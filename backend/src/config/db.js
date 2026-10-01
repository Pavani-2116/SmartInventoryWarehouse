const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const configured = process.env.DATABASE_PATH || './database/warehouse.db';
const dbPath = path.isAbsolute(configured) ? configured : path.resolve(process.cwd(), configured);
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');
module.exports = db;
