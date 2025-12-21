// mockData.js

const generateData = () => {
    const higherEducationPrograms = ['BSIS', 'BSSW', 'BAB', 'BSAIS', 'BSA', 'ACT', 'BSIT']; // Added BSIT as it was present in initialMockStudents

    // Students 1-11: Detailed records provided by the user
    const initialMockStudents = [
        { id: 1, name: "Santos, Michaella Avaine", studentId: "25-00001MAS", program: "Grade 10", type: "Regular", status: "Eligible" },
        { id: 2, name: "Nabor, Samantha Roselle", studentId: "25-00002SRN", program: "BSA 4", type: "Regular", status: "Eligible" },
        { id: 3, name: "Manalo, Erica Kai", studentId: "25-00003EKM", program: "BSAIS 3", type: "Irregular", status: "Ineligible" },
        { id: 4, name: "Silangon, Cherry Rose", studentId: "25-00004CRS", program: "Grade 12", type: "Regular", status: "Eligible" },
        { id: 5, name: "Feliciano, Keysi Star", studentId: "25-00005KSF", program: "Grade 12", type: "Regular", status: "Eligible" },
        { id: 6, name: "Concepcion, Princess Angel", studentId: "25-00006PAC", program: "BSIS 1", type: "Regular", status: "Eligible" },
        { id: 7, name: "Martin, Fiona Margarette", studentId: "25-00007FMM", program: "BAB 3", type: "Regular", status: "Eligible" },
        { id: 8, name: "Uson, Tracy Haven", studentId: "25-00008THU", program: "BAB 1", type: "Regular", status: "Eligible" },
        { id: 9, name: "Roldan, Jamie Mae", studentId: "25-00009JMR", program: "BSIT 2", type: "Irregular", status: "Eligible" },
        { id: 10, name: "Adna, Arjumina Nana", studentId: "25-00010ANA", program: "BSAIS 1", type: "Regular", status: "Eligible" },
        { id: 11, name: "Conception, Akira", studentId: "25-00011AC", program: "BSA 2", type: "Regular", status: "Eligible" },
    ].filter(student => higherEducationPrograms.includes(student.program.split(' ')[0])); // Filter initial students

    // Students 12-50: Generated records
    const generateStudents = (startId, count) => {
        const names = [
            "Liam", "Olivia", "Noah", "Emma", "Oliver", "Ava", "Elijah", "Sophia", "Mateo", "Isabella",
            "Lucas", "Amelia", "Mia", "Benjamin", "Charlotte", "Ethan", "Harper", "Alexander", "Aurora",
            "William", "Avery", "Henry", "Luna", "Chloe", "Theodore", "Zoe", "Daniel", "Ella",
            "Michael", "Scarlett", "Jacob", "Grace", "Logan", "Violet", "Sebastian", "Penelope", "Gabriel", "Lily"
        ];
        // Use only higher education programs for generated students
        const programs = higherEducationPrograms.map(p => `${p} ${Math.floor(Math.random() * 4) + 1}`); // Append a random year/level
        const statuses = ['Eligible', 'Ineligible', 'Waived'];
        const types = ['Regular', 'Irregular'];
        const students = [];

        for (let i = 0; i < count; i++) {
            const currentId = startId + i;
            const entryNum = String(currentId).padStart(5, '0');
            const randomName = names[Math.floor(Math.random() * names.length)]; // Randomize name selection
            const lastName = `Dela Cruz ${i}`;
            const initials = `${randomName.charAt(0)}${lastName.charAt(0)}D`;

            students.push({
                id: currentId,
                name: `${lastName}, ${randomName}`,
                studentId: `25-${entryNum}${initials}`,
                program: programs[i % programs.length], // Ensure program is from the higher education list
                type: types[i % 2],
                status: statuses[i % 3],
                avatar: null
            });
        }
        return students;
    };

    // Generate enough students to fill up to 50, considering some initial students might have been filtered out.
    // Adjust the count for generated students based on how many initial students remain.
    const generatedStudents = generateStudents(initialMockStudents.length + 1, 50 - initialMockStudents.length);

    return [...initialMockStudents, ...generatedStudents];
};

export { generateData };