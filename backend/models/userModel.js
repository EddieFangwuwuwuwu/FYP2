const db = require('../config/db.config');

const User = {
    // Method to create a new user
    create: (userData, callback) => {
        const query = 'INSERT INTO users SET ?';
        db.query(query, userData, callback);
    },

    // Method to add a new banking card
    addNewCard: (cardData, callback) => {
        const query = 'INSERT INTO banking_cards SET ?';
        db.query(query, cardData, callback);
    },

    // Method to create a new category
    createCategory: (categoryData, callback) => {
        const query = 'INSERT INTO categories SET ?';
        db.query(query, categoryData, callback);
    },

    // Method to fetch all banking cards
    getAllCards: (callback) => {
        const query = 'SELECT * FROM banking_cards';
        db.query(query, callback);
    },

    // Method to fetch all categories
    getAllCategories: (callback) => {
        const query = 'SELECT * FROM categories';
        db.query(query, callback);
    },

    // Method to add selected cards to a category
    addCardsToCategory: (categoryId, cardIds, callback) => {
        const values = cardIds.map(cardId => [categoryId, cardId]);
        const query = 'INSERT INTO category_cards (category_id, card_id) VALUES ?';
        db.query(query, [values], callback);
    },

    // Method to update the user's profile info (username, email, password)
    updateProfileInfo: (userId, updateData, callback) => {
        const { username, email, password } = updateData;
        
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
            query += 'password = ?, ';
            params.push(password);
        }

        // Remove trailing comma and space
        query = query.slice(0, -2) + ' WHERE id = ?';
        params.push(userId);

        db.query(query, params, callback);
    },

    // Method to update the user's profile picture
    updateProfilePicture: (userId, profilePicturePath, callback) => {
        const query = 'UPDATE users SET profile_picture = ? WHERE id = ?';
        db.query(query, [profilePicturePath, userId], callback);
    },

    // Method to fetch a user profile
    getUserProfile: (userId, callback) => {
        const query = 'SELECT username, email, profile_picture FROM users WHERE id = ?';
        db.query(query, [userId], callback);
    },

    // Method to fetch all users except the current user
    getAllUsersExceptCurrent: (userId, callback) => {
        const query = 'SELECT id, username FROM users WHERE id != ?';
        db.query(query, [userId], callback);
    },

    // Method to get shared cards for a user
    getSharedCardsForUser: (userId, callback) => {
        const query = `
            SELECT bc.id, bc.card_number, bc.bank_type, bc.card_type, bc.expiration_date 
            FROM banking_cards bc
            INNER JOIN shared_cards sc ON bc.id = sc.card_id
            WHERE sc.user_id = ?`;
        db.query(query, [userId], callback);
    },

    // Method to create a pending share record with TOTP secret
    createPendingShare: (cardId, recipientId, secret, callback) => {
        const query = `
            INSERT INTO pending_shares (card_id, recipient_id, secret)
            VALUES (?, ?, ?)`;
        db.query(query, [cardId, recipientId, secret], callback);
    },

    // Method to retrieve a pending share by card ID and recipient ID
    getPendingShare: (cardId, recipientId, callback) => {
        const query = `
            SELECT * FROM pending_shares
            WHERE card_id = ? AND recipient_id = ?`;
        db.query(query, [cardId, recipientId], callback);
    },

    // Method to delete a pending share by card ID and recipient ID
    deletePendingShare: (cardId, recipientId, callback) => {
        const query = `
            DELETE FROM pending_shares
            WHERE card_id = ? AND recipient_id = ?`;
        db.query(query, [cardId, recipientId], callback);
    },

    // Method to share a card with a user
    shareCardWithUser: (cardId, recipientId, callback) => {
        const query = 'INSERT INTO shared_cards (card_id, user_id) VALUES (?, ?)';
        db.query(query, [cardId, recipientId], callback);
    },

    // Method to get verified users with their shared cards
    getVerifiedUsers: (callback) => {
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
                return callback(err, null);
            }
            if (results.length === 0) {
                return callback(null, []);
            }
            return callback(null, results);
        });
    },

    // Method to fetch pending shared cards for a user
    getPendingSharedCards: (userId, callback) => {
        const query = `
            SELECT c.*
            FROM banking_cards c
            WHERE c.id IN (
                SELECT ps.card_id
                FROM pending_shares ps
                WHERE ps.recipient_id = ?
            );
        `;
        db.query(query, [userId], callback);
    },
};

module.exports = User;
