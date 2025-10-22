import { logout } from "../../functions/logoutAuth"
import { Button } from "../../components/ui/button"
import { useNavigate } from "react-router-dom"

export default function FoodItemClaim() {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/'); // redirect to login/home
    };
    return (
        <>
            This is food item claim for canteen staff
            <Button onClick={handleLogout}>
                Log out
            </Button>
        </>
    )
}