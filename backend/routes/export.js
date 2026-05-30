const express = require('express');
const router = express.Router();
const { Parser } = require('json2csv');
const auth = require('../middleware/auth');
const Registration = require('../models/Registration');
const Event = require('../models/Event');

// @route   GET api/export/events/:eventId/csv
// @desc    Export all registrations for a specific event as a CSV file
// @access  Private (Requires Organizer Login)
router.get('/events/:eventId/csv', auth, async (req, res) => {
    try {
        const { eventId } = req.params;

        // 1. Verify the event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        // 2. Fetch all registrations for this event
        // .lean() returns plain Javascript objects instead of heavy Mongoose documents
        const registrations = await Registration.find({ eventId }).lean();

        if (registrations.length === 0) {
            return res.status(404).json({ msg: 'No registrations found for this event to export.' });
        }

        // 3. Define the columns for the CSV file
        const fields = [
            { label: 'Registration ID', value: '_id' },
            { label: 'Attendee Name', value: 'attendeeName' },
            { label: 'Attendee Email', value: 'attendeeEmail' },
            { label: 'Status', value: 'status' },
            { label: 'Registration Date', value: 'createdAt' }
        ];

        // 4. Parse JSON data into CSV format
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(registrations);

        // 5. Set response headers to trigger a file download
        // Remove spaces and special characters from event title for the filename
        const safeTitle = event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        
        res.header('Content-Type', 'text/csv');
        res.attachment(`${safeTitle}_attendees.csv`);
        
        // 6. Send the CSV string
        return res.send(csv);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error during CSV export');
    }
});

module.exports = router;