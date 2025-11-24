import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import Login from "../Login";
import AdminDashboard from "../pages/admin/AdminDashboard"
import AdminAssistantLanding from "../pages/adminAssitant/AdminAssistantLanding";
import AdminAssistantDashboard from "../pages/adminAssitant/AdminAssistantDashboard"
import FoodItemClaim from "../pages/canteenStaff/FoodItemClaim";
import ChancellorDashboard from "../pages/chancellor/ChancellorDashboard";
import SubmitMealList from "../pages/classAdviser/SubmitMealList";
import FreeMealClaim from "../pages/foodServer/FreeMealClaim";
import SuperAdminDashboard from "../pages/superAdmin/SuperAdminDashboard";

import SidebarLayout from "../components/custom/SidebarLayout";
import ClassAdviserLanding from "@/pages/classAdviser/ClassAdviserLanding";
import AdminLanding from "@/pages/admin/AdminLanding";

import MealRecipientOrder from "../pages/admin/MealRecipientOrder";
import Records from "../pages/admin/Records";
import ScheduleStudentEligibility from "../pages/admin/ScheduleStudentEligibility";
import VoucherManagement from "../pages/admin/VoucherManagement";

export default function Routers() {
    return (
        <>
            <Router>
                <Routes>
                    {/*Login is always public*/}
                    <Route path="/" element={<Login />} />

                    <Route path="/sample" element={<SidebarLayout />} />

                    <Route path="/admin" element={
                        <ProtectedRoute>
                            <AdminLanding />
                        </ProtectedRoute>
                    }>
                        <Route index element={<AdminDashboard />} />
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="voucher" element={<VoucherManagement />} /> 
                        <Route path="schedule" element={<ScheduleStudentEligibility />} /> 
                        <Route path="order" element={<MealRecipientOrder />} /> 
                        <Route path="record" element={<Records />} /> 

                    </Route>
                    <Route path="/adminAssistant" element={
                        <ProtectedRoute>
                            <AdminAssistantLanding />
                        </ProtectedRoute>
                    }>
                        <Route index element={<AdminAssistantDashboard />} />
                        <Route path="dashboard" element={<AdminAssistantDashboard />} />
                    </Route>
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
                    <Route path="/classAdviser/:section/:userID" element={
                        <ProtectedRoute>
                            <ClassAdviserLanding />
                        </ProtectedRoute>
                    }>
                        <Route path="submitMealList" element={<SubmitMealList />} />
                    </Route>
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