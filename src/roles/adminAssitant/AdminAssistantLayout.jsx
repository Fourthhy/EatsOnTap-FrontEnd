import { useState } from "react"
import { Sidebar } from "../../components/global/Sidebar"
import {
    LayoutDashboard,
    BookMarked,
    CalendarClock
} from "lucide-react"
import { DataProvider } from "../../context/DataContext";
import { LoaderProvider } from "../../context/LoaderContext";
import { GlobalLoader } from "../../components/global/GlobalLoader";
import { MealSchedulingManagement } from "./components/MealSchedulingManagement";


export default function AdminAssistantLayout() {
    const [isOpen, setIsOpen] = useState(false);
    const AdminAssistantLayoutContent = () => {
        const menuItems = [
            { icon: <LayoutDashboard size={20} />, text: "Dashboard", path: "/adminAssistant/dashboard" },
            { icon: <BookMarked size={20} />, text: "Student Management", path: "/adminAssistant/student" }
        ]

        const quickActions = [
            { 
                icon: <CalendarClock size={20} />, 
                text: "Meal Scheduling Management", 
                onClickAction: () => setIsOpen(true),
                }
        ];

        return (
            <>

                <MealSchedulingManagement isOpen={isOpen} isClose={() => setIsOpen(false)}/>
                <Sidebar
                    menuItems={menuItems}
                    quickActions={quickActions}
                />
            </>
        )


    }

    return (
        <>
            <DataProvider>
                <LoaderProvider>
                    <GlobalLoader />
                        <AdminAssistantLayoutContent />
                </LoaderProvider>
            </DataProvider>
        </>
    )
}