const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    attendeeName: { type: String, required: true },
    attendeeEmail: { type: String, required: true },
    status: { type: String, default: 'Confirmed' }
}, { timestamps: true });

module.exports = mongoose.model('Registration', RegistrationSchema);