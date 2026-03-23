const AESTHETIC_MAPPINGS = {
  vector: {
    tropical: {
      shell: ['Tuscan Sun', 'Alba'],
      cabinet: ['Barnwood']
    }
  }
};

const v84 = {
  seriesName: "Vector21 Series",
  shellColors: [
    "Alba",
    "Midnight Canyon",
    "Glacier",
    "Sterling Silver",
    "Tuscan Sun",
    "Winter Solstice"
  ],
  cabinetColors: [
    "Barnwood",
    "Chestnut",
    "Black DuraCovers®",
    "Black Weathershield"
  ]
};

const preferences = { aesthetic: 'tropical' };

const seriesName = v84.seriesName;
const seriesKey = seriesName.toLowerCase().includes('crown') ? 'crown' : 
                 (seriesName.toLowerCase().includes('vector') ? 'vector' : null);
const aestheticKey = preferences.aesthetic;

console.log('Series Key:', seriesKey);
console.log('Aesthetic Key:', aestheticKey);

const suggested = seriesKey && aestheticKey ? AESTHETIC_MAPPINGS[seriesKey]?.[aestheticKey] : null;
console.log('Mapping Found:', !!suggested);

if (suggested) {
  const suggestedShell = v84.shellColors.filter(c => suggested.shell.includes(c));
  const suggestedCabinet = v84.cabinetColors.filter(c => suggested.cabinet.includes(c));
  console.log('Suggested Shell:', suggestedShell);
  console.log('Suggested Cabinet:', suggestedCabinet);
  console.log('Condition (length > 0):', suggestedShell.length > 0 || suggestedCabinet.length > 0);
}
