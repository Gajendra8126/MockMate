import fs from 'fs'
import path from 'path'

export function readSchemaFiles(dir) {
    return fs.readdirSync(dir)
        .filter(f => f.endsWith('.js'))
        .map(f => ({
            name: path.basename(f, '.js'),
            source: fs.readFileSync(path.join(dir, f), 'utf-8')
        }))
}