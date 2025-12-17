import { useState } from "react";
import { logout } from "../../functions/logoutAuth"
import { Button } from "../../components/ui/button"
import { useNavigate } from "react-router-dom"

import { ButtonGroup } from "../../components/global/ButtonGroup";
import { TableHeader } from "../../components/global/table/TableHeader";
import { TableItem } from "../../components/global/table/TableItem"

import { PlaneTakeoff } from "lucide-react"
import { generateData } from "./data/data"
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
    const [currentOrderType, setCurrentOrderType] = useState('all');

    //For multiple key headers in one table value item
    const [conditionalDisplayIndex, setConditionalDisplayIndex] = useState(0);

    const [tableItemHeight, setTableItemHeight] = useState(null);


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
        setCurrentOrderType(newTypeId);
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

    const sampleData = [
        { id: 1, name: "Santos, Michaella Avaine", studentId: "25-00001MAS", program: "Grade 10", type: "Regular", isLinked: true },
        { id: 2, name: "Nabor, Samantha Roselle", studentId: "25-00002SRN", program: "BSA 4", type: "Regular", isLinked: false },
        { id: 3, name: "Manalo, Erica Kai", studentId: "25-00003EKM", program: "BSAIS 3", type: "Irregular", isLinked: true },
        { id: 4, name: "Silangon, Cherry Rose", studentId: "25-00004CRS", section: "Grade 10", type: "Regular", isLinked: false },
        { id: 5, name: "Feliciano, Keysi Star", studentId: "25-00005KSF", section: "Grade 12", type: "Regular", isLinked: true },
        { id: 6, name: "Concepcion, Princess Angel", studentId: "25-00006PAC", section: "grade 6", type: "Regular", isLinked: false }, // UNLINKED
        { id: 7, name: "Martin, Fiona Margarette", studentId: "25-00007FMM", section: "preschool", type: "Regular", isLinked: true },
        { id: 8, name: "Uson, Tracy Haven", studentId: "25-00008THU", section: "kinder", type: "Regular", isLinked: true },
        { id: 9, name: "Roldan, Jamie Mae", studentId: "25-00009JMR", program: "BSIT 2", type: "Irregular", isLinked: false }, // UNLINKED
        { id: 10, name: "Adna, Arjumina Nana", studentId: "25-00010ANA", program: "BSAIS 1", type: "Regular", isLinked: true },
        { id: 11, name: "Conception, Akira", studentId: "25-00011AC", program: "BSA 2", type: "Regular", isLinked: true },
    ]


    return (
        <>
            <div className="p-8 border-black">
                <ButtonGroup
                    buttonListGroup={buttonList}
                    initialActiveId={currentOrderType} // Control the active state from the parent
                    onSetActiveId={handleTypeChange} // Get the callback on click
                // Optional: change the active color if needed
                // activeColor="#10B981" // Example: use a different green color
                />
            </div>

            {/* THE DATA INSIDE THE TABLE MUST BE CALLED HERE, NOT IN THE TABLE */}
            <TableHeader tableHeaderInformation={tableHeaderInformation} onAutoPassItemHeightEstimate={setTableItemHeight}>
                {sampleData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-200/100 transition-colors group" style={{ height: tableItemHeight }}>
                        <TableItem tableItemtype={"index"} value={item.id} />
                        <TableItem tableItemtype={"defaultInformation"} value={item.name} />
                        <TableItem tableItemtype={"defaultInformation"} value={item.studentId} />
                        <TableItem tableItemtype={"defaultInformation"} value={item.program} />
                        <TableItem tableItemtype={"defaultInformation"} value={item.type} />
                        <TableItem tableItemtype={"defaultInformation"} value={<LinkStatusBadge isLinked={item.isLinked} />} />
                    </tr>
                ))}
            </TableHeader>

            <Button onClick={handleLogout}>
                Log out
            </Button>
        </>
    )
}