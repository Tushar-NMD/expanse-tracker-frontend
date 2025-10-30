import { Box, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 270;

function SidebarUI({ isOpen, onClose }) {
    const navigate = useNavigate();
    const location = useLocation();

    const sideBarContent = [
        { icon: "", title: "Dashboard", path: "/dashboard" },
        { icon: "", title: "Expense Tracker", path: "/expenses" },
    ];

    const handleMenuClick = (path) => {
        navigate(path);
        if (onClose) onClose();
    };

    return (
        <>
            {/* Desktop Sidebar */}
           <Box
  sx={{
    width: drawerWidth,
    height: "100vh", // full height
    display: { xs: "none", lg: "flex" },
    flexDirection: "column",
    gap: "12px",
    overflow: "hidden",
    backgroundColor: "#19A699",
    padding: "18px",
    boxSizing: "border-box",
    position: "fixed",
    top: 0, // no offset
    left: 0,
    zIndex: 100,
    pt: "66px", // add padding-top for navbar space
  }}
>

                {sideBarContent.map((content, index) => {
                    const isActive = content.path === "/expenses" 
                        ? location.pathname.startsWith("/expenses")
                        : location.pathname === content.path;
                    return (
                        <Box
                            key={index}
                            onClick={() => handleMenuClick(content.path)}
                            sx={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                gap: "12px",
                                borderRadius: "8px",
                                paddingY: "6px",
                                paddingX: 2,
                                boxSizing: "border-box",
                                background: isActive ? "#007E74" : "#FFFFFF",
                                cursor: "pointer",
                                "&:hover": {
                                    background: isActive ? "#007E74" : "#f0f0f0",
                                }
                            }}
                        >
                            <Typography
                                sx={{
                                    fontFamily: "Poppins, sans-serif",
                                    fontWeight: 600,
                                    fontSize: "18px",
                                    color: isActive ? "#FFFFFF" : "#19A699",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {content.title}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>

            {/* Mobile Sidebar */}
           <Box
  sx={{
    position: "fixed",
    top: 0,
    left: 0,
    width: drawerWidth,
    height: "100vh", // full height
    display: { xs: "flex", md: "none" },
    flexDirection: "column",
    gap: "8px",
    overflowY: "auto",
    backgroundColor: "#19A699",
    padding: "12px",
    boxSizing: "border-box",
    transform: isOpen ? "translateX(0)" : "translateX(-100%)",
    transition: "transform 0.3s ease-in-out",
    zIndex: 1200,
    pt: "54px", // add top padding for navbar space
  }}
>

                {sideBarContent.map((content, index) => {
                    const isActive = content.path === "/expenses" 
                        ? location.pathname.startsWith("/expenses")
                        : location.pathname === content.path;
                    return (
                        <Box
                            key={index}
                            onClick={() => handleMenuClick(content.path)}
                            sx={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                gap: "14px",
                                borderRadius: "8px",
                                paddingY: "6px",
                                paddingX: 2,
                                boxSizing: "border-box",
                                background: isActive ? "#007E74" : "#FFFFFF",
                                cursor: "pointer",
                                "&:hover": {
                                    background: isActive ? "#007E74" : "#f0f0f0",
                                }
                            }}
                        >
                            <Typography
                                sx={{
                                    fontFamily: "Poppins, sans-serif",
                                    fontWeight: 600,
                                    fontSize: "16px",
                                    color: isActive ? "#FFFFFF" : "#19A699",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {content.title}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>

            {/* Mobile Overlay */}
            {isOpen && (
                <Box
                    onClick={onClose}
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: { xs: "block", md: "none" },
                        zIndex: 1100,
                    }}
                />
            )}
        </>
    );
}

export default SidebarUI;
