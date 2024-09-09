const db = require('../config/db.config');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const User = require('../models/userModel'); // Adjust the path if necessary
const speakeasy = require('speakeasy');

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'D:/MobileApplicationTutorial/FYP/Image'); // Specify the uploads directory
    },
    filename: function (req, file, cb) {
        const filename = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
        cb(null, filename); // Create a unique filename
    }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// Register a new user
exports.registerUser = (req, res) => {
    try {
        const { email, username, password } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10);

        const query = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';
        db.query(query, [email, username, hashedPassword], (err, result) => {
            if (err) {
                return res.status(500).send({ message: 'Error registering user', error: err });
            }
            res.status(201).send({ message: 'User registered successfully!' });
        });
    } catch (err) {
        res.status(500).send({ message: 'An error occurred', error: err.message });
    }
};

// Log in a user
exports.loginUser = (req, res) => {
    try {
        const { email, password } = req.body;

        const query = 'SELECT * FROM users WHERE email = ?';
        db.query(query, [email], (err, results) => {
            if (err) {
                return res.status(500).send({ message: 'Error retrieving user', error: err });
            }

            if (results.length === 0) {
                return res.status(404).send({ message: 'User not found' });
            }

            const user = results[0];
            const isPasswordValid = bcrypt.compareSync(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).send({ message: 'Invalid password' });
            }

            req.session.user = { id: user.id, username: user.username };
            res.status(200).send({ message: 'Login successful', user: { id: user.id, username: user.username } });
        });
    } catch (err) {
        res.status(500).send({ message: 'An error occurred', error: err.message });
    }
};

// Add a new banking card
exports.addNewCard = (req, res) => {
    try {
        const userId = req.session.user ? req.session.user.id : null;
        if (!userId) {
            return res.status(400).send({ message: 'User ID is missing. Cannot add card.' });
        }

        const { bankType, cardNumber, cardType, cardExpDate } = req.body;
        const query = 'INSERT INTO banking_cards (user_id, bank_type, card_number, card_type, expiration_date) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [userId, bankType, cardNumber, cardType, cardExpDate], (err, result) => {
            if (err) {
                return res.status(500).send({ message: 'Error adding banking card', error: err });
            }

            res.status(201).send({ message: 'Banking card added successfully!', card: result.insertId });
        });
    } catch (err) {
        res.status(500).send({ message: 'An error occurred', error: err.message });
    }
};

// Create a new category
exports.createCate = (req, res) => {
    try {
        const userId = req.session.user.id;
        const { cateName, cateType } = req.body;
        const query = 'INSERT INTO categories (user_id, cateName, cateType) VALUES (?, ?, ?)';
        db.query(query, [userId, cateName, cateType], (err, result) => {
            if (err) {
                return res.status(500).send({ message: 'Error creating category', error: err });
            }

            res.status(201).send({ message: 'Category created successfully!' });
        });
    } catch (err) {
        res.status(500).send({ message: 'An error occurred', error: err.message });
    }
};

// Fetch all cards
exports.getAllCards = (req, res) => {
    try {
        const userId = req.session.user.id;
        const query = 'SELECT * FROM banking_cards WHERE user_id = ?';
        db.query(query, [userId], (err, results) => {
            if (err) {
                return res.status(500).send({ message: 'Error fetching cards', error: err });
            }
            res.status(200).send(results);
        });
    } catch (err) {
        res.status(500).send({ message: 'An error occurred', error: err.message });
    }
};

// Fetch all categories
exports.getAllCategories = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const query = 'SELECT * FROM categories where user_id = ?';
        db.query(query, [userId], (err, results) => {
            if (err) {
                return res.status(500).send({ message: 'Error fetching categories', error: err });
            }
            res.status(200).send(results);
        });
    } catch (err) {
        res.status(500).send({ message: 'An error occurred', error: err.message });
    }
};

// Add cards to a category
exports.addCardsToCategory = async (req, res) => {
    try {
        const { categoryId, cardIds } = req.body;

        if (!Array.isArray(cardIds) || cardIds.length === 0) {
            return res.status(400).send({ message: 'No card IDs provided' });
        }

        const values = cardIds.map(cardId => [categoryId, cardId]);
        const query = 'INSERT INTO category_cards (category_id, card_id) VALUES ?';
        db.query(query, [values], (err, result) => {
            if (err) {
                return res.status(500).send({ message: 'Error adding cards to category', error: err });
            }
            res.status(201).send({ message: 'Cards added to category successfully!' });
        });
    } catch (err) {
        res.status(500).send({ message: 'An error occurred', error: err.message });
    }
};

