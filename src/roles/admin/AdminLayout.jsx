import React, { useState, useEffect } from "react"; // 🟢 Import useEffect
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

// 🟢 Import API to check existing menu
import { viewDishes } from "../../functions/admin/viewDishes";

const AdminLayoutContent = () => {
    // --- MODAL & MEAL STATE LOGIC ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // 🟢 State to track if menu exists for today
    const [addedTodaysDish, setAddedTodaysDish] = useState(false);
    
    // 🟢 State for the input fields
    const [meals, setMeals] = useState(["", ""]); 
    
    // 🟢 State to store the "Original/Saved" menu for comparison
    const [todaysMenu, setTodaysMenu] = useState([]);

    // 🟢 1. FETCH & CHECK MENU ON MOUNT
    const checkTodaysMenu = async () => {
        try {
            const today = new Date();
            const data = await viewDishes(today);

            if (data && data.dishes && data.dishes.length > 0) {
                // ✅ Found existing menu
                setAddedTodaysDish(true);
                setMeals(data.dishes);      // Pre-fill modal
                setTodaysMenu(data.dishes); // Set "Original" for comparison
            } else {
                // ❌ No menu found
                setAddedTodaysDish(false);
                setMeals(["", ""]);
                setTodaysMenu([]);
            }
        } catch (error) {
            // Error usually means 404 (No report yet), so treat as empty
            setAddedTodaysDish(false);
            setMeals(["", ""]);
            setTodaysMenu([]);
        }
    };

    useEffect(() => {
        checkTodaysMenu();
    }, []);

    // Change Detection Logic (Compare 'meals' inputs vs 'todaysMenu' saved state)
    // If they match, disable save. If they differ, enable save.
    const hasChanges = JSON.stringify(meals) !== JSON.stringify(todaysMenu);
    
    // Logic: 
    // - If it's a NEW entry (!addedTodaysDish), always enable save (unless empty).
    // - If it's an EDIT (addedTodaysDish), only enable save if there are changes.
    // - We'll handle the "empty check" inside the Modal component itself or via disabled prop.
    const isSaveDisabled = addedTodaysDish && !hasChanges;

    // Handlers passed to the Modal
    const handleMealChange = (index, value) => {
        const newMeals = [...meals];
        newMeals[index] = value;
        setMeals(newMeals);
    };

    const addMealField = () => setMeals([...meals, ""]);

    // 🟢 2. REFRESH DATA AFTER SUBMIT
    const handleSubmitMeals = () => {
        // Close modal immediately
        setIsModalOpen(false);
        // Refresh the data to confirm it was saved and update UI state
        checkTodaysMenu();
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
            text: addedTodaysDish ? "View Menu" : "Add Dish", // 🟢 Dynamic Text
            onClickAction: () => {
                // If we have a saved menu, revert inputs to that saved state (undo unsaved changes)
                if (todaysMenu.length > 0) {
                    setMeals([...todaysMenu]);
                } else {
                    setMeals(["", ""]);
                }
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
                onSubmit={handleSubmitMeals} // 🟢 Pass the refresh handler
                isSaveDisabled={isSaveDisabled}
                addedTodaysDish={addedTodaysDish} // 🟢 Pass the checker state
            />
        </>
    );
};

// --- MAIN EXPORT ---
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