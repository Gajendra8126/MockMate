// src/engine/registry.js

export class MemoryRegistry {
    constructor() {
        this.store = new Map();
    }

    // Prepare a bucket for a new collection
    init(collectionName) {
        if (!this.store.has(collectionName)) {
            this.store.set(collectionName, []);
        }
    }

    // Save a newly generated ID
    pushId(collectionName, id) {
        this.store.get(collectionName).push(id);
    }

    // Pick a random ID for a reference field
    getRandomId(collectionName) {
        const ids = this.store.get(collectionName);
        if (!ids || ids.length === 0) return null; // Fallback if bucket is empty

        const randomIndex = Math.floor(Math.random() * ids.length);
        return ids[randomIndex];
    }
}