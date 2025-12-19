import { Outlet } from "react-router-dom";
import { useBreakpoint } from "use-breakpoint"
import { Sidebar } from "./components/Sidebar";

export default function ClassAdviserLanding() {
    const BREAKPOINTS = {
        'mobile-md': 375,
        'mobile-lg': 425,
        'tablet': 768,
        'laptop-md': 1024,
        'laptop-lg': 1440,
    };
    const { breakpoint } = useBreakpoint(BREAKPOINTS, 'mobile-md');
    const screenType =
        breakpoint === 'laptop-md' || breakpoint === 'laptop-lg' ? "laptop" :
            breakpoint === 'mobile-md' || breakpoint === 'mobile-lg' || breakpoint === "tablet" ? "handheld" : "";
    return (
        <>
            {screenType === "laptop" ? (
                <Sidebar />
            ) : screenType === "handheld" ? (
                <Outlet />
            ) : (
                null
            )}
        </>
    )
}