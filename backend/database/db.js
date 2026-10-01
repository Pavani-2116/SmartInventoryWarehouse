const Database = require('better-sqlite3');
const path = require('path');

const dataDir = path.join(__dirname);
const db = new Database(path.join(dataDir, 'inventory.sqlite'));

db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');
db.pragma('busy_timeout = 5000');

module.exports = db;
