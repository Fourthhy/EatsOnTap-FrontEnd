import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import StudentID from "./components/StudentID";

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<StudentID />}></Route>
        </Routes>
      </Router>
    </>
  )
}