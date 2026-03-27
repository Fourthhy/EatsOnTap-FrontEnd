import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoutes";
import Login from "../Login";

// 🟢 IMPORT BOTH PROVIDERS HERE
import { DataProvider } from "../context/DataContext";
import { LoaderProvider } from "../context/LoaderContext";

import HEStudentManagement from "../roles/adminAssitant/components/pages/HEStudentManagement"
import MealEligibilityManagement from "../roles/adminAssitant/components/pages/MealEligibilityManagement"
import AdminAssistantDashboard from "../roles/adminAssitant/components/pages/AdminAssistantDashboard"
import AdminAssistantLayout from "../roles/adminAssitant/AdminAssistantLayout";

import FoodItemClaim from "../roles/canteenStaff/FoodItemClaim";

import ChancellorDashboard from "../roles/chancellor/ChancellorDashboard";
import ChancellorLanding from "../roles/chancellor/ChancellorLanding";
    
import FreeMealClaim from "../roles/foodServer/FreeMealClaim";

import SuperAdminLayout from "../roles/superAdmin/SuperAdminLayout";
import UserManagement from "../roles/superAdmin/pages/UserManagement";
import SystemLogs from "../roles/superAdmin/pages/SystemLogs";

import SidebarLayout from "../components/custom/SidebarLayout";

import AdminLayout from "@/roles/admin/AdminLayout";
import AdminDashboard from "../roles/admin/components/pages/AdminDashboard"
import MealRecipientOrder from "../roles/admin/components/pages/MealRecipientOrder";
import StudentRecords from "../roles/admin/components/pages/StudentRecords";
import EventManagement from "../roles/admin/components/pages/EventManagement";
import StudentManagement from "../roles/admin/components/pages/StudentManagement";
import SystemSettings from "../roles/admin/components/pages/SystemSettings";

import Playground from "../Playground";

import ClassAdviserLayout from "../roles/classAdviser/ClassAdviserLayout";
import SubmitMealList from "../roles/classAdviser/SubmitMealList";

import LoginRegistration from "../LoginRegistration";

export default function Routers() {
    return (
        <Router>
            <Routes>
                {/* 🟢 PUBLIC ROUTES (No Data, No Loaders, No Sockets) */}
                <Route path="/" element={<Login />} />
                <Route path="/sample" element={<SidebarLayout />} />
                <Route path="/playground" element={<Playground />} />
                <Route path="/loginRegistration/:token/:userEmail" element={<LoginRegistration />} />

                {/* 🔴 SECURE ROUTES: Wrapped in DataProvider -> LoaderProvider AFTER the Auth check */}
                <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <DataProvider>
                            <LoaderProvider>
                                <AdminLayout />
                            </LoaderProvider>
                        </DataProvider>
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

                <Route path="/superAdmin" element={
                    <ProtectedRoute allowedRoles={['SUPER-ADMIN']}>
                        <DataProvider>
                            <LoaderProvider>
                                <SuperAdminLayout />
                            </LoaderProvider>
                        </DataProvider>
                    </ProtectedRoute>
                }>
                    <Route index element={<Navigate to="/superAdmin/userManagement" replace />} />
                    <Route path="userManagement" element={<UserManagement />} />
                    <Route path="systemLogs" element={<SystemLogs />} />
                </Route>

                <Route path="/adminAssistant" element={
                    <ProtectedRoute allowedRoles={['ADMIN-ASSISTANT']}>
                        <DataProvider>
                            <LoaderProvider>
                                <AdminAssistantLayout />
                            </LoaderProvider>
                        </DataProvider>
                    </ProtectedRoute>
                }>
                    <Route index element={<Navigate to="/adminAssistant/dashboard" replace />} />
                    <Route path="dashboard" element={<AdminAssistantDashboard />} />
                    <Route path="student" element={<HEStudentManagement />} />
                    <Route path="meal" element={<MealEligibilityManagement />} />
                </Route>

                <Route path="/canteenStaff" element={
                    <ProtectedRoute allowedRoles={['CANTEEN-STAFF']}>
                        <DataProvider>
                            <LoaderProvider>
                                <FoodItemClaim />
                            </LoaderProvider>
                        </DataProvider>
                    </ProtectedRoute>
                } />

                <Route path="/chancellor" element={
                    <ProtectedRoute allowedRoles={['CHANCELLOR']}>
                        <DataProvider>
                            <LoaderProvider>
                                <ChancellorLanding />
                            </LoaderProvider>
                        </DataProvider>
                    </ProtectedRoute>
                }>
                    <Route index element={<ChancellorDashboard />} />
                    <Route path="dashboard" element={<ChancellorDashboard />} />
                </Route>

                <Route path="/classAdviser/:section/:userID" element={
                    <ProtectedRoute allowedRoles={['CLASS-ADVISER']}>
                        <DataProvider>
                            <LoaderProvider>
                                <ClassAdviserLayout />
                            </LoaderProvider>
                        </DataProvider>
                    </ProtectedRoute>
                }>
                    <Route path="submitMealList" element={<SubmitMealList />} />
                </Route>

                <Route path="/foodServer" element={
                    <ProtectedRoute allowedRoles={['FOOD-SERVER']}>
                        <DataProvider>
                            <LoaderProvider>
                                <FreeMealClaim />
                            </LoaderProvider>
                        </DataProvider>
                    </ProtectedRoute>
                } />

            </Routes>
        </Router>
    )
}