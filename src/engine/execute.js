// src/engine/execute.js
import { faker } from '@faker-js/faker';

export function executeFakerString(fakerString, expectedType) {
    if (!fakerString) return null;

    try {
        const generator = new Function('faker', `return ${fakerString}`);
        const result = generator(faker);

        // If faker returns undefined (e.g., calling a missing function on a valid module)
        if (result === undefined) throw new Error("Faker returned undefined");

        return result;
    } catch (error) {
        // console.warn(`⚠️ Hallucination Caught: "${fakerString}" failed. Injecting fallback for type: ${expectedType}`);
        return getFallbackValue(expectedType);
    }
}

// The Type-Safe Dynamic Fallback Generator
function getFallbackValue(type) {
    // If no type is provided, default to a random string to prevent crashes
    if (!type) return faker.string.alphanumeric(12);

    // Handle common Mongoose types dynamically using Faker
    switch (type.toLowerCase()) {
        case 'map':
            // Returns a random key-value pair to satisfy the Map type
            return {
                [faker.commerce.productMaterial()]: faker.commerce.productAdjective()
            };
        case 'number':
            return faker.number.int({ min: 1, max: 1000 });
        case 'boolean':
            return faker.datatype.boolean();
        case 'date':
            return faker.date.recent().toISOString();
        case 'objectid':
            return faker.database.mongodbObjectId();
        case 'string':
        default:
            // Generates a random 16-character string (perfect for paymentIds, hashes, etc.)
            return faker.string.alphanumeric(16);
    }
}