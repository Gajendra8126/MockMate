import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.join(__dirname, "../../.env")
});

const config = {
    // port: process.env.PORT || 3000,

    gemini: {
        apiKey: process.env.GEMINI_API_KEY,
    },
    openrouter: {
        apiKey: process.env.OPENROUTER_API_KEY,
    },

    db: {
        url: process.env.MONGODB_URI,
    }
};


export default config;