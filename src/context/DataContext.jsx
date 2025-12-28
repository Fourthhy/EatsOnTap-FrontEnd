import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    // 1. DASHBOARD ANALYTICS
    const [dashboardData, setDashboardData] = useState({
        daily: [],   
        weekly: [],  
        monthly: [], 
        overall: {}  
    });

    // 2. MASTER RECORDS
    const [students, setStudents] = useState([]);
    const [events, setEvents] = useState([]);
    const [mealOrders, setMealOrders] = useState([]);
    const [claimRecords, setClaimRecords] = useState([]);

    // 3. SYSTEM STATE
    const [todaysMenu, setTodaysMenu] = useState([]);

    return (
        <DataContext.Provider value={{
            dashboardData, setDashboardData,
            students, setStudents,
            events, setEvents,
            mealOrders, setMealOrders,
            claimRecords, setClaimRecords,
            todaysMenu, setTodaysMenu
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error("useData must be used within a DataProvider");
    }
    return context;
};