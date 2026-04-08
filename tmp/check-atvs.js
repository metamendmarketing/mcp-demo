const Database = require('better-sqlite3');
const db = new Database('prisma/dev.db');
const summit = db.prepare("SELECT modelName, usageTags FROM Product WHERE modelName = 'Summit'").get();
console.log('Summit usageTags:', summit.usageTags);
console.log('Type:', typeof summit.usageTags);
db.close();
