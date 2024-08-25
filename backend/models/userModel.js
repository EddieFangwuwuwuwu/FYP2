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

    // Method to update the user's profile (including profile picture)
    updateProfile: (userId, updateData, callback) => {
        const { username, email, password, profilePicturePath } = updateData;
        
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
        if (profilePicturePath) {
            query += 'profile_picture = ?, ';
            params.push(profilePicturePath);
        }

        // Remove trailing comma and space
        query = query.slice(0, -2) + ' WHERE id = ?';
        params.push(userId);

        db.query(query, params, callback);
    },

    getUserProfile: (userId, callback) => {
        const query = 'SELECT username, email, profile_picture FROM users WHERE id = ?';
        db.query(query, [userId], callback);
    },
};

module.exports = User;
