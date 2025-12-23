import { Sidebar } from "../global/Sidebar";
import { Outlet } from "react-router-dom";

const SidebarLayout = () => (
  <div style={{ display: "flex", height: "100vh" }}>
    <Sidebar />
    <main style={{ flexGrow: 1 }}>
      <Outlet />
    </main>
  </div>
);

export default SidebarLayout;
