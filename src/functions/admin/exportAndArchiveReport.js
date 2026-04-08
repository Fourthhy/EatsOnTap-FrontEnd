// src/functions/settingManagement.js
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;

// Use VITE_LOCALHOST for local testing if needed, or VITE_BASE_URL for production
const BASE_URL = VITE_BASE_URL; // Change to VITE_LOCALHOST if testing locally without deployed backend

/**
 * Fetches monthly report data and initiates the 24-hour purge countdown.
 * @param {Object} payload - { bucketMonth: "YYYY-MM" }
 */
async function exportAndArchiveReport(payload) {
    // Note: If your backend routes reports under /api/reports instead of /api/setting, adjust accordingly!
    const targetUrl = `${BASE_URL}/api/report/export-and-archive-report`;

    try {
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `Server Error: ${response.status}`);
        }

        return data;

    } catch (error) {
        console.error("❌ Error exporting report:", error);
        throw error;
    }
}

export {
    exportAndArchiveReport
}