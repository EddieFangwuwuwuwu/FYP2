import axios from 'axios';

const API_URL = 'http://10.0.2.2:8082/api';

// Register a new user
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

// Log in a user
export const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/login`, userData);
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

// Add a new banking card
export const addNewCard = async (cardData) => {
    try {
        const response = await axios.post(`${API_URL}/addNewCard`, cardData);
        return response.data;
    } catch (error) {
        console.error('Error adding new card:', error);
        throw error;
    }
};

// Create a new category
export const createCategory = async (categoryData) => {
    try {
        const response = await axios.post(`${API_URL}/createCate`, categoryData);
        return response.data;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};

// Fetch cards from the database
export const fetchCards = async () => {
    try {
        const response = await axios.get(`${API_URL}/cards`);
        return response.data;
    } catch (error) {
        console.error('Error fetching cards:', error);
        throw error;
    }
};

// Fetch categories from the database
export const fetchCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/categories`);
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};
