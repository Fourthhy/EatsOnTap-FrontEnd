import React, { createContext, useContext, useState } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    // In a real app, this initial state would be null until 'auth_check' completes
    const [admin, setAdmin] = useState({
        name: "Lorence Tagailog",
        role: "System Administrator",
        email: "lorence.admin@laverdad.edu.ph",
        avatar: "/should_i_call_you_mister.png", // Path to your image
        department: "MIS Office",
        permissions: ['all'] 
    });

    // Helper to update specific admin details
    const updateAdminProfile = (updates) => {
        setAdmin(prev => ({ ...prev, ...updates }));
    };

    return (
        <AdminContext.Provider value={{ admin, setAdmin, updateAdminProfile }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => useContext(AdminContext);