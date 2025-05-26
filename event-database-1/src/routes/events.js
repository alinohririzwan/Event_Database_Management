const express = require('express');
const router = express.Router();
const Event = require('../models/event');

// Add a new event
router.post('/', async (req, res) => {
    const { name, date } = req.body;
    try {
        const newEvent = await Event.create({ name, date });
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add event' });
    }
});

// Get all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.findAll();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve events' });
    }
});

// Update an event
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, date } = req.body;
    try {
        const updatedEvent = await Event.update(id, { name, date });
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update event' });
    }
});

// Delete an event
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Event.delete(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete event' });
    }
});

module.exports = router;