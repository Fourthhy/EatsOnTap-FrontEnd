import { Sidebar } from "../admin/components/Sidebar"
import {
    LayoutDashboard,
    BookMarked,
    CalendarClock
} from "lucide-react"


export default function AdminAssistantLanding() {

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, text: "Dashboard", path: "/adminAssistant/dashboard" },
        { icon: <BookMarked size={20} />, text: "Student Eligibility Management", path: "/adminAssistant/voucher" },
        { icon: <CalendarClock size={20} />, text: "Schedule of Student Eligibility", path: "/adminAssistant/schedule" },
    ]

    return (
        <>
            <Sidebar menuItems={menuItems} />
        </>
    )
}