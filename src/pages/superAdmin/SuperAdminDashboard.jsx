import { useState } from "react";
import { logout } from "../../functions/logoutAuth"
import { Button } from "../../components/ui/button"
import { useNavigate } from "react-router-dom"

import { ButtonGroup } from "../../components/global/ButtonGroup";
import { PlaneTakeoff } from "lucide-react"

export default function SuperAdminDashboard() {
    const [currentOrderType, setCurrentOrderType] = useState('all');
    const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
    const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
    const buttonListGroup = [
        {
            id: 'Pending',
            label: 'Pending Orders',
            icon: <ClockIcon />, // Using the clock icon for pending
        },
        {
            id: 'Confirmed',
            label: 'Confirmed Orders',
            icon: <CheckIcon />, // Using the check icon for confirmed
        },
        {
            id: 'Shipped',
            label: 'Shipped Orders',
            icon: <PlaneTakeoff />,
        },
    ];

    const buttonListGroup2 = [
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
        console.log(`Order type changed to: ${newTypeId}`);
        setCurrentOrderType(newTypeId);
        // You can fetch new data or update state based on the new type ID here
    };

    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/'); // redirect to login/home
    };


    return (
        <>
            <div className="p-8 border-black">
                <h2 className="text-xl font-bold mb-4">Order Status Selector</h2>
                <ButtonGroup
                    buttonListGroup={buttonListGroup2}
                    initialActiveId={currentOrderType} // Control the active state from the parent
                    onSetActiveId={handleTypeChange} // Get the callback on click
                // Optional: change the active color if needed
                // activeColor="#10B981" // Example: use a different green color
                />
                <div className="mt-4 p-4 border rounded-md bg-white">
                    Viewing: **{currentOrderType}**
                </div>
            </div>
            <Button onClick={handleLogout}>
                Log out
            </Button>
        </>
    )
}