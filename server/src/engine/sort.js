// src/engine/sort.js
export function getExecutionOrder(rulebook) {
    const inDegree = new Map();
    const adjacencyList = new Map();

    // Get Collection Name
    const getCollectionName = (refName) => {
        if (!refName) return null;
        const normalizedRef = refName.toLowerCase();

        const found = rulebook.find(c =>
            c.collectionName.replace(/\.model|\.js/gi, '').toLowerCase() === normalizedRef
        );
        return found ? found.collectionName : refName;
    };

    rulebook.forEach(config => {
        inDegree.set(config.collectionName, 0);
        adjacencyList.set(config.collectionName, []);
    });

    rulebook.forEach(config => {
        config.fields.forEach(field => {
            if (field.isReference) {
                const rawTargets = field.ref ? [field.ref] : (field.enum || []);

                rawTargets.forEach(rawTarget => {
                    const target = getCollectionName(rawTarget);

                    if (!adjacencyList.has(target)) return;
                    if (target === config.collectionName) return;

                    adjacencyList.get(target).push(config.collectionName);
                    inDegree.set(config.collectionName, inDegree.get(config.collectionName) + 1);
                });
            }
        });
    });

    // Sorting
    const queue = [];
    const executionOrder = [];


    for (const [collection, degree] of inDegree.entries()) {
        if (degree === 0) queue.push(collection);
    }

    while (queue.length > 0) {
        const current = queue.shift();
        executionOrder.push(current);

        adjacencyList.get(current).forEach(dependent => {
            inDegree.set(dependent, inDegree.get(dependent) - 1);
            if (inDegree.get(dependent) === 0) {
                queue.push(dependent);
            }
        });
    }

    // Check for circular dependencies (Infinite Loops)
    if (executionOrder.length !== rulebook.length) {
        console.warn("Circular dependency detected!");
        // Push the trapped collections to the end of the line
        rulebook.forEach(c => {
            if (!executionOrder.includes(c.collectionName)) executionOrder.push(c.collectionName);
        });
    }

    return executionOrder;
}