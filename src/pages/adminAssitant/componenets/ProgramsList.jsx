import React from 'react';

function ProgramsList() {
    // Mock Data based on your requirements
    const courses = [
        "Bachelor of Science in Information Systems 3",
        "Bachelor of Science in Social Work 1",
        "Bachelor of Science in Social Work 3",
        "Bachelor of Science in Social Work 3",
        "Bachelor of Arts in Broadcasting 4",
        "Bachelor of Science in Information Systems 2",
        "Bachelor of Science in Social Work 2",
        "Bachelor of Science in Social Work 2",
        "Bachelor of Science in Social Work 2",
        "Bachelor of Science in Accounting Information Systems 1", // Added to test Yellow
        "Associate in Computer Technology 1", // Added to test Orange
    ];

    // Helper function to assign colors based on program keywords
    const getCourseColor = (courseName) => {
        const name = courseName.toLowerCase();

        if (name.includes("information systems")) return "bg-red-400 shadow-red-100";
        if (name.includes("computer technology")) return "bg-orange-400 shadow-orange-100";
        if (name.includes("broadcasting")) return "bg-blue-400 shadow-blue-100";
        if (name.includes("social work")) return "bg-fuchsia-400 shadow-fuchsia-100"; // Violet/Purple
        if (name.includes("accounting")) return "bg-yellow-400 shadow-yellow-100"; // Covers both Accounting & AIS

        return "bg-gray-300 shadow-gray-100"; // Default fallback
    };

    return (
        <div className="w-[100%] p-6 bg-gray-50 flex justify-center">
            {/* grid-cols-1 for mobile, 
         md:grid-cols-2 splits it into two columns on larger screens.
         The grid naturally handles the 'odd number starts left' logic.
      */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginTop: 10 }}>
                {courses.map((course, index) => {
                    const colorClass = getCourseColor(course);

                    return (
                        <div
                            key={index}

                            className="group relative flex items-center w-full h-10 bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
                        >
                            {/* The Colored Strip 
                  w-1.5 creates that thin line. 
                  The parent's 'rounded-xl' + 'overflow-hidden' curves the top and bottom of this strip automatically.
              */}
                            <div className={`w-1.5 h-full ${colorClass.split(' ')[0]}`} />

                            {/* Optional: A subtle gradient fade from the strip to make it glow slightly 
                  like the image reference (Notice the soft color bleed in your screenshot)
              */}
                            <div className={`absolute left-0 top-0 bottom-0 w-4 opacity-20 bg-gradient-to-r from-current to-transparent pointer-events-none ${colorClass.replace('bg-', 'text-')}`} />

                            <span className="ml-4 text-sm font-medium text-gray-700 font-geist truncate pr-4" style={{
                                fontWeight: "450",
                                fontSize: 12,
                                color: "#272727ff",
                                fontFamily: "geist",
                                width: "fit-content",
                                height: "fit-content",
                                paddingLeft: 10,
                                paddingRight: 10
                            }}>
                                {course}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export { ProgramsList };