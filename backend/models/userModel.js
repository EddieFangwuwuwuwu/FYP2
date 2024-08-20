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
    addCardsToCategory: (categoryId, cardIds, callback) => {
        const values = cardIds.map(cardId => [categoryId, cardId]);
        const query = 'INSERT INTO category_cards (category_id, card_id) VALUES ?';
        db.query(query, [values], callback);
    },
   
};

module.exports = User;
