import React, { useState } from "react";
import { IoMdAlert } from "react-icons/io";
import {
    Utensils,
    FileCheck2,
    UserPlus,
    CalendarDays,
    Plus,
    X,
    ClipboardList
} from "lucide-react"
    ;
// BUTTON FROM SHADCN
// import { Button } from "@/components/ui/button";

// BUTTON FROM FLOWBITE
import { Button } from "flowbite-react"

function QuickActions() {
    const [addedTodaysDish, setAddedTodaysDish] = useState(false);

    // --- STATE HOLDERS ---
    // 1. 'meals' holds the temporary input values while the user is typing in the modal
    const [meals, setMeals] = useState(["", ""]);

    // 2. 'todaysMenu' is the PERMANENT STATE HOLDER for the submitted data
    const [todaysMenu, setTodaysMenu] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- CHANGE DETECTOR ---
    // We compare the current 'meals' input vs the saved 'todaysMenu'.
    // JSON.stringify is a quick way to compare the contents of two arrays.
    const hasChanges = JSON.stringify(meals) !== JSON.stringify(todaysMenu);

    // Define when the button should be disabled
    // It is disabled ONLY if: We have already added a dish (Edit Mode) AND there are NO changes.
    const isSaveDisabled = addedTodaysDish && !hasChanges;

    const handelClickAction = (action) => {
        switch (action) {
            case "addDish":
                // Logic: If we already have a menu saved, load it into the inputs to edit. 
                // Otherwise, reset inputs to 2 empty fields.
                if (todaysMenu.length > 0) {
                    setMeals([...todaysMenu]);
                } else {
                    setMeals(["", ""]);
                }
                setIsModalOpen(true);
                break;
            case "ScheduleEvent":
                break;
            case "registerStudent":
                break;
            case "viewMealRequest":
                break
        }
    };

    // Helper to handle modal submission
    const handleSubmitMeals = () => {
        // Save the inputs to the main state holder
        setTodaysMenu(meals);

        console.log("Final Saved Menu Data:", meals);

        setAddedTodaysDish(true); // Toggle the button UI
        setIsModalOpen(false); // Close modal
    };

    // Helper to add a new input field
    const addMealField = () => {
        setMeals([...meals, ""]);
    };

    // Helper to update specific meal input
    const handleMealChange = (index, value) => {
        const newMeals = [...meals];
        newMeals[index] = value;
        setMeals(newMeals);
    };

    const globalButtonStyle = {
        marginBottom: 8,
        borderRadius: 6,
        padding: "20px 12px",
        fontFamily: "geist",
        fontSize: 13,
        fontWeight: 400,
        width: "100%",
        boxShadow: "0 2px 6px #e5eaf0ac",
        border: "1px solid #ddddddbf",
        color: "#eeeeee",
        cursor: "pointer"
    }

    const globalButtonBgColor = "bg-[#4268BD] hover:bg-[#33549F] transition-colors duration-300";

    return (
        <>
            <div
                style={{
                    background: "#fff",
                    borderRadius: 12,
                    boxShadow: "0 2px 6px #e5eaf0",
                    padding: 20,
                    display: "flex",
                    flexDirection: "column",
                    width: "auto",
                    justifyContent: "center",
                    height: "100%",
                }}
            >
                <h4
                    style={{
                        fontWeight: 500,
                        fontSize: 12,
                        color: "#000000",
                        fontFamily: "geist",
                        width: "fit-content",
                        height: "fit-content",
                        paddingBottom: 20,
                    }}
                >
                    Quick Actions
                </h4>

                <div className="w-full">
                    <Button style={globalButtonStyle} className={globalButtonBgColor}
                        onClick={() => {
                            handelClickAction("addDish");
                        }}
                    >
                        <span className="w-[100%] h-[100%] flex justify-start items-center">
                            <div style={{ paddingRight: 8 }}>
                                <Utensils size={20} />
                            </div>
                            {addedTodaysDish ? "View Dish for Today" : "Add Dish for Today"}

                            <IoMdAlert size={15} color={"#F68A3A"} />

                        </span>
                    </Button>
                </div>
                <div className="w-full">
                    <Button style={globalButtonStyle} className={globalButtonBgColor}
                        onClick={() => {
                            handelClickAction("ScheduleEvent");
                        }}
                    >
                        <span className="w-[100%] gap-2 flex justify-start">
                            <CalendarDays size={20} />
                            Schedule Event
                        </span>
                    </Button>
                </div>
                <div className="w-full">
                    <Button style={globalButtonStyle} className={globalButtonBgColor}
                        onClick={() => {
                            handelClickAction("registerStudent");
                        }}
                    >
                        <span className="w-[100%] gap-2 flex justify-start">
                            <UserPlus size={20} />
                            Register Student
                        </span>
                    </Button>
                </div>
                <div className="w-full">
                    <Button style={globalButtonStyle} className={globalButtonBgColor}
                        onClick={() => {
                            handelClickAction("viewMealRequest");
                        }}
                    >
                        <span className="w-[100%] gap-2 flex justify-start">
                            <ClipboardList size={20} />
                            View Meal Request
                        </span>
                    </Button>
                </div>
            </div >

            {/* --- MODAL IMPLEMENTATION --- */}
            {
                isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-xl w-[550px] h-auto p-8 relative animate-in fade-in zoom-in duration-200">

                            {/* Header */}
                            <div className="flex items-start gap-3 mb-8 w-full h-[20%] flex justify-start items-center" style={{ marginTop: 15 }}>
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
                                            onChange={(e) => handleMealChange(index, e.target.value)}
                                            className="w-[75%] bg-[#F3F4F8] h-[45px] text-gray-700 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-geist"
                                            style={{ borderRadius: 6, paddingLeft: 10, fontSize: 13 }}
                                        />
                                    </div>
                                ))}

                                {/* Add Another Meal Button */}
                                <div className="w-[92%] flex justify-start">
                                    <button
                                        onClick={addMealField}
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
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-md text-sm transition-colors"
                                    style={{ paddingRight: 30, paddingLeft: 30, paddingTop: 15, paddingBottom: 15 }}
                                >
                                    Cancel
                                </button>

                                {/* SUBMIT BUTTON WITH CHANGE DETECTION STYLING */}
                                <button
                                    onClick={handleSubmitMeals}
                                    disabled={isSaveDisabled}
                                    className={`
                    px-8 py-2.5 rounded-md text-sm transition-colors
                    ${isSaveDisabled
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed" // Disabled Style
                                            : "bg-[#3B65CA] hover:bg-[#3052a6] text-white"   // Active Style
                                        }
                `}
                                    style={{ paddingRight: 30, paddingLeft: 30, paddingTop: 15, paddingBottom: 15 }}
                                >
                                    {addedTodaysDish ? "Save Changes" : "Submit"}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
}

export { QuickActions };