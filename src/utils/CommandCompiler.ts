import { Import } from "./types/types";
import fs from 'fs';

const dir = `${__dirname}/../commands`;
let imports: Import[] = [];
const files = fs.readdirSync(dir);

files.forEach((file: string) => {
    if (file.includes(__filename.slice(-3)))
    {
        imports.push({
            filename: file,
            import: require(`${dir}/${file}`)
        })
    }
});

export const compiledCommands = imports;