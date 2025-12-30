import React, { createContext, useContext, useState, useEffect } from 'react';
import { APP_INITIALIZATION_MANIFEST } from '../config/dataManifest';

// 🟢 KEEP: New API Import
import { getUnifiedSchoolData } from '../functions/admin/getUnifiedSchoolData';
import { getAllClassAdvisers } from '../functions/admin/getAllClassAdvisers';

import { useData } from './DataContext';
import { MOCK_DASHBOARD_DATA, MOCK_EVENTS } from '../data/roles/admin/dashboard/dashboardData';

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [currentLabel, setCurrentLabel] = useState("Initializing System...");

    // 2. GRAB SETTERS
    const {
        setDashboardData,
        setEvents,
        setSchoolData,
        setClassAdvisers
    } = useData();

    const mockApiCall = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const executeLoadingSequence = async () => {
        const isRefreshed = sessionStorage.getItem('is_session_active');
        let currentProgress = 0;

        // 🟢 1. WRAP EVERYTHING IN TRY/CATCH
        try {
            const runTask = async (task) => {
                console.log("⚡ Processing Task:", task.id);
                setCurrentLabel(task.label);

                const delay = isRefreshed ? 0 : (Math.floor(Math.random() * 400) + 400);
                await mockApiCall(delay);

                // --- TASKS ---
                if (task.id === 'dash_chart_daily') {
                    // Dashboard logic...
                }

                if (task.id === "fetch_unified_data") {
                    try {
                        console.log("🚀 Starting Unified Fetch...");

                        // 🟢 DEBUG: Check if function exists
                        if (typeof getUnifiedSchoolData !== 'function') {
                            throw new Error("getUnifiedSchoolData import is missing or invalid!");
                        }

                        // 🟢 DEBUG: Check if setter exists
                        if (typeof setSchoolData !== 'function') {
                            throw new Error("setSchoolData is not defined in DataContext!");
                        }

                        const unifiedData = await getUnifiedSchoolData();

                        if (unifiedData && unifiedData.length > 0) {
                            setSchoolData(unifiedData);
                            console.log("✅ Unified Data Saved");
                        } else {
                            console.warn("⚠️ Unified Data returned empty array");
                        }
                    } catch (err) {
                        console.error("❌ Unified Fetch Task Failed:", err);
                        // We don't throw here so the loop continues
                    }
                }

                if (task.id === "fetch_class_advisers") {
                    try {
                        console.log("Starting to fetch class adviser data!");

                        if (typeof getAllClassAdvisers !== 'function') {
                            throw new Error('getAllClassAdvisers import is missing or invalid!')
                        }
                        if (typeof setClassAdvisers !== 'function') {
                            throw new Error('setClassAdvisers is not defined in the Data Context!');
                        }

                        const classAdvisers = await getAllClassAdvisers();
                        if (classAdvisers && classAdvisers.length > 0) {
                            setClassAdvisers(classAdvisers);
                            console.log("Class Advisers Fetched and Saved!");
                        } else {
                            console.warn("Class ADvisers returned empty array")
                        }
                    } catch (error) {
                        console.error("Failed to fetch class advisers")
                    }
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

            // --- DATA INJECTION ---
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
            // 🟢 2. FINALLY BLOCK: ALWAYS RUNS
            // This guarantees the loader turns off no matter what happens above
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