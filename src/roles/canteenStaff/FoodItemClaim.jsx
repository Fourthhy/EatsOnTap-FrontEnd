import React, { useState, useRef, useEffect } from "react";
import { logout } from "../../functions/logoutAuth";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// 🟢 IMPORTS
import { fetchAllStudents } from "../../functions/foodServer/fetchAllStudents";
import { isSettingActive } from "../../functions/isSettingActive";

// --- COMPONENTS ---

const Row = ({ label, value, valueColor }) => (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontFamily: "geist, sans-serif" }}>
        <span style={{ color: "#555" }}>{label}</span>
        <span style={{ fontWeight: 600, color: valueColor }}>{value}</span>
    </div>
);

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

            {/* Row 4 */}
            <button
                onClick={() => onKeyPress("0")}
                disabled={disabled}
                style={{
                    gridColumn: "span 3", height: "60px", borderRadius: "8px", border: "none",
                    background: disabled ? "#e5e5e5" : "#f5f5f5", fontSize: "18px", fontWeight: 600,
                    cursor: disabled ? "not-allowed" : "pointer"
                }}
            >
                0
            </button>
        </div>
    );
};

const SuccessModal = ({ isOpen, newBalance }) => {
    if (!isOpen) return null;
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                zIndex: 9000,
                backgroundColor: "rgba(0,0,0,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(4px)",
            }}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    padding: "32px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                    width: "400px",
                    textAlign: "center",
                    fontFamily: "Geist, sans-serif",
                }}
            >
                {/* Icon Circle */}
                <div
                    style={{
                        width: "80px",
                        height: "80px",
                        backgroundColor: "#DCFCE7",
                        borderRadius: "9999px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "16px",
                    }}
                >
                    <CheckCircle size={40} color="#16A34A" />
                </div>

                {/* Title */}
                <h2
                    style={{
                        fontSize: "24px",
                        fontWeight: "700",
                        color: "#1F2937",
                        marginBottom: "8px",
                    }}
                >
                    Transaction Success!
                </h2>

                {/* Subtitle */}
                <p
                    style={{
                        color: "#6B7280",
                        marginBottom: "24px",
                    }}
                >
                    The amount has been deducted.
                </p>

                {/* Balance Card */}
                <div
                    style={{
                        backgroundColor: "#F9FAFB",
                        borderRadius: "8px",
                        padding: "16px",
                        width: "100%",
                        border: "1px solid #F3F4F6",
                    }}
                >
                    <p
                        style={{
                            fontSize: "12px",
                            color: "#6B7280",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            fontWeight: "600",
                        }}
                    >
                        Remaining Balance
                    </p>

                    <p
                        style={{
                            fontSize: "30px",
                            fontWeight: "700",
                            marginTop: "4px",
                            color: newBalance < 0 ? "#DC2626" : "#111827",
                        }}
                    >
                        ₱{newBalance.toFixed(2)}
                    </p>
                </div>
            </motion.div>
        </div>

    );
};

