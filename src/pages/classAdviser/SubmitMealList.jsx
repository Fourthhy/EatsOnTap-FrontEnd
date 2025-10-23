import { logout } from "../../functions/logoutAuth"
import { Button } from "../../components/ui/button"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom";

export default function SubmitMealList() {
    const { section } = useParams();

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/'); // redirect to login/home
    };
    return (
        <>
            this is section { section } of class advisers
            <Button onClick={handleLogout}>
                Log out
            </Button>
        </>
    )
}