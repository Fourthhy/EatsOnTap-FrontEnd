import React, { useState, useRef, useEffect } from "react";
import { logout } from "../../functions/logoutAuth";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Loader2, LogOut } from "lucide-react";

// 🟢 API FUNCTIONS (Ensure these match your actual file paths)
import { claimFoodItem } from "../../functions/foodItem/claimFoodItem"; 

const Row = ({ label, value, valueColor }) => (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontFamily: "geist, sans-serif" }}>
        <span style={{ color: "#555" }}>{label}</span>
        <span style={{ fontWeight: 600, color: valueColor }}>{value}</span>
    </div>
);

// 🟢 KEYPAD COMPONENT (Now accepts props)
const Keypad = ({ onKeyPress, disabled }) => {
    const renderKey = (label, value, style = {}) => (
        <button
            onClick={() => onKeyPress(value)}
            disabled={disabled}
            style={{
                height: "60px",
                borderRadius: "8px",
                border: "none",
                background: disabled ? "#e5e5e5" : style.background || "#f5f5f5",
                color: style.color || "#000",
                fontSize: "18px",
                fontWeight: 600,
                cursor: disabled ? "not-allowed" : "pointer",
                transition: "background 0.1s",
                ...style
            }}
        >
            {label}
        </button>
    );

    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", width: "360px" }}>
            {renderKey("1", "1")}
            {renderKey("2", "2")}
            {renderKey("3", "3")}
            {renderKey("Cancel", "CANCEL", { background: "#eaf2ff", color: "#1d4ed8" })}

            {renderKey("4", "4")}
            {renderKey("5", "5")}
            {renderKey("6", "6")}
            {renderKey("Delete", "DELETE", { background: "#ffe4e6", color: "#ef4444" })}

            {renderKey("7", "7")}
            {renderKey("8", "8")}
            {renderKey("9", "9")}
            
            <button
                onClick={() => onKeyPress("ENTER")}
                disabled={disabled}
                style={{
                    gridRow: "span 2",
                    borderRadius: "8px",
                    border: "none",
                    background: disabled ? "#e5e5e5" : "#b7e1b4",
                    color: "#166534",
                    fontSize: "18px",
                    fontWeight: 700,
                    cursor: disabled ? "not-allowed" : "pointer"
                }}
            >
                Enter
            </button>

            {/* Row 4 (0 spans 3 cols) */}
            <button
                onClick={() => onKeyPress("0")}
                disabled={disabled}
                style={{
                    gridColumn: "span 3",
                    height: "60px",
                    borderRadius: "8px",
                    border: "none",
                    background: disabled ? "#e5e5e5" : "#f5f5f5",
                    fontSize: "18px",
                    fontWeight: 600,
                    cursor: disabled ? "not-allowed" : "pointer"
                }}
            >
                0
            </button>
        </div>
    );
};

