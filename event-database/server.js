const express = require('express');
const cors = require('cors');
const { Client } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection config
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'event_database', // your database name
    password: 'password',
    port: 5432,
});

// Connect to PostgreSQL
client.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => {
        console.error('Failed to connect to PostgreSQL:', err.message);
        process.exit(1);
    });

// API endpoint to save event
app.post('/api/events', async (req, res) => {
    const { event_name, event_date } = req.body;
    if (!event_name || !event_date) {
        return res.status(400).json({ error: 'Event name and date are required.' });
    }
    try {
        await client.query(
            'INSERT INTO event_registered (event_name, event_date) VALUES ($1, $2)',
            [event_name, event_date]
        );
        res.status(201).json({ message: 'Event saved!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all events
app.get('/api/events', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM event_registered ORDER BY event_date DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete an event
app.delete('/api/events/:event_name/:event_date', async (req, res) => {
    const { event_name, event_date } = req.params;
    try {
        await client.query(
            'DELETE FROM event_registered WHERE event_name = $1 AND event_date = $2',
            [event_name, event_date]
        );
        res.json({ message: 'Event deleted!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on http://192.168.0.112:3000');
});



