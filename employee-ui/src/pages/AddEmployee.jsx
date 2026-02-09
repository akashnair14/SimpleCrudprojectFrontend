import React, { useState } from "react";
import { addEmployee } from "../services/employeeApi";
import { useNavigate } from "react-router-dom";
import {
    Box, TextField, Button, Paper, Typography, Stack, Divider, InputAdornment,
    MenuItem, Fade, useTheme
} from "@mui/material";
import PersonAddTwoToneIcon from "@mui/icons-material/PersonAddTwoTone";
import BadgeTwoToneIcon from "@mui/icons-material/BadgeTwoTone";
import BusinessTwoToneIcon from "@mui/icons-material/BusinessTwoTone";
import SaveTwoToneIcon from "@mui/icons-material/SaveTwoTone";
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";
import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";
import { useToast } from "../ToastContext";

export default function AddEmployee() {
    const [form, setForm] = useState({ name: "", department: "", salary: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();
    const { showToast } = useToast();

    const departments = [
        "Engineering",
        "Human Resources",
        "Product Management",
        "Sales",
        "Marketing",
        "Finance",
        "Operations"
    ];

    const formatINR = (value) => {
        if (!value) return "";
        const num = value.replace(/,/g, '');
        if (isNaN(num)) return value;
        return new Intl.NumberFormat('en-IN').format(num);
    };

    const handleSalaryChange = (e) => {
        const value = e.target.value;
        const rawValue = value.replace(/,/g, '');
        if (!isNaN(rawValue)) {
            setForm({ ...form, salary: formatINR(rawValue) });
        }
    };

    const validate = () => {
        let tempErrors = {};
        if (!form.name.trim()) tempErrors.name = "Full Name is required";
        if (!form.department) tempErrors.department = "Department is required";

        const rawSalary = form.salary.replace(/,/g, '');
        if (!rawSalary) {
            tempErrors.salary = "Salary is required";
        } else if (isNaN(rawSalary) || parseFloat(rawSalary) <= 0) {
            tempErrors.salary = "Please enter a valid positive salary";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const submit = async () => {
        if (!validate()) {
            showToast("Please correct the errors in the form", "error");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                name: form.name.trim(),
                department: form.department,
                salary: parseFloat(form.salary.replace(/,/g, '')) || 0
            };
            await addEmployee(payload);
            showToast("Employee added successfully!", "success");
            navigate("/employees");
        } catch (err) {
            console.error(err);
            const errMsg = err.response?.data?.message || err.message || "Failed to add employee";
            showToast(errMsg, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Fade in={true} timeout={600}>
            <Box sx={{ maxWidth: 700, mx: "auto" }}>
                <Button
                    startIcon={<ArrowBackTwoToneIcon />}
                    onClick={() => navigate("/employees")}
                    sx={{ mb: 3, opacity: 0.7, "&:hover": { opacity: 1, bgcolor: "transparent" } }}
                >
                    Back to List
                </Button>

                <Paper sx={{ p: { xs: 3, md: 5 }, position: 'relative', overflow: 'hidden' }}>
                    <Box sx={{
                        position: 'absolute', top: -50, right: -50, width: 200, height: 200,
                        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0) 70%)',
                        borderRadius: '50%', pointerEvents: 'none'
                    }} />

                    <Stack spacing={4}>
                        <Box>
                            <Stack direction="row" spacing={2.5} alignItems="center" mb={1.5}>
                                <Box sx={{
                                    p: 1.5,
                                    borderRadius: 3,
                                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)",
                                    display: 'flex', color: 'white'
                                }}>
                                    <PersonAddTwoToneIcon fontSize="medium" />
                                </Box>
                                <Box>
                                    <Typography variant="h4" fontWeight="800" letterSpacing="-0.5px">Add Employee</Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                                        Onboard a new team member to the system.
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>

                        <Divider sx={{ borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />

                        <Stack spacing={3}>
                            <TextField
                                label="Full Name"
                                placeholder="e.g. Akash Nair"
                                value={form.name}
                                onChange={(e) => {
                                    setForm({ ...form, name: e.target.value });
                                    if (errors.name) setErrors({ ...errors, name: null });
                                }}
                                error={!!errors.name}
                                helperText={errors.name}
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><BadgeTwoToneIcon color="primary" sx={{ opacity: 0.7 }} /></InputAdornment>,
                                }}
                            />

                            <TextField
                                select
                                label="Department"
                                value={form.department}
                                onChange={(e) => {
                                    setForm({ ...form, department: e.target.value });
                                    if (errors.department) setErrors({ ...errors, department: null });
                                }}
                                error={!!errors.department}
                                helperText={errors.department}
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><BusinessTwoToneIcon color="primary" sx={{ opacity: 0.7 }} /></InputAdornment>,
                                }}
                            >
                                {departments.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                label="Annual Salary"
                                placeholder="e.g. 5,00,000"
                                value={form.salary}
                                onChange={(e) => {
                                    handleSalaryChange(e);
                                    if (errors.salary) setErrors({ ...errors, salary: null });
                                }}
                                error={!!errors.salary}
                                helperText={errors.salary || "Annual salary in INR (Indian Rupee)"}
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">
                                        <Typography fontWeight="700" color="text.primary">₹</Typography>
                                    </InputAdornment>,
                                }}
                            />
                        </Stack>

                        <Box sx={{ display: 'flex', gap: 2, pt: 3 }}>
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => navigate("/employees")}
                                startIcon={<CancelTwoToneIcon />}
                                sx={{
                                    flex: 1,
                                    borderWidth: '2px',
                                    "&:hover": { borderWidth: '2px' }
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={submit}
                                disabled={loading}
                                startIcon={<SaveTwoToneIcon />}
                                sx={{
                                    flex: 2,
                                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                    boxShadow: "0 4px 14px 0 rgba(16, 185, 129, 0.4)",
                                    "&:hover": {
                                        background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                                        boxShadow: "0 6px 20px rgba(16, 185, 129, 0.6)",
                                    }
                                }}
                            >
                                {loading ? "Saving..." : "Save Employee"}
                            </Button>
                        </Box>
                    </Stack>
                </Paper>
            </Box>
        </Fade>
    );
}
