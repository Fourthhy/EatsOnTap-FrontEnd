import { useState, useEffect } from "react";

export default function StudentID() {
    const [searchItem, setSearchItem] = useState("");

    // searched items
    const [studentID, setStudentID] = useState("");
    const [studentName, setStudentName] = useState("");
    const [studentCourse, setStudentCourse] = useState("");
    const [studentSection, setStudentSection] = useState("");
    const [studentEligibility, setStudentEligibility] = useState("");

    const studentCollection = {
        "22-00100MBS": {
            name: "Mark Joseph Santos",
            course: "STEM",
            section: "12-Mark",
            eligibility: "Ineligible"
        },
        "22-00208AKS": {
            name: "Aerrol Kyle Santos",
            course: "HUMSS",
            section: "11-Aerrol",
            eligibility: "Eligible"
        },
        "22-00164JUM": {
            name: "John Miguel Mamabo",
            course: "GAS",
            section: "12-Michael",
            eligibility: "Eligible"
        }
    };

    const searchFunction = (id) => {
        if (studentCollection[id]) {
            const studentData = studentCollection[id];
            setStudentID(id);
            setStudentName(studentData.name);
            setStudentCourse(studentData.course);
            setStudentSection(studentData.section);
            setStudentEligibility(studentData.eligibility);
        } else {
            setStudentID("");
            setStudentName("");
            setStudentCourse("");
            setStudentSection("");
            setStudentEligibility("");
        }
    };

    const handleInputChange = (e) => {
        setSearchItem(e.target.value);
    };

    // Automatically run search when searchItem hits 11 characters
    useEffect(() => {
        if (searchItem.length === 11) {
            searchFunction(searchItem);
        }
    }, [searchItem]);

    return (
        <>
            <div>
                <input 
                    type="text" 
                    value={searchItem}
                    onChange={handleInputChange}
                    placeholder="search here"
                />
                <button onClick={() => searchFunction(searchItem)}>Submit</button>
            </div>
            <h1>Student ID: {studentID}</h1>
            <h2>Student Name: {studentName}</h2>
            <h3>Course: {studentCourse}</h3>
            <h3>Section: {studentSection}</h3>
            <h3>Eligibility: {studentEligibility}</h3>
        </>
    );
}