// Get cards for a specific category
exports.getCardsForCategory = (req, res) => {
    try {
        const userId = req.session.user.id;
        const { categoryId } = req.params;

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
                return res.status(500).send({ message: 'Error fetching cards for category', error: err });
            }
            res.status(200).send(results);
        });
    } catch (err) {
        res.status(500).send({ message: 'An error occurred', error: err.message });
    }
};

// Update profile info (username, email, password)
exports.updateProfileInfo = (req, res) => {
    const userId = req.session.user.id;
    const { username, email, password } = req.body;

    const getUserQuery = 'SELECT profile_picture FROM users WHERE id = ?';
    db.query(getUserQuery, [userId], (err, results) => {
        if (err) {
            return res.status(500).send({ message: 'Error retrieving user info', error: err });
        }

        if (results.length === 0) {
            return res.status(404).send({ message: 'User not found.' });
        }

        const currentProfilePicture = results[0].profile_picture || 'profile.jpg'; 

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

        query += 'profile_picture = ?, ';
        params.push(currentProfilePicture);

        query = query.slice(0, -2) + ' WHERE id = ?';
        params.push(userId);

        db.query(query, params, (err, result) => {
            if (err) {
                return res.status(500).send({ message: 'Error updating profile info', error: err });
            }

            req.session.user.username = username || req.session.user.username;
            req.session.user.email = email || req.session.user.email;
            req.session.user.profile_picture = currentProfilePicture;

            res.status(200).send({ message: 'Profile info updated successfully' });
        });
    });
};

// Update profile picture
exports.updateProfilePicture = (req, res) => {
    upload.single('profile_picture')(req, res, (err) => {
        if (err) {
            return res.status(500).send({ message: 'Error uploading file', error: err });
        }

        const userId = req.session.user.id;
        const profilePicture = `/uploads/${req.file.filename}`;

        User.updateProfilePicture(userId, profilePicture, (err, result) => {
            if (err) {
                return res.status(500).send({ message: 'Error updating profile picture', error: err });
            }
            res.status(200).send({ message: 'Profile picture updated successfully', profile_picture: profilePicture });
        });
    });
};

// Fetch user profile
exports.getUserProfile = (req, res) => {
    try {
        const userId = req.session.user?.id;

        const query = 'SELECT username, email, profile_picture FROM users WHERE id = ?';
        db.query(query, [userId], (err, results) => {
            if (err) {
                return res.status(500).send({ message: 'Error fetching user profile', error: err });
            }

            if (results.length === 0) {
                return res.status(404).send({ message: 'User not found' });
            }
            res.status(200).send(results[0]);
        });
    } catch (err) {
        res.status(500).send({ message: 'An error occurred', error: err.message });
    }
};

// Fetch all users (for sharing functionality)
exports.getAllUsers = (req, res) => {
    const currentUserId = req.session.user.id;

    const query = 'SELECT id, username FROM users WHERE id != ?';
    db.query(query, [currentUserId], (err, results) => {
        if (err) {
            return res.status(500).send({ message: 'Error fetching users', error: err });
        }
        res.status(200).send(results);
    });
};



exports.generateTOTP = (req, res) => {
    const { cardId, recipientId, senderId } = req.body;

    // Add logging to check the data coming from frontend
    console.log("Generating TOTP with the following data:", {
        cardId, recipientId, senderId
    });

    const secret = speakeasy.generateSecret({ length: 20 });

    const token = speakeasy.totp({
        secret: secret.base32,
        encoding: 'base32',
        step: 300, 
    });

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    const query = `
        INSERT INTO pending_shares (card_id, recipient_id, sender_id, secret, expires_at)
        VALUES (?, ?, ?, ?, ?)
    `;

    // Log before inserting into DB
    console.log("Inserting into pending_shares with values:", {
        cardId, recipientId, senderId, secret: secret.base32, expiresAt
    });

    db.query(query, [cardId, recipientId, senderId, secret.base32, expiresAt], (err, result) => {
        if (err) {
            console.error('Error inserting into pending_shares:', err);
            return res.status(500).send({ message: 'Error storing pending share', error: err });
        }
        res.status(200).send({ token, secret: secret.base32 });
    });
};




