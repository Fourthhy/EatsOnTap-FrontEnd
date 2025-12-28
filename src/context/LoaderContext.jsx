import React, { createContext, useContext, useState, useEffect } from 'react';
import { APP_INITIALIZATION_MANIFEST } from '../config/dataManifest';

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [currentLabel, setCurrentLabel] = useState("Initializing System...");

    // MOCK API CALL
    const mockApiCall = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const executeLoadingSequence = async () => {
        let currentProgress = 0;

        // HELPER
        const runTask = async (task) => {
            setCurrentLabel(task.label);
            // Random delay for "Critical" items (400-800ms)
            await mockApiCall(Math.floor(Math.random() * 400) + 400);
            currentProgress += task.weight;
            setProgress(currentProgress);
        };

        // PHASE 1: CRITICAL (Sequential)
        if (APP_INITIALIZATION_MANIFEST.critical) {
            for (const task of APP_INITIALIZATION_MANIFEST.critical) {
                await runTask(task);
            }
        }

        // PHASE 2: SECONDARY (Simulated Parallel with Stagger)
        if (APP_INITIALIZATION_MANIFEST.secondary) {
            const secondaryPromises = APP_INITIALIZATION_MANIFEST.secondary.map(async (task, index) => {
                // Stagger delay: Item 1 waits 0ms, Item 2 waits 250ms, etc.
                await mockApiCall(index * 250 + 300);
                setCurrentLabel(task.label); 
                currentProgress += task.weight;
                // Cap progress at 100 visually
                setProgress(Math.min(currentProgress, 100));
            });
            await Promise.all(secondaryPromises);
        }

        // FINISH
        await mockApiCall(500); 
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