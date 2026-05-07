// server.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';
import archiver from 'archiver';

import { readSchemaFiles } from './src/ingestion/readSchemas.js';
import { parseToAST } from './src/ingestion/parseToAST.js';
import { extractSchemaFields } from './src/ingestion/extractor.js';
import { generateFakerConfig } from './src/ai/analyzer.js';
import { generateMockData } from './src/engine/materialize.js';
import { bulkInsertToDatabase } from './src/engine/seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
// Increase JSON limit because the Rulebook can get quite large!
app.use(express.json({ limit: '50mb' }));


// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, 'input_schemas');
        // Clear old schemas before saving new ones
        if (fs.existsSync(dir)) {
            fs.readdirSync(dir).forEach(f => fs.unlinkSync(path.join(dir, f)));
        } else {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Keep original .js filenames
    }
});
const upload = multer({ storage });

// THE UPLOAD ENDPOINT
app.post('/api/upload', upload.array('schemas'), (req, res) => {
    try {
        console.log(`📥 Uploaded ${req.files.length} schema files.`);
        res.status(200).json({ message: "Files uploaded successfully", files: req.files.map(f => f.originalname) });
    } catch (error) {
        res.status(500).json({ error: "Upload failed." });
    }
});

// READ FILE CONTENT ENDPOINT
app.get('/api/files', (req, res) => {
    const type = req.query.type; // 'input' or 'output'
    const targetDir = type === 'input'
        ? path.join(__dirname, 'input_schemas')
        : path.join(__dirname, 'output_data');

    if (!fs.existsSync(targetDir)) return res.json({ files: [] });

    // Read directory and get contents of each file
    const files = fs.readdirSync(targetDir).map(filename => {
        const content = fs.readFileSync(path.join(targetDir, filename), 'utf-8');
        return { filename, content };
    });

    res.json({ files });
});

// DOWNLOAD ZIP ENDPOINT
app.get('/api/download', (req, res) => {
    const outputDir = path.join(__dirname, 'output_data');
    if (!fs.existsSync(outputDir)) return res.status(404).json({ error: "No generated data found." });

    res.attachment('mockmate_data.zip');
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.on('error', (err) => res.status(500).send({ error: err.message }));

    // Pipe the zip directly to the user's browser download
    archive.pipe(res);
    // Append the entire output directory
    archive.directory(outputDir, false);
    archive.finalize();
});

// 1. Array to hold connected terminal clients
let activeClients = [];

// 2. The SSE Endpoint
app.get('/api/stream', (req, res) => {
    // Set headers to keep the connection open and format as an event stream
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // Establish the connection immediately

    // Send an initial connection message
    res.write(`data: ${JSON.stringify({ text: '🟢 Connected to MockMate Engine...' })}\n\n`);

    // Add this client to our active pool
    activeClients.push(res);

    // If the client closes the browser/terminal, remove them from the pool
    req.on('close', () => {
        activeClients = activeClients.filter(client => client !== res);
    });
});

// 3. The Broadcast Helper Function
// We use this to push messages to all connected terminals
export function streamLog(message) {
    // Still log it to your actual Node terminal so you can see it locally
    console.log(message);
}

// 4. Globally Hijack console.log
const originalConsoleLog = console.log;

console.log = function (...args) {
    // 1. Call the original console.log so it still prints in your VS Code terminal
    originalConsoleLog.apply(console, args);

    // 2. Convert the arguments into a single string
    const message = args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg) : arg
    ).join(' ');

    // 3. Pipe it to the SSE clients!
    activeClients.forEach(client => {
        client.write(`data: ${JSON.stringify({ text: message })}\n\n`);
    });
};

// ==========================================
// ENDPOINT 1: THE UNIFIED PIPELINE (Analyze -> Generate -> Materialize)
// ==========================================
app.post('/api/build-mock', async (req, res) => {
    try {
        const { count = 10 } = req.body; // Allow frontend to dictate row count
        streamLog("🚀 [POST /api/build-mock] Starting unified generation pipeline...");

        // 1. Read files
        const schemaDir = path.join(__dirname, 'input_schemas');
        const schemaFiles = readSchemaFiles(schemaDir);

        if (schemaFiles.length === 0) {
            return res.status(400).json({ error: "No schema files found in input_schemas folder." });
        }

        // 2. Parse AST
        streamLog(`📂 Parsed ${schemaFiles.length} schema files. Extracting AST...`);
        const allExtractedSchemas = [];
        for (const { name, source } of schemaFiles) {
            const ast = parseToAST(source);
            const cleanFields = extractSchemaFields(ast);
            allExtractedSchemas.push({ collectionName: name, fields: cleanFields });
        }

        // 3. AI Analysis (Rulebook Generation)
        streamLog(`🧠 Sending AST to AI for semantic mapping...`);
        const rulebook = await generateFakerConfig(allExtractedSchemas);

        // 4. Materialization (Building the JSONs)
        streamLog(`🏗️ AI mapping complete. Materializing mock data to disk...`);
        generateMockData(rulebook, count);

        streamLog(`✅ Pipeline complete! Data is ready for download or seeding.`);
        res.status(200).json({
            message: `Successfully analyzed and materialized ${count} records per collection!`,
            rulebook: rulebook // Send it back just in case the frontend wants to display it
        });

    } catch (error) {
        streamLog(`❌ Pipeline Error: ${error.message}`);
        res.status(500).json({ error: "Failed to build mock data.", details: error.message });
    }
});

// ==========================================
// ENDPOINT 2: SEED TO EXTERNAL MONGODB
// ==========================================
app.post('/api/seed-db', async (req, res) => {
    try {
        const { mongoUri } = req.body;

        if (!mongoUri) {
            return res.status(400).json({ error: "Please provide a valid mongoUri in the request body." });
        }

        streamLog("🚀 [POST /api/seed-db] Initiating database injection...");

        // Pass the frontend's URI directly to our seeder
        await bulkInsertToDatabase(mongoUri);

        res.status(200).json({
            message: "Successfully seeded the target database!"
        });

    } catch (error) {
        res.status(500).json({ error: "Failed to seed database.", details: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`\n Server running on http://localhost:${PORT}`);
});