// src/engine/seed.js
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function bulkInsertToDatabase() {
    const outputDir = path.join(__dirname, '../../output_data');

    if (!fs.existsSync(outputDir)) {
        console.error("❌ No output_data directory found. Run the generator first!");
        return;
    }

    console.log(`\n🔌 Connecting to MongoDB: ${config.db.url}`);

    try {
        await mongoose.connect(config.db.url);
        console.log("✅ Database connected successfully.");

        // Read all generated JSON files
        const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.json'));

        for (const file of files) {
            const collectionName = file.replace('.json', '');
            const filePath = path.join(outputDir, file);

            // Parse the massive JSON array
            const rawData = fs.readFileSync(filePath, 'utf-8');
            const documents = JSON.parse(rawData);

            if (documents.length === 0) continue;

            console.log(`\n📦 Injecting ${documents.length} records into [${collectionName}]...`);

            // Bypass Mongoose models! Get the raw MongoDB collection directly
            const collection = mongoose.connection.collection(collectionName);

            // Clear out the old mock data before inserting the new stuff (Optional but recommended)
            await collection.deleteMany({});
            console.log(`   🧹 Cleared old data from ${collectionName}`);

            // 🚀 The High-Speed Insert: ordered: false parallelizes the writes
            try {
                const result = await collection.insertMany(documents, { ordered: false });
                console.log(`   ✅ Successfully inserted ${result.insertedCount} documents!`);
            } catch (insertError) {
                // If ordered: false is used, it throws a specific bulk write error but inserts valid docs anyway
                console.warn(`   ⚠️ Inserted ${insertError.insertedDocs?.length || 0} docs, but hit some errors (usually unique index conflicts).`);
            }
        }

        console.log("\n🎉 ALL DATA SEEDED SUCCESSFULLY!");

    } catch (error) {
        console.error("❌ Database Error:", error);
    } finally {
        // Always close the connection when done so the terminal script exits cleanly
        await mongoose.disconnect();
        console.log("🔌 Database connection closed.");
    }
}