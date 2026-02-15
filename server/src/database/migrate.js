const fs = require('fs');
const path = require('path');
const { getDb } = require('./connection');

function runMigrations() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      ran_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

  const ranMigrations = db.prepare('SELECT name FROM _migrations').all().map(r => r.name);

  for (const file of files) {
    if (ranMigrations.includes(file)) continue;

    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
    console.log(`Running migration: ${file}`);
    db.exec(sql);
    db.prepare('INSERT INTO _migrations (name) VALUES (?)').run(file);
    console.log(`Completed migration: ${file}`);
  }
}

module.exports = { runMigrations };
