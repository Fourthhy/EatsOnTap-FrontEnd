import { useState, useMemo, useRef, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Search, User, ChevronLeft, ChevronRight } from "lucide-react";


// --- Mock Data Generation ---

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
    const baseNames = ["A. Doe", "B. Reyes", "C. Dicdican", "D. Santos", "E. Chambers", "F. Nixon", "G. Baird", "H. Hartley", "I. Stevenson", "J. Arvin"];
    for (let i = 0; i < Math.min(10, baseNames.length); i++) {
        const studentId = `25-${Math.floor(Math.random() * 90000) + 10000}`;
        // Base status is irrelevant now, as it will be derived from the checkbox state
        const status = 'Eligible';
        students.push({
            id: `${programCode}-${i}`,
            name: `${baseNames[i]} (${programCode})`,
            studentId: studentId,
            program: programCode,
            // We use a derived status property for display later
            baseStatus: status,
        });
    }
    return students;
};
const allStudentsData = ALL_PROGRAM_CODES.flatMap(program => generateStudentData(program));


// --- Student List Table Component (ProgramSelectionAndList) ---
const ProgramSelectionAndList = ({ filteredStudents }) => {
    const ITEM_HEIGHT_ESTIMATE_PX = 45;
    const ITEMS_PER_PAGE = 9;
    const PAGES_PER_VIEW = 5;

    const [currentPage, setCurrentPage] = useState(1);

    // --- Row Checkbox State (Initializes all to checked/Eligible) ---
    const [rowCheckedState, setRowCheckedState] = useState({});

    // EFFECT: Set all filtered students to CHECKED (Eligible) upon mount or filter change
    useEffect(() => {
        const initialCheckedState = {};
        filteredStudents.forEach(student => {
            // Default them to true (Eligible)
            initialCheckedState[student.id] = true;
        });
        setRowCheckedState(initialCheckedState);
        setCurrentPage(1); // Reset pagination on filter change
    }, [filteredStudents]);

    // Handler for toggling the selection checkbox
    const handleRowCheckChange = (studentId) => {
        setRowCheckedState(prev => ({
            ...prev,
            [studentId]: !prev[studentId] // Toggle the state
        }));
    };

    // --- Pagination Logic ---
    const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentData = filteredStudents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };
    const isPrevDisabled = currentPage === 1;
    const isNextDisabled = currentPage >= totalPages || totalPages === 0;

    // --- Dynamic Page Calculation (Sliding Window) ---
    const getDisplayedPages = () => {
        if (totalPages <= PAGES_PER_VIEW) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        let start = Math.max(1, currentPage - Math.floor(PAGES_PER_VIEW / 2));
        let end = Math.min(totalPages, start + PAGES_PER_VIEW - 1);

        // Adjust start if we hit the end bound
        if (end - start + 1 < PAGES_PER_VIEW) {
            start = Math.max(1, end - PAGES_PER_VIEW + 1);
        }

        const pages = [];
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };
    const displayedPages = getDisplayedPages();

    // --- Status Badge Sub-component ---
    const StatusBadge = ({ isChecked }) => {
        // Determine status based on checkbox state
        const status = isChecked ? 'Eligible' : 'Ineligible';

        const styles = {
            Eligible: { backgroundColor: '#d1fae5', color: '#047857', dotColor: '#10b981', text: 'Eligible' },
            Ineligible: { backgroundColor: '#fee2e2', color: '#b91c1c', dotColor: '#ef4444', text: 'Ineligible' }
        };
        const currentStyle = styles[status] || styles.Eligible;

        return (
            <span
                className="text-xs font-medium"
                style={{
                    padding: '4px 12px', borderRadius: 12, display: 'flex', alignItems: 'center',
                    gap: '6px', backgroundColor: currentStyle.backgroundColor, color: currentStyle.color,
                    width: 'fit-content'
                }}
            >
                <span style={{ width: '6px', height: '6px', borderRadius: 12, backgroundColor: currentStyle.dotColor }}></span>
                {currentStyle.text}
            </span>
        );
    };

    // --- Avatar Sub-component ---
    const Avatar = () => (
        <div style={{
            width: 32, height: 32, borderRadius: 9999,
            backgroundColor: '#e5e7eb',
            color: '#6b7280',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginRight: 12
        }}>
            <User size={16} />
        </div>
    );


    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'white',
                fontFamily: 'sans-serif'
            }}
        >
            {/* Top Search and Filter Bar */}
            <div style={{
                padding: '12px 10px',
                borderBottom: '1px solid #f3f4f6',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '8px'
            }}>
                <div className="relative flex-1 max-w-md flex-row" style={{ marginLeft: 10 }}>
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        style={{
                            width: '100%', paddingLeft: '40px', paddingRight: '16px', paddingTop: '4px',
                            paddingBottom: '4px', backgroundColor: '#F0F1F6', border: 'none', borderRadius: '8px',
                            fontSize: 14, fontFamily: "geist"
                        }}
                    />
                </div>F
            </div>

            {/* Table Container */}
            <div style={{ overflowY: 'auto', flexGrow: 1 }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f9fafb', position: 'sticky', top: 0, zIndex: 10 }}>
                        <tr>
                            <th style={{ fontSize: 12, padding: '12px 24px', fontWeight: 500, color: '#6b7280', width: 60 }}>#</th>
                            <th style={{ fontSize: 12, padding: '12px 24px', fontWeight: 500, color: '#6b7280', width: 250 }}>Student Name</th>
                            <th style={{ fontSize: 12, padding: '12px 12px', fontWeight: 500, color: '#6b7280', width: 120 }}>Student ID</th>
                            <th style={{ fontSize: 12, padding: '12px 24px', fontWeight: 500, color: '#6b7280', width: 150 }}>Program/Section</th>
                            <th style={{ fontSize: 12, padding: '12px 24px', fontWeight: 500, color: '#6b7280', width: 120 }}>Status</th>
                            <th style={{ fontSize: 12, padding: '12px 24px', fontWeight: 500, color: '#6b7280', width: 60, textAlign: 'center' }}>Select</th>
                        </tr>
                    </thead>
                    <tbody style={{ borderSpacing: 0, borderTop: '1px solid #f3f4f6' }}>
                        {currentData.length > 0 ? (
                            currentData.map((student, index) => {
                                const isSelected = rowCheckedState[student.id] !== false; // Checkbox defaults to true if undefined
                                return (
                                    <tr key={student.id} className="hover:bg-gray-50 transition-colors" style={{ height: ITEM_HEIGHT_ESTIMATE_PX, borderBottom: '1px solid #f3f4f6' }}>

                                        {/* # */}
                                        <td style={{ padding: '8px 24px', fontSize: 13, color: '#1f2937' }}>{startIndex + index + 1}</td>

                                        {/* Student Name */}
                                        <td style={{ padding: '8px 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <Avatar />
                                            <span style={{ fontSize: 12, fontWeight: 450, color: '#1f2937' }}>{student.name.split('(')[0].trim()}</span>
                                        </td>

                                        {/* Student ID */}
                                        <td style={{ padding: '8px 12px', fontSize: 12, color: '#1f2937' }}>{student.studentId}</td>

                                        {/* Program */}
                                        <td style={{ padding: '8px 24px', fontSize: 12, color: '#1f2937' }}>{student.program}</td>

                                        {/* Status (DYNAMIC) */}
                                        <td style={{ padding: '8px 24px', fontSize: 12 }}>
                                            <StatusBadge isChecked={isSelected} />
                                        </td>

                                        {/* Select Checkbox */}
                                        <td style={{ padding: '8px 24px', textAlign: 'center' }}>
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleRowCheckChange(student.id)}
                                                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#2563eb' }}
                                            />
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                                    No students selected. Please check program boxes above.
                                </td>
                            </tr>
                        )}

                        {/* Padding Rows */}
                        {currentData.length < ITEMS_PER_PAGE && Array(ITEMS_PER_PAGE - currentData.length).fill(0).map((_, i) => (
                            <tr key={`pad-${i}`} style={{ height: ITEM_HEIGHT_ESTIMATE_PX, borderBottom: '1px solid #f3f4f6' }}>
                                <td colSpan="6"></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div style={{ padding: 16, borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                {/* Previous Button */}
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={isPrevDisabled}
                    className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ padding: '8px 12px', borderRadius: '6px' }}
                >
                    <ChevronLeft size={16} /> Previous
                </button>

                {/* START Ellipsis */}
                {displayedPages[0] > 1 && (
                    <span style={{ color: '#9ca3af', padding: '8px 4px' }}>...</span>
                )}

                {/* Page Number Buttons */}
                {displayedPages.map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 rounded-md text-sm font-medium flex items-center justify-center ${currentPage === page ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                        style={{ width: '32px', height: '32px', borderRadius: '6px' }}
                    >
                        {page}
                    </button>
                ))}

                {/* END Ellipsis */}
                {displayedPages[displayedPages.length - 1] < totalPages && (
                    <span style={{ color: '#9ca3af', padding: '8px 4px' }}>...</span>
                )}


                {/* Next Button */}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={isNextDisabled}
                    className="text-sm flex items-center gap-2font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ padding: '8px 12px', borderRadius: '6px' }}
                >
                    Next <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};


// --- Refactored EligibleProgramsForm to pass state changes up ---
const EligibleProgramsForm = ({ checkedPrograms, handleCheckboxChange, toggleSelectAll, isAllSelected }) => {
    const programs = ["BSSW", "BSA", "BSAIS", "BAB", "BSIS", "ACT"];
    const years = [1, 2, 3, 4];

    const globalStyle = {
        fontFamily: "geist",
        fontSize: "0.75rem",
        fontWeight: 450
    };

    const renderCheckbox = (programCode, year) => {
        const programId = `${programCode} ${year}`;
        if (!ALL_PROGRAM_CODES.includes(programId)) return null;

        const isChecked = !!checkedPrograms[programId];

        return (
            <div
                key={programId}
                style={{
                    ...globalStyle,
                    marginRight: "1.5rem",
                    marginBottom: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <input
                    type="checkbox"
                    id={programId}
                    checked={isChecked}
                    onChange={() => handleCheckboxChange(programId)}
                    style={{
                        marginRight: "0.5rem",
                        width: "18px",
                        height: "18px",
                        accentColor: isChecked ? "#1976D2" : "inherit",
                        cursor: "pointer",
                    }}
                />
                <label htmlFor={programId} style={{ ...globalStyle }}>
                    {programId}
                </label>
            </div>
        );
    };

    return (
        <div
            style={{
                ...globalStyle,
                backgroundColor: "#E6F0FF",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                width: "full",
                height: "full",
                marginBottom: "20px"
            }}
        >

            <h1 style={{ color: "#232323", marginBottom: "15px", fontFamily: 'geist', fontSize: '0.90rem', fontWeight: 400 }}>Eligibile Programs</h1>

            {/* SELECT ALL CHECKBOX */}
            <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center" }}>
                <input
                    type="checkbox"
                    id="selectAll"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    style={{
                        marginRight: "0.5rem",
                        width: "18px",
                        height: "18px",
                        cursor: "pointer",
                        accentColor: isAllSelected ? "#1976D2" : "inherit",
                    }}
                />
                <label htmlFor="selectAll" style={{ ...globalStyle, fontWeight: 700 }}>
                    Select All Programs
                </label>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
                {programs.map((program) => (
                    <div key={program} style={{ display: "flex", flexDirection: "column" }}>
                        {years.map((year) => renderCheckbox(program, year))}
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- Main Component ---
function EligibilityScheduler() {
    // Shared State for Program Selection (LIFTED)
    const [checkedPrograms, setCheckedPrograms] = useState({});

    // general selection of submission type
    const [selectedSubmissionType, setSelectedSubmissionType] = useState('mealEligibility');

    // state for selecting day of week
    const [selectedDayOfWeek, setSelectedDayOfWeek] = useState('');

    // state for event entries
    const [eventName, setEventName] = useState('')
    const [eventDate, setEventDate] = useState('')

    // --- Program Selection Handlers (LIFTED) ---
    const handleCheckboxChange = (programId) => {
        setCheckedPrograms((prev) => ({
            ...prev,
            [programId]: !prev[programId],
        }));
    };

    const isAllSelected = ALL_PROGRAM_CODES.every(
        (code) => checkedPrograms[code]
    );

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setCheckedPrograms({});
        } else {
            const allChecked = {};
            ALL_PROGRAM_CODES.forEach((code) => {
                allChecked[code] = true;
            });
            setCheckedPrograms(allChecked);
        }
    };

    // Filter students based on selected programs
    const filteredStudents = useMemo(() => {
        const selectedCodes = Object.keys(checkedPrograms).filter(key => checkedPrograms[key]);
        if (selectedCodes.length === 0) return [];

        return allStudentsData.filter(student => selectedCodes.includes(student.program));
    }, [checkedPrograms]);


    function SubmissionTypeDropdown() {
        const options = [
            { label: 'Meal Eligibility Request', value: 'mealEligibility' },
            { label: 'Event Meal Request', value: 'eventMeal' },
        ];

        const selectedOption = options.find(option => option.value === selectedSubmissionType);
        const buttonText = selectedOption ? selectedOption.label : 'Select a Request Type';

        return (
            <div style={{ width: 'full', height: 'full', display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'center' }}>
                <h1 style={{ fontFamily: 'geist', fontSize: '0.90rem', fontWeight: 400, padding: 10 }}>Submission Type</h1>
                <div className="font-geist" style={{ paddingLeft: 20 }}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full font-geist" style={{ padding: "10px 20px", fontFamily: "geist", fontSize: "0.75", fontWeight: 450, color: "#4C4B4B" }}>
                                {buttonText}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[200px]">
                            {options.map((option) => (
                                <DropdownMenuItem
                                    style={{ padding: "10px 20px", fontFamily: "geist", fontSize: "0.75", fontWeight: 450 }}
                                    key={option.value}
                                    onSelect={() => setSelectedSubmissionType(option.value)}
                                    {...(option.value === '' && { onSelect: (e) => e.preventDefault() })}
                                >
                                    <span>{option.label}</span>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        )
    }

    function EventForm() {
        return (
            <div className="w-full flex flex-col gap-2">
                <h1 style={{ fontFamily: 'geist', fontSize: '0.85rem', fontWeight: 400 }}>Enter Event Name</h1>
                <div style={{ paddingLeft: "10px" }}>
                    <Input style={{ paddingLeft: "10px" }} placeholder="Event Name" type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} />
                </div>
                <h1 style={{ fontFamily: 'geist', fontSize: '0.85rem', fontWeight: 400 }}>Enter Event Date</h1>
                <div style={{ paddingLeft: "10px" }}>
                    <Input style={{ paddingLeft: "10px" }} placeholder="Event Date" type="Date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
                </div>
            </div>
        )
    }

    function MealRequestForm() {
        const daysOfWeek = [
            { label: 'Monday', value: 'monday' }, { label: 'Tuesday', value: 'tuesday' },
            { label: 'Wednesday', value: 'wednesday' }, { label: 'Thursday', value: 'thursday' },
            { label: 'Friday', value: 'friday' }, { label: 'Saturday', value: 'saturday' },
        ];

        const selectedDay = daysOfWeek.find(option => option.value === selectedDayOfWeek);
        const dayButtonText = selectedDay ? selectedDay.label : 'Select a Day';
        return (
            <>
                <h1 style={{ fontFamily: 'geist', fontSize: '0.90rem', fontWeight: 400 }}>Select day of week</h1>
                <div className="font-geist" style={{ paddingLeft: "10px" }}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full font-geist" style={{ padding: "10px 20px", fontFamily: "geist", fontSize: "0.75", fontWeight: 450, color: "#4C4B4B" }}>
                                {dayButtonText}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[200px]">
                            {daysOfWeek.map((option) => (
                                <DropdownMenuItem
                                    style={{ padding: "10px 20px", fontFamily: "geist", fontSize: "0.75", fontWeight: 450 }}
                                    key={option.value}
                                    onSelect={() => setSelectedDayOfWeek(option.value)}
                                    {...(option.value === '' && { onSelect: (e) => e.preventDefault() })}
                                >
                                    <span>{option.label}</span>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </>
        )
    }


    return (
        <>
            {/* PARENT */}
            <div className="w-full h-full flex items-center justify-center font-geist overflow-hidden">
                {/* CHILD */}
                <div className="w-full h-full bg-white rounded-md shadow-sm border border-gray-200 flex-1 overflow-hidden">
                    {/* GRIDDER */}
                    <div className="w-full h-full flex flex-col" style={{ padding: 10 }}>
                        <div className="w-full h-auto grid grid-cols-4 row-span-1 gap-4">
                            <div className="col-span-1">
                                <SubmissionTypeDropdown />
                                <div style={{ padding: "10px 10px 10px 10px" }}>
                                    {selectedSubmissionType === 'mealEligibility' && <MealRequestForm />}
                                    {selectedSubmissionType === 'eventMeal' && <EventForm />}
                                </div>
                            </div>
                            <div className="col-span-3">
                                <EligibleProgramsForm
                                    checkedPrograms={checkedPrograms}
                                    handleCheckboxChange={handleCheckboxChange}
                                    toggleSelectAll={toggleSelectAll}
                                    isAllSelected={isAllSelected}
                                />
                            </div>
                        </div>
                        {/* BOTTOM CONTENT: Student List (Target Area) */}
                        <div style={{ flexGrow: 1, border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
                            <ProgramSelectionAndList filteredStudents={filteredStudents} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export { EligibilityScheduler }