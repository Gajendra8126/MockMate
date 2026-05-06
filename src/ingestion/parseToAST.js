import { parse } from 'acorn'

export function parseToAST(source) {
    return parse(source, {
        ecmaVersion: 2020,
        sourceType: 'module'   // handles ES module imports
    })
}