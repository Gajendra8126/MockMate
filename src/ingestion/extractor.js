// src/ingestion/extractor.js
import { simple as walkSimple } from 'acorn-walk'

export function extractSchemaFields(ast) {
    const fields = [];
    const schemaRegistry = {};
    let mainSchemaProps = null;
    let timestamps = false;

    // Helper to identify "new Schema()" or "new mongoose.Schema()"
    const isSchema = (node) => {
        if (node.type !== 'NewExpression') return false;
        return (node.callee.type === 'Identifier' && node.callee.name === 'Schema') ||
            (node.callee.type === 'MemberExpression' && node.callee.property.name === 'Schema');
    };

    const checkTimestamps = (optionsArg) => {
        if (optionsArg && optionsArg.type === 'ObjectExpression') {
            const hasTs = optionsArg.properties.some(p =>
                (p.key.name === 'timestamps' || p.key.value === 'timestamps') && p.value.value === true
            );
            if (hasTs) timestamps = true;
        }
    };

    // PASS 1: Catalog all defined schemas into the registry
    walkSimple(ast, {
        VariableDeclarator(node) {
            if (node.init && isSchema(node.init)) {
                schemaRegistry[node.id.name] = {
                    properties: node.init.arguments[0].properties,
                    options: node.init.arguments[1]
                };
            }
        }
    });

    // PASS 2: Find which schema is passed to mongoose.model()
    walkSimple(ast, {
        CallExpression(node) {
            const callee = node.callee;
            const isModelCall = (callee.type === 'Identifier' && callee.name === 'model') ||
                (callee.type === 'MemberExpression' && callee.property.name === 'model');

            if (isModelCall && node.arguments[1]) {
                const schemaArg = node.arguments[1];
                // e.g. mongoose.model('User', userSchema)
                if (schemaArg.type === 'Identifier' && schemaRegistry[schemaArg.name]) {
                    mainSchemaProps = schemaRegistry[schemaArg.name].properties;
                    checkTimestamps(schemaRegistry[schemaArg.name].options);
                }
                // e.g. mongoose.model('User', new Schema(...))
                else if (isSchema(schemaArg)) {
                    mainSchemaProps = schemaArg.arguments[0].properties;
                    checkTimestamps(schemaArg.arguments[1]);
                }
            }
        }
    });

    if (!mainSchemaProps) return []; // Safety fallback

    // PASS 3: Recursive Extraction with Registry Lookup
    function extractField(prop, prefix, fieldsArray) {
        if (prop.type !== 'Property') return;

        const fieldName = prop.key.name || prop.key.value;
        const fullPath = prefix ? `${prefix}.${fieldName}` : fieldName;
        const val = prop.value;

        // SCENARIO A: Shorthand OR Sub-Schema Object { address: addressSchema }
        if (val.type === 'Identifier') {
            if (schemaRegistry[val.name]) {
                // It's a sub-schema! Unpack it recursively.
                for (const p of schemaRegistry[val.name].properties) extractField(p, fullPath, fieldsArray);
            } else {
                fieldsArray.push({ name: fullPath, type: val.name });
            }
            return;
        }

        // SCENARIO B: Arrays [{ url: String }] OR [addressSchema] OR [{ type: ObjectId, ref: 'User' }]
        if (val.type === 'ArrayExpression' && val.elements.length > 0) {
            const inner = val.elements[0];
            const arrayPath = `${fullPath}[]`;

            if (inner.type === 'ObjectExpression') {
                // Is this a field definition inside an array? (e.g., [{ type: ObjectId, ref: 'User' }])
                const typeProp = inner.properties.find(p => (p.key.name || p.key.value) === 'type');

                if (typeProp && typeProp.value.type !== 'ObjectExpression') {
                    const field = { name: arrayPath };
                    for (const p of inner.properties) {
                        const key = p.key.name || p.key.value;
                        const v = p.value;
                        if (key === 'type') {
                            field.type = v.type === 'MemberExpression' ? (v.property.name || 'ObjectId') : (v.name ?? v.value);
                        }
                        if (key === 'ref') field.ref = v.value;
                        if (key === 'refPath') field.refPath = v.value;
                        if (key === 'enum' && v.type === 'ArrayExpression') field.enum = v.elements.map(e => e.value);
                    }
                    fieldsArray.push(field);
                } else {
                    // standard nested object: e.g., [{ url: String, alt: String }]
                    for (const p of inner.properties) extractField(p, arrayPath, fieldsArray);
                }
            } else if (inner.type === 'Identifier') {
                if (schemaRegistry[inner.name]) {
                    // array of sub-schemas! (Like reviews: [reviewSchema])
                    for (const p of schemaRegistry[inner.name].properties) extractField(p, arrayPath, fieldsArray);
                } else {
                    fieldsArray.push({ name: arrayPath, type: inner.name });
                }
            }
            return;
        }

        // SCENARIO C: Full Definition or Nested Object
        if (val.type === 'ObjectExpression') {
            const props = val.properties;
            const typeProp = props.find(p => (p.key.name || p.key.value) === 'type');

            if (typeProp && typeProp.value.type !== 'ObjectExpression') {
                const field = { name: fullPath };
                for (const p of props) {
                    const key = p.key.name || p.key.value;
                    const v = p.value;

                    if (key === 'type') {
                        // Handle standard types AND nested mongoose.Schema.Types.ObjectId
                        field.type = v.type === 'MemberExpression' ? (v.property.name || 'ObjectId') : (v.name ?? v.value);
                    }
                    if (key === 'ref') field.ref = v.value;
                    if (key === 'refPath') field.refPath = v.value;
                    if (key === 'enum' && v.type === 'ArrayExpression') field.enum = v.elements.map(e => e.value);
                }
                fieldsArray.push(field);
            } else {
                // Standard nested object
                for (const p of props) extractField(p, fullPath, fieldsArray);
            }
        }
    }

    // Kick off the extraction on the root properties
    for (const prop of mainSchemaProps) extractField(prop, '', fields);

    if (timestamps) {
        fields.push({ name: 'createdAt', type: 'Date' });
        fields.push({ name: 'updatedAt', type: 'Date' });
    }

    return fields;
}