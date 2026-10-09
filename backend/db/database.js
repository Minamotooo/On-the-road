const fs = require("fs");
const path = require("path");
const { Pool, types } = require("pg");

// Pick up PGUSER / PGPASSWORD / ... from backend/.env if they're set there
// (real environment variables win).
const envFile = path.join(__dirname, "..", ".env");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
    if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2];
  }
}

// Return DATE columns as plain 'YYYY-MM-DD' strings instead of JS Dates,
// so check-in/check-out dates don't shift a day when serialised to JSON.
types.setTypeParser(1082, (value) => value);

// PostgreSQL configuration. Defaults match the README; override any of them
// with PGUSER / PGHOST / PGDATABASE / PGPASSWORD / PGPORT in backend/.env.
const config = {
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "ontheroad",
  password: process.env.PGPASSWORD || "1",
  port: Number(process.env.PGPORT) || 5432,
};

const pool = new Pool(config);

module.exports = pool;
module.exports.config = config;
