const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'password',
    database: 'event_database', // Make sure to create this database in PostgreSQL
    port: 5432,
});

const Event = {
    create: async (eventName, eventDate) => {
        const result = await pool.query('INSERT INTO events (name, date) VALUES ($1, $2) RETURNING *', [eventName, eventDate]);
        return result.rows[0];
    },
    getAll: async () => {
        const result = await pool.query('SELECT * FROM events');
        return result.rows;
    },
    getById: async (id) => {
        const result = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
        return result.rows[0];
    },
    update: async (id, eventName, eventDate) => {
        const result = await pool.query('UPDATE events SET name = $1, date = $2 WHERE id = $3 RETURNING *', [eventName, eventDate, id]);
        return result.rows[0];
    },
    delete: async (id) => {
        await pool.query('DELETE FROM events WHERE id = $1', [id]);
    }
};

module.exports = Event;