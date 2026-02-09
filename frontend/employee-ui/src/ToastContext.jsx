import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert, Typography, useTheme, Slide } from '@mui/material';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone';
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
import WarningTwoToneIcon from '@mui/icons-material/WarningTwoTone';

const ToastContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

function SlideTransition(props) {
    return <Slide {...props} direction="up" />;
}

export const ToastProvider = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success'); // 'success' | 'error' | 'warning' | 'info'
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const showToast = useCallback((msg, type = 'success') => {
        setMessage(msg);
        setSeverity(type);
        setOpen(true);
    }, []);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };



    const getColors = () => {
        // Custom glass colors based on severity
        switch (severity) {
            case 'success':
                return {
                    bg: isDark ? 'rgba(6, 78, 59, 0.85)' : 'rgba(209, 250, 229, 0.9)',
                    color: isDark ? '#d1fae5' : '#065f46',
                    border: isDark ? 'rgba(52, 211, 153, 0.2)' : 'rgba(16, 185, 129, 0.3)',
                    iconColor: '#10b981'
                };
            case 'error':
                return {
                    bg: isDark ? 'rgba(127, 29, 29, 0.85)' : 'rgba(254, 226, 226, 0.9)',
                    color: isDark ? '#fecaca' : '#991b1b',
                    border: isDark ? 'rgba(248, 113, 113, 0.2)' : 'rgba(239, 68, 68, 0.3)',
                    iconColor: '#ef4444'
                };
            // Add others as needed, defaulting to primary/info styling
            default:
                return {
                    bg: isDark ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.9)',
                    color: theme.palette.text.primary,
                    border: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0,0,0,0.1)',
                    iconColor: theme.palette.primary.main
                };
        }
    };

    const colors = getColors();

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                TransitionComponent={SlideTransition}
            >
                <Alert
                    onClose={handleClose}
                    severity={severity}
                    iconMapping={{
                        success: <CheckCircleTwoToneIcon fontSize="inherit" />,
                        error: <ErrorTwoToneIcon fontSize="inherit" />,
                        warning: <WarningTwoToneIcon fontSize="inherit" />,
                        info: <InfoTwoToneIcon fontSize="inherit" />,
                    }}
                    sx={{
                        width: '100%',
                        minWidth: '300px',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '16px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                        border: `1px solid ${colors.border}`,
                        backgroundColor: colors.bg,
                        color: colors.color,
                        alignItems: 'center',
                        '& .MuiAlert-icon': {
                            color: colors.iconColor
                        }
                    }}
                >
                    <Typography variant="body2" fontWeight="600">{message}</Typography>
                </Alert>
            </Snackbar>
        </ToastContext.Provider>
    );
};
