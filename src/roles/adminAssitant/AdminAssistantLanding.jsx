import { Sidebar } from "../../components/global/Sidebar"
import {
    LayoutDashboard,
    BookMarked,
    CalendarClock
} from "lucide-react"


export default function AdminAssistantLanding() {

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, text: "Dashboard", path: "/adminAssistant/dashboard" },
        { icon: <BookMarked size={20} />, text: "Student Management", path: "/adminAssistant/student" },
        { icon: <CalendarClock size={20} />, text: "Meal Eligibility Management", path: "/adminAssistant/meal" },
    ]

    return (
        <>
            <Sidebar menuItems={menuItems} />
        </>
    )
}