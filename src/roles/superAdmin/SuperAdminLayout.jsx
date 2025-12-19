import { Sidebar } from "../admin/components/Sidebar";
import { User, Logs } from "lucide-react"

export default function SuperAdminLayout() {

    const menuItems = [
        { icon: <User size={20} />, text: "User Management", path: "/superAdmin/userManagement" },
        { icon: <Logs size={20} />, text: "System Logs", path: "/superAdmin/systemLogs" },
    ]


    return (
        <div>
            <Sidebar menuItems={menuItems} />
        </div>
    );
}