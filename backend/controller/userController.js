const db = require('../config/db.config');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('Setting up destination for file upload...');
        cb(null, 'D:/MobileApplicationTutorial/FYP/Image'); // Specify the uploads directory
    },
    filename: function (req, file, cb) {
        const filename = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
        console.log('Generated filename:', filename);
        cb(null, filename); // Create a unique filename
    }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// Register a new user
exports.registerUser = (req, res) => {
    try {
        console.log('Registering user with email:', req.body.email);
        const { email, username, password } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10);

        const query = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';
        db.query(query, [email, username, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error registering user:', err);
                return res.status(500).send({ message: 'Error registering user', error: err });
            }

            console.log('User registered successfully with ID:', result.insertId);
            res.status(201).send({ message: 'User registered successfully!' });
        });
    } catch (err) {
        console.error('An error occurred during user registration:', err.message);
        res.status(500).send({ message: 'An error occurred', error: err.message });
    }
};

// Log in a user
exports.loginUser = (req, res) => {
    try {
        console.log('Login request received for:', req.body.email);
        const { email, password } = req.body;

        const query = 'SELECT * FROM users WHERE email = ?';
        db.query(query, [email], (err, results) => {
            if (err) {
                console.error('Error retrieving user:', err);
                return res.status(500).send({ message: 'Error retrieving user', error: err });
            }

            if (results.length === 0) {
                console.log('User not found for email:', email);
                return res.status(404).send({ message: 'User not found' });
            }

            const user = results[0];
            const isPasswordValid = bcrypt.compareSync(password, user.password);

            if (!isPasswordValid) {
                console.log('Invalid password for email:', email);
                return res.status(401).send({ message: 'Invalid password' });
            }

            // Store user info in session
            req.session.user = { id: user.id, username: user.username };
            console.log("Session set for user:", req.session.user);

            res.status(200).send({ message: 'Login successful', user: { id: user.id, username: user.username } });
        });
    } catch (err) {
        console.error('An error occurred during login:', err.message);
        res.status(500).send({ message: 'An error occurred', error: err.message });
    }
};

// Add a new banking card
exports.addNewCard = (req, res) => {
    try {
        const userId = req.session.user ? req.session.user.id : null;
        if (!userId) {
            console.log('User ID missing in session. Cannot add card.');
            return res.status(400).send({ message: 'User ID is missing. Cannot add card.' });
        }

        console.log('Adding new banking card for user ID:', userId);
        const { bankType, cardNumber, cardType, cardExpDate } = req.body;
        const query = 'INSERT INTO banking_cards (user_id, bank_type, card_number, card_type, expiration_date) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [userId, bankType, cardNumber, cardType, cardExpDate], (err, result) => {
            if (err) {
                console.error('Error adding banking card:', err);
                return res.status(500).send({ message: 'Error adding banking card', error: err });
            }

            console.log('Banking card added successfully with ID:', result.insertId);
            res.status(201).send({ message: 'Banking card added successfully!', card: result.insertId });
        });
    } catch (err) {
        console.error('An error occurred while adding a banking card:', err.message);
        res.status(500).send({ message: 'An error occurred', error: err.message });
    }
};

// Create a new category
exports.createCate = (req, res) => {
    try {
        const userId = req.session.user.id;
        console.log('Creating new category for user ID:', userId);
        const { cateName, cateType } = req.body;
        const query = 'INSERT INTO categories (user_id, cateName, cateType) VALUES (?, ?, ?)';
        db.query(query, [userId, cateName, cateType], (err, result) => {
            if (err) {
                console.error('Error creating category:', err);
                return res.status(500).send({ message: 'Error creating category', error: err });
            }

            console.log('Category created successfully with ID:', result.insertId);
            res.status(201).send({ message: 'Category created successfully!' });
        });
    } catch (err) {
        console.error('An error occurred while creating a category:', err.message);
        res.status(500).send({ message: 'An error occurred', error: err.message });
    }
};

// Fetch all cards
exports.getAllCards = (req, res) => {
    try {
        const userId = req.session.user.id;
        console.log('Fetching all cards for user ID:', userId);
        const query = 'SELECT * FROM banking_cards WHERE user_id = ?';
        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error('Error fetching cards:', err);
                return res.status(500).send({ message: 'Error fetching cards', error: err });
            }

            console.log('Cards fetched successfully for user ID:', userId);
            res.status(200).send(results);
        });
    } catch (err) {
        console.error('An error occurred while fetching cards:', err.message);
        res.status(500).send({ message: 'An error occurred', error: err.message });
    }
};

// Fetch all categories
exports.getAllCategories = async (req, res) => {
    try {
        const userId = req.session.user.id;
        console.log('Fetching all categories for user ID:', userId);
        const query = 'SELECT * FROM categories where user_id = ?';
        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error('Error fetching categories:', err);
                return res.status(500).send({ message: 'Error fetching categories', error: err });
            }

            console.log('Categories fetched successfully for user ID:', userId);
            res.status(200).send(results);
        });
    } catch (err) {
        console.error('An error occurred while fetching categories:', err.message);
        res.status(500).send({ message: 'An error occurred', error: err.message });
    }
};

