import fs from 'fs';
import path from 'path';
const __dirname = import.meta.dirname;

// Get the current timestamp
const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
const filename = `${timestamp}.ts`;
const filepath = path.join(__dirname, '../scripts/migrations', filename);

// Define the content
const content = `/*
optional message or empty
*/

function run() {
  // migration
}
`;

// Write the content to the file
fs.writeFileSync(filepath, content, { encoding: 'utf8', flag: 'w' });
