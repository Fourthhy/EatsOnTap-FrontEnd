import React, { useState } from "react";
import {
  ClipboardCheck, // Changed from FileCheck2 to ClipboardCheck for better compatibility
  CalendarDays,
  Calendar,
  Plus,
  X
} from "lucide-react";

function QuickActions() {
  const [ordersSubmitted, setOrdersSubmitted] = useState(false);

  // --- STATE HOLDERS ---
  // 1. 'orderItems' holds the temporary input values while the user is typing in the modal
  const [orderItems, setOrderItems] = useState(["", ""]); 
  
  // 2. 'submittedOrders' is the PERMANENT STATE HOLDER for the submitted data
  const [submittedOrders, setSubmittedOrders] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- CHANGE DETECTOR ---
  // We compare the current 'orderItems' input vs the saved 'submittedOrders'.
  const hasChanges = JSON.stringify(orderItems) !== JSON.stringify(submittedOrders);

  // Define when the button should be disabled
  const isSaveDisabled = ordersSubmitted && !hasChanges;

  const handleClickAction = (action) => {
    switch (action) {
      case "submitOrders":
        // Logic: If we already have orders saved, load them to edit. 
        // Otherwise, reset inputs to 2 empty fields.
        if (submittedOrders.length > 0) {
            setOrderItems([...submittedOrders]);
        } else {
            setOrderItems(["", ""]);
        }
        setIsModalOpen(true);
        break;
      case "editSchedule":
        // Add logic for Edit Schedule here
        break;
      case "requestEvent":
        // Add logic for Send Request for Event here
        break;
    }
  };

  // Helper to handle modal submission
  const handleSubmitOrders = () => {
    // Save the inputs to the main state holder
    setSubmittedOrders(orderItems); 
    
    console.log("Final Saved Order Data:", orderItems); 
    
    setOrdersSubmitted(true); // Toggle the button UI
    setIsModalOpen(false); // Close modal
  };

  // Helper to add a new input field
  const addOrderField = () => {
    setOrderItems([...orderItems, ""]);
  };

  // Helper to update specific order input
  const handleOrderChange = (index, value) => {
    const newItems = [...orderItems];
    newItems[index] = value;
    setOrderItems(newItems);
  };

  return (
    <>
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 6px #e5eaf0",
          padding: 18,
          display: "flex",
          flexDirection: "column",
          width: "auto",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <h4
          style={{
            fontWeight: "500",
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
        
        {/* --- BUTTON 1: SUBMIT ORDERS --- */}
        <div className="w-full">
          <button
            style={{
              marginBottom: 8,
              borderRadius: 6,
              padding: "10px 12px",
              cursor: "pointer",
              fontFamily: "geist",
              fontSize: 13,
              width: "100%",
            }}
            className={
              ordersSubmitted === false
                ? "bg-[#EEFCFF] hover:bg-[#c7eaf280]" // Default light blue style
                : "bg-[#EEFCFF] hover:bg-[#c7eaf280]" // Kept consistent with design
            }
            onClick={() => {
              handleClickAction("submitOrders");
            }}
          >
            <span className="w-[100%] gap-3 flex justify-start items-center">
              <ClipboardCheck size={20} strokeWidth={1.5} />
              {ordersSubmitted ? "View Submitted Orders" : "Submit Orders"}
            </span>
          </button>
        </div>

        {/* --- BUTTON 2: EDIT SCHEDULE --- */}
        <div className="w-full">
          <button
            style={{
              marginBottom: 8,
              borderRadius: 6,
              padding: "10px 12px",
              cursor: "pointer",
              fontFamily: "geist",
              fontSize: 13,
              width: "100%",
            }}
            className="bg-[#EEFCFF] hover:bg-[#c7eaf280]"
            onClick={() => {
              handleClickAction("editSchedule");
            }}
          >
            <span className="w-[100%] gap-3 flex justify-start items-center">
              <CalendarDays size={20} strokeWidth={1.5} />
              Edit Schedule
            </span>
          </button>
        </div>

        {/* --- BUTTON 3: SEND REQUEST FOR EVENT --- */}
        <div className="w-full">
          <button
            style={{
              marginBottom: 8,
              borderRadius: 6,
              padding: "10px 12px",
              cursor: "pointer",
              fontFamily: "geist",
              fontSize: 13,
              width: "100%",
            }}
            className="bg-[#EEFCFF] hover:bg-[#c7eaf280]"
            onClick={() => {
              handleClickAction("requestEvent");
            }}
          >
            <span className="w-[100%] gap-3 flex justify-start items-center">
              {/* Using generic Calendar icon for single event request */}
              <Calendar size={20} strokeWidth={1.5} />
              Send Request for Event
            </span>
          </button>
        </div>
      </div>

      {/* --- MODAL IMPLEMENTATION --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-[550px] h-auto p-8 relative animate-in fade-in zoom-in duration-200">

            {/* Header */}
            <div className="flex items-start gap-3 mb-8 w-full h-[20%] flex justify-start items-center" style={{ marginTop: 15 }}>
              <div className="h-[50px] flex items-center" style={{ paddingLeft: 10 }}>
                <ClipboardCheck size={30} strokeWidth={1.5} />
              </div>
              <div className="h-full flex flex-col justify-center">
                <h2 className="text-xl font-bold text-gray-900" style={{ fontSize: 20, fontWeight: 500 }}>
                  <span className="font-geist">
                    {ordersSubmitted ? "View Submitted Orders" : "Submit Orders"}
                  </span>
                </h2>
                <p className="text-gray-500 text-sm font-geist" style={{ fontSize: 12, fontWeight: 400 }}>
                  {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Form Inputs */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 flex flex-col items-center" style={{ marginTop: 15 }}>
              {orderItems.map((item, index) => (
                <div key={index} className="w-[92%] flex items-center" style={{ marginBottom: 15 }}>
                  <label className="text-sm font-medium text-gray-700 font-geist w-[25%] shrink-0">
                    Item {index + 1}:
                  </label>
                  <input
                    type="text"
                    placeholder="Enter order details"
                    value={item}
                    onChange={(e) => handleOrderChange(index, e.target.value)}
                    className="w-[75%] bg-[#F3F4F8] h-[45px] text-gray-700 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-geist" 
                    style={{ borderRadius: 6, paddingLeft: 10, fontSize: 13 }}
                  />
                </div>
              ))}

              {/* Add Another Item Button */}
              <div className="w-[92%] flex justify-start">
                <button
                  onClick={addOrderField}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm mt-4 pl-1 transition-colors"
                >
                  <Plus size={20} strokeWidth={1.5} className="rounded-full border border-gray-400 p-0.5" />
                  Add another item
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
                onClick={handleSubmitOrders}
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
                {ordersSubmitted ? "Save Changes" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export {QuickActions};