import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import Login from "../Login";

import AdminDashboard from "../roles/admin/AdminDashboard"

import StudentManagement from "../roles/adminAssitant/subPages/StudentManagement"
import MealEligibilityManagement from "../roles/adminAssitant/subPages/MealEligibilityManagement"
import AdminAssistantDashboard from "../roles/adminAssitant/subPages/AdminAssistantDashboard"
import AdminAssistantLanding from "../roles/adminAssitant/AdminAssistantLanding";

import FoodItemClaim from "../roles/canteenStaff/FoodItemClaim";

import ChancellorDashboard from "../roles/chancellor/ChancellorDashboard";
import ChancellorLanding from "../roles/chancellor/ChancellorLanding";

import SubmitMealList from "../roles/classAdviser/SubmitMealList";
import FreeMealClaim from "../roles/foodServer/FreeMealClaim";

import SuperAdminLayout from "../roles/superAdmin/SuperAdminLayout";
import UserManagement from "../roles/superAdmin/pages/UserManagement";
import SystemLogs from "../roles/superAdmin/pages/SystemLogs";

import SidebarLayout from "../components/custom/SidebarLayout";
import ClassAdviserLanding from "@/roles/classAdviser/ClassAdviserLanding";
import AdminLanding from "@/roles/admin/AdminLanding";

import MealRecipientOrder from "../roles/admin/MealRecipientOrder";
import Records from "../roles/admin/Records";
import ScheduleStudentEligibility from "../roles/admin/ScheduleStudentEligibility";
import VoucherManagement from "../roles/admin/VoucherManagement";

import Playground from "../Playground";



export default function Routers() {
    return (
        <>
            <Router>
                <Routes>
                    {/*Login is always public*/}
                    <Route path="/" element={<Login />} />

                    <Route path="/sample" element={<SidebarLayout />} />

                    <Route path="/playground" element={<Playground />} />

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
                        <Route path="student" element={<StudentManagement />} />
                        <Route path="meal" element={<MealEligibilityManagement />} />
                    </Route>
                    <Route path="/canteenStaff" element={
                        <ProtectedRoute>
                            <FoodItemClaim />
                        </ProtectedRoute>
                    } />
                    <Route path="/chancellor" element={
                        <ProtectedRoute>
                            <ChancellorLanding />
                        </ProtectedRoute>
                    }>
                        <Route index element={<ChancellorDashboard />} />
                        <Route path="dashboard" element={<ChancellorDashboard />} />

                    </Route>
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
                            <SuperAdminLayout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<UserManagement />}  />
                        <Route path="userManagement" element={<UserManagement />} />
                        <Route path="systemLogs" element={<SystemLogs />} />
                    </Route>
                </Routes>
            </Router>
        </>
    )
}