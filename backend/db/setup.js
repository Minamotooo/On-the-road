// Builds the database from ../../database/*.sql, creating it first if needed.
// usage: npm run db:setup   (from the backend folder)
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");
const pool = require("./database");

const SQL_DIR = path.join(__dirname, "..", "..", "database");
const { config } = pool;

async function ensureDatabase() {
  const admin = new Client({ ...config, database: "postgres" });
  await admin.connect();
  try {
    const { rowCount } = await admin.query("SELECT 1 FROM pg_database WHERE datname = $1", [config.database]);
    if (rowCount === 0) {
      console.log(`Creating database "${config.database}" ...`);
      await admin.query(`CREATE DATABASE "${config.database.replace(/"/g, "")}"`);
    }
  } finally {
    await admin.end();
  }
}

(async () => {
  try {
    await ensureDatabase();
  } catch (error) {
    console.error(
      `Could not reach PostgreSQL at ${config.host}:${config.port} as "${config.user}": ${error.message}\n` +
        "Check that PostgreSQL is running and that PGUSER / PGPASSWORD in backend/.env are right."
    );
    process.exit(1);
  }

  const files = fs
    .readdirSync(SQL_DIR)
    .filter((f) => /^\d+_.*\.sql$/.test(f))
    .sort();

  const client = await pool.connect();
  try {
    for (const file of files) {
      process.stdout.write(`Running ${file} ... `);
      await client.query(fs.readFileSync(path.join(SQL_DIR, file), "utf8"));
      console.log("done");
    }
    const { rows } = await client.query(
      `SELECT (SELECT COUNT(*) FROM tourist_spot) spots, (SELECT COUNT(*) FROM hotel) hotels,
              (SELECT COUNT(*) FROM restaurant) restaurants, (SELECT COUNT(*) FROM client_user) travellers`
    );
    console.log("Database ready:", rows[0]);
  } catch (error) {
    console.error("\nSetup failed:", error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
})();
