# MockMate 🎯

**An AI-driven, schema-aware mock data generator for complex NoSQL architectures, complete with a real-time web IDE.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Overview

MockMate solves a massive gap in the testing ecosystem. Legacy tools like Mockaroo fail when dealing with complex, interrelated NoSQL databases because they cannot handle multi-collection referential integrity. 

MockMate takes your raw Mongoose schema files, mathematically sorts their dependencies, uses AI to infer semantic meaning for realistic data generation (via Faker.js), and safely injects thousands of flawlessly connected records into MongoDB using bulk operations. No more orphaned IDs. No more broken `populate()` queries.

Now featuring a **VS Code-inspired React interface**, MockMate allows you to drag-and-drop schemas, review AI rulebooks, watch terminal logs stream in real-time, and securely push data to your remote MongoDB Atlas clusters directly from the browser.

---

## Features

* **VS Code-Style Web Studio:** A sleek, dual-pane UI for managing files, previewing AI JSON rulebooks, and viewing live backend terminal logs via Server-Sent Events (SSE).
* **Schema Introspection:** Parses raw Mongoose files into ASTs to extract structure without needing database execution.
* **AI Semantic Mapping:** Automatically determines the correct Faker.js functions based on field names and types using OpenRouter's free, state-of-the-art models.
* **Referential Integrity Engine:** Guarantees valid ObjectIds for both standard `ref` and polymorphic `refPath` relationships.
* **Circular Dependency Handling:** Detects infinite schema loops and patches them using a multi-pass materialization strategy.
* **Bring-Your-Own-Database:** Seed local databases or remote MongoDB Atlas clusters by simply pasting your URI into the UI.

---

## How It Works

MockMate processes data in 6 distinct phases:

### 1. Ingestion & AST Parsing

MockMate cannot simply `require()` Mongoose schemas, as executing them without a DB connection would crash. Instead, it reads the files as plain text strings and feeds them into the `acorn` parser. This builds an **Abstract Syntax Tree (AST)**. The extractor recursively traverses this tree, identifying `new Schema()`, unwrapping arrays, and extracting strictly the structural elements.

### 2. AI Semantic Mapping (The Analyzer)

Instead of asking an AI to generate the data directly (which is slow and expensive), MockMate asks OpenRouter (using fast models like Gemini Flash or Hy3) to write the *instructions*. It sends the parsed AST structure and receives a "Rulebook" mapping every field to an executable Faker.js command (e.g., `shippingAddress.city` ➔ `faker.location.city()`).

### 3. Graph Construction (DAG) & Topological Sort

You cannot generate an `Order` if the `User` who placed it doesn't exist yet.

* MockMate treats collections as **Nodes** and references (`ref`) as **Directed Edges**.
* It builds an Adjacency List and executes **Kahn's Algorithm** to achieve a Topological Sort, outputting a fail-safe execution schedule.

### 4. Materialization & The Memory Registry

As MockMate builds records according to the sorted schedule, it mints valid 12-byte BSON ObjectIds. The core data is flushed to JSON files on disk, but the ObjectIds are kept in a RAM-efficient **Memory Registry** categorized by collection.

### 5. Resolving References (`ref` vs `refPath`)

When the engine hits a reference field, it pauses Faker generation. It queries the Memory Registry for a random, pre-generated ID from the target bucket (handling polymorphic sibling `enum` arrays automatically) and injects it.

### 6. High-Speed Database Seeding

Finally, MockMate reads the interconnected JSON files and injects them directly via the native MongoDB driver using `insertMany({ ordered: false })`. This bypasses Mongoose validation overhead and parallelizes writes across CPU threads.

---

## Tech Stack

**Frontend:**

* **React 18 & Vite**
* **Tailwind CSS** (Styling)
* **Lucide React** (Icons)
* **Server-Sent Events (SSE)** (Real-time terminal streaming)

**Backend Core:**

* **Node.js & Express**
* **OpenRouter SDK** (AI API Gateway)
* **Acorn & Acorn-Walk** (AST parsing)
* **Faker.js v8** (Deterministic data generation)
* **Mongoose / MongoDB Node Driver** (DB connections)

---

## Project Structure

```text
MockMate/
├── client/              # React + Vite Frontend
│   ├── src/             # UI Components, Pages, and Assets
│   └── package.json
├── server/              # Express Backend & Core Engine
│   ├── input_schemas/   # Uploaded Mongoose .js models
│   ├── output_data/     # Generated interrelated JSON files
│   ├── src/
│   │   ├── ai/          # OpenRouter prompt engineering
│   │   ├── engine/      # DAG sorting, Materializer, DB Ingestion
│   │   ├── ingestion/   # AST parsers and schema extraction
│   │   └── server.js    # Express API and SSE stream
│   └── package.json
└── README.md
```

---

## Installation & Setup

You will need two terminal windows open to run the full application (one for the backend, one for the frontend).

### 1. Clone the repository

```bash
git clone [https://github.com/bishuk-dev/MockMate.git](https://github.com/bishuk-dev/MockMate.git)
cd MockMate
```

### 2. Setup the Backend Server

Open your first terminal window:

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and add your Gemini API key:

```env
GEMINI_API_KEY=your-api-key-here
```

Start the backend server (runs on port 4000):

```bash
npm start
```

### 3. Setup the Frontend Client

Open your second terminal window:

```bash
cd client
npm install
npm run dev
```

### 4. Start Generating

Open your browser and navigate to `http://localhost:5173`.
Drag and drop your schema files, click **Continue**, and watch the AI engine build your database in real-time!

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

* **Dockerization:** Provide a `docker-compose.yml` to spin up the UI, Backend, and a local MongoDB instance with a single command.
* **Visual Graph Explorer:** Implement React Flow to visualize the mathematical dependency graph before generation.
* **SQL Support:** Expand the AST parser to ingest Prisma (`.prisma`) or TypeORM entities to support PostgreSQL and MySQL.

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
