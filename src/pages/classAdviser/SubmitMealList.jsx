import { logout } from "../../functions/logoutAuth"
import { Button } from "../../components/ui/button"
import { useNavigate } from "react-router-dom"

export default function SubmitMealList() {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/'); // redirect to login/home
    };
    return (
        <>
            This is submit meal list for class advisers
            <Button onClick={handleLogout}>
                Log out
            </Button>
        </>
    )
}