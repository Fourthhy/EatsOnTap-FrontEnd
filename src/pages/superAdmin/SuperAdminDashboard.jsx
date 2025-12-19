// STATE
import { useState } from "react";
// NAVIGATION
import { useNavigate } from "react-router-dom"
// LOG OUT FUNCTION
import { logout } from "../../functions/logoutAuth"
// COMPONENTS
import { Button } from "../../components/ui/button"
import { ButtonGroup } from "../../components/global/ButtonGroup";
import { TableHeader } from "../../components/global/table/TableHeader";
import { TableItem } from "../../components/global/table/TableItem"
// DATA
import { buttonList } from "./data/buttonList.js"


const LinkStatusBadge = ({ isLinked }) => {
    const status = isLinked ? 'Linked' : 'Unlinked';

    const styles = {
        Linked: { backgroundColor: '#d1fae5', color: '#047857', dotColor: '#10b981', text: 'Linked' },
        Unlinked: { backgroundColor: '#fee2e2', color: '#b91c1c', dotColor: '#ef4444', text: 'Not Yet Linked' }
    };

    const currentStyle = styles[status];

    return (
        <span
            className={`text-xs font-medium flex items-center w-fit transition-all ${!isLinked ? 'cursor-pointer hover:bg-red-200 hover:text-red-800' : ''}`}
            style={{
                padding: '4px 12px', borderRadius: 12, display: 'flex', alignItems: 'center',
                gap: '6px', backgroundColor: currentStyle.backgroundColor, color: currentStyle.color,
            }}
        >
            <span style={{ width: '6px', height: '6px', borderRadius: 12, backgroundColor: currentStyle.dotColor }}></span>
            <span className={`${!isLinked ? 'group-hover:hidden inline' : ''}`}>{currentStyle.text}</span>
            <span className={`hidden ${!isLinked ? 'group-hover:inline' : ''}`} style={{ fontWeight: 600 }}>Link ID now</span>
        </span>
    );
};

