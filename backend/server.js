const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Mounting Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
// Add this line where your other app.use() routes are defined
app.use('/api/export', require('./routes/export'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));