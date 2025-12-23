import React, { useState } from "react";
import { AddDishModal } from "./components/dashboard/AddDishModal";
import { Sidebar } from "../../components/global/Sidebar";
import { LayoutDashboard, Ticket, CalendarDays, ShoppingBag, BookOpen, Utensils } from "lucide-react";
import { DateProvider } from "./components/dashboard/DatePicker";

export default function AdminLayout() {
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

    const quickActions = [
        { 
            icon: <Utensils size={20} />, 
            text: "Add Dish", 
            // Logic: Ensure current saved menu is loaded when opening
            onClickAction: () => {
                if (todaysMenu.length > 0) setMeals([...todaysMenu]);
                setIsModalOpen(true);
            } 
        },
    ];

    return (
        <DateProvider>
            <Sidebar
                menuItems={menuItems}
                menutItemsLabel={"Pages"}
                quickActions={quickActions}
                quickActionsLabel={"Quick Actions"}
            />

            {/* Render Modal with all required logic props */}
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
        </DateProvider>
    );
}