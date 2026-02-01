import React, { useState, useMemo, useEffect } from 'react';
import { AlertCircle, Hash, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { GenericTable } from '../../../components/global/table/GenericTable';
import { getAllProgramSchedule } from "../../../functions/adminAssistant/getAllProgramSchedule";

// 🟢 IMPORT THE ACTION BAR
import { SelectionActionBar } from '../../admin/components/voucherManagement/SelectionActionBar';

// --- CONFIGURATION ---
const ITEM_HEIGHT_ESTIMATE_PX = 50;

const cellStyle = {
    fontSize: '12px',
    color: '#4b5563',
    borderBottom: '1px solid #f3f4f6',
    height: '50px',
    verticalAlign: 'middle'
};

// --- EDIT SCHEDULE MODAL ---
const EditScheduleModal = ({ isOpen, onClose, program, onSave }) => {
  // --- STATE & DATA ---
  const daysOptions = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const [selectedDays, setSelectedDays] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state with program data
  useEffect(() => {
    if (isOpen && program && program.dayOfWeek) {
      setSelectedDays([...program.dayOfWeek]);
    } else {
      setSelectedDays([]);
    }
  }, [isOpen, program]);

  // Handlers
  const toggleDay = (dayConstant) => {
    if (selectedDays.includes(dayConstant)) {
      setSelectedDays(selectedDays.filter((d) => d !== dayConstant));
    } else {
      setSelectedDays([...selectedDays, dayConstant]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API
    onSave({ ...program, dayOfWeek: selectedDays });
    setIsSaving(false);
    onClose();
  };

  const formatDayLabel = (day) => {
    return day.charAt(0) + day.slice(1).toLowerCase();
  };

  function getOrdinalSuffix(i) {
    const j = i % 10,
      k = i % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
  }

  // 🟢 REMOVE THE "if (!isOpen) return null" LINE.
  // The rendering logic is now handled inside AnimatePresence below.

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9600,
          }}
        >
          {/* Backdrop */}
          <div
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
            }}
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20, transition: { duration: 0.2 } }}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              boxShadow:
                '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
              width: '100%',
              maxWidth: '448px',
              overflow: 'hidden',
              position: 'relative',
              zIndex: 10,
              padding: '24px',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#1F2937',
                    fontFamily: 'Geist, sans-serif',
                  }}
                >
                  Edit Schedule
                </h3>

                <p
                  style={{
                    fontSize: '14px',
                    color: '#6B7280',
                    fontFamily: 'Geist, sans-serif',
                  }}
                >
                  {program?.programName} - {program?.year}
                  {getOrdinalSuffix(program?.year)} Year
                </p>
              </div>

              <button
                onClick={onClose}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9CA3AF',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#4B5563')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#9CA3AF')}
              >
                <X size={20} />
              </button>
            </div>

            {/* Days Selection */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#374151',
                  marginBottom: '8px',
                  fontFamily: 'Geist, sans-serif',
                }}
              >
                Select Eligible Days
              </label>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '12px',
                }}
              >
                {daysOptions.map((dayConstant, idx) => {
                  const isSelected = selectedDays.includes(dayConstant);

                  return (
                    <div
                      key={idx}
                      onClick={() => toggleDay(dayConstant)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        border: isSelected
                          ? '1px solid #BFDBFE' // blue-200
                          : '1px solid #F3F4F6', // gray-100
                        backgroundColor: isSelected
                          ? '#EFF6FF' // blue-50
                          : '#FFFFFF',
                        boxShadow: isSelected
                          ? '0 1px 2px rgba(0,0,0,0.05)'
                          : 'none',
                        height: '40px',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = '#F9FAFB';
                          e.currentTarget.style.border = '1px solid #D1D5DB';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = '#FFFFFF';
                          e.currentTarget.style.border = '1px solid #F3F4F6';
                        }
                      }}
                    >
                      {/* Checkbox */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '32px',
                          flexShrink: 0,
                          marginRight: '8px',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          readOnly
                          style={{
                            width: '16px',
                            height: '16px',
                            cursor: 'pointer',
                            accentColor: '#2563EB',
                          }}
                        />
                      </div>

                      {/* Label */}
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 500,
                          fontFamily: 'Geist, sans-serif',
                          color: isSelected ? '#1E40AF' : '#111827',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {formatDayLabel(dayConstant)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                paddingTop: '16px',
                borderTop: '1px solid #F3F4F6',
              }}
            >
              {/* Cancel */}
              <button
                onClick={onClose}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#4B5563',
                  backgroundColor: 'transparent',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Geist, sans-serif',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = '#F3F4F6')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = 'transparent')
                }
              >
                Cancel
              </button>

              {/* Save */}
              <button
                onClick={handleSave}
                disabled={isSaving}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#FFFFFF',
                  backgroundColor: isSaving ? '#93C5FD' : '#2563EB',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  fontFamily: 'Geist, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isSaving)
                    e.currentTarget.style.backgroundColor = '#1D4ED8';
                }}
                onMouseLeave={(e) => {
                  if (!isSaving)
                    e.currentTarget.style.backgroundColor = '#2563EB';
                }}
              >
                {isSaving && (
                  <Loader2
                    size={14}
                    style={{
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                )}
                Save Changes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ProgramListView = ({ switcher }) => {
    // --- STATE ---
    const [schedules, setSchedules] = useState([]);
    const [activeTab, setActiveTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Selection State
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [isActionBarVisible, setIsActionBarVisible] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // --- FETCH LOGIC ---
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await getAllProgramSchedule();
            if (Array.isArray(response)) {
                setSchedules(response);
            } else if (response && Array.isArray(response.data)) {
                setSchedules(response.data);
            } else {
                setSchedules([]);
            }
        } catch (error) {
            console.error("Failed to load program schedules", error);
            setSchedules([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- DYNAMIC TABS ---
    const tabs = useMemo(() => {
        const allTabs = [{ id: 'All', label: 'All Levels' }];
        const uniqueYears = [...new Set(schedules.map(s => s.year))].sort();
        const yearTabs = uniqueYears.map(year => ({
            id: year,
            label: `${year}${getOrdinalSuffix(year)} Year`
        }));
        return [...allTabs, ...yearTabs];
    }, [schedules]);

    // --- FILTER LOGIC ---
    const filteredSchedules = useMemo(() => {
        return schedules.filter(item => {
            const programName = (item.programName || '').toUpperCase();
            const year = item.year || '';
            let matchesTab = true;
            if (activeTab !== 'All') {
                matchesTab = year === activeTab;
            }
            const matchesSearch = programName.includes(searchTerm.toUpperCase());
            return matchesTab && matchesSearch;
        });
    }, [schedules, activeTab, searchTerm]);

    // --- ROW RENDERER ---
    const renderRow = (item, index, startIndex) => {
        const isSelected = selectedProgram?._id === item._id;

        return (
            <tr
                key={item._id || index}
                onClick={() => {
                    if (isSelected) {
                        setSelectedProgram(null);
                        setIsActionBarVisible(false);
                    } else {
                        setSelectedProgram(item);
                        setIsActionBarVisible(true);
                    }
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    height: ITEM_HEIGHT_ESTIMATE_PX,
                    backgroundColor: isSelected ? "#eff6ff" : (isHovered ? "rgba(249, 250, 251, 0.8)" : "transparent"),
                    transition: "background-color 0.2s ease",
                    cursor: "pointer"
                }}
            >
                <td style={{ ...cellStyle, textAlign: "center", width: "64px" }}>
                    {startIndex + index + 1}
                </td>
                <td style={{ ...cellStyle, paddingLeft: "24px", paddingRight: "24px", fontWeight: 600, color: "#111827" }}>
                    <div style={{ display: "flex", alignItems: "start", justifyContent: "start", gap: "12px" }}>
                        {item.programName}
                    </div>
                </td>
                <td style={{ ...cellStyle, paddingLeft: "24px", paddingRight: "24px" }}>
                    <span style={{ fontFamily: "monospace", fontSize: "11px", backgroundColor: "#F3F4F6", padding: "4px 8px", borderRadius: "4px", color: "#4B5563", border: "1px solid #E5E7EB", display: "inline-block" }}>
                        {getOrdinalSuffix(item.year)} Year
                    </span>
                </td>
                <td style={{ ...cellStyle, paddingLeft: "24px", paddingRight: "24px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                        {item.dayOfWeek && item.dayOfWeek.length > 0 ? (
                            item.dayOfWeek.map((day, idx) => (
                                <DayBadge key={idx} day={day} />
                            ))
                        ) : (
                            <span style={{ color: "#9CA3AF", fontStyle: "italic", fontSize: "11px" }}>
                                No schedule
                            </span>
                        )}
                    </div>
                </td>
            </tr>
        );
    };

    const columns = ['Program Name', 'Year Level', 'Scheduled Days'];
    const metrics = [
        { label: 'Total Programs', value: schedules.length },
        { label: 'Visible', value: filteredSchedules.length, color: '#4268BD' }
    ];

    return (
        <div style={{ width: '100%', height: '100%' }}>

            {/* EDIT MODAL */}
            <EditScheduleModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                program={selectedProgram}
                onSave={(updatedProgram) => {
                    const updatedList = schedules.map(p => p._id === updatedProgram._id ? updatedProgram : p);
                    setSchedules(updatedList);
                    setSelectedProgram(updatedProgram);
                }}
            />

            <GenericTable
                title="Program Schedules"
                subtitle="Manage meal eligibility days per program"
                data={filteredSchedules}
                columns={columns}
                renderRow={renderRow}
                metrics={metrics}
                primaryKey="_id"
                isLoading={isLoading}
                emptyMessage="No schedules found"
                emptyMessageIcon={<AlertCircle size={30} strokeWidth={1.5} />}
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={(tab) => { setActiveTab(tab); setSelectedProgram(null); setIsActionBarVisible(false); }}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                customActions={switcher}
                selectable={false}
                minItems={6}

                // 🟢 FIX: CONDITIONAL RENDERING OF ACTION BAR
                overrideHeader={
                    isActionBarVisible && selectedProgram ? (
                        <SelectionActionBar
                            variant="program" // 🟢 Use new program variant
                            selectedItem={selectedProgram}
                            onClearSelection={() => {
                                setSelectedProgram(null);
                                setIsActionBarVisible(false);
                            }}
                            onEditSchedule={() => setIsEditModalOpen(true)}
                        />
                    ) : null
                }
            />
        </div>
    );
};

// --- HELPER COMPONENTS ---
const DayBadge = ({ day }) => {
    const dayMap = {
        'MONDAY': 'Mon', 'TUESDAY': 'Tue', 'WEDNESDAY': 'Wed',
        'THURSDAY': 'Thu', 'FRIDAY': 'Fri', 'SATURDAY': 'Sat', 'SUNDAY': 'Sun'
    };
    const shortDay = dayMap[day.toUpperCase()] || day;
    return (
        <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', backgroundColor: '#EFF6FF', color: '#2563EB', border: '1px solid #DBEAFE', textTransform: 'uppercase' }}>
            {shortDay}
        </span>
    );
};

function getOrdinalSuffix(i) {
    const j = i % 10, k = i % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
}

export { ProgramListView };