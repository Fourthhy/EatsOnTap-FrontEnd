import { Sidebar } from "../admin/components/Sidebar"
import { LayoutDashboard } from "lucide-react"

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
            <Sidebar menuItems={menuItems} />
        </div>
    )
}