export default function FoodItemClaim() {
    const navigate = useNavigate();
    const inputRef = useRef(null);

    // --- STATE ---
    const [studentId, setStudentId] = useState("");
    const [amount, setAmount] = useState(""); // String to handle inputs easily
    const [studentData, setStudentData] = useState(null); // Stores fetched student info
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("info"); // 'info', 'success', 'error'

    // --- CALCULATIONS ---
    const currentBalance = studentData ? studentData.temporaryCreditBalance : 0;
    const totalCost = parseFloat(amount) || 0;
    const remainingBalance = currentBalance - totalCost;
    const isInsufficient = remainingBalance < 0;

    // --- LOGOUT ---
    const handleLogout = () => {
        logout();
        navigate('/'); 
    };

    // --- 1. HANDLE STUDENT SEARCH (Scan/Enter ID) ---
    const handleSearchStudent = async (e) => {
        if (e.key === 'Enter') {
            if (!studentId.trim()) return;
            
            setLoading(true);
            setMessage("");
            setStudentData(null);
            setAmount("");

            try {
                // Reuse your existing logic or the 'fakeMealClaim' GET endpoint
                // We assume 'claimMeal' here fetches data. If it auto-claims, you need a different fetch function.
                // Ideally: fetch(`${VITE_LOCALHOST}/api/claim/fakeMealClaim?studentInput=${studentId}`)
                const data = await claimMeal(studentId); 
                
                setStudentData(data);
                setMessage(`Student Found: ${data.first_name} ${data.last_name}`);
                setMessageType("success");
                
                // Clear input for next scan if needed, or keep it visible
                // setStudentId(""); 
            } catch (error) {
                console.error(error);
                setMessage(error.message || "Student not found");
                setMessageType("error");
            } finally {
                setLoading(false);
            }
        }
    };

    // --- 2. HANDLE KEYPAD INPUT ---
    const handleKeypadPress = async (key) => {
        if (!studentData) {
            setMessage("Please scan a Student ID first.");
            setMessageType("error");
            return;
        }

        if (key === "CANCEL") {
            setAmount("");
            setMessage("");
            return;
        }

        if (key === "DELETE") {
            setAmount((prev) => prev.slice(0, -1));
            return;
        }

        if (key === "ENTER") {
            handleTransactionSubmit();
            return;
        }

        // Handle Numbers
        // Prevent leading zeros or too many decimals if you add decimal logic later
        if (amount.length > 5) return; // Limit length
        setAmount((prev) => prev + key);
    };

    // --- 3. SUBMIT TRANSACTION ---
    const handleTransactionSubmit = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            setMessage("Please enter a valid amount.");
            setMessageType("error");
            return;
        }

        if (isInsufficient) {
            setMessage("Insufficient Balance!");
            setMessageType("error");
            return;
        }

        setLoading(true);
        try {
            // Call the POST API
            const result = await claimFoodItem(studentData.studentID, parseFloat(amount));
            
            setMessage(`Success! New Balance: ₱${result.remainingBalance}`);
            setMessageType("success");
            
            // Update local state to reflect new balance immediately
            setStudentData(prev => ({
                ...prev,
                temporaryCreditBalance: result.remainingBalance
            }));
            setAmount(""); // Reset amount for next purchase

            // Optional: Auto-reset after 3 seconds for next student
            setTimeout(() => {
                setStudentId("");
                setStudentData(null);
                setMessage("");
                if(inputRef.current) inputRef.current.focus();
            }, 3000);

        } catch (error) {
            setMessage(error.message || "Transaction Failed");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    // Auto-focus input on load
    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, []);


    return (
        <>
            <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", fontFamily: "geist, sans-serif" }}>
                
                {/* 🟢 LOGOUT BUTTON (Absolute Top Right) */}
                {/* <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 50 }}>
                     <Button variant="destructive" onClick={handleLogout} className="flex gap-2">
                        <LogOut size={16} /> Logout
                     </Button>
                </div> */}

                {/* 🟢 BACKGROUND */}
                <img
                    src="/studentClaim/Canteen-Staff-BG.svg"
                    alt="Background"
                    style={{
                        position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                        objectFit: "cover", zIndex: 0, pointerEvents: "none"
                    }}
                />

                <div style={{
                    position: "relative", zIndex: 10, height: "100%", width: "100%",
                    display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"
                }}>
                    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "row" }}>
                        
                        {/* 🟢 LEFT SIDE: SCANNER & INFO */}
                        <div style={{ width: "63%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <div
                                style={{
                                    width: "65%", height: "50%",
                                    border: `2px dashed ${messageType === 'error' ? '#ef4444' : messageType === 'success' ? '#22c55e' : '#6F4E37'}`,
                                    background: "rgba(255, 255, 255, 0.85)", // increased opacity for readability
                                    backdropFilter: "blur(10px)",
                                    borderRadius: "16px",
                                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
                                    display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column",
                                    gap: "20px", padding: "20px", transition: "all 0.3s"
                                }}
                            >
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {studentData ? `Hi, ${studentData.first_name}!` : "Scan ID to Start"}
                                </h2>

                                <Input
                                    ref={inputRef}
                                    value={studentId}
                                    onChange={(e) => setStudentId(e.target.value)}
                                    onKeyDown={handleSearchStudent}
                                    placeholder="Tap RFID or Type ID"
                                    disabled={loading}
                                    style={{
                                        background: '#FFFFFF', width: '80%', height: '60px',
                                        fontSize: '18px', textAlign: 'center', borderRadius: '12px',
                                        border: '1px solid #d1d5db'
                                    }}
                                />

                                {/* 🟢 STATUS MESSAGE AREA */}
                                <div style={{ height: '30px', textAlign: 'center' }}>
                                    {loading ? (
                                        <div className="flex items-center gap-2 text-blue-600 font-semibold">
                                            <Loader2 className="animate-spin" /> Processing...
                                        </div>
                                    ) : (
                                        <p style={{ 
                                            color: messageType === 'error' ? '#dc2626' : messageType === 'success' ? '#16a34a' : '#4b5563',
                                            fontWeight: 600, fontSize: '16px'
                                        }}>
                                            {message || "Ready for transaction"}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 🟢 RIGHT SIDE: SUMMARY & KEYPAD */}
                        <div style={{ width: "37%" }}>
                            <div style={{ height: "45%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "end" }}>
                                <div className="flex justify-end flex-col w-[95%]" style={{ paddingLeft: "5%", paddingBottom: "25px" }}>
                                    
                                    {/* SUMMARY CARD */}
                                    <div style={{
                                        background: "#f7f7f7", borderRadius: "10px", padding: "20px",
                                        marginBottom: "14px", width: "100%", boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
                                    }}>
                                        <Row label="Current Balance:" value={`₱${currentBalance}`} valueColor="#16a34a" />
                                        <Row label="Item Cost:" value={`₱${totalCost}`} valueColor="#000" />
                                        <div style={{ width: '100%', height: '1px', background: '#e5e5e5', margin: '8px 0' }}></div>
                                        <Row 
                                            label="Remaining:" 
                                            value={`₱${remainingBalance}`} 
                                            valueColor={isInsufficient ? "#ef4444" : "#16a34a"} 
                                        />
                                    </div>

                                    {/* LARGE AMOUNT DISPLAY */}
                                    <div style={{
                                        border: `2px solid ${isInsufficient ? '#fca5a5' : '#e5e7eb'}`,
                                        borderRadius: "12px", padding: "16px",
                                        background: isInsufficient ? "#fef2f2" : "#fff",
                                        width: "100%", textAlign: "right",
                                        display: "flex", justifyContent: "space-between", alignItems: "center"
                                    }}>
                                        <span style={{ color: "#6b7280", fontWeight: 500 }}>Enter Amount:</span>
                                        <span style={{ fontSize: "32px", fontWeight: "bold", color: "#111827" }}>
                                            ₱{amount || "0"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ height: "55%", width: "100%" }}>
                                <div className="h-[100%] w-[100%] flex items-center justify-center">
                                    <Keypad onKeyPress={handleKeypadPress} disabled={!studentData || loading} />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}