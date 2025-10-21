import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../Login";

export default function Routers() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />}/>
                </Routes>
            </Router>
        </>
    )
}