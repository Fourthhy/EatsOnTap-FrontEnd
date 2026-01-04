import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client'; // 🟢 1. Import Socket Client

// API Imports
import { getUnifiedSchoolData } from '../functions/admin/getUnifiedSchoolData';
import { getAllClassAdvisers } from '../functions/admin/getAllClassAdvisers';
import { getAllBasicEducationMealRequest } from "../functions/admin/getAllBasicEducationMealRequest";
import { getAllHigherEducationMealRequest } from '../functions/admin/getAllHigherEducationMealRequest';
import { getAllEvents } from '../functions/admin/getAllEvents';
import { getTodayClaimRecord } from '../functions/admin/getTodayClaimRecord';

const DataContext = createContext();

const DataProvider = ({ children }) => {
    // --- STATE DEFINITIONS ---
    const [dashboardData, setDashboardData] = useState({
        daily: [], weekly: [], monthly: [], overall: {}
    });
    const [schoolData, setSchoolData] = useState([]);
    const [classAdvisers, setClassAdvisers] = useState([]);
    const [basicEducationMealRequest, setBasicEducationMealRequest] = useState([]);
    const [higherEducationMealRequest, setHigherEducationMealRequest] = useState([]);
    const [eventMealRequest, setEventMealRequest] = useState([]);

    // Other states
    const [students, setStudents] = useState([]);
    const [events, setEvents] = useState([]);
    const [mealOrders, setMealOrders] = useState([]);
    const [claimRecords, setClaimRecords] = useState([]);
    const [todaysMenu, setTodaysMenu] = useState([]);

    const [todayClaimRecord, setTodayClaimRecord] = useState([]);

    // --- 🟢 WRAPPER FUNCTIONS (Wrapped in useCallback for Socket) ---

    const fetchUnifiedSchoolData = useCallback(async () => {
        try {
            if (typeof getUnifiedSchoolData !== 'function') throw new Error("getUnifiedSchoolData import missing!");

            const data = await getUnifiedSchoolData();

            // 🟢 FIX: Used === instead of =
            if (data && data.length === 0) {
                console.warn("⚠️ Unified School Returned No Record");
            } else {
                setSchoolData(data); // Update State
            }
        } catch (error) {
            console.error('Error Fetching Unified School Data', error);
        }
    }, []);

    const fetchAllClassAdvisers = useCallback(async () => {
        try {
            if (typeof getAllClassAdvisers !== 'function') throw new Error('getAllClassAdvisers import missing!');

            const data = await getAllClassAdvisers();

            if (data && data.length === 0) {
                console.warn("⚠️ Class Adviser Data Returned No Record");
            } else {
                setClassAdvisers(data);
            }
        } catch (error) {
            console.error('Error Fetching Class Adviser Data', error);
        }
    }, []);

    const fetchAllBasicEducationMealRequest = useCallback(async () => {
        try {
            if (typeof getAllBasicEducationMealRequest !== 'function') throw new Error('getAllBasicEducationMealRequest import missing!');

            // 🟢 FIX: Added missing 't' in function call
            const data = await getAllBasicEducationMealRequest();

            if (data && data.length === 0) {
                console.warn("⚠️ Basic Ed Meal Requests Returned No Record");
            } else {
                setBasicEducationMealRequest(data);
            }
        } catch (error) {
            console.error('Error Fetching Basic Ed Requests', error);
        }
    }, []);

    const fetchAllHigherEducationMealRequest = useCallback(async () => {
        try {
            if (typeof getAllHigherEducationMealRequest !== 'function') throw new Error('getAllHigherEducationMealRequest import missing!');

            const data = await getAllHigherEducationMealRequest();

            if (data && data.length === 0) {
                console.warn("⚠️ Higher Ed Meal Requests Returned No Record");
            } else {
                setHigherEducationMealRequest(data);
            }
        } catch (error) {
            console.error('Error Fetching Higher Ed Requests', error);
        }
    }, []);

    const fetchAllEvents = useCallback(async () => {
        try {
            if (typeof getAllEvents !== 'function') throw new Error('getAllEvents import missing!');

            const data = await getAllEvents();

            if (data && data.length === 0) {
                console.warn("⚠️ Event Requests Returned No Record");
            } else {
                setEventMealRequest(data);
            }
        } catch (error) {
            console.error('Error Fetching Event Requests', error);
        }
    }, []);

    const fetchTodayClaimRecord = useCallback(async () => {
        try {
            if (typeof getTodayClaimRecord !== 'function') throw new Error('getTodayClaimRecord import missnig!');
            const data = await getTodayClaimRecord();
            if (data && data.length === 0) {
                console.warn("⚠️ Today Claim Record Returned empty");
            } else {
                setTodayClaimRecord(data);
            }
            console.log(data);
        } catch (error) {
            console.error('Error fetching claim record data', error)
        }
    }, [])

    useEffect(() => {
        // Initial fetch on load

        const socket = io(import.meta.env.VITE_BASE_URL);

        socket.on('connect', () => {
            console.log("✅ Socket Connected:", socket.id);
        });

        socket.on('meal-request-submit', (data) => {
            console.log("🔔 Real-time Update Received:", data);
            // 1. Refresh the List of Requests (The Pending Table)
            if (data.type === 'Basic Education') {
                fetchAllBasicEducationMealRequest();
            } else if (data.type === 'Higher Education') {
                fetchAllHigherEducationMealRequest();
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [fetchAllBasicEducationMealRequest, fetchAllHigherEducationMealRequest]);


    return (
        <DataContext.Provider value={{
            // States & Setters (Expose Setters just in case Loader needs them)
            dashboardData, setDashboardData,
            students, setStudents,
            events, setEvents,
            mealOrders, setMealOrders,
            claimRecords, setClaimRecords,
            todaysMenu, setTodaysMenu,

            schoolData,
            classAdvisers,
            basicEducationMealRequest,
            higherEducationMealRequest,
            eventMealRequest,
            todayClaimRecord,


            // Fetch Functions (For Loader or Manual Refresh)
            fetchUnifiedSchoolData,
            fetchAllClassAdvisers,
            fetchAllBasicEducationMealRequest,
            fetchAllHigherEducationMealRequest,
            fetchAllEvents,
            fetchTodayClaimRecord,
        }}>
            {children}
        </DataContext.Provider>
    );
};

const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) { throw new Error("useData must be used within a DataProvider"); }
    return context;
};

export {
    DataProvider,
    useData
}