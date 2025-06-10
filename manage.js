const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'database.json');

function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    return { entries: [] };
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

const [,, cmd, ...args] = process.argv;

switch (cmd) {
  case 'mkdir': {
    const dir = args[0];
    if (!dir) {
      console.error('Usage: node manage.js mkdir <directory>');
      process.exit(1);
    }
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
    break;
  }
  case 'add-entry': {
    const name = args[0];
    const description = args[1];
    if (!name || !description) {
      console.error('Usage: node manage.js add-entry <name> <description>');
      process.exit(1);
    }
    const db = loadDB();
    db.entries.push({ name, description });
    saveDB(db);
    console.log('Entry added.');
    break;
  }
  default:
    console.log('Usage:');
    console.log('  node manage.js mkdir <directory>');
    console.log('  node manage.js add-entry <name> <description>');
}
