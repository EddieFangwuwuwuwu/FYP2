const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Configure express-session
app.use(session({
    secret: '1234',  // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Set to true if using HTTPS
}));

// Routes
app.use('/api', userRoutes);

const PORT = process.env.PORT || 8082;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
