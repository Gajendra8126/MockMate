# MockMate 🎯

**An AI-driven, schema-aware mock data generator for complex NoSQL architectures.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Overview

MockMate solves a massive gap in the testing ecosystem. Legacy tools like Mockaroo fail when dealing with complex, interrelated NoSQL databases because they cannot handle multi-collection referential integrity. 

MockMate takes your raw Mongoose schema files, mathematically sorts their dependencies, uses AI to infer semantic meaning for realistic data generation (via Faker.js), and safely injects thousands of flawlessly connected records into MongoDB using bulk operations. No more orphaned IDs. No more broken `populate()` queries.

---

## Features

* **Schema Introspection:** Parses raw Mongoose files into ASTs to extract structure without needing database execution.
* **AI Semantic Mapping:** Automatically determines the correct Faker.js functions based on field names and types.
* **Referential Integrity Engine:** Guarantees valid ObjectIds for both standard `ref` and polymorphic `refPath` relationships.
* **Circular Dependency Handling:** Detects infinite schema loops and patches them using a multi-pass materialization strategy.
* **High-Speed Ingestion:** Utilizes unordered MongoDB `insertMany` for lightning-fast database seeding.

---

## How It Works

MockMate processes data in 6 distinct phases:

### 1. Ingestion & AST Parsing
MockMate cannot simply `require()` Mongoose schemas, as executing them without a DB connection would crash. Instead, it reads the files as plain text strings and feeds them into the `acorn` parser. This builds an **Abstract Syntax Tree (AST)**. The extractor recursively traverses this tree, identifying `new Schema()`, unwrapping arrays, and extracting strictly the structural elements (`type`, `ref`, `enum`, `timestamps`).

### 2. AI Semantic Mapping (The Analyzer)
Instead of asking an AI to generate the data directly (which is slow and expensive), MockMate asks Gemini to write the *instructions*. It sends the parsed AST structure and receives a "Rulebook" mapping every field to an executable Faker.js command (e.g., `shippingAddress.city` ➔ `faker.location.city()`).

### 3. Graph Construction (DAG) & Topological Sort
You cannot generate an `Order` if the `User` who placed it doesn't exist yet. 
* MockMate treats collections as **Nodes** and references (`ref`) as **Directed Edges**.
* It builds an Adjacency List and executes **Kahn's Algorithm** to achieve a Topological Sort, outputting a fail-safe execution schedule (e.g., `User` ➔ `Product` ➔ `Order`).

### 4. Materialization & The Memory Registry
As MockMate builds records according to the sorted schedule, it mints valid 12-byte BSON ObjectIds. The core data is flushed to JSON files on disk, but the ObjectIds are kept in a RAM-efficient **Memory Registry** categorized by collection.

### 5. Resolving References (`ref` vs `refPath`)
When the engine hits a reference field, it pauses Faker generation.
* **Standard `ref`**: It queries the Memory Registry for a random, pre-generated ID from the target bucket.
* **Polymorphic `refPath`**: It randomly selects a target collection from the sibling `enum` array, queries that specific bucket in the Registry, and injects both the ID and the Type string.

### 6. High-Speed Database Seeding
Finally, MockMate reads the interconnected JSON files and injects them directly via the native MongoDB driver using `insertMany({ ordered: false })`. This bypasses Mongoose validation overhead and parallelizes writes across CPU threads.

---

## Tech Stack

* **Node.js** (Core runtime)
* **Acorn & Acorn-Walk** (AST parsing and traversal)
* **Google Generative AI SDK** (Gemini 2.0 Flash for semantic analysis)
* **Faker.js** (Deterministic realistic data generation)
* **BSON** (Valid MongoDB ObjectId minting)
* **Mongoose** (Database connection and collection targeting)

---

## Project Structure

```text
mockmate/
├── input_schemas/       # Drop your raw Mongoose .js models here
├── output_data/         # Generated interrelated JSON files
├── src/
│   ├── ai/              # Gemini prompt engineering and API logic
│   ├── engine/          # Core execution: DAG sorting, Materializer, DB Ingestion
│   ├── ingestion/       # AST parsers and recursive schema extraction
│   └── index.js         # Main pipeline orchestrator
├── package.json
└── .env
```

---

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/mockmate.git
   cd mockmate
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add your credentials:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   MONGO_URI=mongodb://localhost:27017/your_test_db
   ```

---

## Usage Example

1. **Add your schemas:** Place any valid Mongoose `.js` files into the `input_schemas/` directory.

2. **Run the pipeline:**
   ```bash
   node src/index.js
   ```

3. **Watch the magic:** The terminal will display the AST extraction, the AI batched request, the Topological Sort order, and the final high-speed bulk ingestion into your local database.

---

## Sample Models

MockMate easily handles complex, nested, and relational schemas. 

*Example Input (`input_schemas/Order.js`):*
```javascript
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number
  }],
  shippingAddress: {
    street: String,
    city: String
  }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
```

*MockMate handles the array flattening, object nesting, and referential lookups automatically!*

---

## Future Improvements

*   **GUI Dashboard:** Wrap the Node.js engine in a React/Vite/Tailwind frontend for visual drag-and-drop uploads and interactive config editing.
*   **Visual Graph Explorer:** Implement D3.js or React Flow to visualize the dependency graph before generation.
*   **Variable Extraction Engine:** Enhance the AST parser to handle globally defined variable sub-schemas outside the main Mongoose export.

---

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

Distributed under the MIT License. See `LICENSE` for more information.
