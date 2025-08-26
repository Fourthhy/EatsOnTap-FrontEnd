import { useState } from "react";

export default function StudentID() {
    const [searchItem, setSearchItem] = useState("");

    //searched items

    const [studentID, setStudentID] = useState("");
    const [studentName, setStudentName] = useState("");
    const [studentCourse, setStudentCourse] = useState("");
    const [studentSection, setStudentSection] = useState("");
    const [studentEligibility, setStudentEligibility] = useState("")
    

    const studentCollection = {
        "22-00100MBS": {
            name: "Mark Joseph Santos",
            course: "Ikaw of course",
            section: "Sa section namin",
            eligibility: "Pwedng pwede ser"
        },
        "22-00208AKS": {
            name: "Aerrol Kyle Santos",
            course: "main course",
            section: "Sa section nila",
            eligibility: "ser, di po pwede"
        },
        "22-00164JUM": {
            name: "John Miguel Mamabo",
            course: "python crash course",
            section: "Sa section ni ano HEHE",
            eligibility: "ser, tapos na po"
        }
    }

   const searchFunction = () => {
        if (studentCollection[searchItem]) {
            const studentData = studentCollection[searchItem]
            setStudentID(searchItem)
            setStudentName(studentData.name)
            setStudentCourse(studentData.course)
            setStudentSection(studentData.section)
            setStudentEligibility(studentData.eligibility)
        } else {
            setStudentID("")
            setStudentName("")
            setStudentCourse("")
            setStudentSection("")
            setStudentEligibility("")
        }
    }

    return (
        <>
        <div>
            <input 
                type="text" 
                value={searchItem} 
                onChange={(e) => {setSearchItem(e.target.value)}} 
                placeholder="search here"></input>
            <button onClick={searchFunction}>Submit</button>
        </div>
            <h1>Student ID: {studentID}</h1>
            <h2>Student Name: {studentName}</h2>
            <h3>Course: {studentCourse}</h3>
            <h3>Section: {studentSection}</h3>
            <h3>Eligibility: {studentEligibility}</h3>
        </>
    )
}