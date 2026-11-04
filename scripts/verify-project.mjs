import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const requiredFiles = [
  'index.html', 'src/main.js', 'src/style.css', 'src/car.js',
  'src/materials.js', 'src/lighting.js', 'src/showroom.js',
  'src/interaction.js', 'src/animation.js',
  'src/shaders/showroom.vert', 'src/shaders/showroom.frag',
  'docs/ODBRANA_MK.md', 'docs/TECHNICAL_AUDIT_MK.md',
  'docs/FINAL_TEST_CHECKLIST_MK.md', 'AI-USE.md', 'README.md'
];

for (const relative of requiredFiles) {
  if (!fs.existsSync(path.join(root, relative))) errors.push(`Missing required file: ${relative}`);
}

const sourceFiles = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', 'dist'].includes(entry.name)) walk(full);
    } else if (entry.name.endsWith('.js') && !entry.name.endsWith('.config.js')) {
      sourceFiles.push(full);
    }
  }
}
walk(path.join(root, 'src'));

for (const file of sourceFiles) {
  const source = fs.readFileSync(file, 'utf8');
  const importPattern = /(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g;
  for (const match of source.matchAll(importPattern)) {
    const specifier = match[1].split('?')[0];
    const resolved = path.resolve(path.dirname(file), specifier);
    if (!fs.existsSync(resolved)) errors.push(`Unresolved local import in ${path.relative(root, file)}: ${match[1]}`);
  }
}

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (!packageJson.scripts?.dev || !packageJson.scripts?.build || !packageJson.scripts?.preview) {
  errors.push('package.json must define dev, build and preview scripts');
}

const checks = [
  ['Lighting types and shadows', /AmbientLight/.test(read('src/lighting.js')) && /DirectionalLight/.test(read('src/lighting.js')) && /SpotLight/.test(read('src/lighting.js')) && /shadowMap\.enabled\s*=\s*true/.test(read('src/main.js'))],
  ['sRGB and tone mapping', /outputColorSpace\s*=\s*THREE\.SRGBColorSpace/.test(read('src/main.js')) && /ACESFilmicToneMapping/.test(read('src/main.js'))],
  ['Color map, normal map and UVs', /colorSpace\s*=\s*THREE\.SRGBColorSpace/.test(read('src/materials.js')) && /normalMap/.test(read('src/materials.js')) && /setAttribute\('uv'/.test(read('src/car.js'))],
  ['PBR and environment map', /metalness/.test(read('src/materials.js')) && /roughness/.test(read('src/materials.js')) && /PMREMGenerator/.test(read('src/lighting.js'))],
  ['Custom ShaderMaterial and animated uniforms', /ShaderMaterial/.test(read('src/showroom.js')) && /transformed\.y/.test(read('src/shaders/showroom.vert')) && /uTime/.test(read('src/shaders/showroom.frag'))],
  ['Delta-time animation and easing', /delta/.test(read('src/animation.js')) && /Math\.cos/.test(read('src/animation.js'))],
  ['Raycaster and nearest selectable hit', /new THREE\.Raycaster/.test(read('src/interaction.js')) && /intersectObject/.test(read('src/interaction.js')) && /\.find\(hit => hit\.object\.userData\.isSelectable\)/.test(read('src/interaction.js'))]
];

function read(relative) {
  const file = path.join(root, relative);
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

console.log('NEON VOLT — static project verification');
console.log(`Required files: ${requiredFiles.length}`);
console.log(`JavaScript source files: ${sourceFiles.length}`);
for (const [label, passed] of checks) console.log(`${passed ? 'PASS' : 'FAIL'}  ${label}`);
if (checks.some(([, passed]) => !passed)) errors.push('One or more required technique markers were not found.');
if (errors.length) {
  console.error('\nVerification errors:');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log('\nPASS  Required files and local imports');
  console.log('NOTE  This is a static check, not a Vite production build or browser/WebGL test.');
}
