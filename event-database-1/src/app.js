const express = require('express');
const eventRoutes = require('./routes/events');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL pool setup (Nhost)
const pool = new Pool({
    user: 'postgres',
    host: 'ostmpjoicdvtsfvyybtp.db.eu-central-1.nhost.run',
    database: 'ostmpjoicdvtsfvyybtp',
    password: 'Passwordpassword1',
    port: 5432,
    ssl: { rejectUnauthorized: false }
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

app.locals.pool = pool;

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../../event-database')));
console.log('Serving static files from:', path.join(__dirname, '../../event-database'));

app.use(express.json());
app.use('/api/events', eventRoutes);

// Optional: Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../event-database/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});