const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'password',
    database: 'event_database',
    port: 5432,
});

const Event = {
    create: async ({ name, date }) => {
        const result = await pool.query(
            'INSERT INTO events (name, date) VALUES ($1, $2) RETURNING *',
            [name, date]
        );
        return result.rows[0];
    },
    findAll: async () => {
        const result = await pool.query('SELECT * FROM events');
        return result.rows;
    },
    getById: async (id) => {
        const result = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
        return result.rows[0];
    },
    update: async (id, { name, date }) => {
        const result = await pool.query(
            'UPDATE events SET name = $1, date = $2 WHERE id = $3 RETURNING *',
            [name, date, id]
        );
        return result.rows[0];
    },
    delete: async (id) => {
        await pool.query('DELETE FROM events WHERE id = $1', [id]);
        return { message: 'Event deleted' };
    }
};

module.exports = Event;