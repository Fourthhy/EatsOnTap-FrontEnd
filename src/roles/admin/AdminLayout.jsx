import React, { useState } from "react";
import { LayoutDashboard, Ticket, CalendarDays, ShoppingBag, BookOpen, Utensils, Settings } from "lucide-react";

// --- IMPORTS ---
import { AddDishModal } from "./components/dashboard/AddDishModal";
import { Sidebar } from "../../components/global/Sidebar";
import { DateProvider } from "./components/dashboard/DatePicker";

// --- NEW CONTEXT IMPORTS ---
import { AdminProvider } from "../../context/AdminContext";
import { DataProvider } from "../../context/DataContext";
import { LoaderProvider } from "../../context/LoaderContext";
import { GlobalLoader } from "../../components/global/GlobalLoader";

// This Inner Component contains your original logic
const AdminLayoutContent = () => {
    // --- MODAL & MEAL STATE LOGIC ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addedTodaysDish, setAddedTodaysDish] = useState(false);
    const [meals, setMeals] = useState(["", ""]);
    const [todaysMenu, setTodaysMenu] = useState([]);

    // Change Detection Logic
    const hasChanges = JSON.stringify(meals) !== JSON.stringify(todaysMenu);
    const isSaveDisabled = addedTodaysDish && !hasChanges;

    // Handlers passed to the Modal
    const handleMealChange = (index, value) => {
        const newMeals = [...meals];
        newMeals[index] = value;
        setMeals(newMeals);
    };

    const addMealField = () => setMeals([...meals, ""]);

    const handleSubmitMeals = () => {
        setTodaysMenu(meals);
        setAddedTodaysDish(true);
        setIsModalOpen(false);
        console.log("Saved Menu:", meals);
    };

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, text: "Dashboard", path: "/admin/dashboard" },
        { icon: <Ticket size={20} />, text: "Students", path: "/admin/voucher" },
        { icon: <CalendarDays size={20} />, text: "Events", path: "/admin/schedule" },
        { icon: <ShoppingBag size={20} />, text: "Meal Orders", path: "/admin/order" },
        { icon: <BookOpen size={20} />, text: "Records", path: "/admin/record" },
    ];

    const settingMenu = [
        { icon: <Settings size={20} />, text: "Settings", path: "/admin/settings" }
    ]

    const quickActions = [
        {
            icon: <Utensils size={20} />,
            text: "Add Dish",
            onClickAction: () => {
                if (todaysMenu.length > 0) setMeals([...todaysMenu]);
                setIsModalOpen(true);
            }
        },
    ];

    return (
        <>
            {/* The Loader sits on top of everything */}
            <GlobalLoader />

            <Sidebar
                menuItems={menuItems}
                menutItemsLabel={"Pages"}

                quickActions={quickActions}
                quickActionsLabel={"Quick Actions"}
                
                settingMenu={settingMenu}
            />

            <AddDishModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                meals={meals}
                onMealChange={handleMealChange}
                onAddMealField={addMealField}
                onSubmit={handleSubmitMeals}
                isSaveDisabled={isSaveDisabled}
                addedTodaysDish={addedTodaysDish}
            />
        </>
    );
};

// --- MAIN EXPORT ---
// Wraps the content in the necessary Providers
export default function AdminLayout() {
    return (
        <AdminProvider>
            <DataProvider>
                <LoaderProvider>
                    <DateProvider>
                        <AdminLayoutContent />
                    </DateProvider>
                </LoaderProvider>
            </DataProvider>
        </AdminProvider>
    );
}