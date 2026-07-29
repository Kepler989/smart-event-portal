const express = require('express');
const router = express.Router();
const { Parser } = require('json2csv');
const auth = require('../middleware/auth');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
 
router.get('/events/:eventId/csv', auth, async (req, res) => {
    try {
        const { eventId } = req.params;
 
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }
 
        const registrations = await Registration.find({ eventId }).lean();

        if (registrations.length === 0) {
            return res.status(404).json({ msg: 'No registrations found for this event to export.' });
        }
 
        const fields = [
            { label: 'Registration ID', value: '_id' },
            { label: 'Attendee Name', value: 'attendeeName' },
            { label: 'Attendee Email', value: 'attendeeEmail' },
            { label: 'Status', value: 'status' },
            { label: 'Registration Date', value: 'createdAt' }
        ];
 
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(registrations);
 
        const safeTitle = event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        
        res.header('Content-Type', 'text/csv');
        res.attachment(`${safeTitle}_attendees.csv`);
         
        return res.send(csv);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error during CSV export');
    }
});

module.exports = router;