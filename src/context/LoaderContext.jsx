import React, { createContext, useContext, useState, useEffect } from 'react';
import { APP_INITIALIZATION_MANIFEST } from '../config/dataManifest';

// 0. IMPORT CALL TO FETCH
import { fetchProgramsAndSection } from "../functions/admin/programsAndSectionsFetch";

// 1. IMPORT DATA CONTEXT & MOCK DATA
import { useData } from './DataContext';
import { MOCK_DASHBOARD_DATA, MOCK_EVENTS } from '../data/roles/admin/dashboard/dashboardData';

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [currentLabel, setCurrentLabel] = useState("Initializing System...");

    // 2. GRAB SETTERS FROM DATA CONTEXT
    const { setDashboardData, setEvents, setProgramsAndSections } = useData();

    const mockApiCall = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const executeLoadingSequence = async () => {
        // ... (Check session logic here) ...
        const isRefreshed = sessionStorage.getItem('is_session_active');
        let currentProgress = 0;

        const runTask = async (task) => {
            console.log("⚡ Processing Task:", task.id); // <--- DEBUG LOG 1
            setCurrentLabel(task.label);
            const delay = isRefreshed ? 0 : (Math.floor(Math.random() * 400) + 400);
            await mockApiCall(delay);

            // 3. INJECT DATA BASED ON TASK ID
            // When specific tasks finish, we populate the relevant part of the state
            if (task.id === 'dash_chart_daily') {
                // In real app: const data = await api.getDaily();
                // setDashboardData(prev => ({...prev, daily: data}));
            }

            //USE THE IMPORTED CALL TO FETCH FROM STEP 0 
            if (task.id === "fetch_programs_and_sections") {
                console.log("✅ MATCH FOUND! Starting fetch..."); // <--- DEBUG LOG 2
                try {
                    const data = await fetchProgramsAndSection();
                    console.log("📦 Data received:", data); // <--- DEBUG LOG 3
                    if (data) {
                        setProgramsAndSections(data);
                    }
                } catch (err) {
                    console.error("❌ Fetch failed:", err);
                }
            } else {
                console.log("⚠️ No specific logic for:", task.id); // <--- DEBUG LOG 4
            }

            currentProgress += task.weight;
            setProgress(currentProgress);
        };

        // --- RUNNING THE TASKS ---
        for (const task of APP_INITIALIZATION_MANIFEST.critical) {
            await runTask(task);
        }

        // ... (Secondary tasks logic) ...
        if (APP_INITIALIZATION_MANIFEST.secondary) {
            const secondaryPromises = APP_INITIALIZATION_MANIFEST.secondary.map(async (task, index) => {
                await mockApiCall(index * 250 + 300);
                setCurrentLabel(task.label);
                currentProgress += task.weight;
                setProgress(Math.min(currentProgress, 100));
            });
            await Promise.all(secondaryPromises);
        }

        // 4. FINAL DATA INJECTION (SIMULATION)
        // Once the bar hits 100%, we dump the mock data into the Context
        // This ensures the Dashboard has data when it renders
        setDashboardData({
            daily: MOCK_DASHBOARD_DATA.today,
            weekly: MOCK_DASHBOARD_DATA.weekly,
            monthly: MOCK_DASHBOARD_DATA.monthly,
            overall: MOCK_DASHBOARD_DATA.overall
        });
        setEvents(MOCK_EVENTS);


        await mockApiCall(500);
        setIsLoading(false);
        sessionStorage.setItem('is_session_active', 'true');
    };

    useEffect(() => {
        executeLoadingSequence();
    }, []);

    return (
        <LoaderContext.Provider value={{ isLoading, progress, currentLabel }}>
            {children}
        </LoaderContext.Provider>
    );
};

export const useLoader = () => useContext(LoaderContext);