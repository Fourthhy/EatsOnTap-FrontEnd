import { Sidebar } from "./components/Sidebar";
import {    
    LayoutDashboard,
    Ticket,
    CalendarDays,
    ShoppingBag,
    BookOpen
} from "lucide-react"
import { DateProvider } from "./components/DatePicker";

export default function AdminLanding() {
    const menuItems = [
        // Make sure these paths match the Route paths defined above
        { icon: <LayoutDashboard size={20} />, text: "Dashboard", path: "/admin/dashboard" },
        { icon: <Ticket size={20} />, text: "Voucher Management", path: "/admin/voucher" },
        { icon: <CalendarDays size={20} />, text: "Schedule of Student Eligibility", path: "/admin/schedule" },
        { icon: <ShoppingBag size={20} />, text: "Meal Recipient Orders", path: "/admin/order" },
        { icon: <BookOpen size={20} />, text: "Records", path: "/admin/record" },
    ]

    return (
        <DateProvider>
            <Sidebar menuItems={menuItems}/>
        </DateProvider>
    )
}