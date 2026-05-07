// src/engine/seed.js
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { streamLog } from '../../server.js'; // Optional: if you want live terminal logs

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function bulkInsertToDatabase(dynamicMongoUri) {
    if (!dynamicMongoUri) {
        throw new Error("A MongoDB URI must be provided to seed the database.");
    }

    const outputDir = path.join(__dirname, '../../output_data');
    if (!fs.existsSync(outputDir)) {
        throw new Error("No generated data found. Please run the build pipeline first.");
    }

    try {
        streamLog(`🔌 Connecting to target MongoDB database...`);
        // Establish connection to the user's specific database
        await mongoose.connect(dynamicMongoUri);
        streamLog(`✅ Connected to MongoDB!`);

        const files = fs.readdirSync(outputDir).filter(f =>
            f.endsWith('.json') && f !== 'RuleBook.json'
        );

        for (const file of files) {
            const collectionName = file.replace('.json', '').replace('.model', '');
            const filePath = path.join(outputDir, file);

            const rawData = fs.readFileSync(filePath, 'utf-8');
            const docs = JSON.parse(rawData);

            if (docs.length === 0) continue;

            streamLog(`⏳ Seeding ${docs.length} records into '${collectionName}'...`);

            // Access the native MongoDB driver collection directly
            const collection = mongoose.connection.db.collection(collectionName);

            // Bypass Mongoose validation for maximum speed
            await collection.insertMany(docs, { ordered: false });

            streamLog(`✅ Successfully seeded '${collectionName}'.`);
        }

    } catch (error) {
        streamLog(`❌ Database Seeding Error: ${error.message}`);
        throw error;
    } finally {
        // CRITICAL: Always close the connection so the server doesn't crash from too many open sockets
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
            streamLog(`🔌 Disconnected from database.`);
        }
    }
}