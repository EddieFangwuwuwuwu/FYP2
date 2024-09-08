import React, { createContext, useState, useEffect } from 'react';
import { fetchUserProfile } from './api/api'; // Replace with your actual API call

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Function to fetch user profile
    const loadUserData = async () => {
        try {
            const userData = await fetchUserProfile();
            if (userData) {
                setUser(userData);
            }   
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        }
    };

    // Function to handle user login
    const handleLogin = async (credentials) => {
        try {
            // Perform login and obtain authentication token
            const token = await loginUser(credentials); // Replace with your actual login function

            // Store the token securely (e.g., in state, secure storage, etc.)
            setAuthToken(token);

            // Fetch the user data now that we have a valid token
            await loadUserData();
        } catch (error) {
            console.error('Failed to login:', error);
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, handleLogin }}>
            {children}
        </UserContext.Provider>
    );
};

