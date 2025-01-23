const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Built-in JSON parser

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'contact-manager-frontend', 'build')));

// Import Routes
const contactRoutes = require('./routes/contacts');
app.use('/contacts', contactRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact-manager-frontend', 'build', 'index.html'));
});

// Sync Database Schema
sequelize
    .sync({ force: true })
    .then(() => {
        console.log('Database synced successfully.');
        // Start the server after syncing
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error syncing database:', error);
    });