// Add cards to a category
exports.addCardsToCategory = async (req, res) => {
    try {
        console.log('Adding cards to category:', req.body.categoryId);
        const { categoryId, cardIds } = req.body;

        // Check if cardIds is an array and contains at least one element
        if (!Array.isArray(cardIds) || cardIds.length === 0) {
            console.log('No card IDs provided for category:', categoryId);
            return res.status(400).send({ message: 'No card IDs provided' });
        }

        User.addCardsToCategory(categoryId, cardIds, (err, result) => {
            if (err) {
                console.error('Error adding cards to category:', err);
                return res.status(500).send({ message: 'Error adding cards to category', error: err });
            }
            console.log('Cards added to category successfully for category ID:', categoryId);
            res.status(201).send({ message: 'Cards added to category successfully!' });
        });
    } catch (err) {
        console.error('Error in addCardsToCategory:', err.message);
        res.status(500).send({ message: 'An error occurred', error: err.message });
    }
};

// Get cards for a specific category
exports.getCardsForCategory = (req, res) => {
    try {
        const userId = req.session.user.id;
        const { categoryId } = req.params;
        console.log('Fetching cards for category:', categoryId, 'and user ID:', userId);

        const query = `
            SELECT 
                bc.id, 
                bc.card_number, 
                bc.bank_type, 
                bc.card_type, 
                bc.expiration_date, 
                bc.user_id, 
                cc.category_id
            FROM 
                banking_cards bc
            INNER JOIN 
                category_cards cc 
            ON 
                bc.id = cc.card_id
            WHERE 
                cc.category_id = ? AND bc.user_id = ?`;

        db.query(query, [categoryId, userId], (err, results) => {
            if (err) {
                console.error('Error fetching cards for category:', err);
                return res.status(500).send({ message: 'Error fetching cards for category', error: err });
            }

            console.log('Cards fetched successfully for category ID:', categoryId);
            res.status(200).send(results);
        });
    } catch (err) {
        console.error('Error fetching cards for category:', err.message);
        res.status(500).send({ message: 'An error occurred', error: err.message });
    }
};

// Handle profile picture upload and update user profile
exports.updateProfile = (req, res) => {
    console.log('Updating profile for user ID:', req.session.user.id);
    upload.single('profile_picture')(req, res, async (err) => {
        if (err) {
            console.error('Error uploading file:', err);
            return res.status(500).send({ message: 'Error uploading file', error: err });
        }

        const userId = req.session.user.id;
        const { username, email, password } = req.body;
        const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;

        // Validate file type (Optional)
        if (req.file && !['image/jpeg', 'image/png', 'image/gif', 'image/jpg'].includes(req.file.mimetype)) {
            console.log('Invalid file type uploaded:', req.file.mimetype);
            return res.status(400).send({ message: 'Invalid file type. Please upload an image.' });
        }

        let query = 'UPDATE users SET ';
        let params = [];
        if (username) {
            query += 'username = ?, ';
            params.push(username);
        }
        if (email) {
            query += 'email = ?, ';
            params.push(email);
        }
        if (password) {
            const hashedPassword = bcrypt.hashSync(password, 10);
            query += 'password = ?, ';
            params.push(hashedPassword);
        }
        if (profilePicture) {
            query += 'profile_picture = ?, ';
            params.push(profilePicture);
        }

        // Remove the last comma and space
        query = query.slice(0, -2) + ' WHERE id = ?';
        params.push(userId);

        db.query(query, params, (err, result) => {
            if (err) {
                console.error('Error updating profile:', err);
                return res.status(500).send({ message: 'Error updating profile', error: err });
            }

            console.log('Profile updated successfully for user ID:', userId);
            res.status(200).send({ message: 'Profile updated successfully', profile_picture: profilePicture });
        });
    });
};

exports.getUserProfile = (req, res) => {
    try {
        const userId = req.session.user?.id; // Assuming the user ID is stored in the session after login
        console.log('Fetching user profile for user ID:', userId);

        const query = 'SELECT username, email, profile_picture FROM users WHERE id = ?';
        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error('Error fetching user profile:', err);
                return res.status(500).send({ message: 'Error fetching user profile', error: err });
            }

            if (results.length === 0) {
                console.log('User not found for ID:', userId);
                return res.status(404).send({ message: 'User not found' });
            }

            console.log('User profile fetched successfully for user ID:', userId);
            res.status(200).send(results[0]);  // Send the user profile data as the response
        });
    } catch (err) {
        console.error('Error occurred while fetching user profile:', err.message);
        res.status(500).send({ message: 'An error occurred', error: err.message });
    }
};
