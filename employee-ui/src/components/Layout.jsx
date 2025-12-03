import React from "react";
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItemButton, ListItemIcon, ListItemText, IconButton } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";

const drawerWidth = 220;

export default function Layout({ children }) {
    const navigate = useNavigate();

    return (
        <Box sx={{ display: "flex" }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Employee Manager
                    </Typography>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
                }}
            >
                <Toolbar />
                <List>
                    <ListItemButton onClick={() => navigate("/")}>
                        <ListItemIcon><HomeIcon /></ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItemButton>

                    <ListItemButton onClick={() => navigate("/employees")}>
                        <ListItemIcon><PeopleIcon /></ListItemIcon>
                        <ListItemText primary="Employees" />
                    </ListItemButton>
                </List>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar /> {/* space for AppBar */}
                {children}
            </Box>
        </Box>
    );
}
