const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const generateTicketQR = require('../utils/generateQR'); // <-- 1. Add this import

router.post('/', async (req, res) => {
    const { eventId, attendeeName, attendeeEmail } = req.body;

    try {
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ msg: 'Event not found' });
        if (event.registeredCount >= event.capacity) return res.status(400).json({ msg: 'Event is at full capacity' });

        const registration = new Registration({ eventId, attendeeName, attendeeEmail });
        await registration.save();

        event.registeredCount += 1;
        await event.save();

        // --- 2. Generate the QR code string from the database ID ---
        const ticketQR = await generateTicketQR(registration._id.toString());

        // --- 3. Send it back to the frontend ---
        res.status(201).json({ msg: 'Successfully registered!', registration, ticketQR });
    } catch (err) {
        console.error("Backend Registration Error:", err.message);
        res.status(500).json({ msg: 'Server Error: ' + err.message });
    }
});

module.exports = router;