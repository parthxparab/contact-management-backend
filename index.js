const express = require('express');
const cors = require('cors');
// If you're using an older version of Express, you might need body-parser:
// const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // built-in JSON parser

// Import Routes
const contactRoutes = require('./routes/contacts');
app.use('/contacts', contactRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});