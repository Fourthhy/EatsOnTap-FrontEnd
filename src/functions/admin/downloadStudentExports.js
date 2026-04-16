const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;

const BASE_URL = VITE_LOCALHOST; 

/**
 * Fetches students and triggers downloads based on requested level and format.
 * @param {string} format - 'csv' or 'excel'
 * @param {string} level - 'all', 'basic', or 'higher'
 */
async function downloadStudentExports(format, level = 'all') {
    const targetUrl = `${BASE_URL}/api/report/export-all?format=${format}`;
    
    try {
        const response = await fetch(targetUrl, { method: 'GET' });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `Server Error: ${response.status}`);
        }

        const dateStr = new Date().toISOString().split('T')[0];

        // Decoder/Trigger helper
        const triggerDownload = (base64Data, filename, contentType) => {
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: contentType });
            
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            
            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);
        };

        // 🟢 Only download what was requested!
        if (level === 'all' || level === 'basic') {
            triggerDownload(
                data.files.basic, 
                `Basic_Ed_Students_${dateStr}.${data.extension}`, 
                data.contentType
            );
        }

        if (level === 'all' || level === 'higher') {
            // If we are downloading "all", we need the delay to prevent browser blocking.
            // If we are ONLY downloading "higher", we can trigger it immediately.
            const delay = (level === 'all') ? 800 : 0;
            
            setTimeout(() => {
                triggerDownload(
                    data.files.higher, 
                    `Higher_Ed_Students_${dateStr}.${data.extension}`, 
                    data.contentType
                );
            }, delay);
        }

        return data;

    } catch (error) {
        console.error("❌ Error exporting students:", error);
        throw error; 
    }
}

export {
    downloadStudentExports
};