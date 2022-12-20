import fs from 'fs';

const dir = `${__dirname}/../events`;
let imports: Function[] = [];
const files = fs.readdirSync(dir);

files.forEach((file: string) => {
    if (file.includes(__filename.slice(-3))) {
        imports.push(require(`${dir}/${file}`))
    }
});

export const events = imports;