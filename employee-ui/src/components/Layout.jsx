import React from "react";
import { Box, AppBar, Toolbar, Typography, Stack, IconButton, useTheme, Avatar, Container, useMediaQuery } from "@mui/material";
import DashboardTwoToneIcon from "@mui/icons-material/DashboardTwoTone";
import DarkModeTwoToneIcon from "@mui/icons-material/DarkModeTwoTone";
import LightModeTwoToneIcon from "@mui/icons-material/LightModeTwoTone";
import NotificationsTwoToneIcon from "@mui/icons-material/NotificationsTwoTone";
import { useNavigate, useLocation } from "react-router-dom";
import { useColorMode } from "../ThemeContext";

export default function Layout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const { toggleColorMode } = useColorMode();
    const isDark = theme.palette.mode === "dark";
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            {/* Sticky/Floating Glass Header */}
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    bgcolor: "transparent",
                    pt: 1.5,
                    pb: 0.5,
                }}
            >
                <Container maxWidth="xl">
                    <Box sx={{
                        bgcolor: isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.75)',
                        backdropFilter: "blur(20px) saturate(180%)",
                        borderRadius: "20px",
                        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.5)",
                        boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.2)" : "0 8px 32px rgba(31, 38, 135, 0.07)",
                        px: 3,
                    }}>
                        <Toolbar sx={{ justifyContent: "space-between", px: "0 !important", minHeight: "60px !important" }}>
                            {/* Logo */}
                            <Stack direction="row" alignItems="center" spacing={2} sx={{ cursor: 'pointer' }} onClick={() => navigate("/")}>
                                <Box sx={{
                                    p: 1,
                                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                    borderRadius: "10px",
                                    display: 'flex',
                                    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)"
                                }}>
                                    <DashboardTwoToneIcon sx={{ color: "white", fontSize: 24 }} />
                                </Box>
                                {!isMobile && (
                                    <Box>
                                        <Typography variant="h6" fontWeight="800" letterSpacing="-0.5px" color="text.primary">
                                            Employee Manager
                                        </Typography>
                                    </Box>
                                )}
                            </Stack>

                            {/* Actions */}
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <IconButton sx={{
                                    color: "text.secondary",
                                    bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                    border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)'
                                }}>
                                    <NotificationsTwoToneIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                    onClick={toggleColorMode}
                                    sx={{
                                        color: "text.secondary",
                                        bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                        border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)'
                                    }}
                                >
                                    {isDark ? <LightModeTwoToneIcon fontSize="small" /> : <DarkModeTwoToneIcon fontSize="small" />}
                                </IconButton>

                                <Box sx={{ width: "1px", height: "24px", bgcolor: "divider", mx: 1 }} />

                                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ cursor: 'pointer' }}>
                                    <Avatar
                                        sx={{
                                            background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                                            width: 40, height: 40,
                                            boxShadow: "0 2px 8px rgba(99, 102, 241, 0.25)"
                                        }}
                                    >
                                        A
                                    </Avatar>
                                    {!isMobile && (
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight={700} lineHeight={1.2}>Admin</Typography>
                                            <Typography variant="caption" color="text.secondary">HR Manager</Typography>
                                        </Box>
                                    )}
                                </Stack>
                            </Stack>
                        </Toolbar>
                    </Box>
                </Container>
            </AppBar>

            <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
                <Container maxWidth="xl">
                    <Box sx={{ mb: 3, opacity: 0, animation: "fadeIn 0.8s ease-out forwards", "@keyframes fadeIn": { "0%": { opacity: 0, transform: "translateY(10px)" }, "100%": { opacity: 1, transform: "translateY(0)" } } }}>
                        <Typography variant="h4" color="text.primary" sx={{ mb: 0.5, fontWeight: 800 }}>
                            {location.pathname.includes("add") ? "Add Employee" :
                                location.pathname.includes("edit") ? "Edit Profile" :
                                    "Team Overview"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 600 }}>
                            {location.pathname.includes("add") ? "Create a new employee profile in the system." :
                                location.pathname.includes("edit") ? "Modify employee details and role assignments." :
                                    "Track your team's performance, manage roles, and monitor headcount."}
                        </Typography>
                    </Box>

                    {children}
                </Container>
            </Box>
        </Box>
    );
}
