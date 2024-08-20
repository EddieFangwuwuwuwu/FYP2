import React, { createContext, useState } from 'react';

// Create a UserContext
export const UserContext = createContext();

// Create a UserProvider component that will wrap the app and provide the user state to all components
export const UserProvider = ({ children }) => {
    // Initialize the user state as null
    const [user, setUser] = useState(null);

    return (
        // Provide the user state and setUser function to the entire application
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