export default function FoodItemClaim() {
    const navigate = useNavigate();
    const inputRef = useRef(null);

    // --- STATE ---
    const [allStudents, setAllStudents] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const [inputVal, setInputVal] = useState("");
    const [studentData, setStudentData] = useState(null);
    const [amount, setAmount] = useState("");

    const [loading, setLoading] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [isSystemActive, setIsSystemActive] = useState(true);
    const [systemMessage, setSystemMessage] = useState("");

    // 🟢 NEW: State to hold the final balance for the modal
    const [successBalance, setSuccessBalance] = useState(0);

    // --- CALCULATIONS (For live display only) ---
    const currentBalance = studentData ? studentData.temporaryCreditBalance : 0;
    const totalCost = parseFloat(amount) || 0;
    const remainingBalance = currentBalance - totalCost;

    // --- INITIAL DATA LOAD ---
    useEffect(() => {
        const loadData = async () => {
            try {
                const students = await fetchAllStudents();
                if (Array.isArray(students)) {
                    setAllStudents(students);
                    setIsDataLoaded(true);
                }
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };

        const checkSystemStatus = async () => {
            try {
                const status = await isSettingActive("STUDENT-CLAIM");
                if (status) {
                    setIsSystemActive(status);
                    setSystemMessage(status.message);
                }
            } catch (error) {
                console.error("Failed to check status:", error);
            }
        };

        loadData();
        checkSystemStatus();

        if (inputRef.current && isSystemActive) inputRef.current.focus();
    }, [isSystemActive]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // --- 1. HANDLE LOCAL SEARCH ---
    const handleSearchStudent = (e) => {
        if (e.key === 'Enter') {
            const trimmedInput = inputVal.trim();
            if (!trimmedInput) return;

            const isRFID = /^\d+$/.test(trimmedInput);

            const foundStudent = allStudents.find(s => {
                if (isRFID) return s.rfidTag === trimmedInput;
                return s.studentID?.toLowerCase() === trimmedInput.toLowerCase();
            });

            if (foundStudent) {
                setStudentData(foundStudent);
                setInputVal("");
                setAmount("");
            } else {
                alert("Student not found!");
                setInputVal("");
            }
        }
    };

    // --- 2. HANDLE KEYPAD ---
    const handleKeypadPress = (key) => {
        if (!studentData) return;

        if (key === "CANCEL") {
            setStudentData(null);
            setAmount("");
            setTimeout(() => { if (inputRef.current) inputRef.current.focus() }, 100);
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
        if (amount.length > 5) return;
        setAmount((prev) => prev + key);
    };

    // --- 3. SUBMIT TRANSACTION (LOCAL UPDATE) ---
    const handleTransactionSubmit = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        setLoading(true);

        await new Promise(resolve => setTimeout(resolve, 500));

        try {
            const deductAmount = parseFloat(amount);
            const newBal = studentData.temporaryCreditBalance - deductAmount;

            // 🟢 FIX: Set the success balance state BEFORE updating the studentData
            setSuccessBalance(newBal);

            // Update Local Data Structure
            const updatedList = allStudents.map(s => {
                if (s.studentID === studentData.studentID) {
                    return {
                        ...s,
                        temporaryCreditBalance: newBal,
                        claimRecords: [
                            ...(s.claimRecords || []),
                            { date: new Date(), creditClaimed: deductAmount, remarks: ["CLAIMED"] }
                        ]
                    };
                }
                return s;
            });

            setAllStudents(updatedList);
            setStudentData(prev => ({ ...prev, temporaryCreditBalance: newBal }));

            setIsSuccessOpen(true);

            setTimeout(() => {
                setIsSuccessOpen(false);
                setStudentData(null);
                setAmount("");
                if (inputRef.current) inputRef.current.focus();
            }, 3000);

        } catch (error) {
            console.error(error);
            alert("Transaction failed");
        } finally {
            setLoading(false);
        }
    };

    const currentDateTime = new Date();
    const dateOnlyString = currentDateTime.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <>
            <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", fontFamily: "geist, sans-serif" }}>

                {/* 🟢 PASS THE FIXED STATE TO MODAL */}
                <SuccessModal isOpen={isSuccessOpen} newBalance={successBalance} />

                {/* BACKGROUND */}
                <img
                    src="/studentClaim/Canteen-Staff-BG.svg"
                    alt="Background"
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, pointerEvents: "none" }}
                />

                <div style={{ position: "relative", zIndex: 10, height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>

                    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "row" }}>

                        {/* 🟢 LEFT SIDE: SCANNER OR CARD */}
                        <div style={{ width: "63%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>

                            {!studentData ? (
                                // 🟢 STATE A: ID SCANNER BOX
                                <div style={{
                                    width: "65%", height: "50%",
                                    background: "rgba(255, 255, 255, 0.85)", backdropFilter: "blur(10px)",
                                    borderRadius: "16px", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
                                    display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column",
                                    gap: "20px", padding: "20px"
                                }}>
                                    <h2 className="text-2xl font-bold text-gray-800">Scan ID to Start</h2>
                                    <Input
                                        ref={inputRef}
                                        value={inputVal}
                                        onChange={(e) => setInputVal(e.target.value)}
                                        onKeyDown={handleSearchStudent}
                                        placeholder={!isSystemActive ? "System Disabled" : !isDataLoaded ? "Loading Data..." : "Tap RFID or Type ID"}
                                        disabled={!isSystemActive || !isDataLoaded}
                                        autoFocus={true}
                                        style={{
                                            background: '#FFFFFF', width: '80%', height: '60px',
                                            fontSize: '18px', textAlign: 'center', borderRadius: '12px', border: '1px solid #d1d5db'
                                        }}
                                    />
                                    {loading && <div className="text-blue-600 font-semibold flex items-center gap-2"><Loader2 className="animate-spin" /> Processing...</div>}
                                </div>
                            ) : (
                                // 🟢 STATE B: VALIDITY CARD (Exact Structure)
                                <div style={{ position: "relative", width: "65%", height: "50%" }}>
                                    {/* Card Background Selection */}
                                    {studentData.section === 'BSIS' ? (
                                        <img src="/studentClaim/Card_Template_BSIS.svg" alt="card" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "contain", zIndex: 0 }} />
                                    ) : studentData.section === 'ACT' ? (
                                        <img src="/studentClaim/Card_Template_ACT.svg" alt="card" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "contain", zIndex: 0 }} />
                                    ) : <img src="/studentClaim/Card_Template_Basic_Ed.svg" alt="card" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "contain", zIndex: 0 }} />}

                                    {/* Card Content Overlay */}
                                    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 10, display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "start", padding: "5px" }}>

                                            {/* Header Logo Row */}
                                            <div className="w-[100%] h-[20%] flex flex-row" style={{ display: "flex", justifyContent: "start", alignItems: "center", marginTop: "10px" }}>
                                                <img src="/lv-logo.svg" alt="lv-logo" style={{ height: "60px", width: "60px", margin: "5px 10px 5px 20px" }} />
                                                <div className="h-[100%] flex items-center">
                                                    <p style={{ fontWeight: 400 }} className="font-geist text-md text-white">Food Item Purchase</p>
                                                </div>
                                            </div>

                                            {/* Body Info */}
                                            <div className="w-[100%] h-[80%]" style={{ paddingTop: "20px" }}>
                                                <div className="h-[100%] w-[100] flex items-center justify-between" style={{ marginLeft: "20px" }}>
                                                    <div className="w-[100%] h-[100%] flex flex-row">
                                                        {/* Picture & Time */}
                                                        <div className="w-auto flex flex-col items-center gap-2">
                                                            <img src="/studentClaim/Default_Picture.jpg" alt="default" style={{ width: "160px", height: "160px" }} />
                                                            <p style={{ fontWeight: 400 }} className="font-geist text-[10px] text-white w-[160px]">
                                                                {dateOnlyString.toUpperCase()}
                                                            </p>
                                                        </div>
                                                        {/* Text Details */}
                                                        <div style={{ marginLeft: "20px", display: "flex", flexDirection: "column", gap: 20 }} className="h-[100%] flex flex-column justify-start">
                                                            <div>
                                                                <p style={{ fontWeight: 400 }} className="font-geist text-xl text-white">{studentData.last_name}, {studentData.first_name}</p>
                                                                <p style={{ fontWeight: 350 }} className="font-geist text-xs text-[#999797]">Student Name</p>
                                                            </div>
                                                            <div>
                                                                <p style={{ fontWeight: 400 }} className="font-geist text-xl text-white">{studentData.section || studentData.program} - {studentData.year}</p>
                                                                <p style={{ fontWeight: 350 }} className="font-geist text-xs text-[#999797]">Section / Year</p>
                                                            </div>
                                                            <div>
                                                                <p style={{ fontWeight: 400 }} className="font-geist text-xl text-white">{studentData.studentID}</p>
                                                                <p style={{ fontWeight: 350 }} className="font-geist text-xs text-[#999797]">StudentID</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Department Logo */}
                                                    <div>
                                                        {studentData.section === 'ACT' ? (
                                                            <img src="/studentClaim/logo-ACT.svg" alt='logo' style={{ width: "170px", height: "170px", paddingBottom: "10px" }} />
                                                        ) : studentData.section === 'BSIS' ? (
                                                            <img src="/studentClaim/logo-BSIS.svg" alt='logo' style={{ width: "170px", height: "170px", paddingBottom: "50px" }} />
                                                        ) : <img src="/lv-logo.svg" alt='logo' style={{ width: "170px", height: "170px", paddingBottom: "10px", paddingRight: "10px" }} />}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
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
                                        <Row label="Current Balance:" value={`₱${currentBalance.toFixed(2)}`} valueColor="#16a34a" />
                                        <Row label="Item Cost:" value={`₱${totalCost.toFixed(2)}`} valueColor="#000" />
                                        <div style={{ width: '100%', height: '1px', background: '#e5e5e5', margin: '8px 0' }}></div>
                                        {/* Use derived state here for live updates */}
                                        <Row
                                            label="Remaining:"
                                            value={`₱${remainingBalance.toFixed(2)}`}
                                            valueColor={remainingBalance < 0 ? "#ef4444" : "#16a34a"}
                                        />
                                    </div>

                                    {/* LARGE AMOUNT DISPLAY */}
                                    <div style={{
                                        border: `2px solid #e5e7eb`,
                                        borderRadius: "12px", padding: "16px",
                                        background: "#fff",
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
                                    {/* Disable Keypad if no student is selected */}
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