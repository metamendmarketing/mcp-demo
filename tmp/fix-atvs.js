const fs = require('fs');
const file = './prisma/marquis-products.json';
let data = JSON.parse(fs.readFileSync(file));
let modified = false;
data.forEach(p => {
    if (p.seriesName && p.seriesName.includes('ATV') && p.voltageOptions === '["110V/240V"]') {
        p.voltageOptions = '["240V"]';
        p.electricalAmps = 50;
        modified = true;
    }
});
if (modified) {
    fs.writeFileSync(file, JSON.stringify(data, null, 4));
    console.log("Fixed ATV models in marquis-products.json");
} else {
    console.log("No ATV models required fixing.");
}
