// const { Pool } = require("pg");

// const pool = new Pool();
// module.exports = {
//   query: (text, params) => pool.query(text, params),
// };

const { Pool } = require('pg');

// PostgreSQL configuration
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'slogsweep44445',
    port: 5432,
});

module.exports = pool;
