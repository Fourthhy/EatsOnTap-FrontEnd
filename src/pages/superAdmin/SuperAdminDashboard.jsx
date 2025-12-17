import { useState } from "react";
import { logout } from "../../functions/logoutAuth"
import { Button } from "../../components/ui/button"
import { useNavigate } from "react-router-dom"

import { ButtonGroup } from "../../components/global/ButtonGroup";
import { Table } from "../../components/global/Table";
import { PlaneTakeoff } from "lucide-react"

import { generateData } from "./data/data"

export default function SuperAdminDashboard() {
    // --- STATE FROM BUTTON GROUP ---
    const [currentOrderType, setCurrentOrderType] = useState('all');
    
    //add conditional display for multiple key headers in one table value item
    // const [conditionalDisplay, setConditionalDisplay] = useState(0);

    const buttonListGroup = [
        {
            id: 'all',
            label: 'All',
            icon: null
        },
        {
            id: 'preschool',
            label: 'Preschool',
            icon: null
        },
        {
            id: 'primaryEducation',
            label: 'Primary Education',
            icon: null
        },
        {
            id: 'intermediate',
            label: 'Intermediate',
            icon: null
        },
        {
            id: 'juniorHighSchool',
            label: 'Junior High School',
            icon: null
        },
        {
            id: 'seniorHighSchool',
            label: 'Senior High School',
            icon: null
        },
        {
            id: 'higherEducation',
            label: 'Higher Education',
            icon: null
        },
    ]
    const handleTypeChange = (newTypeId) => {
        setCurrentOrderType(newTypeId);
    };

    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/'); // redirect to login/home
    };


    return (
        <>
            <div className="p-8 border-black">
                <ButtonGroup
                    buttonListGroup={buttonListGroup}
                    initialActiveId={currentOrderType} // Control the active state from the parent
                    onSetActiveId={handleTypeChange} // Get the callback on click
                // Optional: change the active color if needed
                // activeColor="#10B981" // Example: use a different green color
                />
            </div>
            {/* THE DATA INSIDE THE TABLE MUST BE CALLED HERE, NOT IN THE TABLE */}
            <Table /> 
            <Button onClick={handleLogout}>
                Log out
            </Button>
        </>
    )
}