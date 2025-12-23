import React from "react";
import { Utensils, Plus } from "lucide-react";

const AddDishModal = ({ 
    isOpen, 
    onClose, 
    meals, 
    onMealChange, 
    onAddMealField, 
    onSubmit, 
    isSaveDisabled, 
    addedTodaysDish 
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-[550px] h-auto p-8 relative animate-in fade-in zoom-in duration-200">
                
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
                    {meals.map((meal, index) => (
                        <div key={index} className="w-[92%] flex items-center" style={{ marginBottom: 15 }}>
                            <label className="text-sm font-medium text-gray-700 font-geist w-[25%] shrink-0">
                                Meal Number {index + 1}:
                            </label>
                            <input
                                type="text"
                                placeholder="Enter dish name"
                                value={meal}
                                onChange={(e) => onMealChange(index, e.target.value)}
                                className="w-[75%] bg-[#F3F4F8] h-[45px] text-gray-700 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-geist"
                                style={{ borderRadius: 6, paddingLeft: 10, fontSize: 13 }}
                            />
                        </div>
                    ))}

                    {/* Add Another Meal Button */}
                    <div className="w-[92%] flex justify-start">
                        <button
                            onClick={onAddMealField}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm mt-4 pl-1 transition-colors"
                        >
                            <Plus size={20} strokeWidth={1.5} className="rounded-full border border-gray-400 p-0.5" />
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
                        onClick={onSubmit}
                        disabled={isSaveDisabled}
                        className={`px-8 py-2.5 rounded-md text-sm transition-colors ${
                            isSaveDisabled
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-[#3B65CA] hover:bg-[#3052a6] text-white"
                        }`}
                        style={{ paddingRight: 30, paddingLeft: 30, paddingTop: 15, paddingBottom: 15 }}
                    >
                        {addedTodaysDish ? "Save Changes" : "Submit"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export { AddDishModal };