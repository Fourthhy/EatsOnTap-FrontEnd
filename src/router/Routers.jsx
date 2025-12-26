import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoutes";
import Login from "../Login";

import HEStudentManagement from "../roles/adminAssitant/components/pages/HEStudentManagement"
import MealEligibilityManagement from "../roles/adminAssitant/components/pages/MealEligibilityManagement"
import AdminAssistantDashboard from "../roles/adminAssitant/components/pages/AdminAssistantDashboard"
import AdminAssistantLayout from "../roles/adminAssitant/AdminAssistantLayout";

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

import AdminLayout from "@/roles/admin/AdminLayout";
import AdminDashboard from "../roles/admin/components/pages/AdminDashboard"
import MealRecipientOrder from "../roles/admin/components/pages/MealRecipientOrder";
import StudentRecords from "../roles/admin/components/pages/StudentRecords";
import EventManagement from "../roles/admin/components/pages/EventManagement";
import StudentManagement from "../roles/admin/components/pages/StudentManagement";
import SystemSettings from "../roles/admin/components/pages/SystemSettings";

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
                            <AdminLayout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<AdminDashboard />} />
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="voucher" element={<StudentManagement />} /> 
                        <Route path="schedule" element={<EventManagement />} /> 
                        <Route path="order" element={<MealRecipientOrder />} /> 
                        <Route path="record" element={<StudentRecords />} /> 
                        <Route path="settings" element={<SystemSettings />} />

                    </Route>
                    <Route path="/adminAssistant" element={
                        <ProtectedRoute>
                            <AdminAssistantLayout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<AdminAssistantDashboard />} />
                        <Route path="dashboard" element={<AdminAssistantDashboard />} />
                        <Route path="student" element={<HEStudentManagement />} />
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