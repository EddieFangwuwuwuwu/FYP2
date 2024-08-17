const db = require('../config/db.config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
exports.registerUser =  (req, res) => {
    try {
        const { email, username, password } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10);

        const query = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';
        db.query(query, [email, username, hashedPassword], (err, result) => {
            if (err) return res.status(500).send({ message: 'Error registering user', error: err });

            res.status(201).send({ message: 'User registered successfully!' });
        });
    } catch (err) {
        res.status(500).send({ message: 'An error occurred', error: err.message });
    }
};

// Log in a user
exports.loginUser =  (req, res) => {
    try {
        const { email, password } = req.body;

        const query = 'SELECT * FROM users WHERE email = ?';
        db.query(query, [email], (err, results) => {
            if (err) return res.status(500).send({ message: 'Error retrieving user', error: err });

            if (results.length === 0) {
                return res.status(404).send({ message: 'User not found' });
            }

            const user = results[0];
            const isPasswordValid = bcrypt.compareSync(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).send({ message: 'Invalid password' });
            }

            const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET || 'secret_key', {
                expiresIn: '1h',
            });

            res.status(200).send({ message: 'Login successful', token, user: { id: user.id, username: user.username } });
        });
    } catch (err) {
        res.status(500).send({ message: 'An error occurred', error: err.message });
    }
};

// Add a new banking card
exports.addNewCard =  (req, res) => {
    try {
        const { bankType, cardNumber, cardType, cardExpDate } = req.body;
        const query = 'INSERT INTO banking_cards (bank_type, card_number, card_type, expiration_date) VALUES (?, ?, ?, ?)';
        db.query(query, [bankType, cardNumber, cardType, cardExpDate], (err, result) => {
            if (err) return res.status(500).send({ message: 'Error adding banking card', error: err });

            res.status(201).send({ message: 'Banking card added successfully!' });
        });
    } catch (err) {
        res.status(500).send({ message: 'An error occurred', error: err.message });
    }
};

// Create a new category
exports.createCate =  (req, res) => {
    try {
        const { cateName, cateType } = req.body;
        const query = 'INSERT INTO categories (category_name, category_type) VALUES (?, ?)';
        db.query(query, [cateName, cateType], (err, result) => {
            if (err) return res.status(500).send({ message: 'Error creating category', error: err });

            res.status(201).send({ message: 'Category created successfully!' });
        });
    } catch (err) {
        res.status(500).send({ message: 'An error occurred', error: err.message });
    }
};


exports.getAllCards = async (req, res) => {
    try {
        const query = 'SELECT * FROM banking_cards';
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching cards:', err);
                return res.status(500).send({ message: 'Error fetching cards', error: err });
            }

            res.status(200).send(results);
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({ message: 'An error occurred', error: err.message });
    }
};

// Fetch all categories
exports.getAllCategories = async (req, res) => {
    try {
        const query = 'SELECT * FROM categories';
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching categories:', err);
                return res.status(500).send({ message: 'Error fetching categories', error: err });
            }

            res.status(200).send(results);
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({ message: 'An error occurred', error: err.message });
    }
};