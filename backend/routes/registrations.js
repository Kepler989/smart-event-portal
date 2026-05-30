const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const mongoose = require('mongoose');
const generateTicketQR = require('../utils/generateQR');

// Registration Schema (Typically goes in models/Registration.js)
const RegistrationSchema = new mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    attendeeName: { type: String, required: true },
    attendeeEmail: { type: String, required: true },
    status: { type: String, default: 'Confirmed' }
}, { timestamps: true });
const Registration = mongoose.model('Registration', RegistrationSchema);

// @route   POST api/registrations
// @desc    Register a participant for an event
router.post('/', async (req, res) => {
    const { eventId, attendeeName, attendeeEmail } = req.body;

    try {
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ msg: 'Event not found' });

        if (event.registeredCount >= event.capacity) {
            return res.status(400).json({ msg: 'Event is at full capacity' });
        }

        // Create new registration
        const registration = new Registration({ eventId, attendeeName, attendeeEmail });
        await registration.save();

        // ... after await registration.save();
        const ticketQR = await generateTicketQR(registration._id.toString());
        res.status(201).json({ msg: 'Successfully registered!', registration, ticketQR });

        // Update event count
        event.registeredCount += 1;
        await event.save();

        res.status(201).json({ msg: 'Successfully registered!', registration });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;