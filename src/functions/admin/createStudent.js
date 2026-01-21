const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

// 🟢 Updated to accept the formData object
const createStudent = async (studentData) => {

    const targetUrl = `${VITE_BASE_URL}/api/students/addNewStudent`;
    console.log("🌐 Adding New Student:", targetUrl);

    try {
        const payload = {
            studentID: studentData.studentId,      // Backend expects 'studentID' (capital D)
            first_name: studentData.firstName,     // Backend expects snake_case
            last_name: studentData.lastName,
            middle_name: studentData.middleName || "", // Send empty string if blank to pass validation
            section: studentData.section,
            year: studentData.yearLevel,           // Backend expects 'year'
            
            // Backend expects "REGULAR" or "IRREGULAR" (Uppercase)
            academicStatus: studentData.type ? studentData.type.toUpperCase() : "REGULAR" 
        };

        // 2. Perform the Fetch Request
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        // 3. Handle Backend Errors (e.g., Duplicate ID, Missing Fields)
        if (!response.ok) {
            throw new Error(result.message || "Failed to create student");
        }

        return result; // Return successful data to the component

    } catch (error) {
        console.error("Error details:", error);
        // Throw simple error message so the UI can alert it
        throw new Error(error.message || "Error in creating new student");
    }
};

export { createStudent };