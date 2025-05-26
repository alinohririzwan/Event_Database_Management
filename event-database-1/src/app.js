const express = require('express');
const eventRoutes = require('./routes/events');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL pool setup
const pool = new Pool({
    user: 'postgres', // Change to your Nhost DB user
    host: 'ostmpjoicdvtsfvyybtp.db.eu-central-1.nhost.run', // Change to your Nhost DB host
    database: 'ostmpjoicdvtsfvyybtp', // Change to your Nhost DB name
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

// Make pool available to routes/models if needed
app.locals.pool = pool;

// Serve static files from the correct frontend directory
app.use(express.static(path.join(__dirname, '../../event-database')));

app.use(express.json());
app.use('/api/events', eventRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Added for starting the application from a specific directory
process.chdir('F:\\code\\Event_Database_Management\\event-database-1');