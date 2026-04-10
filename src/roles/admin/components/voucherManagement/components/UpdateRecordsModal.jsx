import React, { useState, useEffect } from 'react';
import { X, GraduationCap, ArrowUpCircle, CheckCircle, ChevronRight, School, BookOpen, AlertTriangle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../../../../context/DataContext'; 
import { promoteStudentsBulk } from '../../../../../functions/admin/promoteStudentsBulk';

export const UpdateRecordsModal = ({ isOpen, onClose }) => {
    const { sectionProgram } = useData(); 

    // State
    const [department, setDepartment] = useState(null); 
    const [completedSteps, setCompletedSteps] = useState([]); 
    const [isProcessing, setIsProcessing] = useState(false);
    const [sectionMappings, setSectionMappings] = useState({});

    // Reset state when opened
    useEffect(() => {
        if (isOpen) {
            setDepartment(null);
            setCompletedSteps([]);
            setIsProcessing(false);
            setSectionMappings({});
        }
    }, [isOpen]);

    // Extract available sections from context
    const allAvailableSections = sectionProgram?.data || [];

    // Helper to get sections for a specific year
    const getSectionsForYear = (year) => {
        return allAvailableSections.filter(s => s.year === String(year) && s.department === "Basic Education");
    };

    // --- THE STRICT TOP-DOWN ARRAYS ---
    const basicEdSteps = [
        { level: "12", action: "Graduate All", label: "Grade 12 (Graduating)", type: 'graduate' },
        { level: "11", action: "Promote mapped sections", label: "Grade 11", type: 'promote' },
        { level: "10", action: "Move Up All", label: "Grade 10 (Moving Up)", type: 'graduate' },
        { level: "9", action: "Promote mapped sections", label: "Grade 9", type: 'promote' },
        { level: "8", action: "Promote mapped sections", label: "Grade 8", type: 'promote' },
        { level: "7", action: "Promote mapped sections", label: "Grade 7", type: 'promote' },
        { level: "6", action: "Graduate All", label: "Grade 6 (Graduating)", type: 'graduate' },
        { level: "5", action: "Promote mapped sections", label: "Grade 5", type: 'promote' },
        { level: "4", action: "Promote mapped sections", label: "Grade 4", type: 'promote' },
        { level: "3", action: "Promote mapped sections", label: "Grade 3", type: 'promote' },
        { level: "2", action: "Promote mapped sections", label: "Grade 2", type: 'promote' },
        { level: "1", action: "Promote mapped sections", label: "Grade 1", type: 'promote' },
        { level: "0", action: "Move Up All", label: "Preschool / Grade 0", type: 'graduate' },
    ];

    const higherEdSteps = [
        { level: "4", action: "Graduate", label: "4th Year (Graduating)", type: 'graduate' },
        { level: "3", action: "Promote to 4th Year", label: "3rd Year", type: 'promote' },
        { level: "2", action: "Promote to 3rd Year", label: "2nd Year", type: 'promote' },
        { level: "1", action: "Promote to 2nd Year", label: "1st Year", type: 'promote' },
    ];

    const currentSteps = department === 'basic' ? basicEdSteps : higherEdSteps;

    // --- HANDLERS ---
    const handleMappingChange = (level, currentSection, targetSection) => {
        setSectionMappings(prev => ({
            ...prev,
            [level]: {
                ...(prev[level] || {}),
                [currentSection]: targetSection
            }
        }));
    };

    const handleProcessLevel = async (levelInfo, index) => {
        setIsProcessing(levelInfo.level);
        try {
            let targetLvl = "";
            if (levelInfo.type === 'promote' || (levelInfo.type === 'graduate' && levelInfo.action.includes('Move Up'))) {
                targetLvl = String(parseInt(levelInfo.level, 10) + 1);
            }

            // HIGHER ED OR GRADUATION
            if (department === 'higher' || levelInfo.type === 'graduate') {
                const payload = {
                    department: department,
                    currentLevel: levelInfo.level,
                    action: levelInfo.type, 
                    targetLevel: targetLvl
                };
                await promoteStudentsBulk(payload);
            } 
            // BASIC ED PROMOTION
            else {
                const levelMappings = sectionMappings[levelInfo.level] || {};
                const currentSectionsAvailable = getSectionsForYear(levelInfo.level);
                
                const promises = currentSectionsAvailable.map(currentSec => {
                    const targetSecName = levelMappings[currentSec.section];
                    if (!targetSecName) return Promise.resolve(); 

                    return promoteStudentsBulk({
                        department: 'basic',
                        currentLevel: levelInfo.level,
                        action: 'promote',
                        currentGroup: currentSec.section, 
                        targetLevel: targetLvl,
                        targetGroup: targetSecName  
                    }).catch(err => {
                        console.warn(`Skipped ${currentSec.section}:`, err.message);
                    });
                });

                await Promise.all(promises);
            }
            
            setCompletedSteps(prev => [...prev, levelInfo.level]);
        } catch (error) {
            alert(error.message || "Failed to update records for this level.");
        } finally {
            setIsProcessing(false);
        }
    };

    // --- RENDER HELPERS ---
    const renderBasicEdMapping = (levelInfo) => {
        const currentSections = getSectionsForYear(levelInfo.level);
        const targetLevel = String(parseInt(levelInfo.level, 10) + 1);
        const targetSections = getSectionsForYear(targetLevel);

        if (currentSections.length === 0) {
            return <p className="text-sm text-gray-500 italic border-t" style={{ marginTop: '12px', paddingTop: '12px' }}>No sections found for this grade level.</p>;
        }

        const currentMappings = sectionMappings[levelInfo.level] || {};
        const isFullyMapped = currentSections.every(sec => currentMappings[sec.section]);

        return (
            <div className="border-t border-gray-100" style={{ marginTop: '16px', paddingTop: '16px' }}>
                <p className="text-sm font-medium text-gray-700" style={{ marginBottom: '12px' }}>Map sections to Grade {targetLevel}:</p>
                <div className="flex flex-col" style={{ gap: '8px', marginBottom: '16px' }}>
                    {currentSections.map(sec => (
                        <div key={sec._id} className="flex items-center bg-gray-50 rounded-lg border border-gray-200" style={{ gap: '12px', padding: '8px' }}>
                            <span className="text-sm font-medium text-gray-700 w-1/3 truncate" title={sec.section}>
                                {sec.section}
                            </span>
                            <ArrowRight size={14} className="text-gray-400 shrink-0" />
                            <select
                                className="flex-1 text-sm border border-gray-300 rounded bg-white outline-none focus:ring-1 focus:ring-blue-500"
                                style={{ padding: '6px' }}
                                value={currentMappings[sec.section] || ""}
                                onChange={(e) => handleMappingChange(levelInfo.level, sec.section, e.target.value)}
                            >
                                <option value="" disabled>Select Target Section...</option>
                                {targetSections.map(tSec => (
                                    <option key={tSec._id} value={tSec.section}>{tSec.section}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end">
                    <button
                        disabled={!isFullyMapped || isProcessing === levelInfo.level}
                        onClick={() => handleProcessLevel(levelInfo)}
                        className={`text-sm font-medium rounded-lg flex items-center transition-all ${
                            !isFullyMapped ? 'bg-gray-200 text-gray-400 cursor-not-allowed' :
                            isProcessing === levelInfo.level ? 'bg-blue-100 text-blue-700 cursor-wait' :
                            'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                        }`}
                        style={{ padding: '8px 16px', gap: '8px' }}
                    >
                        {isProcessing === levelInfo.level ? 'Processing...' : levelInfo.action}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm bg-black/50" 
                    onClick={onClose}
                >
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 10 }}
                        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col transform" 
                        onClick={(e) => e.stopPropagation()} 
                        style={{ maxHeight: '90vh', fontFamily: "inherit" }}
                    >
                        
                        {/* Header */}
                        <div className="flex justify-between items-center border-b border-gray-100" style={{ padding: '24px' }}>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 flex items-center" style={{ gap: '8px' }}>
                                    Academic Year Rollover
                                </h2>
                                <p className="text-sm text-gray-500" style={{ marginTop: '4px' }}>Map sections and promote top-down to prevent data collision.</p>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors" style={{ padding: '8px' }}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="overflow-y-auto flex-1 bg-gray-50" style={{ padding: '24px' }}>
                            <AnimatePresence mode="wait">
                                
                                {/* STEP 1: SELECT DEPARTMENT */}
                                {!department && (
                                    <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="grid grid-cols-2" style={{ gap: '16px' }}>
                                        <button onClick={() => setDepartment('basic')} className="flex flex-col items-center justify-center bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group" style={{ padding: '32px' }}>
                                            <School size={48} className="text-gray-400 group-hover:text-blue-500" style={{ marginBottom: '16px' }} />
                                            <span className="text-lg font-medium text-gray-900">Basic Education</span>
                                            <span className="text-sm text-gray-500" style={{ marginTop: '8px' }}>Grades 0 to 12</span>
                                        </button>

                                        <button onClick={() => setDepartment('higher')} className="flex flex-col items-center justify-center bg-white border-2 border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group" style={{ padding: '32px' }}>
                                            <BookOpen size={48} className="text-gray-400 group-hover:text-emerald-500" style={{ marginBottom: '16px' }} />
                                            <span className="text-lg font-medium text-gray-900">Higher Education</span>
                                            <span className="text-sm text-gray-500" style={{ marginTop: '8px' }}>Years 1 to 4</span>
                                        </button>
                                    </motion.div>
                                )}

                                {/* STEP 2: THE TOP-DOWN CHECKLIST */}
                                {department && (
                                    <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col" style={{ gap: '12px' }}>
                                        <div className="flex items-center text-amber-600 bg-amber-50 rounded-lg border border-amber-200" style={{ gap: '8px', marginBottom: '16px', padding: '16px' }}>
                                            <AlertTriangle size={20} />
                                            <span className="text-sm font-medium">You must complete these in order from top to bottom. Basic Education requires explicit section mapping.</span>
                                        </div>

                                        {currentSteps.map((stepInfo, index) => {
                                            const isCompleted = completedSteps.includes(stepInfo.level);
                                            const isUnlocked = index === 0 || completedSteps.includes(currentSteps[index - 1].level);
                                            const isCurrentlyProcessing = isProcessing === stepInfo.level;
                                            
                                            const showMappingUI = department === 'basic' && stepInfo.type === 'promote' && isUnlocked && !isCompleted;

                                            return (
                                                <div 
                                                    key={stepInfo.level} 
                                                    className={`flex flex-col rounded-xl border ${isCompleted ? 'bg-green-50 border-green-200' : isUnlocked ? 'bg-white border-blue-200 shadow-sm' : 'bg-gray-100 border-gray-200 opacity-60'}`}
                                                    style={{ padding: '16px' }}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center" style={{ gap: '16px' }}>
                                                            {isCompleted ? (
                                                                <CheckCircle className="text-green-500" size={24} />
                                                            ) : stepInfo.type === 'graduate' ? (
                                                                <GraduationCap className={isUnlocked ? "text-amber-500" : "text-gray-400"} size={24} />
                                                            ) : (
                                                                <ArrowUpCircle className={isUnlocked ? "text-blue-500" : "text-gray-400"} size={24} />
                                                            )}
                                                            <div>
                                                                <p className={`font-medium ${isCompleted ? 'text-green-800' : 'text-gray-900'}`}>{stepInfo.label}</p>
                                                                <p className="text-xs text-gray-500">
                                                                    {isCompleted ? 'Successfully processed' : isUnlocked ? (showMappingUI ? 'Map sections to continue' : 'Ready for processing') : 'Locked - Complete previous level first'}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {!showMappingUI && (
                                                            <button
                                                                disabled={!isUnlocked || isCompleted || isCurrentlyProcessing}
                                                                onClick={() => handleProcessLevel(stepInfo, index)}
                                                                className={`text-sm font-medium rounded-lg flex items-center transition-all ${
                                                                    isCompleted ? 'bg-green-100 text-green-700 cursor-default' :
                                                                    isCurrentlyProcessing ? 'bg-blue-100 text-blue-700 cursor-wait' :
                                                                    isUnlocked ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' :
                                                                    'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                                }`}
                                                                style={{ padding: '8px 16px', gap: '8px' }}
                                                            >
                                                                {isCurrentlyProcessing ? 'Processing...' : isCompleted ? 'Done' : stepInfo.action}
                                                                {!isCompleted && !isCurrentlyProcessing && <ChevronRight size={16} />}
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* Expandable Mapping UI */}
                                                    {showMappingUI && renderBasicEdMapping(stepInfo)}
                                                </div>
                                            );
                                        })}

                                        {completedSteps.length === currentSteps.length && (
                                            <div className="bg-green-100 border border-green-300 rounded-xl text-center animate-in fade-in zoom-in duration-500" style={{ marginTop: '16px', padding: '24px' }}>
                                                <h3 className="text-green-800 font-bold text-lg">Rollover Complete!</h3>
                                                <p className="text-green-700 text-sm" style={{ marginTop: '4px' }}>All students in this department have been successfully updated.</p>
                                                <button onClick={onClose} className="bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium" style={{ marginTop: '16px', padding: '8px 24px' }}>Close Window</button>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};