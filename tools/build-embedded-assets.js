const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const assetsRoot = path.join(root, 'assets');
const outputFile = path.join(root, 'js', 'embedded-assets.js');

const mimeByExt = new Map([
    ['.png', 'image/png'],
    ['.jpg', 'image/jpeg'],
    ['.jpeg', 'image/jpeg'],
    ['.webp', 'image/webp'],
    ['.gif', 'image/gif']
]);

function walk(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
        const full = path.join(dir, entry.name);
        return entry.isDirectory() ? walk(full) : [full];
    });
}

const files = walk(assetsRoot)
    .filter(file => mimeByExt.has(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b));

const bundle = {};
files.forEach(file => {
    const relativePath = path.relative(root, file).split(path.sep).join('/');
    const mime = mimeByExt.get(path.extname(file).toLowerCase());
    bundle[relativePath] = `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`;
});

const output = [
    '// Generated from files in assets/.',
    '// Re-run: node tools/build-embedded-assets.js',
    `window.BOBA_EMBEDDED_ASSETS = ${JSON.stringify(bundle)};`,
    ''
].join('\n');

fs.writeFileSync(outputFile, output);
console.log(`Embedded ${files.length} image assets into ${path.relative(root, outputFile)}.`);
