import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client'; 

// API Imports
import { getUnifiedSchoolData } from '../functions/admin/getUnifiedSchoolData';
import { getAllClassAdvisers } from '../functions/admin/getAllClassAdvisers';
import { getAllBasicEducationMealRequest } from "../functions/admin/getAllBasicEducationMealRequest";
import { getAllHigherEducationMealRequest } from '../functions/admin/getAllHigherEducationMealRequest';
import { getAllEvents } from '../functions/admin/getAllEvents';
import { getTodayClaimRecord } from '../functions/admin/getTodayClaimRecord';
import { getOverallClaimRecord } from '../functions/admin/getOverallClaimRecord';
import { getSectionProgramList } from '../functions/admin/getSectionProgramList';
import { getMealValue } from '../functions/admin/getMealValue';
import { getAllSettings } from '../functions/admin/getAllSettings';
import { getAllProgramSchedule } from '../functions/adminAssistant/getAllProgramSchedule';
import { getDashboardData } from '../functions/admin/getDashboardData';

import { getWeeklyMealStats } from "../functions/adminAssistant/getWeeklyMealStats";
import { getStudentsWithProgramOnly } from "../functions/adminAssistant/getStudentsWithProgramOnly";


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
    const [overallClaimRecord, setOverallClaimRecord] = useState([]);
    const [sectionProgram, setSectionProgram] = useState([]);
    const [mealValue, setMealValue] = useState()
    const [setting, setSetting] = useState([]);

    //ADMIN ASSISTANT STATES
    const [weeklyMealStats, setWeeklyMeatStats] = useState({});
    const [studentsWithPrograms, setStudentsWithPrograms] = useState()
    
    // 🟢 FIX: Initialize from LocalStorage (Persistence)
    // This prevents "undefined" errors on the Dashboard when refreshing the page.
    const [userInformation, setUserInformation] = useState(() => {
        try {
            const savedUser = localStorage.getItem("userInformation");
            return savedUser ? JSON.parse(savedUser) : {};
        } catch (error) {
            console.error("Error parsing user info from storage", error);
            return {};
        }
    });

    // 🟢 FIX: Update LocalStorage whenever state changes
    useEffect(() => {
        localStorage.setItem("userInformation", JSON.stringify(userInformation));
    }, [userInformation]);


    const [programSchedule, setProgramSchedule] = useState([])

    // --- WRAPPER FUNCTIONS ---

    const fetchUnifiedSchoolData = useCallback(async () => {
        try {
            if (typeof getUnifiedSchoolData !== 'function') throw new Error("getUnifiedSchoolData import missing!");
            const data = await getUnifiedSchoolData();
            if (data && data.length === 0) {
            } else {
                setSchoolData(data); 
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
            const data = await getAllBasicEducationMealRequest();
            if (data && data.length === 0) {
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
            } else {
                setTodayClaimRecord(data);
            }
        } catch (error) {
            console.error('Error fetching claim record data', error)
        }
    }, []);

    const fetchOverallClaimRecord = useCallback(async () => {
        try {
            if (typeof getOverallClaimRecord !== 'function') throw new Error('getOverallClaimRecord import missing!');
            const data = await getOverallClaimRecord();
            if (data && data.length === 0) {
            } else {
                setOverallClaimRecord(data);
            }
        } catch (error) {
            console.error('Error fetching overall claim record dataw', error)
        }
    }, [])

    const fetchSectionProgramList = useCallback(async () => {
        try {
            if (typeof getSectionProgramList !== 'function') throw new Error('getSectionProgramList import missing!');
            const data = await getSectionProgramList();
            if (data && data.length === 0) {
            } else {
                setSectionProgram(data)
            }
        } catch (error) {
            console.error('Error fetching section program list', error);
        }
    }, [])

    const fetchMealValue = useCallback(async () => {
        try {
            if (typeof getMealValue !== 'function') throw new Error('getMealValue import missing!');
            const data = await getMealValue();
            setMealValue(data)
        } catch (error) {
            console.error('Error Fetching Meal Value', error);
        }
    })

    const fetchAllSettings = useCallback(async () => {
        try {
            if (typeof getAllSettings !== 'function') throw new Error('getAllSettings import missing!');
            const data = await getAllSettings();
            setSetting(data);
        } catch (error) {
            console.error('Error fetching settings', error)
        }
    });

    const fetchAllProgramSchedule = useCallback(async () => {
        try {
            if (typeof getAllProgramSchedule !== 'function') throw new Error('getAllProgramSchedule import missing!');
            const data = await getAllProgramSchedule()
            setProgramSchedule(data);
        } catch (error) {
            console.error('Error fetching program schedule');
        }
    });

    const fetchDashboardData = useCallback(async () => {
        try {
            if (typeof getDashboardData !== 'function') throw new Error('getDashboardData import missing!');
            const data = await getDashboardData();
            setDashboardData(data);
        } catch (error) {
            console.error('Error fetching dashboard data', error)
        }
    })

    //ADMIN ASSISTANT
    const fetchWeeklyMealStats = useCallback(async () => {
        try {
            if (typeof getWeeklyMealStats !== 'function') throw new Error('getWeeklyMealStats import missing');
            const data = await getWeeklyMealStats();
            setWeeklyMeatStats(data);
        } catch (error) {
            console.error('Error fetching weekly meal stats', error);
        }
    })

    //getStudentsWithProgramOnly
    const fetchStudentsWithProgramOnly = useCallback( async () => {
        try {
            if (typeof getStudentsWithProgramOnly !== 'function') throw new Error('getStudentsWithProgramOnly import missing');
            const data = await getStudentsWithProgramOnly();
            setStudentsWithPrograms(data)
        } catch (error) {
            console.error('Error fetching students with programs only', error);
        }
    })

    useEffect(() => {
        // Initial fetch on load

        const socket = io(import.meta.env.VITE_BASE_URL);

        socket.on('connect', () => {});

        socket.on('meal-request-submit', (data) => {
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

    useEffect(() => {
        // Connect to Socket
        const socket = io(import.meta.env.VITE_BASE_URL);

        socket.on('connect', () => {});

        // 🟢 LISTEN for the specific event from your backend
        socket.on('update-student-register', (data) => {
            fetchUnifiedSchoolData();
        });

        return () => {
            socket.disconnect();
        };
    }, [fetchUnifiedSchoolData]); 

    useEffect(() => {
        const socket = io(import.meta.env.VITE_BASE_URL);
        socket.on('connect', () => {});
        socket.on('update-section-program-register', (data) => {
            fetchSectionProgramList();
        });
        return () => {
            socket.disconnect();
        }
    }, [fetchSectionProgramList])


    return (
        <DataContext.Provider value={{
            // States & Setters
            dashboardData, setDashboardData,
            students, setStudents,
            events, setEvents,
            mealOrders, setMealOrders,
            claimRecords, setClaimRecords,
            todaysMenu, setTodaysMenu,
            userInformation, setUserInformation,

            schoolData,
            classAdvisers,
            basicEducationMealRequest,
            higherEducationMealRequest,
            eventMealRequest,
            todayClaimRecord,
            overallClaimRecord,
            sectionProgram,
            mealValue,
            setting,
            programSchedule,

            //ADMIN ASSISTANT
            weeklyMealStats,
            studentsWithPrograms,

            // Fetch Functions
            fetchUnifiedSchoolData,
            fetchAllClassAdvisers,
            fetchAllBasicEducationMealRequest,
            fetchAllHigherEducationMealRequest,
            fetchAllEvents,
            fetchTodayClaimRecord,
            fetchOverallClaimRecord,
            fetchSectionProgramList,
            fetchMealValue,
            fetchAllSettings,
            fetchAllProgramSchedule,
            fetchDashboardData,

            //ADMIN ASSISTANT
            fetchWeeklyMealStats,
            fetchStudentsWithProgramOnly
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