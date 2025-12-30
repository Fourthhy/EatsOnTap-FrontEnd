import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [dashboardData, setDashboardData] = useState({
        daily: [], weekly: [], monthly: [], overall: {}
    });

    // 🟢 KEEP: The Master Tree
    const [schoolData, setSchoolData] = useState([]);

    // FOR CLASS ADVISERS
    const [classAdvisers, setClassAdvisers] = useState([]);

    const [students, setStudents] = useState([]); 
    const [events, setEvents] = useState([]);
    const [mealOrders, setMealOrders] = useState([]);
    const [claimRecords, setClaimRecords] = useState([]);
    const [todaysMenu, setTodaysMenu] = useState([]);

    return (
        <DataContext.Provider value={{
            dashboardData, setDashboardData,
            
            // ❌ REMOVED FROM EXPORT
            
            schoolData, setSchoolData,

            students, setStudents,
            events, setEvents,
            mealOrders, setMealOrders,
            claimRecords, setClaimRecords,
            todaysMenu, setTodaysMenu,

            //new Class advisers
            classAdvisers, setClassAdvisers
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) { throw new Error("useData must be used within a DataProvider"); }
    return context;
};