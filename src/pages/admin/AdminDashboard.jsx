import { logout } from "../../functions/logoutAuth"
import { Button } from "../../components/ui/button"
import { useNavigate } from "react-router-dom"
import { StatsCard } from "./components/StatsCard"

export default function AdminDashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/'); // redirect to login/home
    };

    return (
        <>
            <Button onClick={handleLogout}>
                Log out
            </Button>

            {/* <StatsCard title={"Total Claims Today"} value={575} subtitle={"12% vs yesterday"}/> */}
        </>
    )
}