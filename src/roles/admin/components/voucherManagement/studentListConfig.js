// studentListConfig.js

export const programsAndSections = [
    {
        category: "preschool",
        levels: [
            { gradeLevel: "Nursery", sections: [{ name: "Sun", adviser: "Ms. Elena Ramos", studentCount: 15 }, { name: "Moon", adviser: "Ms. Clara Diaz", studentCount: 14 }] },
            { gradeLevel: "Kindergarten", sections: [{ name: "Angels", adviser: "Mrs. Lita Castro", studentCount: 20 }, { name: "Stars", adviser: "Ms. Joy Santos", studentCount: 22 }] }
        ]
    },
    {
        category: "primaryEducation",
        levels: [
            { gradeLevel: "Grade 1", sections: [{ name: "Luke", adviser: "Mr. Roberto Gomez", studentCount: 35 }, { name: "John", adviser: "Ms. Sarah Lim", studentCount: 34 }, { name: "Matthew", adviser: "Mrs. Anna Reyes", studentCount: 35 }, { name: "Mark", adviser: "Mr. Joseph Cruz", studentCount: 33 }] },
            { gradeLevel: "Grade 2", sections: [{ name: "Peter", adviser: "Ms. Maria Leon", studentCount: 30 }, { name: "James", adviser: "Mr. David Tan", studentCount: 31 }, { name: "Andrew", adviser: "Mrs. Grace Pua", studentCount: 29 }] },
            { gradeLevel: "Grade 3", sections: [{ name: "Philip", adviser: "Ms. Rose Villa", studentCount: 32 }, { name: "Bartholomew", adviser: "Mr. Kevin Sy", studentCount: 30 }, { name: "Thomas", adviser: "Mrs. Elena Co", studentCount: 31 }] }
        ]
    },
    {
        category: "intermediate",
        levels: [
            { gradeLevel: "Grade 4", sections: [{ name: "Michael", adviser: "Mr. Arthur King", studentCount: 35 }, { name: "Gabriel", adviser: "Ms. Felicity Ong", studentCount: 34 }, { name: "Raphael", adviser: "Mrs. Gina Lu", studentCount: 35 }] },
            { gradeLevel: "Grade 5", sections: [{ name: "Ignatius", adviser: "Mr. Paul Chua", studentCount: 36 }, { name: "Francis", adviser: "Ms. Irene Dy", studentCount: 35 }, { name: "Dominic", adviser: "Mrs. Helen Ng", studentCount: 36 }] },
            { gradeLevel: "Grade 6", sections: [{ name: "Lorenzo", adviser: "Mr. Victor Yu", studentCount: 40 }, { name: "Pedro", adviser: "Ms. Karen Go", studentCount: 38 }, { name: "Fatima", adviser: "Mrs. Linda Ho", studentCount: 39 }] }
        ]
    },
    {
        category: "juniorHighSchool",
        levels: [
            { gradeLevel: "Grade 7", sections: [{ name: "Rizal", adviser: "Mr. Antonio Luna", studentCount: 42 }, { name: "Bonifacio", adviser: "Ms. Melchora S.", studentCount: 41 }, { name: "Luna", adviser: "Mr. Juan Novicio", studentCount: 40 }] },
            { gradeLevel: "Grade 8", sections: [{ name: "Faith", adviser: "Ms. Charity Hope", studentCount: 40 }, { name: "Hope", adviser: "Mr. Peter Pan", studentCount: 40 }, { name: "Charity", adviser: "Mrs. Wendy D.", studentCount: 39 }] },
            { gradeLevel: "Grade 9", sections: [{ name: "Love", adviser: "Mr. Romeo Mon", studentCount: 41 }, { name: "Peace", adviser: "Ms. Juliet Cap", studentCount: 41 }, { name: "Joy", adviser: "Mrs. Mercy Grace", studentCount: 40 }] },
            { gradeLevel: "Grade 10", sections: [{ name: "St.Paul", adviser: "Mr. Timothy Teo", studentCount: 45 }, { name: "St.Augustine", adviser: "Ms. Monica A.", studentCount: 44 }, { name: "St.Peter", adviser: "Mr. Simon Key", studentCount: 45 }] }
        ]
    },
    {
        category: "seniorHighSchool",
        levels: [
            { gradeLevel: "Grade 11", sections: [{ name: "STEM A", adviser: "Mr. Isaac Newton", studentCount: 35 }, { name: "STEM B", adviser: "Ms. Marie Curie", studentCount: 34 }, { name: "ABM", adviser: "Mr. Adam Smith", studentCount: 38 }, { name: "HUMSS", adviser: "Ms. Jane Austen", studentCount: 36 }] },
            { gradeLevel: "Grade 12", sections: [{ name: "STEM A", adviser: "Mr. Albert E.", studentCount: 33 }, { name: "STEM B", adviser: "Ms. Rosalind F.", studentCount: 32 }, { name: "ABM", adviser: "Mr. John Keynes", studentCount: 35 }, { name: "HUMSS", adviser: "Ms. Virginia W.", studentCount: 34 }] }
        ]
    },
    {
        category: "higherEducation",
        levels: [
            { gradeLevel: "1st Year", sections: [{ name: "BSIT-1A", adviser: "Dr. Alan Turing", studentCount: 40 }, { name: "BSIT-1B", adviser: "Dr. Grace Hopper", studentCount: 38 }, { name: "BSCS-1A", adviser: "Dr. Ada Lovelace", studentCount: 35 }] },
            { gradeLevel: "2nd Year", sections: [{ name: "BSIT-2A", adviser: "Dr. Ken Thompson", studentCount: 35 }, { name: "BSIT-2B", adviser: "Dr. Dennis R.", studentCount: 34 }, { name: "BSCS-2A", adviser: "Dr. Linus T.", studentCount: 30 }] },
            { gradeLevel: "3rd Year", sections: [{ name: "BSIT-3A", adviser: "Dr. Steve Jobs", studentCount: 30 }, { name: "BSIT-3B", adviser: "Dr. Bill Gates", studentCount: 28 }] },
            { gradeLevel: "4th Year", sections: [{ name: "BSIT-4A", adviser: "Dr. Mark Z.", studentCount: 25 }, { name: "BSCS-4A", adviser: "Dr. Elon M.", studentCount: 22 }] }
        ]
    }
];

export const adviserRegistry = [
    { id: "T-001", name: "Mr. Roberto Gomez", department: "Primary Education", assignment: "Grade 1 - Luke", years: 5 },
    { id: "T-002", name: "Ms. Sarah Lim", department: "Primary Education", assignment: "Grade 1 - John", years: 3 },
    { id: "T-003", name: "Dr. Alan Turing", department: "Higher Education", assignment: "BSIT-1A", years: 10 },
    { id: "T-004", name: "Mr. Isaac Newton", department: "Senior High School", assignment: "STEM A", years: 8 },
    { id: "T-005", name: "Ms. Elena Ramos", department: "Preschool", assignment: "Nursery - Sun", years: 2 },
    { id: "T-006", name: "Mr. Arthur King", department: "Intermediate", assignment: "Grade 4 - Michael", years: 6 },
    { id: "T-007", name: "Mr. Antonio Luna", department: "Junior High School", assignment: "Grade 7 - Rizal", years: 4 },
];