// src/index.js
import path from 'path';
import { fileURLToPath } from 'url';
import { readSchemaFiles } from './ingestion/readSchemas.js';
import { parseToAST } from './ingestion/parseToAST.js';
import { extractSchemaFields } from './ingestion/extractor.js';
import { generateFakerConfig } from './ai/analyzer.js';
import { generateMockData } from './engine/materialize.js';
import { bulkInsertToDatabase } from './engine/seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runPipeline() {
  const schemaDir = path.join(__dirname, '../input_schemas');
  const schemaFiles = readSchemaFiles(schemaDir);

  // 1. Array to hold all extracted schemas
  const allExtractedSchemas = [];

  // 2. Loop through files and just extract the AST logic (Zero API calls here)
  for (const { name, source } of schemaFiles) {
    console.log(`📑 Parsing AST for ${name}...`);
    const ast = parseToAST(source);
    const cleanFields = extractSchemaFields(ast);

    allExtractedSchemas.push({
      collectionName: name,
      fields: cleanFields
    });
  }

  // console.log(JSON.stringify(allExtractedSchemas, null, 2));

  // 3. ONE SINGLE API CALL TO GEMINI!
  console.log(`\n🚀 Firing single batched request to Gemini API...`);
  let allConfigs;
  try {
    allConfigs = await generateFakerConfig(allExtractedSchemas);
    console.log(`✅ Batch AI Config successfully generated!`);
  } catch (error) {
    console.error("Pipeline aborted due to AI failure.");
    return;
  }

  // 4. Generate the files using the unified rulebook
  generateMockData(allConfigs, 5);

  // 5. Blast them into the database
  await bulkInsertToDatabase();
}

runPipeline();