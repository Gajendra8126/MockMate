// src/ai/analyzer.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/config.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

const SYSTEM_PROMPT = `
You are a database mock data expert. Your job is to analyze an array of database schemas and map every field to the most semantically appropriate Faker.js (v8) function.

RULES:
1. Return ONLY a JSON object containing a "rulebook" array.
2. If a field has a "ref" or "refPath", set "fakerCall" to null and "isReference" to true.
3. If "refPath" is present, extract the possible target collections into an "enum" array. If it is NOT a reference, "enum" MUST be an empty array [].
4. For normal fields (including standard Mongoose enums), set "fakerCall" to an executable Faker.js string.
5. NEVER invent Faker functions. If unsure, fallback to "faker.string.alphanumeric(16)".
6. Pass the exact Mongoose "type" (String, Number, Boolean, Date) from the input to the output.
7. If the type is "Map", set fakerCall to null. We will handle it internally.

OUTPUT FORMAT:
{
  "rulebook": [
    {
      "collectionName": "string",
      "fields": [
        {
          "name": "string",
          "type": "string", 
          "fakerCall": "string | null",
          "isReference": boolean,
          "ref": "string | null",
          "refPath": "string | null",
          "enum": ["string"]
        }
      ]
    }
  ]
}
`;

// pass ALL schemas at once
export async function generateFakerConfig(allExtractedSchemas) {
  const outputDir = path.join(__dirname, '../../output_data');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  console.log(`Analyzing ${allExtractedSchemas.length} collections...`);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    // model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_PROMPT
  });

  // Convert the array into a single string payload
  const userPrompt = `All Schemas:\n${JSON.stringify(allExtractedSchemas, null, 2)}`;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1
      }
    });

    const responseText = result.response.text();
    const outputPath = path.join(outputDir, `RuleBook.json`);
    // Write the Exported RueBook to a file
    fs.writeFileSync(outputPath, JSON.stringify(JSON.parse(responseText).rulebook, null, 2));

    // Parse the JSON and return just the array!
    return JSON.parse(responseText).rulebook;

  } catch (error) {
    console.error(`Analyzer Error during processing:`, error);
    throw error;
  }
}