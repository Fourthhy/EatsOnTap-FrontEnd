import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import StudentID from "./components/StudentID";
import StudentIDInput from "./components/StudentIDInput";

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<StudentIDInput />}></Route>
        </Routes>
      </Router>
    </>
  )
}