import React, { useEffect, useState } from "react";
import { getEmployees, updateEmployee } from "../services/employeeApi.js";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box, TextField, Button, Paper, Typography, Stack, Divider, InputAdornment,
    Skeleton, MenuItem, Fade, useTheme, IconButton
} from "@mui/material";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import BadgeTwoToneIcon from "@mui/icons-material/BadgeTwoTone";
import BusinessTwoToneIcon from "@mui/icons-material/BusinessTwoTone";
import SaveTwoToneIcon from "@mui/icons-material/SaveTwoTone";
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";
import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";
import { useToast } from "../ToastContext";

export default function EditEmployee() {
    const { id } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const { showToast } = useToast();

    // Initial state with empty strings to avoid uncontrolled inputs
    const [form, setForm] = useState({ id: "", name: "", department: "", salary: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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
        const num = String(value).replace(/,/g, '');
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

    useEffect(() => {
        const load = async () => {
            try {
                // Fetch employee by ID
                const res = await getEmployees({ Id: id });
                if (res.data && res.data.length > 0) {
                    const e = res.data[0];
                    setForm({
                        id: e.id,
                        name: e.name || "",
                        department: e.department || "",
                        salary: formatINR(e.salary || "")
                    });
                } else {
                    showToast("Employee not found", "error");
                    navigate("/employees");
                }
            } catch (err) {
                console.error(err);
                showToast("Failed to load employee details", "error");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id, navigate, showToast]);

    const validate = () => {
        let tempErrors = {};
        if (!form.name.trim()) tempErrors.name = "Full Name is required";
        if (!form.department) tempErrors.department = "Department is required";

        const rawSalary = form.salary.toString().replace(/,/g, '');
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
        setSaving(true);
        try {
            const payload = {
                id: parseInt(form.id),
                name: form.name.trim(),
                department: form.department,
                salary: parseFloat(form.salary.toString().replace(/,/g, '')) || 0
            };
            await updateEmployee(payload);
            showToast("Employee updated successfully!", "success");
            navigate("/employees");
        } catch (err) {
            console.error(err);
            const errMsg = err.response?.data?.message || err.message || "Update failed";
            showToast(errMsg, "error");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
                <Skeleton variant="text" width={100} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 4 }} />
            </Box>
        );
    }

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

                    {/* Decorative Background Blob */}
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
                                    <EditTwoToneIcon fontSize="medium" />
                                </Box>
                                <Box>
                                    <Typography variant="h4" fontWeight="800" letterSpacing="-0.5px">Edit Employee</Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                                        Updating details for employee <Box component="span" fontWeight="700" color="primary.main">#{form.id}</Box>
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>

                        <Divider sx={{ borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />

                        <Stack spacing={3}>
                            <TextField
                                label="Full Name"
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
                                disabled={saving}
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
                                {saving ? "Updating..." : "Update Employee"}
                            </Button>
                        </Box>
                    </Stack>
                </Paper>
            </Box>
        </Fade>
    );
}
