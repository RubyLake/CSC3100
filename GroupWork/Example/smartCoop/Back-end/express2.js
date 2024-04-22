const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the front-end directory
app.use(express.static(path.join(__dirname, '..', 'front-end')));

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req, res) => {
    res.redirect('/smartCoop.html');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});