export default function SuperAdminDashboard() {
    // --- STATE FROM BUTTON GROUP ---
    const [activeButtonTab, setActiveButtonTab] = useState('all');

    //For multiple key headers in one table value item
    const [conditionalDisplayIndex, setConditionalDisplayIndex] = useState(0);

    const [tableItemHeight, setTableItemHeight] = useState(null);
    const [minItems, setMinItems] = useState(null)
    const [maxItems, setMaxItems] = useState(null)
    const [itemsPerPage, setItemsPerPage] = useState(null)
    const [currentPage, setCurrentPage] = useState(null)

    const handleTypeChange = (newTypeId) => {
        //for conditional display
        switch (newTypeId) {
            case "all":
                console.log("all")
                setConditionalDisplayIndex(0);
                break;
            case "higherEducation":
                console.log("higherEducation")
                setConditionalDisplayIndex(2);
                break;
            default:
                console.log("BE")
                setConditionalDisplayIndex(1);
                break;
        }
        setActiveButtonTab(newTypeId);
    };

    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/'); // redirect to login/home
    };

    const tableHeaderInformation = {
        title: 'All Students List',
        subtitle: 'Manage Students\' Eligibility',
        generalInformation: [
            { label: 'Total Students', value: '100', color: '#f3f4f6' },
            { label: 'Eligible Students', value: '50', color: '#d1fae5' },
            { label: 'Ineligible Students', value: '50', color: '#fee2e2' },
        ],
        tableHeaders: ["", "Student Name", "Student ID", ["Program/Section", "Section", "Program"], "Regular/Irregular", "RFID Link"],
        conditionalDisplay: conditionalDisplayIndex,
    }

    const allStudents = [
        { id: 1, name: "Santos, Michaella Avaine", studentId: "25-00001MAS", section: "Grade 10", type: "Regular", isLinked: true },
        { id: 2, name: "Nabor, Samantha Roselle", studentId: "25-00002SRN", program: "BSA 4", type: "Regular", isLinked: false },
        { id: 3, name: "Manalo, Erica Kai", studentId: "25-00003EKM", program: "BSAIS 3", type: "Irregular", isLinked: true },
        { id: 4, name: "Silangon, Cherry Rose", studentId: "25-00004CRS", section: "Grade 10", type: "Regular", isLinked: false },
        { id: 5, name: "Feliciano, Keysi Star", studentId: "25-00005KSF", section: "Grade 12", type: "Regular", isLinked: true },
        { id: 6, name: "Concepcion, Princess Angel", studentId: "25-00006PAC", section: "Grade 6", type: "Regular", isLinked: false }, // UNLINKED
        { id: 7, name: "Martin, Fiona Margarette", studentId: "25-00007FMM", section: "preschool", type: "Regular", isLinked: true },
        { id: 8, name: "Uson, Tracy Haven", studentId: "25-00008THU", section: "kinder", type: "Regular", isLinked: true },
        { id: 9, name: "Roldan, Jamie Mae", studentId: "25-00009JMR", program: "BSIT 2", type: "Irregular", isLinked: false }, // UNLINKED
        { id: 10, name: "Adna, Arjumina Nana", studentId: "25-00010ANA", program: "BSAIS 1", type: "Regular", isLinked: true },
        { id: 11, name: "Conception, Akira", studentId: "25-00011AC", section: "Grade 2", type: "Regular", isLinked: true },
    ]

    // -- FILERING FUNCTIONS ---

    const isGradeLevel = (levelString, min, max) => {
        // 1. Ensure the string actually contains "grade"
        if (!levelString.includes("grade")) return false;

        // 2. Extract the number safely
        const match = levelString.match(/\d+/);
        if (!match) return false;

        const gradeNum = parseInt(match[0]);
        return gradeNum >= min && gradeNum <= max;
    };

    const isHigherEducation = (levelString) => {
        // Checks if it's a college program (starts with BS, AB, etc.)
        // We use .toLowerCase() because the 'level' variable is already lowercased
        const lower = levelString.toLowerCase();
        return lower.startsWith('bs') || lower.startsWith('bab') || lower.startsWith('ab');
    };

    const filteredStudents = allStudents.filter(student => {
        let matchesTab = true;

        // Standardize to lowercase: "Grade 10" -> "grade 10"
        const level = (student.program || student.section || "").toLowerCase();

        if (activeButtonTab !== 'all') {
            switch (activeButtonTab) {
                case 'preschool':
                    // Check specifically for these K-12 keywords
                    matchesTab = level.includes('kinder') || level.includes('preschool');
                    break;

                case 'primaryEducation':
                    // isGradeLevel now requires the word "grade" + number 1-3
                    matchesTab = isGradeLevel(level, 1, 3);
                    break;

                case 'intermediate':
                    matchesTab = isGradeLevel(level, 4, 6);
                    break;

                case 'juniorHighSchool':
                    matchesTab = isGradeLevel(level, 7, 10);
                    break;

                case 'seniorHighSchool':
                    // This will catch "Grade 11" and "Grade 12"
                    matchesTab = isGradeLevel(level, 11, 12);
                    break;

                case 'higherEducation':
                    // This looks for "bs...", "ab...", etc.
                    matchesTab = isHigherEducation(level);
                    break;

                default:
                    matchesTab = false;
            }
        }

        return matchesTab;
    });


    return (
        <>
            <div className="p-8 border-black">
                <ButtonGroup
                    buttonListGroup={buttonList}
                    initialActiveId={activeButtonTab} // Control the active state from the parent
                    onSetActiveId={handleTypeChange} // Get the callback on click
                // Optional: change the active color if needed
                // activeColor="#10B981" // Example: use a different green color
                />
            </div>

            {/* THE DATA INSIDE THE TABLE MUST BE CALLED HERE, NOT IN THE TABLE */}
            <TableHeader
                tableHeaderInformation={tableHeaderInformation}
                onAutoPassItemHeightEstimate={setTableItemHeight}
                onAutoPassMinItems={setMinItems}
                onAutoPassMaxItems={setMaxItems}
                onAutoPassItemsPerPage={setItemsPerPage}
                onAutoPassCurrentPage={setCurrentPage}
            >
                {filteredStudents.map((item, index) => (
                    //table row is still necessary
                    <tr key={index} className="hover:bg-gray-200/100 transition-colors group" style={{ height: tableItemHeight }}>
                        <TableItem tableItemtype={"index"} value={index + 1} />
                        <TableItem tableItemtype={"defaultInformation"} value={item.name} />
                        <TableItem tableItemtype={"defaultInformation"} value={item.studentId} />
                        <TableItem tableItemtype={"defaultInformation"} value={item.program || item.section} />
                        <TableItem tableItemtype={"defaultInformation"} value={item.type} />
                        <TableItem tableItemtype={"defaultInformation"} value={<LinkStatusBadge isLinked={item.isLinked} />} />
                    </tr>
                ))}
                {filteredStudents.length < itemsPerPage && Array(itemsPerPage - filteredStudents.length).fill(0).map((_, i) => (
                    <tr key={`pad-${i}`} style={{ height: tableItemHeight }}>
                        <td colSpan="7"></td>
                    </tr>
                ))}
            </TableHeader>

            <Button onClick={handleLogout}>
                Log out
            </Button>
        </>
    )
}