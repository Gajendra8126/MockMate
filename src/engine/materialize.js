// src/engine/materialize.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ObjectId } from 'bson';
import { executeFakerString } from './execute.js';
import { getExecutionOrder } from './sort.js';
import { MemoryRegistry } from './registry.js';
import { faker } from '@faker-js/faker';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function setDeepValue(obj, path, value) {
    const parts = path.split('.');
    let current = obj;

    for (let i = 0; i < parts.length - 1; i++) {
        let part = parts[i];

        // If the path contains '[]', create an array containing one empty object
        if (part.endsWith('[]')) {
            const key = part.slice(0, -2);
            if (!current[key]) current[key] = [{}];
            current = current[key][0];
        } else {
            if (!current[part]) current[part] = {};
            current = current[part];
        }
    }

    const lastPart = parts[parts.length - 1];

    // Handle arrays of primitive strings (like tags: [String])
    if (lastPart.endsWith('[]')) {
        const key = lastPart.slice(0, -2);
        if (!current[key]) current[key] = [];
        current[key].push(value);
    } else {
        current[lastPart] = value;
    }
}

export function generateMockData(rulebook, count = 10) {
    const outputDir = path.join(__dirname, '../../output_data');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    // 1. Get the execution order
    const safeOrder = getExecutionOrder(rulebook);
    console.log(`\nExecution Order: ${safeOrder.join(' ➔ ')}`);

    const registry = new MemoryRegistry();

    console.log(`\nStarting Data Generation... Generating ${count} records per collection.\n`);

    // 3. Loop through the collections IN THE SAFE ORDER, not randomly
    safeOrder.forEach(collectionName => {
        // Find the rulebook config for this specific collection
        const config = rulebook.find(c => c.collectionName === collectionName);
        if (!config) return;

        registry.init(collectionName);
        const mockDocuments = [];

        const getRealName = (refName) => {
            if (!refName) return null;
            const normalizedRef = refName.toLowerCase();
            const found = rulebook.find(c =>
                c.collectionName.replace(/\.model|\.js/gi, '').toLowerCase() === normalizedRef
            );
            return found ? found.collectionName : refName;
        };

        for (let i = 0; i < count; i++) {
            const doc = { _id: new ObjectId().toHexString() };

            config.fields.forEach(field => {

                if (field.isReference) {
                    if (field.ref) {
                        // Standard Reference (e.g., ref: 'User')
                        const targetBucket = getRealName(field.ref);
                        setDeepValue(doc, field.name, registry.getRandomId(targetBucket));
                    }
                    else if (field.refPath && field.enum) {
                        // Polymorphic Reference (e.g., refPath: 'type')
                        const selectedType = faker.helpers.arrayElement(field.enum);
                        const targetBucket = getRealName(selectedType);
                        setDeepValue(doc, field.name, registry.getRandomId(targetBucket));
                        setDeepValue(doc, field.refPath, selectedType);
                    }
                }
                // ==========================
                else {
                    const generatedValue = executeFakerString(field.fakerCall, field.type);
                    setDeepValue(doc, field.name, generatedValue);
                }
            });

            mockDocuments.push(doc);
            // Save IDs into the registry so future collections can use it
            registry.pushId(collectionName, doc._id);
        }

        const outputPath = path.join(outputDir, `${collectionName}.json`);
        fs.writeFileSync(outputPath, JSON.stringify(mockDocuments, null, 2));

        console.log(`✅ ${collectionName}: Generated ${count} docs.`);
    });
}