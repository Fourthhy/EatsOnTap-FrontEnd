import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"


function EligibilityScheduler() {
    const [selectedValue, setSelectedValue] = useState('');

    function SubmissionTypeDropdown() {

        // Options for select
        const options = [
            { label: 'Meal Eligibility Request', value: 'mealEligibility' },
            { label: 'Event Meal Request', value: 'eventMeal' },
        ];



        // Find the selected option's label for display in the button
        const selectedOption = options.find(option => option.value === selectedValue);
        const buttonText = selectedOption ? selectedOption.label : 'Select a Request Type';



        return (
            <>
                <div style={{
                    width: 'full',
                    height: 'full',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {/* HEADER */}
                    <h1 style={{ fontFamily: 'geist', fontSize: '1rem', fontWeight: 450 }}>Submission Type</h1>

                    <div className="font-geist">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full">
                                    {/* Display the human-readable label */}
                                    {buttonText}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[200px]">
                                {options.map((option) => (
                                    <DropdownMenuItem
                                        style={{ padding: "10px 20px" }}
                                        key={option.value}
                                        // FIX: Use an arrow function to set the state 
                                        // with the correct value when the item is selected.
                                        onSelect={() => setSelectedValue(option.value)}
                                        // Prevents the menu from closing when selecting the placeholder/empty option
                                        // This is often helpful for initial states.
                                        {...(option.value === '' && { onSelect: (e) => e.preventDefault() })}
                                    >
                                        <span>
                                            {option.label}
                                        </span>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                </div>
            </>
        )
    }

    function EventForm() {
        return (
            <>
                <div className="w-full flex flex-col gap-2">
                    <Input placeholder="Event Name" type="text" />
                    <Input placeholder="Event Date" type="Date" />
                </div>
            </>
        )
    }

    function MealRequestForm() {
        const daysOfWeek = [
            { label: 'Monday', value: 'monday' },
            { label: 'Tuesday', value: 'tuesday' },
            { label: 'Wednesday', value: 'wednesday' },
            { label: 'Thursday', value: 'thursday' },
            { label: 'Friday', value: 'friday' },
            { label: 'Saturday', value: 'saturday' },
        ];

        const selectedDay = daysOfWeek.find(option => option.value === selectedValue);
        const dayButtonText = selectedDay ? selectedDay.label : 'Select a Day';
        return (
            <div className="font-geist">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full">
                            {/* Display the human-readable label */}
                            {dayButtonText}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[200px]">
                        {daysOfWeek.map((option) => (
                            <DropdownMenuItem
                                style={{ padding: "10px 20px" }}
                                key={option.value}
                                // FIX: Use an arrow function to set the state 
                                // with the correct value when the item is selected.
                                onSelect={() => setSelectedValue(option.value)}
                                // Prevents the menu from closing when selecting the placeholder/empty option
                                // This is often helpful for initial states.
                                {...(option.value === '' && { onSelect: (e) => e.preventDefault() })}
                            >
                                <span>
                                    {option.label}
                                </span>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        )
    }

    const EligibleProgramsForm = () => {
        const ALL_PROGRAM_CODES = [
            "BSSW 1", "BSSW 2", "BSSW 3", "BSSW 4",
            "BSA 1", "BSA 2", "BSA 3", "BSA 4",
            "BSAIS 1", "BSAIS 2", "BSAIS 3", "BSAIS 4",
            "BAB 1", "BAB 2", "BAB 3", "BAB 4",
            "BSIS 1", "BSIS 2", "BSIS 3", "BSIS 4",
            "ACT 1", "ACT 2", "ACT 3", "ACT 4",
        ];

        // Default selected (same as before)
        const [checkedPrograms, setCheckedPrograms] = useState({});

        const programs = ["BSSW", "BSA", "BSAIS", "BAB", "BSIS", "ACT"];
        const years = [1, 2, 3, 4];

        const globalStyle = {
            fontFamily: "geist",
            fontSize: "0.80rem",
            fontWeight: 500
        };

        // Handle single checkbox toggle
        const handleCheckboxChange = (programId) => {
            setCheckedPrograms((prev) => ({
                ...prev,
                [programId]: !prev[programId],
            }));
        };

        // 🔥 Select All toggle
        const isAllSelected = ALL_PROGRAM_CODES.every(
            (code) => checkedPrograms[code]
        );

        const toggleSelectAll = () => {
            if (isAllSelected) {
                // Uncheck ALL
                setCheckedPrograms({});
            } else {
                // Check ALL
                const allChecked = {};
                ALL_PROGRAM_CODES.forEach((code) => {
                    allChecked[code] = true;
                });
                setCheckedPrograms(allChecked);
            }
        };

        const renderCheckbox = (programCode, year) => {
            const programId = `${programCode} ${year}`;
            if (!ALL_PROGRAM_CODES.includes(programId)) return null;

            const isChecked = !!checkedPrograms[programId];

            return (
                <div
                    key={programId}
                    style={{
                        ...globalStyle,
                        marginRight: "1.5rem",
                        marginBottom: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <input
                        type="checkbox"
                        id={programId}
                        checked={isChecked}
                        onChange={() => handleCheckboxChange(programId)}
                        style={{
                            marginRight: "0.5rem",
                            width: "18px",
                            height: "18px",
                            accentColor: isChecked ? "#1976D2" : "inherit",
                            cursor: "pointer",
                        }}
                    />
                    <label htmlFor={programId} style={{ ...globalStyle }}>
                        {programId}
                    </label>
                </div>
            );
        };

        return (
            <div
                style={{
                    ...globalStyle,
                    backgroundColor: "#E6F0FF",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    maxWidth: "fit-content",
                }}
            >
                <h3
                    style={{
                        ...globalStyle,
                        color: "#232323",
                        marginBottom: "15px",
                        fontWeight: "normal",
                        fontSize: "1rem",
                        fontFamily: "geist",
                    }}
                >
                    Eligible Programs
                </h3>

                {/* 🔥 SELECT ALL CHECKBOX */}
                <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center" }}>
                    <input
                        type="checkbox"
                        id="selectAll"
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                        style={{
                            marginRight: "0.5rem",
                            width: "18px",
                            height: "18px",
                            cursor: "pointer",
                            accentColor: isAllSelected ? "#1976D2" : "inherit",
                        }}
                    />
                    <label htmlFor="selectAll" style={{ ...globalStyle }}>
                        Select All Programs
                    </label>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
                    {programs.map((program) => (
                        <div key={program} style={{ display: "flex", flexDirection: "column" }}>
                            {years.map((year) => renderCheckbox(program, year))}
                        </div>
                    ))}
                </div>
            </div>
        );
    };


    return (
        <>
            <div className="w-full h-[calc(100vh-90px)] flex items-center p-6 font-geist text-gray-900 overflow-hidden">
                <div className="bg-white rounded-md shadow-sm border border-gray-200 flex flex-col flex-1 min-h-0 overflow-hidden">
                    
                </div>
            </div>
        </>
    )
}

export { EligibilityScheduler }