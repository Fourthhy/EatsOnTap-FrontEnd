const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;

// --- HELPER: FORMAT YEAR LEVEL ---
const formatYearLevel = (year) => {
    if (!year && year !== 0) return "N/A"; // Handle 0 correctly

    const yearString = String(year).toLowerCase();

    if (yearString === "pre") return "Preschool";
    if (yearString === "0") return "Kindergarten";
    
    // Basic Education (1-12)
    if (!isNaN(yearString) && parseInt(yearString) >= 1 && parseInt(yearString) <= 12) {
        return `Grade ${yearString}`;
    }

    // College Years (Usually 1st Year, 2nd Year...)
    // If your backend sends "1", "2" for college, you might need logic to distinguish based on context
    // For now, we assume standard numbers are Grades
    return yearString; 
};

export async function fetchAllStudents() {
    console.log("🌐 Fetching from:", `${VITE_BASE_URL}/api/fetch/getAllStudents`);
    
    try {
        const response = await fetch(`${VITE_BASE_URL}/api/fetch/getAllStudents`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch students');
        }

        const rawData = await response.json();
        console.log("📦 Raw API Data:", rawData);

        // --- 🟢 TRANSFORMATION LAYER ---
        const formattedData = rawData.map((student) => ({
            id: student._id,
            studentId: student.studentID,
            name: `${student.first_name} ${student.middle_name ? student.middle_name + ' ' : ''}${student.last_name}`,
            
            type: 'Regular',
            
            // 🟢 NEW PROPERTY: GRADE LEVEL
            // We use the helper here to get "Preschool", "Grade 1", etc.
            gradeLevel: formatYearLevel(student.year), 
            
            // 🟡 UPDATED PROGRAM/SECTION
            // Now 'program' holds the Section (for Basic Ed) or Course (for College)
            // This separates the "Where" (Section) from the "Level" (Grade)
            program: student.section || student.course || "TBD",
            
            section: student.section, 
            
            isLinked: student.isLinked !== undefined ? student.isLinked : !!student.rfidTag
        }));

        return formattedData;

    } catch (error) {
        console.error('Error fetching all students:', error);
        return []; 
    }
}