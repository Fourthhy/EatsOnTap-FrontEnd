import { Sidebar } from "../../components/global/Sidebar"
import { LayoutDashboard } from "lucide-react"
import { DateProvider } from "../admin/components/dashboard/DatePicker";

export default function ChancellorLanding() {
    const menuItems = [
        {
            title: "Dashboard",
            icon: <LayoutDashboard />,
            href: "/chancellor/dashboard",
        },
    ]

    return (
        <div>
            <DateProvider>
                <Sidebar menuItems={menuItems} />
            </DateProvider>
        </div>
    )
}