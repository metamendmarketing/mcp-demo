const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../prisma/marquis-products.json');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  { from: /â„¢/g, to: '™' },
  { from: /Â®/g, to: '®' },
  { from: /â€™/g, to: '’' },
  { from: /â€”/g, to: '—' },
  { from: /â€“/g, to: '–' },
  { from: /â€œ/g, to: '“' },
  { from: /â€\?/g, to: '”' },
  { from: /RHKâ„¢/g, to: 'RHK™' },
  { from: /ConstantCleanâ„¢/g, to: 'ConstantClean™' },
  { from: /ConstantClean\+â„¢/g, to: 'ConstantClean+™' },
  { from: /V-O-L-Tâ„¢/g, to: 'V-O-L-T™' },
  { from: /DuraShellÂ®/g, to: 'DuraShell®' },
  { from: /DuraCoverÂ®/g, to: 'DuraCover®' },
  { from: /IcyneneÂ®/g, to: 'Icynene®' },
  { from: /MaximizRâ„¢/g, to: 'MaximizR™' }
];

console.log(`Original length: ${content.length}`);

replacements.forEach(r => {
  const count = (content.match(r.from) || []).length;
  if (count > 0) {
    console.log(`Replacing ${count} occurrences of ${r.from}`);
    content = content.replace(r.from, r.to);
  }
});

// Final check for any lingering Â characters that are often artifacts of bad Latin-1 -> UTF-8 conversion
const lingeringA = (content.match(/Â\s/g) || []).length;
if (lingeringA > 0) {
  console.log(`Removing ${lingeringA} lingering 'Â' artifacts.`);
  content = content.replace(/Â\s/g, ' ');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed marquis-products.json encoding.');
