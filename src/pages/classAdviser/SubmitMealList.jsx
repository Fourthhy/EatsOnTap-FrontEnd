import { logout } from "../../functions/logoutAuth"
import { Button } from "../../components/ui/button"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom";
import { Menu, Check } from "lucide-react"
import { useState, useEffect } from "react";
import { fetchStudentsBySection } from "../../functions/fetchStudentBySection";

export default function SubmitMealList() {
    const { section } = useParams();
    const [students, setStudents] = useState([]);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetchStudentsBySection(section)
            .then((result) => {
                // If result is { students: [...] }
                const studentsArray = Array.isArray(result.students) ? result.students : [];
                console.log("Fetched:", studentsArray); // You'll see the actual array!
                setStudents(studentsArray);
            })
            .finally(() => setLoading(false));
    }, [section]);

    const isAllSelected = students.length > 0 && selected.length === students.length;
    const isNoneSelected = selected.length === 0;
    const isPartiallySelected =
        !isAllSelected && !isNoneSelected && selected.length > 0;

    // Toggle individual checkbox
    function handleToggle(id) {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
        );
    }

    // Toggle all checkboxes
    function handleSelectAll(e) {
        setSelected(e.target.checked ? students.map((s) => s.id) : []);
    }

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/'); // redirect to login/home
    };
    return (
        <>
            <div
                style={{ backgroundColor: '#142345', }}
                className="h-[100vh] w-[100vw]">
                <div
                    style={{ background: 'white' }}
                    className="h-[80px] w-[100%] flex">
                    <div
                        className="w-[50%] flex items-center justify-start gap-2">
                        <img
                            style={{
                                width: '10vw',
                                marginLeft: '10px'
                            }}
                            src="/lv-logo.svg"
                            alt="lv logo" />
                        <p className="font-geist text-[5vw]">
                            Eat's on tap
                        </p>
                    </div>
                    <div
                        style={{ marginRight: '10px' }}
                        className="w-[50%] flex justify-end items-center">
                        <Menu onClick={handleLogout} />
                    </div>
                </div>
                <div
                    style={{
                        paddingLeft: '10px',
                        paddingRight: '10px'
                    }}
                    className="h-[80px] w-[100vw] flex items-center">
                    <div className="h-[60px] w-[60px]">
                        <img className="rounded-[12px]" src="/classAdviser/teacher.jpg" alt="teacher image" />
                    </div>
                    <div>
                        <p
                            style={{
                                paddingLeft: '8px',
                                fontWeight: 'normal'
                            }}
                            className="font-geist text-[4.2vw] text-white">
                            Hi, Adviser!
                        </p>
                        <p
                            style={{
                                paddingLeft: '8px',
                                fontWeight: 'lighter'
                            }}
                            className="font-geist text-[3vw] text-[#D9D9D9] text-top">
                            Submit a list for today
                        </p>
                    </div>
                </div>
                <div
                    style={{
                        backgroundColor: 'white',
                        borderTopLeftRadius: '30px',
                        borderTopRightRadius: '30px'
                    }}
                    className="h-[100%] w-[100vw] border-white border-[1px]">
                    <div className="h-[60px] w-[100vw] flex">
                        <div className="w-[50%] h-[100%] flex items-center justify-start">
                            <p
                                style={{
                                    fontWeight: "normal",
                                    paddingLeft: "23px"
                                }}
                                className="text-[3.2vw] font-geist"
                            >
                                Total: <span style={{ fontWeight: 'bold' }}> {selected.length} </span>
                            </p>
                        </div>
                        <div className="w-[50%] h-[100%] flex items-center justify-end">
                            <button
                                className="w-[28vw] h-[30px] flex items-center justify-center gap-1"
                                style={{
                                    backgroundColor: '#385BA7',
                                    marginRight: '10px',
                                    borderRadius: '12px'
                                }}
                            >
                                <Check color="#FFFFFf" size="4vw" />
                                <p className="font-geist text-[3.1vw] text-white">Submit</p>

                            </button>
                        </div>
                    </div>
                    <div
                        style={{
                            marginLeft: '10px',
                            marginRight: '10px',
                            height: 'auto'
                        }} >
                        <p className="text-[3.2] font-bold font-geist">{section}</p>

                        <div
                            style={{ borderRadius: '12px' }}
                            className="bg-[#EDF9FE]">

                            <div className="p-4 max-w-2xl mx-auto bg-white rounded-xl">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-[#EFF4FF] h-[42px]">
                                        <tr>
                                            <th className="p-4">
                                                <input
                                                    type="checkbox"
                                                    checked={isAllSelected}
                                                    indeterminate={isPartiallySelected ? "indeterminate" : undefined}
                                                    onChange={handleSelectAll}
                                                    className="form-checkbox h-5 w-5 border-[#777877] border-[1px]"
                                                />
                                            </th>
                                            <th className="p-4 text-center text-gray-500 font-semibold text-geist">
                                                Student Name
                                            </th>
                                            <th className="p-4 text-left text-gray-500 font-semibold text-geist">
                                                Student ID
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {loading ? (
                                            <tr>
                                                <td colSpan={3} className="p-8 text-center text-gray-500">Loading students...</td>
                                            </tr>
                                        ) : Array.isArray(students) && students.length > 0 ? (
                                            students.map((s) => (
                                                <tr key={s.studentID} className={`h-[42px] w-[100%] ${selected.includes(s.studentID) ? "bg-[#EFF4FF]" : ""}`}>
                                                    <td className="p-4">
                                                        <input
                                                            type="checkbox"
                                                            style={{ marginLeft: '10px' }}
                                                            className="form-checkbox h-5 w-5"
                                                            checked={selected.includes(s.studentID)}
                                                            onChange={() => handleToggle(s.studentID)}
                                                        />
                                                    </td>
                                                    <td className="h-[42px] p-4 flex items-center gap-3">
                                                        <img
                                                            src="https://randomuser.me/api/portraits/lego/3.jpg"
                                                            alt="avatar"
                                                            className="h-8 w-8 rounded-full bg-gray-300 object-cover"
                                                        />
                                                        <span className="font-geist">
                                                            {s.last_name}, {s.first_name} {s.middle_name}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 font-geist">{s.studentID}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="p-8 text-center text-gray-500">No students found.</td>
                                            </tr>
                                        )}
                                    </tbody>

                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}