exports.checkPendingVerification = (req, res) => {
    console.log('checkPendingVerification API hit');

    const userId = req.session.user?.id;

    if (!userId) {
        console.error('No user ID found in session');
        return res.status(400).send({ message: 'User ID not found in session' });
    }

    const query = `
        SELECT * FROM pending_shares
        WHERE recipient_id = ?
        ORDER BY created_at DESC
        LIMIT 1
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error checking pending verification:', err);
            return res.status(500).send({ message: 'Error checking pending verification', error: err });
        }

        if (results.length === 0) {
            // No pending verification found, not an error, simply return success
            console.log('No pending verification found.');
            return res.status(200).send({ message: 'No pending verification', pending: false });
        }

        // Pending verification found
        console.log('Pending verification found:', results[0]);
        return res.status(200).send({ message: 'Pending verification found', pending: true, data: results[0] });
    });
};


exports.verifyTOTP = (req, res) => {
    const { cardId, recipientId, token } = req.body;  // Removed senderId from frontend

    console.log(`[TOTP Verification] Received data: cardId: ${cardId}, recipientId: ${recipientId}, token: ${token}`);

    // Fetch the stored TOTP secret and expiration time from pending_shares
    const query = `
        SELECT * FROM pending_shares
        WHERE card_id = ? AND recipient_id = ?
        ORDER BY created_at DESC
        LIMIT 1
    `;
    console.log(`[TOTP Verification] Fetching pending shares for cardId: ${cardId} and recipientId: ${recipientId}`);
    
    db.query(query, [cardId, recipientId], (err, results) => {
        if (err) {
            console.error(`[TOTP Verification] Error retrieving pending verification for cardId: ${cardId} and recipientId: ${recipientId}:`, err);
            return res.status(500).send({ message: 'Error retrieving pending verification', error: err });
        }

        if (results.length === 0) {
            console.log(`[TOTP Verification] No pending verification found for cardId: ${cardId} and recipientId: ${recipientId}`);
            return res.status(404).send({ message: 'Pending verification not found' });
        }

        const { secret, expires_at, sender_id } = results[0];  // Fetch the senderId from the DB
        console.log(`[TOTP Verification] Retrieved pending verification. Secret: ${secret}, Expires At: ${expires_at}, SenderId: ${sender_id}`);

        // Check if the TOTP has expired
        if (new Date() > new Date(expires_at)) {
            console.log(`[TOTP Verification] TOTP code has expired for cardId: ${cardId} and recipientId: ${recipientId}`);
            return res.status(400).send({ message: 'TOTP code has expired' });
        }

        // Verify the TOTP code
        const isValid = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: token,
            step: 300
        });

        if (!isValid) {
            console.log(`[TOTP Verification] Invalid TOTP code provided for cardId: ${cardId} and recipientId: ${recipientId}`);
            return res.status(401).send({ message: 'Invalid TOTP code' });
        }

        console.log(`[TOTP Verification] TOTP verified successfully for cardId: ${cardId} and recipientId: ${recipientId}`);

        // TOTP is valid, now delete the pending share record
        const deleteQuery = 'DELETE FROM pending_shares WHERE card_id = ? AND recipient_id = ?';
        console.log(`[TOTP Verification] Deleting pending share for cardId: ${cardId} and recipientId: ${recipientId}`);
        
        db.query(deleteQuery, [cardId, recipientId], (err, result) => {
            if (err) {
                console.error(`[TOTP Verification] Error deleting pending share for cardId: ${cardId} and recipientId: ${recipientId}:`, err);
                return res.status(500).send({ message: 'Error deleting pending share', error: err });
            }

            console.log(`[TOTP Verification] Pending share deleted successfully for cardId: ${cardId} and recipientId: ${recipientId}`);

            // After deletion, check if the card is already shared (update if exists) or insert a new shared card with is_verified = 1
            const checkSharedCardQuery = 'SELECT * FROM shared_cards WHERE card_id = ? AND recipient_id = ?';
            console.log(`[TOTP Verification] Checking if card is already shared for cardId: ${cardId} and recipientId: ${recipientId}`);

            db.query(checkSharedCardQuery, [cardId, recipientId], (err, sharedResults) => {
                if (err) {
                    console.error(`[TOTP Verification] Error checking shared card for cardId: ${cardId} and recipientId: ${recipientId}:`, err);
                    return res.status(500).send({ message: 'Error checking shared card', error: err });
                }

                if (sharedResults.length > 0) {
                    // If the shared card exists, update is_verified to 1
                    console.log(`[TOTP Verification] Shared card already exists for cardId: ${cardId} and recipientId: ${recipientId}. Updating verification status.`);
                    
                    const updateQuery = 'UPDATE shared_cards SET is_verified = 1 WHERE card_id = ? AND recipient_id = ?';
                    db.query(updateQuery, [cardId, recipientId], (err, result) => {
                        if (err) {
                            console.error(`[TOTP Verification] Error updating shared card verification status for cardId: ${cardId} and recipientId: ${recipientId}:`, err);
                            return res.status(500).send({ message: 'Error updating shared card verification status', error: err });
                        }

                        console.log(`[TOTP Verification] Shared card verified successfully for cardId: ${cardId} and recipientId: ${recipientId}`);
                        res.status(201).send({ success: true, message: 'Card verification completed successfully!' });
                    });
                } else {
                    // If the shared card does not exist, insert it with is_verified = 1
                    console.log(`[TOTP Verification] Shared card does not exist for cardId: ${cardId} and recipientId: ${recipientId}. Inserting new record.`);
                    
                    const insertQuery = `
                    INSERT INTO shared_cards (card_id, user_id, sender_id, recipient_id, is_verified) 
                    VALUES (?, ?, ?, ?, 1)
                    `;
                    // Use sender_id from the pending_shares result instead of senderId passed from the frontend
                    db.query(insertQuery, [cardId, recipientId, sender_id, recipientId], (err, result) => {
                        if (err) {
                            console.error(`[TOTP Verification] Error inserting shared card for cardId: ${cardId}, senderId: ${sender_id}, recipientId: ${recipientId}:`, err);
                            return res.status(500).send({ message: 'Error sharing card', error: err });
                        }
                        console.log(`[TOTP Verification] Card shared and verified successfully for cardId: ${cardId}, senderId: ${sender_id}, recipientId: ${recipientId}`);
                        res.status(201).send({ success: true, message: 'Card shared successfully and pending verification removed!' });
                    });
                }
            });
        });
    });
};


exports.getVerifiedUsers = (req, res) => {
    const query = `
        SELECT u.id, u.username, u.email,
               GROUP_CONCAT(bc.card_number SEPARATOR ', ') AS sharedCards
        FROM users u
        INNER JOIN shared_cards sc ON u.id = sc.user_id
        INNER JOIN banking_cards bc ON sc.card_id = bc.id
        GROUP BY u.id, u.username, u.email
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching verified users:', err);
            return res.status(500).send({ message: 'Error fetching verified users', error: err });
        }
        if (results.length === 0) {
            // No verified users found
            return res.status(200).send({ message: 'No verified users found', users: [] });
        }
        res.status(200).send({ message: 'Verified users found', users: results });
    });
};

