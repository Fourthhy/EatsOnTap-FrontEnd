// mockData.js

const generateData = () => {
    // Students 1-11: Detailed records provided by the user
    const initialMockStudents = [
        // ... (Keep existing 11 students, adding isLinked status)
        { id: 1, name: "Santos, Michaella Avaine", studentId: "25-00001MAS", program: "Grade 10", type: "Regular", status: "Eligible", isLinked: true },
        { id: 2, name: "Nabor, Samantha Roselle", studentId: "25-00002SRN", program: "BSA 4", type: "Regular", status: "Eligible", isLinked: false }, // UNLINKED
        { id: 3, name: "Manalo, Erica Kai", studentId: "25-00003EKM", program: "BSAIS 3", type: "Irregular", status: "Ineligible", isLinked: true },
        { id: 4, name: "Silangon, Cherry Rose", studentId: "25-00004CRS", program: "Grade 12", type: "Regular", status: "Eligible", isLinked: false }, // UNLINKED
        { id: 5, name: "Feliciano, Keysi Star", studentId: "25-00005KSF", program: "Grade 12", type: "Regular", status: "Eligible", isLinked: true },
        { id: 6, name: "Concepcion, Princess Angel", studentId: "25-00006PAC", program: "BSIS 1", type: "Regular", status: "Eligible", isLinked: false }, // UNLINKED
        { id: 7, name: "Martin, Fiona Margarette", studentId: "25-00007FMM", program: "BAB 3", type: "Regular", status: "Eligible", isLinked: true },
        { id: 8, name: "Uson, Tracy Haven", studentId: "25-00008THU", program: "BAB 1", type: "Regular", status: "Eligible", isLinked: true },
        { id: 9, name: "Roldan, Jamie Mae", studentId: "25-00009JMR", program: "BSIT 2", type: "Irregular", status: "Eligible", isLinked: false }, // UNLINKED
        { id: 10, name: "Adna, Arjumina Nana", studentId: "25-00010ANA", program: "BSAIS 1", type: "Regular", status: "Eligible", isLinked: true },
        { id: 11, name: "Conception, Akira", studentId: "25-00011AC", program: "BSA 2", type: "Regular", status: "Eligible", isLinked: true },
    ];

    // Students 12-50: Generated records
    const generateStudents = (startId, count) => {
        const names = [
            "Liam", "Olivia", "Noah", "Emma", "Oliver", "Ava", "Elijah", "Sophia", "Mateo", "Isabella",
            "Lucas", "Amelia", "Mia", "Benjamin", "Charlotte", "Ethan", "Harper", "Alexander", "Aurora",
            "William", "Avery", "Henry", "Luna", "James", "Chloe", "Theodore", "Zoe", "Daniel", "Ella",
            "Michael", "Scarlett", "Jacob", "Grace", "Logan", "Violet", "Sebastian", "Penelope", "Gabriel", "Lily"
        ];
        const programs = ['Kinder', 'Grade 1', 'Grade 3', 'Grade 5', 'Grade 7', 'Grade 8', 'Grade 9', 'BSCS 1', 'BSME 4', 'BSTM 2', 'BSEd 3', 'AB History 1'];
        const statuses = ['Eligible', 'Ineligible', 'Waived'];
        const types = ['Regular', 'Irregular'];
        const students = [];

        for (let i = 0; i < count; i++) {
            const currentId = startId + i;
            const entryNum = String(currentId).padStart(5, '0');
            const randomName = names[currentId % names.length];
            const lastName = `Dela Cruz ${i}`;
            const initials = `${randomName.charAt(0)}${lastName.charAt(0)}D`;

            students.push({
                id: currentId,
                name: `${lastName}, ${randomName}`,
                studentId: `25-${entryNum}${initials}`,
                program: programs[i % programs.length],
                type: types[i % 2], // Set to Regular or Irregular
                status: statuses[i % 3],
                isLinked: i % 4 !== 0, // Randomly link/unlink 
                avatar: null
            });
        }
        return students;
    };

    const generatedStudents = generateStudents(12, 39);

    return [...initialMockStudents, ...generatedStudents];
};

export { generateData };