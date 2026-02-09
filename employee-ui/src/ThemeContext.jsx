import React, { createContext, useState, useMemo, useContext, useEffect } from "react";
import { createTheme, ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const ColorModeContext = createContext({ toggleColorMode: () => { } });

// eslint-disable-next-line react-refresh/only-export-components
export const useColorMode = () => useContext(ColorModeContext);

export const ThemeProvider = ({ children }) => {
    const [mode, setMode] = useState(localStorage.getItem("themeMode") || "dark");

    useEffect(() => {
        localStorage.setItem("themeMode", mode);
    }, [mode]);

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
            },
        }),
        []
    );

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: {
                        main: mode === "dark" ? "#10b981" : "#059669", // Emerald Green
                        contrastText: "#ffffff",
                    },
                    secondary: {
                        main: "#6366f1", // Electric Indigo
                    },
                    background: {
                        default: mode === "dark" ? "#020617" : "#f8fafc", // Deeper Slate Dark
                        paper: mode === "dark" ? "rgba(15, 23, 42, 0.6)" : "rgba(255, 255, 255, 0.7)",
                    },
                    text: {
                        primary: mode === "dark" ? "#f8fafc" : "#0f172a",
                        secondary: mode === "dark" ? "#94a3b8" : "#475569",
                    },
                    action: {
                        hover: mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
                        selected: mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.06)",
                    },
                },
                shape: {
                    borderRadius: 12,
                },
                typography: {
                    fontFamily: '"Outfit", "Inter", sans-serif', // Cleaner modern font
                    h3: { fontWeight: 900, letterSpacing: "-0.04em" },
                    h4: { fontWeight: 850, letterSpacing: "-0.03em" },
                    h5: { fontWeight: 800, letterSpacing: "-0.02em" },
                    h6: { fontWeight: 700 },
                    subtitle1: { fontWeight: 600, lineHeight: 1.4 },
                    body1: { lineHeight: 1.5 },
                    button: { textTransform: "none", fontWeight: 700, letterSpacing: "0.02em" },
                },
                components: {
                    MuiCssBaseline: {
                        styleOverrides: {
                            body: {
                                backgroundImage: mode === "dark"
                                    ? "radial-gradient(circle at 0% 0%, rgba(16, 185, 129, 0.12), transparent 40%), radial-gradient(circle at 100% 100%, rgba(99, 102, 241, 0.12), transparent 40%)"
                                    : "radial-gradient(circle at 0% 0%, rgba(16, 185, 129, 0.05), transparent 40%), radial-gradient(circle at 100% 100%, rgba(99, 102, 241, 0.05), transparent 40%)",
                                backgroundColor: mode === "dark" ? "#020617" : "#f8fafc",
                                backgroundAttachment: "fixed",
                            },
                        },
                    },
                    MuiPaper: {
                        styleOverrides: {
                            root: {
                                backdropFilter: "blur(24px) saturate(200%)",
                                borderRadius: 16,
                                border: mode === "dark"
                                    ? "1px solid rgba(255, 255, 255, 0.06)"
                                    : "1px solid rgba(0, 0, 0, 0.05)",
                                boxShadow: mode === "dark"
                                    ? "0 20px 40px -15px rgba(0, 0, 0, 0.7)"
                                    : "0 15px 35px -12px rgba(0, 0, 0, 0.08)",
                                backgroundImage: "none",
                            },
                        },
                    },
                    MuiCard: {
                        styleOverrides: {
                            root: {
                                background: mode === "dark"
                                    ? "linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)"
                                    : "linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.5) 100%)",
                            },
                        },
                    },
                    MuiButton: {
                        styleOverrides: {
                            root: {
                                borderRadius: 10,
                                padding: "8px 20px",
                                boxShadow: "none",
                                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                            },
                            containedPrimary: {
                                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)",
                                "&:hover": {
                                    boxShadow: "0 8px 16px rgba(16, 185, 129, 0.3)",
                                    transform: "translateY(-1.5px)",
                                },
                            },
                            outlined: {
                                borderWidth: "1.5px",
                                "&:hover": { borderWidth: "1.5px" },
                            },
                        },
                    },
                    MuiTableCell: {
                        styleOverrides: {
                            root: {
                                borderBottom: mode === "dark"
                                    ? "1px solid rgba(255, 255, 255, 0.06)"
                                    : "1px solid rgba(148, 163, 184, 0.1)",
                                padding: "10px 16px",
                            },
                            head: {
                                fontWeight: 600,
                                textTransform: "uppercase",
                                fontSize: "0.75rem",
                                letterSpacing: "0.05em",
                                color: mode === "dark" ? "#94a3b8" : "#64748b",
                                backgroundColor: mode === "dark" ? "rgba(15, 23, 42, 0.5)" : "rgba(241, 245, 249, 0.5)",
                            },
                        },
                    },
                    MuiTextField: {
                        styleOverrides: {
                            root: {
                                "& .MuiOutlinedInput-root": {
                                    backgroundColor: mode === "dark" ? "rgba(15, 23, 42, 0.4)" : "rgba(255, 255, 255, 0.5)",
                                    transition: "all 0.2s",
                                    "& fieldset": {
                                        borderColor: mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.06)",
                                    },
                                    "&:hover": {
                                        backgroundColor: mode === "dark" ? "rgba(15, 23, 42, 0.6)" : "rgba(255, 255, 255, 0.8)",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderWidth: "1px",
                                        borderColor: "#3b82f6",
                                    },
                                },
                            },
                        },
                    },
                    MuiChip: {
                        styleOverrides: {
                            root: {
                                fontWeight: 600,
                                borderRadius: 8,
                            },
                        },
                    },
                },
            }),
        [mode]
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <MUIThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MUIThemeProvider>
        </ColorModeContext.Provider>
    );
};
