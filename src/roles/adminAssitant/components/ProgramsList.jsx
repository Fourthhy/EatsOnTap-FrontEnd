import React from 'react';

function ProgramsList({ data = [], selectedTab }) {
    
    // 1. Map index to the exact strings in your 'dayOfWeek' array
    // User specified: 1 is MONDAY, 2 is TUESDAY.
    // This implies standard JS mapping: 0=SUNDAY, 1=MONDAY, etc.
    const dayMapping = [
        "SUNDAY",    // 0
        "MONDAY",    // 1
        "TUESDAY",   // 2
        "WEDNESDAY", // 3
        "THURSDAY",  // 4
        "FRIDAY",    // 5
        "SATURDAY"   // 6
    ];

    const targetDay = dayMapping[selectedTab];

    // 2. Filter the parent array directly
    // We check if the 'dayOfWeek' array includes the target day string
    const filteredPrograms = data.filter((program) => {
        const output = program.dayOfWeek && program.dayOfWeek.includes(targetDay);
        console.log('Filtering output', output);
        return output;
    });

    // Helper: Color logic based on programName acronyms
    const getProgramColor = (name) => {
        const code = (name || '').toUpperCase();
        if (code.includes("BSIS")) return "bg-red-400 shadow-red-100";
        if (code.includes("ACT")) return "bg-orange-400 shadow-orange-100";
        if (code.includes("BAB") || code.includes("AB")) return "bg-blue-400 shadow-blue-100";
        if (code.includes("BSSW")) return "bg-fuchsia-400 shadow-fuchsia-100"; 
        if (code.includes("BSA") || code.includes("AIS")) return "bg-yellow-400 shadow-yellow-100"; 
        return "bg-gray-300 shadow-gray-100"; 
    };

    return (
        <div className="w-[100%] p-6 flex justify-center" style={{ marginTop: 10 }}>
            {filteredPrograms.length === 0 ? (
                <div className="text-sm text-gray-400 italic mt-4">
                    No programs scheduled for {targetDay ? targetDay.toLowerCase() : 'this day'}.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full" style={{ marginTop: 10 }}>
                    {filteredPrograms.map((program) => {
                        // Accessing properties directly from the object structure you provided
                        const colorClass = getProgramColor(program.programName);
                        const displayText = `${program.programName} ${program.year}`;

                        return (
                            <div
                                key={program._id} // Using _id from model
                                className="group relative flex items-center w-full h-10 bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
                                style={{ margin: 10 }}
                            >
                                {/* Color Strip */}
                                <div className={`w-1.5 h-full ${colorClass.split(' ')[0]}`} />

                                {/* Gradient Glow */}
                                <div className={`absolute left-0 top-0 bottom-0 w-4 opacity-20 bg-gradient-to-r from-current to-transparent pointer-events-none ${colorClass.replace('bg-', 'text-')}`} />

                                {/* Program Name & Year */}
                                <span 
                                    className="ml-4 text-sm font-medium text-gray-700 font-geist truncate pr-4" 
                                    style={{
                                        fontWeight: "450",
                                        fontSize: 12,
                                        color: "#272727ff",
                                        fontFamily: "geist",
                                        width: "fit-content",
                                        height: "fit-content",
                                        paddingLeft: 10,
                                        paddingRight: 10
                                    }}
                                >
                                    {displayText}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export { ProgramsList };