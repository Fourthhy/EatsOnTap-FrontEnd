import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import Login from "../Login";
import AdminDashboard from "../pages/admin/AdminDashboard"
import AdminAssistantDashboard from "../pages/adminAssitant/AdminAssistantDashboard";
import FoodItemClaim from "../pages/canteenStaff/FoodItemClaim";
import ChancellorDashboard from "../pages/chancellor/ChancellorDashboard";
import SubmitMealList from "../pages/classAdviser/SubmitMealList";
import FreeMealClaim from "../pages/foodServer/FreeMealClaim";
import SuperAdminDashboard from "../pages/superAdmin/SuperAdminDashboard";

export default function Routers() {
    return (
        <>
            <Router>
                <Routes>
                    {/*Login is always public*/}
                    <Route path="/" element={<Login />} />

                    <Route path="/admin" element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/adminAssistant" element={
                        <ProtectedRoute>
                            <AdminAssistantDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/canteenStaff" element={
                        <ProtectedRoute>
                            <FoodItemClaim />
                        </ProtectedRoute>
                    } />
                    <Route path="/chancellor" element={
                        <ProtectedRoute>
                            <ChancellorDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/classAdviser" element={
                        <ProtectedRoute>
                            <SubmitMealList />
                        </ProtectedRoute>
                    } />
                    <Route path="/foodServer" element={
                        <ProtectedRoute>
                            <FreeMealClaim />
                        </ProtectedRoute>
                    } />
                    <Route path="/superAdmin" element={
                        <ProtectedRoute>
                            <SuperAdminDashboard />
                        </ProtectedRoute>
                    } />
                </Routes>
            </Router>
        </>
    )
}