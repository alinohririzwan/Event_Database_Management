const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'password',
    database: 'event_database', // Make sure to create this database in PostgreSQL
    port: 5432,
});

pool.on('connect', () => {
    console.log('Connected to the PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('Error connecting to the database', err);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool,
};