import React, { useState, useRef, useEffect } from "react";
import { logout } from "../../functions/logoutAuth";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// 🟢 IMPORTS
import { claimFoodItem } from "../../functions/foodItem/claimFoodItem";
import { fetchApprovedStudents } from "../../functions/foodServer/fetchApprovedStudents";
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
                <div style={{ width: "80px", height: "80px", backgroundColor: "#DCFCE7", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                    <CheckCircle size={40} color="#16A34A" />
                </div>
                <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#1F2937", marginBottom: "8px" }}>Transaction Success!</h2>
                <p style={{ color: "#6B7280", marginBottom: "24px" }}>The amount has been deducted.</p>
                <div style={{ backgroundColor: "#F9FAFB", borderRadius: "8px", padding: "16px", width: "100%", border: "1px solid #F3F4F6" }}>
                    <p style={{ fontSize: "12px", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "600" }}>Remaining Balance</p>
                    <p style={{ fontSize: "30px", fontWeight: "700", marginTop: "4px", color: newBalance < 0 ? "#DC2626" : "#111827" }}>₱{newBalance.toFixed(2)}</p>
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

    // Local UI Status to handle "Zero Balance" overriding "Eligible"
    const [uiStatus, setUiStatus] = useState("ELIGIBLE");

    const [loading, setLoading] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [isSystemActive, setIsSystemActive] = useState(true);
    const [systemMessage, setSystemMessage] = useState("");
    const [successBalance, setSuccessBalance] = useState(0);

    // 🟢 Ticking Clock State
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    // 🟢 LOGOUT STATE
    const [isLoggingOut, setIsLoggingOut] = useState(false); 
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    // --- CALCULATIONS ---
    const currentBalance = studentData ? studentData.temporaryCreditBalance : 0;
    const totalCost = parseFloat(amount) || 0;
    const remainingBalance = currentBalance - totalCost;

    const dateOnlyString = currentDateTime.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeString = currentDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // =======================================================================
    // 🟢 EFFECT 1: Fetch Data and Settings (Runs ONCE when page loads)
    // =======================================================================
    useEffect(() => {
        const loadData = async () => {
            try {
                const students = await fetchApprovedStudents();
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
                console.log("checking STUDENT-CLAIM setting status:");
                const statusResponse = await isSettingActive("STUDENT-CLAIM");
                console.log("RAW STATUS RECEIVED:", statusResponse);

                if (statusResponse && typeof statusResponse === 'object') {
                    setIsSystemActive(statusResponse.isActive === true);
                    setSystemMessage(statusResponse.message || "System is closed.");
                } else {
                    setIsSystemActive(statusResponse === true);
                    setSystemMessage(statusResponse ? "" : "System is currently disabled.");
                }
            } catch (error) {
                console.error("Failed to check status:", error);
                setIsSystemActive(false); 
                setSystemMessage("Network Error. Cannot connect to settings.");
            }
        };

        loadData();
        checkSystemStatus();
    }, []); // EMPTY ARRAY

    // =======================================================================
    // 🟢 EFFECT 2: The Clock and Input Focus 
    // =======================================================================
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        if (inputRef.current && isSystemActive) {
            inputRef.current.focus();
        }

        return () => clearInterval(timer);
    }, [isSystemActive]);

    // 🟢 LOGOUT HANDLER
    const handleLogout = async () => {
        if (isLoggingOut) return; 

        setIsLoggingOut(true); 

        try {
            await logout(); 
        } catch (error) {
            console.error("Logout process encountered an error:", error);
        } finally {
            navigate('/');
        }
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

                // Logic: If eligible but balance is 0 or less, treat as NO_BALANCE
                let finalStatus = foundStudent.temporaryClaimStatus;
                if (foundStudent.temporaryCreditBalance <= 0) {
                    finalStatus = "NO_BALANCE";
                }

                setUiStatus(finalStatus);

                // If NOT eligible OR No Balance, block workflow
                if (finalStatus !== "ELIGIBLE") {
                    setTimeout(() => {
                        setStudentData(null);
                        setAmount("");
                        if (inputRef.current) inputRef.current.focus();
                    }, 3000);
                }

            } else {
                alert("Student not found!");
                setInputVal("");
            }
        }
    };

    // --- 2. HANDLE KEYPAD ---
    const handleKeypadPress = (key) => {
        if (!studentData) return;
        if (uiStatus !== "ELIGIBLE") return;

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

    // --- 3. SUBMIT TRANSACTION (USING API) ---
    const handleTransactionSubmit = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        setLoading(true);

        try {
            const deductAmount = parseFloat(amount);

            // 🟢 CALL API
            const result = await claimFoodItem(studentData.studentID, deductAmount);

            // Update Success Balance for Modal
            setSuccessBalance(result.remainingBalance);

            // Update Local Data (Optimistic or Response-based)
            const updatedList = allStudents.map(s => {
                if (s.studentID === studentData.studentID) {
                    return {
                        ...s,
                        temporaryCreditBalance: result.remainingBalance,
                        temporaryClaimStatus: result.status // Update status if it changed to CLAIMED
                    };
                }
                return s;
            });

            setAllStudents(updatedList);
            setStudentData(prev => ({ 
                ...prev, 
                temporaryCreditBalance: result.remainingBalance,
                temporaryClaimStatus: result.status 
            }));

            setIsSuccessOpen(true);

            setTimeout(() => {
                setIsSuccessOpen(false);
                setStudentData(null);
                setAmount("");
                if (inputRef.current) inputRef.current.focus();
            }, 3000);

        } catch (error) {
            console.error(error);
            alert(error.message || "Transaction failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* 🟢 FLOATING LOGOUT BUTTON: Anchored bottom-right */}
            <div style={{ position: "absolute", bottom: "20px", left: "20px", zIndex: 9000 }}>
                <Button 
                    onClick={() => setShowLogoutConfirm(true)} 
                    disabled={isLoggingOut}
                    variant="destructive" 
                    style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.1)", padding: "5px 10px" }}
                >
                    Log out
                </Button>
            </div>

            {/* 🟢 LOGOUT CONFIRMATION MODAL */}
            <AnimatePresence>
                {showLogoutConfirm && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {/* Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} 
                            onClick={() => !isLoggingOut && setShowLogoutConfirm(false)} 
                        />
                        
                        {/* Modal Box */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '360px', zIndex: 10, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
                        >
                            <div style={{ backgroundColor: '#FEE2E2', padding: '12px', borderRadius: '50%', marginBottom: '16px', color: '#DC2626' }}>
                                <LogOut size={24} />
                            </div>
                            
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1F2937', marginBottom: '8px' }}>Confirm Logout</h3>
                            <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: '1.5', marginBottom: '24px' }}>
                                Are you sure you want to log out? You will need to sign back in to access your terminal.
                            </p>

                            <div style={{ display: 'flex', width: '100%', gap: '12px' }}>
                                <button 
                                    onClick={() => setShowLogoutConfirm(false)} 
                                    disabled={isLoggingOut}
                                    style={{ flex: 1, padding: '10px 0', borderRadius: '8px', border: '1px solid #D1D5DB', background: 'white', color: '#374151', cursor: isLoggingOut ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 500 }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleLogout} 
                                    disabled={isLoggingOut}
                                    style={{ flex: 1, padding: '10px 0', borderRadius: '8px', border: 'none', background: '#DC2626', color: 'white', cursor: isLoggingOut ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                >
                                    {isLoggingOut ? <Loader2 size={16} className="animate-spin" /> : "Log Out"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", fontFamily: "geist, sans-serif" }}>

                <SuccessModal isOpen={isSuccessOpen} newBalance={successBalance} />

                <img
                    src="/studentClaim/Canteen-Staff-BG.svg"
                    alt="Background"
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, pointerEvents: "none" }}
                />

                <div style={{ position: "relative", zIndex: 10, height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>

                    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "row" }}>

                        {/* 🟢 LEFT SIDE: SCANNER / ERROR IMAGE / CARD */}
                        <div style={{ width: "63%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>

                            {!studentData ? (
                                // 1. NO DATA: SHOW SCANNER
                                <div style={{
                                    width: "65%", height: "50%",
                                    background: "rgba(255, 255, 255, 0.85)", backdropFilter: "blur(10px)",
                                    borderRadius: "16px", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
                                    display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column",
                                    gap: "20px", padding: "20px"
                                }}>
                                    <h2 className="text-2xl font-bold text-gray-800">Scan ID to Start</h2>
                                    <Input
                                        type="password" // Asterisk Mask
                                        ref={inputRef}
                                        value={inputVal}
                                        onChange={(e) => setInputVal(e.target.value)}
                                        onKeyDown={handleSearchStudent}
                                        placeholder={!isSystemActive ? "System Disabled" : !isDataLoaded ? "Loading Data..." : "Tap RFID or Type ID"}
                                        disabled={!isSystemActive || !isDataLoaded}
                                        autoFocus={isSystemActive}
                                        style={{
                                            background: (isSystemActive && isDataLoaded) ? '#FFFFFF' : '#e5e7eb', width: '80%', height: '60px',
                                            fontSize: '18px', textAlign: 'center', borderRadius: '12px', border: '1px solid #d1d5db',
                                            cursor: (isSystemActive && isDataLoaded) ? 'text' : 'not-allowed'
                                        }}
                                    />
                                    {!isSystemActive && (
                                        <p className="text-red-500 font-geist text-sm text-center">{systemMessage}</p>
                                    )}
                                    {loading && <div className="text-blue-600 font-semibold flex items-center gap-2"><Loader2 className="animate-spin" /> Processing...</div>}
                                </div>
                            ) : uiStatus !== "ELIGIBLE" ? (
                                // 2. ERROR STATE
                                <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                                    {uiStatus === "CLAIMED" ? (
                                        <img src="/studentClaim/ALREADY_CLAIMED.svg" alt="Claimed" style={{ width: "250px", height: "250px" }} />
                                    ) : (
                                        <img src="/studentClaim/INELIGIBLE_SINAGE.svg" alt="Ineligible" style={{ width: "250px", height: "250px" }} />
                                    )}
                                    <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "rgba(255, 255, 255, 0.9)", borderRadius: "0.75rem", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", textAlign: "center" }}>
                                        <p style={{ fontSize: "1.25rem", fontWeight: "700", color: "#1f2937" }}>
                                            {studentData.last_name}, {studentData.first_name}
                                        </p>
                                        <p style={{ fontSize: "1rem", fontWeight: "700", color: "#ef4444", marginTop: "0.25rem" }}>
                                            {uiStatus === "NO_BALANCE" ? "Insufficient Balance (₱0.00)" : `Status: ${uiStatus}`}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                // 3. ELIGIBLE STATE: SHOW CARD
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

                                            <div className="w-[100%] h-[20%] flex flex-row" style={{ display: "flex", justifyContent: "start", alignItems: "center", marginTop: "10px" }}>
                                                <img src="/lv-logo.svg" alt="lv-logo" style={{ height: "60px", width: "60px", margin: "5px 10px 5px 20px" }} />
                                                <div className="h-[100%] flex items-center">
                                                    <p style={{ fontWeight: 400 }} className="font-geist text-md text-white">Food Item Purchase</p>
                                                </div>
                                            </div>

                                            <div className="w-[100%] h-[80%]" style={{ paddingTop: "20px" }}>
                                                <div className="h-[100%] w-[100] flex items-center justify-between" style={{ marginLeft: "20px" }}>
                                                    <div className="w-[100%] h-[100%] flex flex-row">
                                                        <div className="w-auto flex flex-col items-center gap-2">
                                                            <img src="/studentClaim/Default_Picture.jpg" alt="default" style={{ width: "160px", height: "160px" }} />
                                                            <p style={{ fontWeight: 400 }} className="font-geist text-[10px] text-white w-[160px]">
                                                                {dateOnlyString.toUpperCase()}
                                                            </p>
                                                        </div>
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

                                    <div style={{
                                        background: "#f7f7f7", borderRadius: "10px", padding: "20px",
                                        marginBottom: "14px", width: "100%", boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
                                    }}>
                                        <Row label="Current Balance:" value={`₱${currentBalance.toFixed(2)}`} valueColor="#16a34a" />
                                        <Row label="Item Cost:" value={`₱${totalCost.toFixed(2)}`} valueColor="#000" />
                                        <div style={{ width: '100%', height: '1px', background: '#e5e5e5', margin: '8px 0' }}></div>
                                        <Row
                                            label="Remaining:"
                                            value={`₱${remainingBalance.toFixed(2)}`}
                                            valueColor={remainingBalance < 0 ? "#ef4444" : "#16a34a"}
                                        />
                                    </div>

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
                                    <Keypad 
                                        onKeyPress={handleKeypadPress} 
                                        disabled={!studentData || loading || uiStatus !== "ELIGIBLE"} 
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}