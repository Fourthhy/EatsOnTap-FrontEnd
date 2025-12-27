import React, { createContext, useContext, useState, useEffect } from 'react';
import { APP_INITIALIZATION_MANIFEST } from '../config/dataManifest';

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [currentLabel, setCurrentLabel] = useState("Initializing...");

    // --- MOCK API CALL (Simulates Network Latency) ---
    const mockApiCall = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const executeLoadingSequence = async () => {
        let currentProgress = 0;

        // HELPER: Runs a single task
        const runTask = async (task) => {
            setCurrentLabel(task.label);
            
            // SIMULATION: Random delay between 300ms and 800ms per task
            // In integration, this will be: await apiRegistry[task.id]();
            await mockApiCall(Math.floor(Math.random() * 500) + 300);

            currentProgress += task.weight;
            setProgress(currentProgress);
        };

        // PHASE 1: Critical Batch (Sequential for visual clarity)
        for (const task of APP_INITIALIZATION_MANIFEST.critical) {
            await runTask(task);
        }

        // PHASE 2: Secondary Batch (Faster simulation)
        for (const task of APP_INITIALIZATION_MANIFEST.secondary) {
            await runTask(task);
        }

        // FINISH
        await mockApiCall(500); // Small pause at 100%
        setIsLoading(false);
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