// --- UTILITY FOR GENERATING MOCK STUDENT DATA ---

const ALL_PROGRAM_CODES = [
    "BSSW 1", "BSSW 2", "BSSW 3", "BSSW 4",
    "BSA 1", "BSA 2", "BSA 3", "BSA 4",
    "BSAIS 1", "BSAIS 2", "BSAIS 3", "BSAIS 4",
    "BAB 1", "BAB 2", "BAB 3", "BAB 4",
    "BSIS 1", "BSIS 2", "BSIS 3", "BSIS 4",
    "ACT 1", "ACT 2", "ACT 3", "ACT 4",
];

const generateStudentData = (programCode) => {
    const students = [];
    const baseNames = [
        "A. Doe", "B. Reyes", "C. Dicdican", "D. Santos", "E. Chambers", 
        "F. Nixon", "G. Baird", "H. Hartley", "I. Stevenson", "J. Arvin"
    ];
    
    // Generate up to 10 unique students per program
    for (let i = 0; i < Math.min(10, baseNames.length); i++) {
        const studentId = `25-${Math.floor(Math.random() * 90000) + 10000}`;
        const status = i % 3 === 0 ? 'Ineligible' : 'Eligible';
        const isSelected = i % 4 !== 0; // Mock initial selection status

        students.push({
            id: `${programCode}-${i}`,
            name: `${baseNames[i]} (${programCode})`,
            studentId: studentId,
            program: programCode,
            status: status,
            isSelected: isSelected // Mock checkbox state for the table row
        });
    }
    return students;
};

// Generate the final list of all possible students
const allStudentsData = ALL_PROGRAM_CODES.flatMap(program => generateStudentData(program));

export { allStudentsData };