const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models'); // Adjust the path to your Sequelize models folder

const app = express();
const PORT = process.env.PORT || 3000; // Use Azure's dynamic PORT or default to 3000

// Middleware
app.use(cors());
app.use(express.json()); // Built-in JSON parser

// Import Routes
const contactRoutes = require('./routes/contacts');
app.use('/contacts', contactRoutes);

// Sync Database Schema
sequelize
    .sync({ force: false }) // Set `force: true` to drop and re-create tables (useful for development)
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