import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "@/components/ui/input";
import { logout } from "../../functions/logoutAuth";

import { isSettingActive } from "../../functions/isSettingActive";
import { claimMeal } from "../../functions/foodServer/claimMeal";
import { fetchApprovedStudents } from "../../functions/foodServer/fetchApprovedStudents";

// 🟢 IMPORTS: For the Logout Modal
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Loader2 } from "lucide-react"; 

export default function FreeMealClaim() {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [pageDislay, setPageDisplay] = useState("Tap");
    const [mealClaimData, setMealClaimData] = useState({});

    const [allStudents, setAllStudents] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    // This state acts as the "Search Term" (can be ID or RFID)
    const [inputVal, setInputVal] = useState("");

    const [isSystemActive, setIsSystemActive] = useState(true);
    const [systemMessage, setSystemMessage] = useState("");

    // 🟢 STATE: For Logout Modal
    const [isLoggingOut, setIsLoggingOut] = useState(false); 
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const inputRef = useRef(null);
    const navigate = useNavigate();

    // 🟢 Async Logout Logic
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

    const handleScan = async (e) => {
        if (!isSystemActive) return;

        if (e.key === 'Enter') {
            e.preventDefault();

            const trimmedInput = inputVal.trim();
            if (!trimmedInput) return;

            const isRFID = /^\d+$/.test(trimmedInput);

            const foundIndex = allStudents.findIndex(s => {
                if (isRFID) {
                    return s.rfidTag === trimmedInput;
                } else {
                    return s.studentID?.toLowerCase() === trimmedInput.toLowerCase();
                }
            });

            if (foundIndex !== -1) {
                // Trigger API call in background
                await claimMeal(trimmedInput).catch((err) => {
                    console.error("Background API Claim Error:", err);
                });

                const updatedStudentList = [...allStudents];
                
                // 1. Get the student as they exist RIGHT NOW (e.g. ELIGIBLE)
                const originalStudentData = updatedStudentList[foundIndex]; 
                
                // 2. Set the display data immediately using a COPY of the original
                setMealClaimData({ ...originalStudentData }); 
                setPageDisplay(""); 

                // 3. Now handle the Logic Update for the next scan
                const currentStatus = originalStudentData.temporaryClaimStatus;

                if (currentStatus === "ELIGIBLE") {
                    // Create a NEW object for the list update to avoid mutating the display data
                    const updatedStudent = { 
                        ...originalStudentData, 
                        temporaryClaimStatus: "CLAIMED" 
                    };
                    
                    updatedStudentList[foundIndex] = updatedStudent;
                    setAllStudents(updatedStudentList);
                }

                // Reset UI
                setInputVal("");

                setTimeout(() => {
                    setPageDisplay("Tap");
                }, 3000);

            } else {
                alert(isRFID ? "RFID Tag not recognized." : "Student ID not found.");
                setInputVal("");
            }
        }
    };

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
                const statusResponse = await isSettingActive("STUDENT-CLAIM");
          
                // Handle the response safely, whether it's an object or a boolean
                if (statusResponse && typeof statusResponse === 'object') {
                    // If backend returns { isActive: false, message: "..." }
                    setIsSystemActive(statusResponse.isActive === true);
                    setSystemMessage(statusResponse.message || "System is closed.");
                } else {
                    // If backend literally just returns the boolean `false`
                    setIsSystemActive(statusResponse === true);
                    setSystemMessage(statusResponse ? "" : "System is currently disabled.");
                }
                
            } catch (error) {
                console.error("Failed to check status:", error);
                // Fail-safe: If the API crashes, lock the POS terminal
                setIsSystemActive(false); 
                setSystemMessage("Network Error. Cannot connect to settings.");
            }
        };

        loadData();
        checkSystemStatus();
    }, []); // EMPTY ARRAY: Guarantees this only fetches from the DB once!

    // =======================================================================
    // 🟢 EFFECT 2: The Clock and Input Focus 
    // =======================================================================
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 3500);

        // Only try to steal focus if the system is actually active
        if (inputRef.current && isSystemActive) {
            inputRef.current.focus();
        }

        return () => clearInterval(timer);
    }, [isSystemActive]); // Safely depends on isSystemActive

    const dateString = currentDateTime.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const dateOnlyString = currentDateTime.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
    const timeString = currentDateTime.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });

    return (
        <>
            {/* 🟢 FLOATING LOGOUT BUTTON: Anchored bottom-right */}
            <div style={{ position: "absolute", bottom: "20px", right: "20px", zIndex: 9000 }}>
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

            {pageDislay === "Tap" ? (
                <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>

                    <img
                        src="/studentClaim/Food-Server-Background.svg"
                        alt="Background"
                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, pointerEvents: "none" }}
                    />

                    <div style={{ position: "relative", zIndex: 10, height: "100%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <div style={{ display: "flex" }}>
                            <div style={{ height: "100vh", width: "55vw" }}>
                                <div style={{ width: "100%", height: "45%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 4 }}>
                                    <img src="/lv-logo.svg" alt="lv-logo" style={{ height: "110px", width: "110px" }} />
                                    <p style={{ fontWeight: 350 }} className="font-tolkien text-lg h-auto flex items-start text-white">LA VERDAD CHRISTIAN COLLEGE</p>
                                    <p className="font-tiroTamil text-white text-[1.5vh]">
                                        MacArthur Highway, Sampaloc, Apalit, Pampanga 2016
                                    </p>
                                </div>
                                <div style={{ width: "100%", height: "55%", display: "flex", justifyContent: "center", alignItems: "start" }}>

                                    <div style={{ position: "relative", width: "90%", height: "90%" }}>

                                        <img
                                            src="/studentClaim/claim-card.svg"
                                            alt="claim card"
                                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "contain", zIndex: 0 }}
                                        />

                                        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 10, display: "flex", justifyContent: "center", alignItems: "center" }}>
                                            <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "start", gap: 8 }}>

                                                <p className="font-geist text-lg text-white mb-1">Scan now or Input Student ID</p>

                                                <hr style={{ width: "70%", borderColor: "rgba(255,255,255,0.3)", margin: "0px 0px 25px 0px" }} />

                                                <div className="flex flex-col items-center text-white">
                                                    <p className="text-md font-geist" style={{ letterSpacing: '1px' }}>
                                                        {dateString.toUpperCase()}
                                                    </p>
                                                    <p className="text-6xl font-geist  mt-1" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.2)", marginBottom: "15px" }}>
                                                        {timeString}
                                                    </p>
                                                </div>

                                                <Input
                                                    ref={inputRef}
                                                    disabled={!isSystemActive || !isDataLoaded}
                                                    value={inputVal}
                                                    onChange={(e) => setInputVal(e.target.value)}
                                                    onKeyDown={handleScan}
                                                    autoFocus={isSystemActive}
                                                    style={{
                                                        background: (isSystemActive && isDataLoaded) ? '#FFFFFF' : '#e5e7eb',
                                                        width: '23vw',
                                                        height: '6vh',
                                                        paddingLeft: '5px',
                                                        font: 'geist',
                                                        margin: "0px 0px 10px 0px",
                                                        cursor: (isSystemActive && isDataLoaded) ? 'text' : 'not-allowed'
                                                    }}
                                                    type="text"
                                                    placeholder={
                                                        !isSystemActive ? (systemMessage || "Claim Disabled") :
                                                            !isDataLoaded ? "Loading Data..." :
                                                                "Student ID or RFID"
                                                    }
                                                />

                                                {!isSystemActive && (
                                                    <p className="text-red-300 font-geist text-sm">{systemMessage}</p>
                                                )}

                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div style={{ height: "100vh", width: "45vw" }}>
                                <div style={{ height: "15vh", width: "100%", display: "flex", justifyContent: "center", marginLeft: "40px" }}>
                                    <img src="/studentClaim/Free-Lunch-Label.svg" alt="free lunch label" />
                                </div>
                                <div style={{ height: "85vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "start" }}>
                                    <img src="/studentClaim/Food-Background.svg" alt="free lunch label" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            ) : (
                <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
                    <img
                        src="/studentClaim/Eligible.svg"
                        alt="Background"
                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, pointerEvents: "none" }}
                    />

                    <div style={{ position: "relative", zIndex: 10, height: "100%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "center" }}>

                        {mealClaimData.temporaryClaimStatus === "ELIGIBLE" ? (
                            <img src="/studentClaim/Eligible_Sinage.svg" alt="Eligible Sinage" style={{ width: "170px", height: "170px" }} />
                        ) : ""}
                        {mealClaimData.temporaryClaimStatus === "CLAIMED" ? (
                            <img src="/studentClaim/ALREADY_CLAIMED.svg" alt="Background" style={{ width: "190px", height: "190px" }} />
                        ) : ""}
                        {mealClaimData.temporaryClaimStatus === "INELGIBLE" ? (
                            <img src="/studentClaim/INELIGIBLE_SINAGE.svg" alt="ineligible sinage" style={{ width: "190px", height: "190px" }} />
                        ) : ""}

                        <div style={{ width: "100%", height: "55%", display: "flex", justifyContent: "center", alignItems: "start" }}>

                            <div style={{ position: "relative", width: "90%", height: "90%" }}>

                                {mealClaimData.section === 'BSIS' ? (
                                    <img src="/studentClaim/Card_Template_BSIS.svg" alt="claim card" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "contain", zIndex: 0 }} />
                                ) : mealClaimData.section === 'ACT' ? (
                                    <img src="/studentClaim/Card_Template_ACT.svg" alt="claim card" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "contain", zIndex: 0 }} />
                                ) : <img src="/studentClaim/Card_Template_Basic_Ed.svg" alt="claim card" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "contain", zIndex: 0 }} />}


                                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 10, display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "start", padding: "5px" }}>

                                        <div className="w-[45%] h-[20%] flex flex-row">
                                            <img src="lv-logo.svg" alt="lv-logo" style={{ height: "60px", width: "60px", margin: "5px 10px 5px 20px" }} />
                                            <div className="h-[100%] flex items-center">
                                                <p style={{ fontWeight: 400 }} className="font-geist text-md text-white">Eat's on Tap Validity Card</p>
                                            </div>
                                        </div>
                                        <div className="w-[45%] h-[80%]" style={{ paddingTop: "20px" }}>
                                            <div className="h-[100%] w-[100] flex items-center justify-between" style={{ marginLeft: "20px" }}>
                                                <div className="w-[100%] h-[100%] flex flex-row">
                                                    <div className="w-auto flex flex-col items-center gap-2">
                                                        <img src="/studentClaim/Default_Picture.jpg" alt="default picture" style={{ width: "160px", height: "160px" }} />
                                                        <p style={{ fontWeight: 400 }} className="font-geist text-[10px] text-white w-[160px]">
                                                            {dateOnlyString.toUpperCase()} | {timeString}
                                                        </p>
                                                    </div>
                                                    <div style={{ marginLeft: "20px", display: "flex", flexDirection: "column", gap: 20 }} className="h-[100%] flex flex-column justify-start">
                                                        <div>
                                                            <p style={{ fontWeight: 400 }} className="font-geist text-xl text-white">{mealClaimData.last_name}, {mealClaimData.first_name}</p>
                                                            <p style={{ fontWeight: 350 }} className="font-geist text-xs text-[#999797]">Student Name</p>
                                                        </div>
                                                        <div>
                                                            <p style={{ fontWeight: 400 }} className="font-geist text-xl text-white">{mealClaimData.section || mealClaimData.program} - {mealClaimData.year}</p>
                                                            <p style={{ fontWeight: 350 }} className="font-geist text-xs text-[#999797]">Section / Year</p>
                                                        </div>
                                                        <div>
                                                            <p style={{ fontWeight: 400 }} className="font-geist text-xl text-white">{mealClaimData.studentID}</p>
                                                            <p style={{ fontWeight: 350 }} className="font-geist text-xs text-[#999797]">StudentID</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    {mealClaimData.section === 'ACT' ? (
                                                        <img src="/studentClaim/logo-ACT.svg" alt='bsis-logo' style={{ width: "170px", height: "170px", paddingBottom: "10px" }} />

                                                    ) : mealClaimData.section === 'BSIS' ? (
                                                        <img src="/studentClaim/logo-BSIS.svg" alt='bsis-logo' style={{ width: "170px", height: "170px", paddingBottom: "10px" }} />
                                                    ) : <img src="lv-logo.svg" alt='bsis-logo' style={{ width: "170px", height: "170px", paddingBottom: "10px", paddingRight: "10px" }} />}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-[45%] h-[20%]">
                                            <p style={{ fontWeight: 350, marginLeft: "20px", paddingBottom: "10px" }} className="font-geist text-xs text-[#999797] w-[100%] h-[100%] flex items-end">
                                                Note: Non-transferable and valid for daily use only
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}