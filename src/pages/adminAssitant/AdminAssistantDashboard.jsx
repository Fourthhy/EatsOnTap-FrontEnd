import { logout } from "../../functions/logoutAuth"
import { Button } from "../../components/ui/button"
import { useNavigate } from "react-router-dom"

export default function AdminAssistantDashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/'); // redirect to login/home
    };
    return (
        <>
            This is the admin assistant dashboard.
            <Button onClick={handleLogout}>
                Log out
            </Button>
        </>
    )
}