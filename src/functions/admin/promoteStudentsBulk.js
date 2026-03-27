const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;

/**
 * Bulk updates students for academic rollover (Promote or Graduate)
 * @param {Object} payload 
 * @param {string} payload.department - 'basic' or 'higher'
 * @param {string} payload.currentLevel - e.g., '11' or '4'
 * @param {string} payload.action - 'promote' or 'graduate'
 * @param {string} [payload.targetLevel] - Level they are moving to
 * @param {string} [payload.targetGroup] - New section (usually 'Unassigned')
 */
export const promoteStudentsBulk = async (payload) => {
    try {
        const response = await fetch(`${VITE_BASE_URL}/api/admin/promoteStudentsBulk`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to update student records");
        }

        return data;
    } catch (error) {
        console.error("Error in bulk promotion:", error);
        throw error;
    }
};