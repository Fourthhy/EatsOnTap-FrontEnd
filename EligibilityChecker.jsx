import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "./src/components/ui/button";
import { Input } from "@/components/ui/input";

import { isSettingActive } from "./src/functions/isSettingActive";
import { fetchApprovedStudents } from "./src/functions/foodServer/fetchApprovedStudents";

import { Search, ArrowLeft } from "lucide-react"; 

export default function EligibilityChecker() {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    
    // 🟢 Unified State for the Checker
    const [studentData, setStudentData] = useState(null);
    const [uiStatus, setUiStatus] = useState("NONE"); // "NONE", "ELIGIBLE", "CLAIMED", "INELIGIBLE"

    const [allStudents, setAllStudents] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    // Search Input
    const [inputVal, setInputVal] = useState("");

    const [isSystemActive, setIsSystemActive] = useState(true);
    const [systemMessage, setSystemMessage] = useState("");

    const inputRef = useRef(null);
    const resetTimerRef = useRef(null);
    const navigate = useNavigate();

    // 🟢 The Checker Logic (Read-Only)
    const handleCheck = () => {
        if (!isSystemActive || !isDataLoaded) return;

        const trimmedInput = inputVal.trim();
        if (!trimmedInput) return;

        const isRFID = /^\d+$/.test(trimmedInput);

        const foundStudent = allStudents.find(s => {
            if (isRFID) {
                return s.rfidTag === trimmedInput;
            } else {
                return s.studentID?.toLowerCase() === trimmedInput.toLowerCase();
            }
        });

        if (foundStudent) {
            setStudentData(foundStudent);
            
            // Determine exact status (Handle edge case if balance is 0 but status says ELIGIBLE)
            if (foundStudent.temporaryClaimStatus === "ELIGIBLE" && foundStudent.temporaryCreditBalance <= 0) {
                setUiStatus("CLAIMED");
            } else {
                setUiStatus(foundStudent.temporaryClaimStatus);
            }

        } else {
            // If they aren't in the approved list, they are ineligible.
            setStudentData({
                first_name: "Unknown",
                last_name: "Student",
                section: "N/A",
                year: "N/A",
                studentID: trimmedInput
            });
            setUiStatus("INELIGIBLE");
        }

        // Clear the input field immediately for the next scan
        setInputVal("");

        // Clear previous timer if they scan fast, then set a new one
        if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
        
        resetTimerRef.current = setTimeout(() => {
            setStudentData(null);
            setUiStatus("NONE");
            if (inputRef.current && isSystemActive) inputRef.current.focus();
        }, 4000); // 4 seconds to read the screen before resetting
    };

    // Handle Enter Key inside Input
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleCheck();
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
    }, []); 

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

        return () => {
            clearInterval(timer);
            if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
        };
    }, [isSystemActive]);

    const dateOnlyString = currentDateTime.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
    const timeString = currentDateTime.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });

    return (
        <>
            {/* 🟢 FLOATING GO BACK BUTTON */}
            <div style={{ position: "absolute", bottom: "20px", right: "20px", zIndex: 9000 }}>
                <Button 
                    onClick={() => navigate(-1)} 
                    style={{ 
                        backgroundColor: "#2563EB", // Vibrant Blue
                        color: "#FFFFFF",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)", 
                        padding: "10px 20px",
                        display: "flex",
                        alignItems: "center"
                    }}
                >
                    <ArrowLeft size={18} style={{ marginRight: "8px" }} />
                    Go back
                </Button>
            </div>

            {/* 🟢 MAIN UNIFIED UI */}
            <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
                
                {/* Background Image */}
                <img
                    src="/studentClaim/Eligible.svg"
                    alt="Background"
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, pointerEvents: "none" }}
                />

                <div style={{ position: "relative", zIndex: 10, height: "100%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "center" }}>

                    {/* 1. STATUS SIGN SPACE (Reserves exact height so UI doesn't jump) */}
                    <div style={{ height: "200px", width: "100%", display: "flex", justifyContent: "center", alignItems: "end", paddingBottom: "10px" }}>
                        {uiStatus === "ELIGIBLE" && <img src="/studentClaim/Eligible_Sinage.svg" alt="Eligible" style={{ width: "170px", height: "170px" }} />}
                        {uiStatus === "CLAIMED" && <img src="/studentClaim/ALREADY_CLAIMED.svg" alt="Claimed" style={{ width: "190px", height: "190px" }} />}
                        {uiStatus === "INELIGIBLE" && <img src="/studentClaim/INELIGIBLE_SINAGE.svg" alt="Ineligible" style={{ width: "190px", height: "190px" }} />}
                    </div>

                    {/* 2. THE ELIGIBILITY CARD (Dynamic or Empty Placeholder) */}
                    <div style={{ width: "100%", height: "55vh", display: "flex", justifyContent: "center", alignItems: "start" }}>
                        <div style={{ position: "relative", width: "90%", maxWidth: "800px", height: "90%" }}>

                            {/* Card Base Logic */}
                            {studentData?.section === 'BSIS' ? (
                                <img src="/studentClaim/Card_Template_BSIS.svg" alt="claim card" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "contain", zIndex: 0 }} />
                            ) : studentData?.section === 'ACT' ? (
                                <img src="/studentClaim/Card_Template_ACT.svg" alt="claim card" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "contain", zIndex: 0 }} />
                            ) : (
                                <img src="/studentClaim/Card_Template_Basic_Ed.svg" alt="claim card" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "contain", zIndex: 0 }} />
                            )}

                            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 10, display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "start", padding: "5px" }}>

                                    <div className="w-[45%] h-[20%] flex flex-row">
                                        <img src="lv-logo.svg" alt="lv-logo" style={{ height: "60px", width: "60px", margin: "5px 10px 5px 20px" }} />
                                        <div className="h-[100%] flex items-center">
                                            <p style={{ fontWeight: 400 }} className="font-geist text-md text-white">Eligibility Checker</p>
                                        </div>
                                    </div>
                                    
                                    <div className="w-[45%] h-[80%]" style={{ paddingTop: "20px" }}>
                                        <div className="h-[100%] w-[100] flex items-center justify-between" style={{ marginLeft: "20px" }}>
                                            <div className="w-[100%] h-[100%] flex flex-row">
                                                <div className="w-auto flex flex-col items-center gap-2">
                                                    <img src="/studentClaim/Default_Picture.jpg" alt="default picture" style={{ width: "160px", height: "160px" }} />
                                                    <p style={{ fontWeight: 400 }} className="font-geist text-[10px] text-white w-[160px] text-center">
                                                        {dateOnlyString.toUpperCase()} | {timeString}
                                                    </p>
                                                </div>
                                                <div style={{ marginLeft: "20px", display: "flex", flexDirection: "column", gap: 20 }} className="h-[100%] flex flex-column justify-start">
                                                    <div>
                                                        <p style={{ fontWeight: 400 }} className="font-geist text-xl text-white">
                                                            {studentData ? `${studentData.last_name}, ${studentData.first_name}` : "-------"}
                                                        </p>
                                                        <p style={{ fontWeight: 350 }} className="font-geist text-xs text-[#999797]">Student Name</p>
                                                    </div>
                                                    <div>
                                                        <p style={{ fontWeight: 400 }} className="font-geist text-xl text-white">
                                                            {studentData ? `${studentData.section || studentData.program} - ${studentData.year}` : "-------"}
                                                        </p>
                                                        <p style={{ fontWeight: 350 }} className="font-geist text-xs text-[#999797]">Section / Year</p>
                                                    </div>
                                                    <div>
                                                        <p style={{ fontWeight: 400 }} className="font-geist text-xl text-white">
                                                            {studentData ? studentData.studentID : "-------"}
                                                        </p>
                                                        <p style={{ fontWeight: 350 }} className="font-geist text-xs text-[#999797]">StudentID</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                {studentData?.section === 'ACT' ? (
                                                    <img src="/studentClaim/logo-ACT.svg" alt='logo' style={{ width: "170px", height: "170px", paddingBottom: "10px" }} />
                                                ) : studentData?.section === 'BSIS' ? (
                                                    <img src="/studentClaim/logo-BSIS.svg" alt='logo' style={{ width: "170px", height: "170px", paddingBottom: "10px" }} />
                                                ) : (
                                                    <img src="lv-logo.svg" alt='logo' style={{ width: "170px", height: "170px", paddingBottom: "10px", paddingRight: "10px" }} />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-[45%] h-[20%]">
                                        <p style={{ fontWeight: 350, marginLeft: "20px", paddingBottom: "10px" }} className="font-geist text-xs text-[#999797] w-[100%] h-[100%] flex items-end">
                                            Verification Terminal Only - No Deductions Applied
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. THE FIXED INPUT BAR (Bottom Center) */}
                    <div style={{ marginTop: "10px", display: "flex", justifyContent: "center", width: "100%", zIndex: 20 }}>
                        <div style={{ 
                            background: "rgba(255, 255, 255, 0.9)", 
                            backdropFilter: "blur(10px)", 
                            padding: "16px 24px", 
                            borderRadius: "16px", 
                            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                            display: "flex", 
                            flexDirection: "column",
                            gap: "12px",
                            alignItems: "center"
                        }}>
                            {!isSystemActive && (
                                <p className="text-red-500 font-geist font-semibold text-sm">{systemMessage}</p>
                            )}
                            
                            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                <Input
                                    ref={inputRef}
                                    type="text"
                                    value={inputVal}
                                    onChange={(e) => setInputVal(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={!isSystemActive || !isDataLoaded}
                                    autoFocus={isSystemActive}
                                    placeholder={
                                        !isSystemActive ? "Disabled" :
                                        !isDataLoaded ? "Loading Data..." :
                                        "Tap RFID or Type Student ID"
                                    }
                                    style={{
                                        background: (isSystemActive && isDataLoaded) ? '#FFFFFF' : '#e5e7eb',
                                        width: '350px',
                                        height: '56px',
                                        fontSize: '18px',
                                        textAlign: 'center',
                                        borderRadius: '12px',
                                        border: '1px solid #d1d5db',
                                        cursor: (isSystemActive && isDataLoaded) ? 'text' : 'not-allowed'
                                    }}
                                />
                                <Button 
                                    onClick={handleCheck} 
                                    disabled={!isSystemActive || !isDataLoaded || !inputVal.trim()}
                                    style={{ height: '56px', borderRadius: '12px', fontSize: '16px', padding: '0 24px' }}
                                >
                                    <Search className="mr-2 h-5 w-5" />
                                    Check Status
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}