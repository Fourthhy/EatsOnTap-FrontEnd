// --- MOCK DATA ---

// The full, structured list of programs by department
export const PROGRAM_STRUCTURE = {
    'Preschool': ['Faith', 'Wisdom'],
    'Primary Education': ['Charity', 'Joel', 'Job', 'Micah', 'Esther', 'Amos', 'Daniel', 'Isaiah', 'Jonah', 'Samuel', 'Ruth', 'Jeremiah', 'Malachi'],
    'Intermediate': ['Charity', 'Joel', 'Job', 'Micah', 'Esther', 'Amos', 'Daniel', 'Isaiah', 'Jonah', 'Samuel', 'Ruth', 'Jeremiah', 'Malachi'],
    'Junior High School': ['Andrew', 'Bartholomew', 'Simon', 'Levi', 'Peter', 'Matthias', 'Thaddeus', 'Paul', 'James', 'John', 'Titus', 'Timothy', 'Mark', 'Luke'],
    'Senior High School': [
        'ABM', 'HUMSS - A', 'ICT', 'Stem - A', 'Stem - B', 'Stem - C', 'ABM', 'HUMSS', 'STEM - A', 'STEM - B', 'STEM - C', 'GAS & ICT'
    ],
    'Higher Education': [
        'Bachelor of Science in Information Systems 1', 'Bachelor of Science in Information Systems 2', 'Bachelor of Science in Information Systems 3', 'Bachelor of Science in Information Systems 4',
        'Bachelor of Science in Accountancy 1', 'Bachelor of Science in Accountancy 2', 'Bachelor of Science in Accountancy 3', 'Bachelor of Science in Accountancy 4',
        'Bachelor of Science in Accounting Information Systems 1', 'Bachelor of Science in Accounting Information Systems 2', 'Bachelor of Science in Accounting Information Systems 3', 'Bachelor of Science in Accounting Information Systems 4',
        'Bachelor of Science in Social Work 1', 'Bachelor of Science in Social Work 2', 'Bachelor of Science in Social Work 3', 'Bachelor of Science in Social Work 4',
        'Bachelor of Arts in Broadcasting 1', 'Bachelor of Arts in Broadcasting 2', 'Bachelor of Arts in Broadcasting 3', 'Bachelor of Arts in Broadcasting 4',
        'Associate in Computer Technology 1', 'Associate in Computer Technology 2',
    ]
};

// The list of selectable departments/categories
export const departments = ["All", "Preschool", "Primary Education", "Intermediate", "Junior High School", "Senior High School", "Higher Education"];

// Helper function to get all programs (for 'All' selection)
export const getAllPrograms = () => {
    return Object.values(PROGRAM_STRUCTURE).flat();
};

// We no longer need the old programsList. If you need it for structure consistency, 
// you can define it as:
export const programsList = getAllPrograms();

// Existing mock data for other components (if needed, keep in this file)
export const upcomingEventsData = [
    { id: 1, name: "Teachers' Day", date: "October 5, 2025", count: 1532 },
    { id: 2, name: "Presidents' Day", date: "November 28, 2025", count: 2343 },
    { id: 3, name: "College Intramurals", date: "December 1-5, 2025", count: 423 },
];

export const recentEventsData = [
    { id: 1, name: "Study Habits Seminar", date: "September 12, 2025", claims: 423, unclaimed: 0 },
    { id: 2, name: "Buwan ng Wika", date: "August 30, 2025", claims: 1323, unclaimed: 54 },
    { id: 3, name: "Higher Education Recogniton", date: "August 19, 2025", claims: 200, unclaimed: 0 },
];