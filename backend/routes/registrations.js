const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Registration = require('../models/Registration'); // Make sure this path is correct!

// @route   POST api/registrations
// @desc    Register a participant for an event
router.post('/', async (req, res) => {
    const { eventId, attendeeName, attendeeEmail } = req.body;

    try {
        // Find the event
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        // Check capacity
        if (event.registeredCount >= event.capacity) {
            return res.status(400).json({ msg: 'Event is at full capacity' });
        }

        // Save registration
        const registration = new Registration({ eventId, attendeeName, attendeeEmail });
        await registration.save();

        // Increment registration counter on the event
        event.registeredCount += 1;
        await event.save();

        res.status(201).json({ msg: 'Successfully registered!', registration });
    } catch (err) {
        console.error("Backend Registration Error:", err.message);
        res.status(500).json({ msg: 'Server Error: ' + err.message });
    }
});

module.exports = router;