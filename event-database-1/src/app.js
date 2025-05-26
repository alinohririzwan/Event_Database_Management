const express = require('express');
const bodyParser = require('body-parser');
const eventRoutes = require('./routes/events');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL pool setup
const pool = new Pool({
    user: 'your_username',
    host: 'localhost',
    database: 'your_database',
    password: 'your_password',
    port: 5432,
});

// Create events table if it doesn't exist
pool.query(`
    CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        date DATE NOT NULL
    );
`, (err) => {
    if (err) {
        console.error('Error creating table:', err);
    } else {
        console.log('Events table is ready.');
    }
});

app.use(bodyParser.json());
app.use('/api/events', eventRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});