exports.fetchPendingSharedCards = (req, res) => {
    const userId = req.session.user?.id;

    if (!userId) {
        return res.status(400).send({ message: 'User ID not found in session' });
    }

    User.getPendingSharedCards(userId, (err, results) => {
        if (err) {
            console.error('Error fetching pending shared cards:', err);
            return res.status(500).send({ message: 'Error fetching pending shared cards', error: err });
        }

        console.log('Fetched pending shared cards:', results); // Log the results from the database
        return res.status(200).send(results); // Send the fetched data back to the frontend
    });
};

exports.getVerifiedSharedCards = (req, res) => {
    const recipientId = req.params.userId;  // Get the user ID from the request params (the recipient)

    const query = `
    SELECT sc.id, sc.card_id, sc.sender_id, sc.shared_at, sc.is_verified, 
           bc.bank_type, bc.card_number, bc.expiration_date
    FROM shared_cards sc
    JOIN banking_cards bc ON sc.card_id = bc.id
    WHERE sc.recipient_id = ? AND sc.is_verified = 1
    `;

    db.query(query, [recipientId], (err, results) => {
        if (err) {
            console.error('Error fetching verified shared cards:', err);
            return res.status(500).send({ message: 'Error fetching shared cards' });
        }

        res.status(200).send(results);  // Return the full card details to the frontend
    });
};

// userController.js
exports.getUsersWithSharedCards = (req, res) => {
    const senderId = req.params.userId; // Get the sender's user ID from the request params
    
    const query = `
        SELECT u.id AS user_id, u.username, u.email, u.profile_picture, 
               sc.card_id, bc.bank_type, bc.card_number, bc.expiration_date
        FROM users u
        JOIN shared_cards sc ON u.id = sc.recipient_id  -- Fetch users who received cards from the sender
        JOIN banking_cards bc ON sc.card_id = bc.id
        WHERE sc.sender_id = ? AND sc.is_verified = 1  -- sc.sender_id is the user who shared the card
    `;
    
    db.query(query, [senderId], (err, results) => {
        if (err) {
            console.error('Error fetching users with shared cards:', err);
            return res.status(500).send({ message: 'Error fetching shared users' });
        }

        // Group the cards by user
        const usersWithSharedCards = results.reduce((acc, row) => {
            const { user_id, username, email, profile_picture, card_id, bank_type, card_number, expiration_date } = row;

            // Find if the user already exists in the accumulator
            let user = acc.find(u => u.id === user_id);

            // If the user doesn't exist, create a new user object
            if (!user) {
                user = {
                    id: user_id,
                    username,
                    email,
                    profile_picture,
                    sharedCards: []
                };
                acc.push(user);
            }

            // Add the card to the user's sharedCards array
            user.sharedCards.push({
                card_id,
                bank_type,
                card_number,
                expiration_date
            });

            return acc;
        }, []);

        res.status(200).send(usersWithSharedCards);
    });
};
