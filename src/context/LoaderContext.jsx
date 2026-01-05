import React, { createContext, useContext, useState, useEffect } from 'react';
import { APP_INITIALIZATION_MANIFEST } from '../config/dataManifest';

import { useData } from './DataContext';
import { MOCK_DASHBOARD_DATA, MOCK_EVENTS } from '../data/roles/admin/dashboard/dashboardData';

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [currentLabel, setCurrentLabel] = useState("Initializing System...");

    // 🟢 1. GRAB THE EXPOSED FETCH FUNCTIONS & SETTERS
    const {
        // Fetchers (These update state internally)
        fetchUnifiedSchoolData,
        fetchAllClassAdvisers,
        fetchAllBasicEducationMealRequest,
        fetchAllHigherEducationMealRequest,
        fetchAllEvents,
        fetchTodayClaimRecord,
        fetchOverallClaimRecord,
        
        
        setDashboardData,
        setEvents
    } = useData();

    const mockApiCall = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const executeLoadingSequence = async () => {
        const isRefreshed = sessionStorage.getItem('is_session_active');
        let currentProgress = 0;

        try {
            const runTask = async (task) => {
                console.log("⚡ Processing Task:", task.id);
                setCurrentLabel(task.label);

                const delay = isRefreshed ? 0 : (Math.floor(Math.random() * 400) + 400);
                await mockApiCall(delay);

                // --- 🟢 SIMPLIFIED TASK HANDLERS ---
                
                // 1. Unified School Data
                if (task.id === "fetch_unified_data") {
                    await fetchUnifiedSchoolData(); 
                }

                // 2. Class Advisers
                if (task.id === "fetch_class_advisers") {
                    await fetchAllClassAdvisers();
                }

                // 3. Meal Requests (Grouped)
                // Note: If your manifest splits these into separate task IDs, adjust accordingly.
                // Assuming "fetch_all_events" or "fetch_meal_data" covers all meal requests:
                if (task.id === "fetch_all_events" || task.id === "fetch_meal_data") {
                    // We run these in parallel for speed, or sequential if preferred
                    await Promise.all([
                        fetchAllBasicEducationMealRequest(),
                        fetchAllHigherEducationMealRequest(),
                        fetchAllEvents()
                    ]);
                    console.log("✅ All Meal Request Data Synced");
                }

                if (task.id === "fetch_today_claim_record") {
                    await fetchTodayClaimRecord();
                }

                if (task.id === "fetch_overall_claim_record") {
                    await fetchOverallClaimRecord();
                }


                // 4. Dashboard Charts (Still Mock for now)
                if (task.id === 'dash_chart_daily') {
                     // Logic handled in Data Injection phase below
                }

                currentProgress += task.weight;
                setProgress(currentProgress);
            };

            // --- CRITICAL LOOP ---
            if (APP_INITIALIZATION_MANIFEST.critical) {
                for (const task of APP_INITIALIZATION_MANIFEST.critical) {
                    await runTask(task);
                }
            }

            // --- SECONDARY LOOP ---
            if (APP_INITIALIZATION_MANIFEST.secondary) {
                const secondaryPromises = APP_INITIALIZATION_MANIFEST.secondary.map(async (task, index) => {
                    await mockApiCall(index * 250 + 300);
                    setCurrentLabel(task.label);
                    currentProgress += task.weight;
                    setProgress(Math.min(currentProgress, 100));
                });
                await Promise.all(secondaryPromises);
            }

            // --- DATA INJECTION (MOCKS) ---
            setDashboardData({
                daily: MOCK_DASHBOARD_DATA.today,
                weekly: MOCK_DASHBOARD_DATA.weekly,
                monthly: MOCK_DASHBOARD_DATA.monthly,
                overall: MOCK_DASHBOARD_DATA.overall
            });
            setEvents(MOCK_EVENTS);

            await mockApiCall(500);

        } catch (globalError) {
            console.error("🔥 CRITICAL LOADER ERROR:", globalError);
            alert("System Validation Failed. Check console for details.");
        } finally {
            setIsLoading(false);
            sessionStorage.setItem('is_session_active', 'true');
        }
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