import { Sidebar } from "../../components/global/Sidebar";
import {    
    LayoutDashboard,
    Ticket,
    CalendarDays,
    ShoppingBag,
    BookOpen
} from "lucide-react"
import { DateProvider } from "./components/dashboard/DatePicker";

export default function AdminLayout() {
    const menuItems = [
        // Make sure these paths match the Route paths defined above
        { icon: <LayoutDashboard size={20} />, text: "Dashboard", path: "/admin/dashboard" },
        { icon: <Ticket size={20} />, text: "Students", path: "/admin/voucher" },
        { icon: <CalendarDays size={20} />, text: "Events", path: "/admin/schedule" },
        { icon: <ShoppingBag size={20} />, text: "Meal Orders", path: "/admin/order" },
        { icon: <BookOpen size={20} />, text: "Records", path: "/admin/record" },
    ]

    return (
        <DateProvider>
            <Sidebar menuItems={menuItems}/>
        </DateProvider>
    )
}