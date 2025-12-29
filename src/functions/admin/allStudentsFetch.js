const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;

// --- HELPER: Number to Ordinal (1 -> 1st, 2 -> 2nd) ---
const toOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

// --- HELPER: Format Year Level Contextually ---
const formatStudentLevel = (year, hasProgram) => {
    if (year === null || year === undefined) return "N/A";
    const yearStr = String(year).toLowerCase().trim();

    // 1. BASIC EDUCATION (No Program)
    if (!hasProgram) {
        if (yearStr === "pre") return "Preschool";
        if (yearStr === "0") return "Kindergarten";
        // Convert "1" -> "Grade 1"
        if (/^\d+$/.test(yearStr)) {
            const num = parseInt(yearStr);
            if (num >= 1 && num <= 12) return `Grade ${num}`;
        }
    }

    // 2. HIGHER EDUCATION (Has Program)
    // Convert "1" -> "1st Year", "2" -> "2nd Year"
    if (/^\d+$/.test(yearStr)) {
        return `${toOrdinal(parseInt(yearStr))} Year`;
    }

    // Fallback (e.g., "Irregular", "Cross-Enrollee")
    return yearStr.charAt(0).toUpperCase() + yearStr.slice(1);
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
        const formattedData = rawData.map((student) => {
            // Check if student is Higher Ed (has a program)
            // Some entries might have empty string "", so we check length too
            const isHigherEd = student.program && student.program.trim().length > 0;

            const fullName = [
                student.first_name,
                student.middle_name,
                student.last_name
            ].filter(Boolean).join(" ");

            return {
                id: student._id,
                
                studentId: student.studentID,
                
                name: fullName,
                
                type: 'Regular', // Schema doesn't have type yet, default to Regular
                
                // 🟢 LOGIC A: Grade Level Column
                // If Higher Ed: "1st Year"
                // If Basic Ed: "Grade 1"
                gradeLevel: formatStudentLevel(student.year, isHigherEd),
                
                // 🟢 LOGIC B: Program/Section Column
                // If Higher Ed: Show "BSIS" (Program)
                // If Basic Ed: Show "Faith" (Section)
                program: isHigherEd ? student.program : (student.section || "TBD"),
                
                // Keep raw section for drilldown logic if needed
                section: student.section,
                
                // Schema uses 'rfidTag', map it to boolean
                isLinked: !!student.rfidTag
            };
        });

        return formattedData;

    } catch (error) {
        console.error('Error fetching all students:', error);
        return []; 
    }
}