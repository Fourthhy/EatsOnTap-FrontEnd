import React, { useState } from "react";
import { Utensils, Plus, X } from "lucide-react"; // 🟢 Added X to imports if not already there
import { motion, AnimatePresence } from "framer-motion";
import { addDishes } from "../../../../functions/admin/addDish";
import { viewDishes } from "../../../../functions/admin/viewDishes";

const AddDishModal = ({
    isOpen,
    onClose,
    meals,
    onMealChange,
    onAddMealField,
    onRemoveMealField, // 🟢 NEW: Added this prop to handle removing fields
    onSubmit, 
    isSaveDisabled,
    addedTodaysDish
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            const currentMeals = Array.isArray(meals) ? meals : [];
            const validMeals = currentMeals.filter(m => m && m.trim() !== "");
            
            if (validMeals.length === 0) {
                console.warn("No valid meals to submit");
                setIsLoading(false);
                return;
            }

            const payload = {
                dishes: validMeals,
                date: new Date() 
            };

            await addDishes(payload);

            setIsLoading(false);
            onSubmit(); 

        } catch (error) {
            console.error("Error submitting dishes:", error);
            setIsLoading(false);
        }
    };

    // 🟢 NEW: Logic to prevent adding a new field if the last one is empty
    const isAddAnotherDisabled = meals && meals.length > 0 && meals[meals.length - 1].trim() === "";

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    onClick={onClose}
                    className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/20 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 10 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-xl shadow-xl w-[550px] h-auto relative"
                        style={{ padding: 20 }}
                    >
                        
                        {/* Header */}
                        <div className="flex items-start gap-3 mb-8 w-full h-[20%] justify-start items-center" style={{ marginTop: 15 }}>
                            <div className="h-[50px] flex items-center" style={{ paddingLeft: 10 }}>
                                <Utensils size={30} strokeWidth={1.5} />
                            </div>
                            <div className="h-full flex flex-col justify-center">
                                <h2 className="text-xl font-bold text-gray-900" style={{ fontSize: 20, fontWeight: 500 }}>
                                    <span className="font-geist">
                                        {addedTodaysDish ? "View dish for today" : "Add dish for today"}
                                    </span>
                                </h2>
                                <p className="text-gray-500 text-sm font-geist" style={{ fontSize: 12, fontWeight: 400 }}>
                                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        {/* Form Inputs */}
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 flex flex-col items-center" style={{ marginTop: 15 }}>
                            {(meals || []).map((meal, index) => (
                                <div key={index} className="w-[92%] flex items-center" style={{ marginBottom: 15 }}>
                                    <label className="text-sm font-medium text-gray-700 font-geist w-[25%] shrink-0">
                                        Meal Number {index + 1}:
                                    </label>
                                    
                                    {/* 🟢 CHANGED: Wrapped input and X button in a flex container that matches the old 75% width */}
                                    <div className="w-[75%] flex items-center gap-2">
                                        <input
                                            type="text"
                                            placeholder="Enter dish name"
                                            value={meal}
                                            onChange={(e) => onMealChange(index, e.target.value)}
                                            className="flex-1 bg-[#F3F4F8] h-[45px] text-gray-700 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-geist"
                                            style={{ borderRadius: 6, paddingLeft: 10, fontSize: 13 }}
                                        />
                                        
                                        {/* 🟢 Render X button only if it's NOT the first field (index > 0) */}
                                        {index > 0 && (
                                            <button 
                                                onClick={() => onRemoveMealField(index)}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                title="Remove meal"
                                            >
                                                <X size={20} strokeWidth={2} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Add Another Meal Button */}
                            <div className="w-[92%] flex justify-start">
                                <button
                                    onClick={onAddMealField}
                                    disabled={isAddAnotherDisabled} // 🟢 Prevents click if last field is empty
                                    className="flex items-center gap-2 text-sm mt-4 pl-1 transition-colors disabled:cursor-not-allowed"
                                    style={{ 
                                        color: isAddAnotherDisabled ? '#9CA3AF' : '#4B5563', // Grayed out if disabled
                                    }}
                                >
                                    <Plus 
                                        size={20} 
                                        strokeWidth={1.5} 
                                        className="rounded-full border p-0.5" 
                                        style={{ borderColor: isAddAnotherDisabled ? '#D1D5DB' : '#9CA3AF' }}
                                    />
                                    Add another meal
                                </button>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex justify-end gap-3" style={{ marginTop: 15, marginBottom: 15, paddingRight: 20 }}>
                            <button
                                onClick={onClose}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-md text-sm transition-colors"
                                style={{ paddingRight: 30, paddingLeft: 30, paddingTop: 15, paddingBottom: 15 }}
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSubmit}
                                disabled={isSaveDisabled || isLoading}
                                className={`px-8 py-2.5 rounded-md text-sm transition-colors ${isSaveDisabled || isLoading
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-[#3B65CA] hover:bg-[#3052a6] text-white"
                                    }`}
                                style={{ paddingRight: 30, paddingLeft: 30, paddingTop: 15, paddingBottom: 15 }}
                            >
                                {isLoading ? "Saving..." : (addedTodaysDish ? "Save Changes" : "Submit")}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export { AddDishModal };