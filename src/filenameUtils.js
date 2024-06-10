import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

// funcionalidad __dirname con type: "module" 
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);