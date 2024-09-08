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
        const response = await axios.post(`${API_URL}/createCategory`, categoryData);
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

// Add selected cards to a category
export const addCardsToCategory = async (categoryId, cardIds) => {
    try {
        const response = await axios.post(`${API_URL}/addCardsToCategory`, {
            categoryId,
            cardIds
        });
        return response.data;
    } catch (error) {
        console.error('Error adding cards to category:', error);
        throw error;
    }
};

// Update profile info (username, email, password)
export const updateProfileInfo = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/updateProfileInfo`, data, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 20000,
        });
        return response.data;
    } catch (error) {
        console.error('Error updating profile info:', error);
        throw error;
    }
};

// Update profile picture
export const updateProfilePicture = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/updateProfilePicture`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 20000,
        });
        return response.data;
    } catch (error) {
        console.error('Error updating profile picture:', error);
        throw error;
    }
};

// Fetch cards for a specific category
export const fetchCardsForCategory = async (categoryId) => {
    try {
        const response = await axios.get(`${API_URL}/cards/category/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching cards for category:', error);
        throw error;
    }
};

// Fetch user profile
export const fetchUserProfile = async () => {
    try {
        const response = await axios.get(`${API_URL}/userProfile`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

// Fetch all users (for sharing functionality)
export const fetchAllUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}/users`);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

// Share a card with selected users
export const shareCard = async (cardId, userIds) => {
    try {
        const response = await axios.post(`${API_URL}/shareCard`, {
            cardId,
            userIds
        });
        return response.data;
    } catch (error) {
        console.error('Error sharing card:', error);
        throw error;
    }
};

// Generate TOTP for card sharing
export const generateTOTP = async (cardId, recipientId, senderId) => {
    try {
        const response = await axios.post(`${API_URL}/generateTOTP`, {
            cardId,
            recipientId,
            senderId  
        });
        return response.data;
    } catch (error) {
        console.error('Error generating TOTP:', error);
        throw error;
    }
};

// Verify TOTP for card sharing
export const verifyTOTP = async (cardId, recipientId, token, senderId) => {
    try {
        const response = await axios.post(`${API_URL}/verifyTOTP`, {
            cardId,
            recipientId,
            token, 
            senderId // No need for senderId here
        });
        return response.data;
    } catch (error) {
        console.error('Error verifying TOTP:', error);
        throw error;
    }
};


// Check for pending TOTP verification
export const checkPendingVerification = async () => {
    try {
        const response = await axios.get(`${API_URL}/checkPendingVerification`);
        return response.data;
    } catch (error) {
        console.error('Error checking pending verification:', error);
        throw error;
    }
};

// Fetch verified users and their shared cards
export const fetchVerifiedUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}/getVerifiedUsers`);

        // Check if the response contains valid data
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
            return response.data;
        } else {
            console.log('No users to share cards with yet.');
            return []; // Return an empty array if no verified users are found
        }
    } catch (error) {
        // Check if the error is related to a 404 status (no shared cards)
        if (error.response && error.response.status === 404) {
            console.log('No users have shared cards.'); // Handle 404 scenario gracefully
            return [];
        } else {
            // Log unexpected errors and throw them to handle higher up if needed
            console.error('Error fetching verified users:', error);
            throw error;
        }
    }
};

export const fetchPendingSharedCards = async () => {
    try {
        const response = await axios.get(`${API_URL}/fetchPendingSharedCards`);
        return response.data;
    } catch (error) {
        console.error('Error fetching pending shared cards:', error);
        throw error;
    }
};

// Fetch verified shared cards for a specific user
export const fetchVerifiedSharedCards = async (userId) => {
    try {
        // Send a GET request to fetch the verified shared cards for the specified user
        const response = await axios.get(`${API_URL}/getVerifiedSharedCards/${userId}`);

        // Check if the response contains valid data (an array of shared cards)
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
            return response.data;  // Return the list of verified shared cards
        } else {
            console.log('No verified shared cards found.');
            return [];  // Return an empty array if no verified shared cards are found
        }
    } catch (error) {
        // Handle specific error codes like 404 (not found) gracefully
        if (error.response && error.response.status === 404) {
            console.log('No verified shared cards found.'); // Handle 404 scenario
            return [];  // Return an empty array when no shared cards are found
        } else {
            // Log unexpected errors and throw them to handle higher up if needed
            console.error('Error fetching verified shared cards:', error);
            throw error;  // Rethrow the error for further handling (if needed)
        }
    }
};


export const fetchUsersWithSharedCards = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/getUsersWithSharedCards/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching users with shared cards:', error);
        throw error;
    }
};
