import React, { createContext, useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useData } from './DataContext'; // 🟢 Needs to be inside DataProvider to work

const ClassAdviserContext = createContext();

export const ClassAdviserProvider = ({ children }) => {
    // 1. Get Params from URL (e.g., /adviser/25-001JMC/Grade1-Rizal)
    const { userID, section } = useParams();
    
    // 2. Get Master Data
    const { classAdvisers } = useData(); 

    // 3. Derive Current Adviser Profile
    const currentAdviser = useMemo(() => {
        if (!classAdvisers || !userID) return null;
        return classAdvisers.find(adv => adv.userID === userID) || null;
    }, [classAdvisers, userID]);

    // 4. Derive Display Name
    const adviserDisplayName = useMemo(() => {
        if (!currentAdviser) return "Adviser";
        return `${currentAdviser.first_name} ${currentAdviser.last_name}`;
    }, [currentAdviser]);

    const value = {
        userID,
        section,
        currentAdviser,
        adviserDisplayName,
        // Helper to check if the URL params match the logged-in user (basic security check)
        isValidSession: !!currentAdviser
    };

    return (
        <ClassAdviserContext.Provider value={value}>
            {children}
        </ClassAdviserContext.Provider>
    );
};

export const useClassAdviser = () => {
    const context = useContext(ClassAdviserContext);
    if (context === undefined) {
        throw new Error("useClassAdviser must be used within a ClassAdviserProvider");
    }
    return context;
};