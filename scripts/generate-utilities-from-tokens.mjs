import fs from 'node:fs';
import path from 'node:path';

const mod = await import(path.resolve('build/js/tokens.js'));
const TOKENS = mod.default ?? mod;

// Get typography tokens from the flattened structure
const typographyDesktop = {
  'Heading 1': TOKENS['typographydesktop-text-sizes-heading-1'],
  'Heading 2': TOKENS['typographydesktop-text-sizes-heading-2'],
  'Heading 3': TOKENS['typographydesktop-text-sizes-heading-3'],
  'Heading 4': TOKENS['typographydesktop-text-sizes-heading-4'],
  'Heading 5': TOKENS['typographydesktop-text-sizes-heading-5'],
  'Heading 6': TOKENS['typographydesktop-text-sizes-heading-6'],
};

const families = {
  heading: TOKENS['text-style-variablesmode-1-fontfamily-urbanist'] || 'Urbanist',
  body: TOKENS['text-style-variablesmode-1-fontfamily-poppins'] || 'Poppins'
};

function readSet(label, defaults) {
  const fsPx = typographyDesktop[label] ?? defaults.size;
  const lh = defaults.lh; // Use defaults for line height
  const fw = defaults.fw; // Use defaults for font weight
  const lhCss = String(lh).endsWith('%') ? String(lh) : `${parseFloat(lh)*100}%`;
  return { fsPx, lhCss, fw };
}

const fallbacks = [
  {label:'Heading 1', size:84, lh:'100%', fw:700},
  {label:'Heading 2', size:60, lh:'100%', fw:700},
  {label:'Heading 3', size:48, lh:'110%', fw:700},
  {label:'Heading 4', size:40, lh:'110%', fw:600},
  {label:'Heading 5', size:32, lh:'110%', fw:600},
  {label:'Heading 6', size:26, lh:'150%', fw:600},
];

let css = `/* generated from tokens */\n`;
css += `:root{--font-heading:${families.heading};--font-body:${families.body};}\n`;

fallbacks.forEach((f, i) => {
  const v = readSet(f.label, f);
  css += `.text-h${i+1}{font-family:var(--font-heading);font-size:${v.fsPx}px;line-height:${v.lhCss};font-weight:${v.fw}}\n`;
});
css += `.text-body{font-family:var(--font-body);font-size:16px;line-height:150%}\n`;

fs.mkdirSync('build/css', { recursive: true });
fs.writeFileSync('build/css/tokens-utilities.css', css);
console.log('✅ Wrote build/css/tokens-utilities.css');
