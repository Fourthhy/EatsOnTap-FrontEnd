    import React, { useState, useMemo } from 'react';
    import { Search, Calendar, Filter, ChevronLeft, ChevronRight, MoreHorizontal, Plus, User } from 'lucide-react';

    // --- MOCK DATA GENERATOR (UPDATED WITH 50 DETAILED RECORDS) ---
    const generateData = () => {
        // Students 1-11: Detailed records provided by the user
        const initialMockStudents = [
            { id: 1, name: "Santos, Michaella Avaine", studentId: "25-00001MAS", program: "Grade 10", type: "-", status: "Eligible" },
            { id: 2, name: "Nabor, Samantha Roselle", studentId: "25-00002SRN", program: "BSA 4", type: "-", status: "Eligible" },
            { id: 3, name: "Manalo, Erica Kai", studentId: "25-00003EKM", program: "BSAIS 3", type: "-", status: "Ineligible" },
            { id: 4, name: "Silangon, Cherry Rose", studentId: "25-00004CRS", program: "Grade 12", type: "-", status: "Eligible" },
            { id: 5, name: "Feliciano, Keysi Star", studentId: "25-00005KSF", program: "Grade 12", type: "-", status: "Eligible" },
            { id: 6, name: "Concepcion, Princess Angel", studentId: "25-00006PAC", program: "BSIS 1", type: "-", status: "Eligible" },
            { id: 7, name: "Martin, Fiona Margarette", studentId: "25-00007FMM", program: "BAB 3", type: "-", status: "Eligible" },
            { id: 8, name: "Uson, Tracy Haven", studentId: "25-00008THU", program: "BAB 1", type: "-", status: "Eligible" },
            { id: 9, name: "Roldan, Jamie Mae", studentId: "25-00009JMR", program: "BSIT 2", type: "-", status: "Eligible" },
            { id: 10, name: "Adna, Arjumina Nana", studentId: "25-00010ANA", program: "BSAIS 1", type: "-", status: "Eligible" },
            { id: 11, name: "Conception, Akira", studentId: "25-00011AC", program: "BSA 2", type: "-", status: "Eligible" },
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
                    type: (i % 5 === 0) ? 'Irregular' : '-',
                    status: statuses[i % 3],
                    avatar: null
                });
            }
            return students;
        };

        const generatedStudents = generateStudents(12, 39);

        return [...initialMockStudents, ...generatedStudents];
    };

    const StudentList = () => {
        // --- CONFIGURATION ---
        // YOU CAN CHANGE THE NUMBER OF STUDENTS PER ROW HERE
        const ITEMS_PER_PAGE = 13;

        const [activeTab, setActiveTab] = useState('All');
        const [currentPage, setCurrentPage] = useState(1);
        const [searchTerm, setSearchTerm] = useState('');

        // Mock data initialization uses the updated generateData function
        const allStudents = useMemo(() => generateData(), []);

        const tabs = [
            'All',
            'Preschool',
            'Primary Education',
            'Intermediate',
            'Junior High School',
            'Senior High School',
            'Higher Education'
        ];

        // --- HELPERS ---

        // Logic for the dynamic header name
        const getProgramHeaderLabel = () => {
            if (activeTab === 'All') return 'Program / Section';
            if (activeTab === 'Higher Education') return 'Programs';
            return 'Section'; // For Preschool through Senior High
        };

        // Filter Logic (Simplified for demo purposes)
        const filteredStudents = allStudents.filter(student => {
            // 1. Filter by Tab (Mock logic - in real app, check student grade level)
            let matchesTab = true;
            if (activeTab !== 'All') {
                // This is a loose match for demo. Real logic would map 'Kinder' to 'Preschool', etc.
                if (activeTab === 'Higher Education') matchesTab = student.program.includes('BS') || student.program.includes('BAB') || student.program.includes('AB');
                else if (activeTab === 'Preschool') matchesTab = student.program === 'Kinder';
                else matchesTab = student.program.includes('Grade');
            }

            // 2. Filter by Search
            const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.studentId.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesTab && matchesSearch;
        });

        // Pagination Logic
        const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const currentData = filteredStudents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

        const handlePageChange = (newPage) => {
            if (newPage >= 1 && newPage <= totalPages) {
                setCurrentPage(newPage);
            }
        };

        // Status Badge Component (CSS kept as classNames for simplicity here)
        // Status Badge Component
        const StatusBadge = ({ status }) => {
            // Keep styles object for dynamic color selection
            const styles = {
                Eligible: {
                    backgroundColor: '#d1fae5', // bg-emerald-100
                    color: '#047857', // text-emerald-700
                    dotColor: '#10b981', // bg-emerald-500
                },
                Ineligible: {
                    backgroundColor: '#fee2e2', // bg-red-100
                    color: '#b91c1c', // text-red-700
                    dotColor: '#ef4444', // bg-red-500
                },
                Waived: {
                    backgroundColor: '#f3f4f6', // bg-gray-100
                    color: '#4b5563', // text-gray-600
                    dotColor: '#6b7280', // bg-gray-500
                }
            };

            const currentStyle = styles[status] || styles.Waived;
            const currentDotColor = currentStyle.dotColor;

            return (
                <span
                    className="text-xs font-medium flex items-center w-fit" // Retain classes for non-style properties
                    style={{
                        padding: '4px 12px',      // px-3 py-1 (using 4px/12px approximation)
                        borderRadius: 12,   // rounded-full
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',               // gap-1.5
                        // Dynamic colors:
                        backgroundColor: currentStyle.backgroundColor,
                        color: currentStyle.color,
                    }}
                >
                    <span
                        style={{
                            width: '6px', // w-1.5 (approximation: 1.5 units * 4px = 6px)
                            height: '6px', // h-1.5
                            borderRadius: 12, // rounded-full
                            backgroundColor: currentDotColor,
                        }}
                    ></span>
                    {status}
                </span>
            );
        };

        return (
            <div className="w-full min-h-screen p-6 font-['Geist',sans-serif] text-gray-900">

                {/* Top Navigation Tabs */}
                <div className="flex flex-wrap gap-2 mb-6" style={{ marginTop: 15, marginBottom: 15 }}>
                    <div>
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                                className={`hover:cursor-pointer text-xs font-medium transition-colors ${activeTab === tab
                                    ? '' // Styles are handled by the 'style' attribute when active
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200' // Keep hover and inactive base classes here
                                    }`}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '12px',
                                    // --- GRADIENT IMPLEMENTATION ---
                                    backgroundImage: activeTab === tab
                                        ? 'linear-gradient(to bottom, #4268BD, #3F6AC9)'
                                        : undefined,
                                    // -------------------------------
                                    color: activeTab === tab ? 'white' : undefined,
                                    transitionProperty: 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter',
                                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                                    transitionDuration: '150ms',
                                    marginRight: 10
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <button
                        className="ml-auto hover:bg-blue-700 text-sm font-medium flex items-center shadow-sm"
                        style={{
                            marginLeft: 'auto',
                            backgroundColor: '#2563eb',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: 12,
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                        }}
                    >
                        <Plus size={16} />
                        Add Student
                    </button>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">

                    {/* Header Section */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex justify-between items-start" style={{ marginBottom: 12, marginTop: 12, }}>
                            <div style={{ paddingLeft: 20 }}>
                                <h1 className="font-geist font-semibold text-gray-900" style={{ fontSize: 16 }}>All Students List</h1>
                                <p className="font-geist text-gray-500" style={{ fontSize: 13 }}>Manage students' eligibility</p>
                            </div>
                            <div className="text-right" style={{ paddingRight: 20 }}>
                                <span className="font-geist font-semibold" style={{ fontSize: 14 }}>Total Students: </span>
                                <span className="font-geist font-bold text-gray-900" style={{ fontSize: 18 }}>{allStudents.length}</span>
                            </div>
                        </div>
                        <hr className="w-full" />

                        {/* Controls */}
                        <div className="flex gap-4 items-center justify-between" style={{ marginTop: 4, marginBottom: 4 }}>
                            <div className="relative flex-1 max-w-md flex-row" style={{ marginLeft: 10 }}>
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    style={{
                                        width: '100%',
                                        paddingLeft: '40px',
                                        paddingRight: '16px',
                                        paddingTop: '4px',
                                        paddingBottom: '4px',
                                        backgroundColor: '#F0F1F6',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: 14,
                                        fontFamily: "geist"
                                    }}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2 ml-auto">
                                <button
                                    className="text-sm font-medium text-gray-600 flex items-center hover:bg-gray-200"
                                    style={{
                                        padding: '8px 12px',
                                        backgroundColor: '#f3f4f6',
                                        borderRadius: '8px',
                                        fontSize: 12,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                    }}
                                >
                                    July 21, 2025 <Calendar size={12} />
                                </button>
                                <button
                                    className="hover:cursor-pointer hover:bg-gray-100 text-sm font-medium text-gray-600 flex items-center gap-2"
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        fontSize: 12,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '2',
                                    }}
                                >
                                    <Filter size={12} /> Filter by Status
                                </button>
                            </div>
                        </div>
                        <hr className="w-full" />
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/50 h-[5vh]">
                                <tr>
                                    <th style={{ fontSize: 12 }} className="font-geist py-3 px-6 font-medium text-gray-500 w-16"></th>
                                    <th style={{ fontSize: 12 }} className="font-geist py-3 px-6 font-medium text-gray-500">Student Name</th>
                                    <th style={{ fontSize: 12 }} className="font-geist py-3 px-3 font-medium text-gray-500">Student ID</th>
                                    {/* Dynamic Header */}
                                    <th style={{ fontSize: 12 }} className="font-geist py-3 px-6 font-medium text-gray-500 w-30">Link</th>
                                    <th style={{ fontSize: 12 }} className="font-geist py-3 px-6 font-medium text-gray-500">
                                        {getProgramHeaderLabel()}
                                    </th>
                                    {/* Requested Empty Link Header */}
                                    <th style={{ fontSize: 12 }} className="font-geist py-3 px-6 font-medium text-gray-500">Regular/Irregular</th>
                                    <th style={{ fontSize: 12 }} className="font-geist py-3 px-6 font-medium text-gray-500">Status</th>
                                    {/* <th className="py-3 px-6 w-10"></th> */} {/*The checkbox part*/}
                                </tr>
                            </thead>
                            
                            <tbody className="divide-y divide-gray-100">
                                <hr className="w-full border-gray-200" />
                                {currentData.map((student, index) => (
                                    <tr key={student.id} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="font-geist text-black flex items-center justify-center" style={{ paddingTop: '10px', paddingBottom: '10px', fontSize: 13 }}>
                                            {startIndex + index + 1}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3" style={{ paddingLeft: 5 }}>
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden text-gray-500">
                                                    <User size={16} />
                                                </div>
                                                <span style={{ fontSize: 12, fontWeight: 450 }} className="font-geist text-black">{student.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ fontSize: 12, paddingLeft: 5 }} className="font-geist py-4 px-3 text-black">{student.studentId}</td>
                                        <td style={{ fontSize: 12, paddingLeft: 5 }} className="font-geist py-4 px-6 text-blue-600 underline cursor-pointer"></td> {/* Empty Content */}
                                        <td style={{ fontSize: 12, paddingLeft: 5 }} className="font-geist py-4 px-6 text-black">{student.program}</td>
                                        <td style={{ fontSize: 12, paddingLeft: 5 }} className="font-geist py-4 px-6 text-black text-left">{student.type}</td>
                                        <td style={{ fontSize: 12, paddingLeft: 5 }} className="font-geist py-4 px-6">
                                            <StatusBadge status={student.status} />
                                        </td>
                                        {/* <td className="py-4 px-6 text-center">
                                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4" defaultChecked />
                                        </td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div
                        className="p-4 border-t border-gray-100 flex items-center justify-center gap-2"
                        style={{
                            padding: '16px',
                            borderTop: '1px solid #f3f4f6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                        }}
                    >
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                padding: '8px 12px',
                                borderRadius: '6px',
                            }}
                        >
                            <ChevronLeft size={16} /> Previous
                        </button>

                        {/* Simple Page Numbers */}
                        {[...Array(Math.min(3, totalPages))].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => handlePageChange(i + 1)}
                                className={`w-8 h-8 rounded-md text-sm font-medium flex items-center justify-center ${currentPage === i + 1
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '6px',
                                }}
                            >
                                {i + 1}
                            </button>
                        ))}
                        {totalPages > 3 && <span className="text-gray-400">...</span>}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="text-sm font-medium text-gray-600 hover:bg-gray-100 bg-gray-100 flex items-center gap-1"
                            style={{
                                padding: '8px 12px',
                                borderRadius: '6px',
                            }}
                        >
                            Next <ChevronRight size={16} />
                        </button>
                    </div>

                </div>
            </div>
        );
    };

    export { StudentList };