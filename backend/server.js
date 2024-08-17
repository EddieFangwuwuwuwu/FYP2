const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api', userRoutes);

const PORT = process.env.PORT || 8082;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
