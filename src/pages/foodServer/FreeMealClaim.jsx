import { logout } from "../../functions/logoutAuth"
import { Button } from "../../components/ui/button"
import { useNavigate } from "react-router-dom"

export default function FreeMealClaim() {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/'); // redirect to login/home
    };
    return (
        <>
            This is free meal claim for food server
            <Button onClick={handleLogout}>
                Log out
            </Button>
        </>
    )
}