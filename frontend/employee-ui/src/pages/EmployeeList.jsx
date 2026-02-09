import React, { useEffect, useState, useMemo, useCallback } from "react";
import { getEmployees, deleteEmployee, addEmployee, updateEmployee } from "../services/employeeApi";
import { useNavigate } from "react-router-dom";

import {
    Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography, Box, TextField, Stack, Dialog, DialogTitle, DialogContent, DialogActions,
    Card, Avatar, Chip, IconButton, Grid, InputAdornment, TablePagination, Fade, Grow,
    useTheme, alpha, Checkbox, Skeleton, Tooltip, Collapse
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import PeopleAltTwoToneIcon from "@mui/icons-material/PeopleAltTwoTone";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded"; // New Import
import AssessmentTwoToneIcon from "@mui/icons-material/AssessmentTwoTone";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useToast } from "../ToastContext";


// --- Analytics Components (Embedded for simplicity) ---
const AnalyticsDashboard = ({ employees }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    // 1. Department Data (Counts & Percents)
    const deptData = useMemo(() => {
        const counts = {};
        employees.forEach(e => { counts[e.department] = (counts[e.department] || 0) + 1 });
        const total = employees.length || 1;
        return Object.keys(counts).map(dept => ({
            name: dept,
            value: counts[dept],
            percent: (counts[dept] / total) * 100
        })).sort((a, b) => b.value - a.value);
    }, [employees]);

    // 2. Salary Data (For Pie Chart Ranges)
    const salaryRanges = useMemo(() => {
        const ranges = { "1-3L": 0, "3-6L": 0, "7-9L": 0, "10-15L": 0, "15L+": 0 };
        employees.forEach(e => {
            const s = e.salary;
            if (s <= 300000) ranges["1-3L"]++;
            else if (s <= 600000) ranges["3-6L"]++;
            else if (s <= 900000) ranges["7-9L"]++;
            else if (s <= 1500000) ranges["10-15L"]++;
            else ranges["15L+"]++;
        });
        const total = employees.length || 1;
        return Object.keys(ranges).map(r => ({ name: r, value: ranges[r], percent: (ranges[r] / total) * 100 }));
    }, [employees]);

    // 3. Dept Salary Stats (For Bar Chart)
    const deptSalaryStats = useMemo(() => {
        const stats = {};
        employees.forEach(e => {
            if (!stats[e.department]) stats[e.department] = { total: 0, count: 0 };
            stats[e.department].total += e.salary;
            stats[e.department].count += 1;
        });
        return Object.keys(stats).map(dept => ({
            name: dept,
            avg: Math.round(stats[dept].total / stats[dept].count)
        })).sort((a, b) => b.avg - a.avg);
    }, [employees]);

    // 4. Global Stats
    const totalPayroll = useMemo(() => employees.reduce((acc, e) => acc + (e.salary || 0), 0), [employees]);
    const avgSalary = employees.length ? Math.round(totalPayroll / employees.length) : 0;
    const maxSalary = employees.length ? Math.max(...employees.map(e => e.salary || 0)) : 0;

    const formatCurrency = (val) => val.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

    return (
        <Stack spacing={1.5} sx={{ mb: 2 }}>
            {/* 1. Global Metrics Row - Ultra Compact */}
            <Grid container spacing={2}>
                {[
                    { label: "Total Payroll", value: formatCurrency(totalPayroll), color: "#10b981", icon: "💰", gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)" },
                    { label: "Avg. Salary", value: formatCurrency(avgSalary), color: "#06b6d4", icon: "📊", gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)" },
                    { label: "Top Salary", value: formatCurrency(maxSalary), color: "#6366f1", icon: "💎", gradient: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)" }
                ].map((stat, i) => (
                    <Grid item xs={12} sm={4} key={i}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 1.5, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 3,
                                background: isDark ? 'rgba(30, 41, 59, 0.4)' : 'rgba(255, 255, 255, 0.7)',
                                backdropFilter: 'blur(10px) saturate(180%)',
                                border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(255, 255, 255, 0.5)',
                                transition: 'all 0.2s ease',
                                '&:hover': { transform: 'translateY(-1px)', boxShadow: isDark ? '0 4px 12px -4px rgba(0,0,0,0.5)' : '0 4px 12px -4px rgba(37, 99, 235, 0.1)' }
                            }}
                        >
                            <Box sx={{
                                width: 40, height: 40, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: stat.gradient, color: 'white', fontSize: '1.2rem', flexShrink: 0
                            }}>{stat.icon}</Box>
                            <Box sx={{ minWidth: 0 }}>
                                <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ textTransform: 'uppercase', letterSpacing: '0.02em', display: 'block', noWrap: true }}>{stat.label}</Typography>
                                <Typography variant="subtitle1" fontWeight="900" sx={{ color: isDark ? '#fff' : stat.color, lineHeight: 1.2, noWrap: true }}>{stat.value}</Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>


            {/* 2. Unified Analytics Row - 3 Columns */}
            <Grid container spacing={1.5}>
                {/* 2.1 Headcount Distribution */}
                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 1.5, height: '100%', borderRadius: 4,
                            background: isDark ? 'rgba(30, 41, 59, 0.3)' : 'rgba(255, 255, 255, 0.7)',
                            backdropFilter: 'blur(20px) saturate(180%)',
                            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(255, 255, 255, 0.5)',
                        }}
                    >
                        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2" fontWeight="800">📊 Headcount</Typography>
                        </Box>
                        <Stack spacing={1.5}>
                            {deptData.slice(0, 5).map((d, i) => (
                                <Box key={d.name}>
                                    <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                        <Typography variant="caption" fontWeight="700">{d.name}</Typography>
                                        <Typography variant="caption" fontWeight="800" color="primary">{d.value}</Typography>
                                    </Stack>
                                    <Box sx={{ width: '100%', height: 6, bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                                        <Box sx={{
                                            width: `${d.percent}%`, height: '100%', borderRadius: 3,
                                            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.5)} 100%)`,
                                            transition: 'width 1.2s ease-out'
                                        }} />
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    </Paper>
                </Grid>

                {/* 2.2 Salary Ranges */}
                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 1.5, height: '100%', borderRadius: 4,
                            background: isDark ? 'rgba(30, 41, 59, 0.3)' : 'rgba(255, 255, 255, 0.7)',
                            backdropFilter: 'blur(20px) saturate(180%)',
                            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(255, 255, 255, 0.5)',
                        }}
                    >
                        <Typography variant="subtitle2" fontWeight="800" sx={{ mb: 2 }}>💸 Salary Brackets</Typography>
                        <Stack alignItems="center" spacing={2.5}>
                            <Box sx={{ position: 'relative', width: 90, height: 90 }}>
                                <Box sx={{
                                    width: '100%', height: '100%', borderRadius: '50%',
                                    background: `conic-gradient(
                                        ${salaryRanges.map((d, i, arr) => {
                                        const start = arr.slice(0, i).reduce((sum, item) => sum + item.percent, 0);
                                        const end = start + d.percent;
                                        const colors = ['#10b981', '#6366f1', '#06b6d4', '#f59e0b', '#334155'];
                                        return `${colors[i % 5]} ${start}% ${end}%`;
                                    }).join(', ')}
                                    )`,
                                    transform: 'rotate(-90deg)',
                                }} />
                                <Box sx={{
                                    position: 'absolute', top: '22%', left: '22%', width: '56%', height: '56%',
                                    bgcolor: isDark ? '#1e293b' : '#fff', borderRadius: '50%',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Typography variant="caption" fontWeight="900" sx={{ lineHeight: 1 }}>{employees.length}</Typography>
                                    <Typography variant="caption" sx={{ fontSize: '0.45rem', fontWeight: 800, textTransform: 'uppercase', color: 'text.secondary' }}>Users</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0.8, width: '100%' }}>
                                {salaryRanges.map((d, i) => (
                                    <Stack key={d.name} direction="row" alignItems="center" spacing={0.5}>
                                        <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: ['#10b981', '#6366f1', '#06b6d4', '#f59e0b', '#334155'][i % 5] }} />
                                        <Typography variant="caption" fontWeight="700" sx={{ fontSize: '0.55rem', whiteSpace: 'nowrap' }}>{d.name}</Typography>
                                    </Stack>
                                ))}
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>

                {/* 2.3 Efficiency */}
                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 1.5, height: '100%', borderRadius: 4,
                            background: isDark ? 'rgba(30, 41, 59, 0.3)' : 'rgba(255, 255, 255, 0.7)',
                            backdropFilter: 'blur(20px) saturate(180%)',
                            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(255, 255, 255, 0.5)',
                        }}
                    >
                        <Typography variant="subtitle2" fontWeight="800" sx={{ mb: 2 }}>🏆 Avg Salary</Typography>
                        <Stack direction="row" alignItems="flex-end" justifyContent="space-around" sx={{ height: 110, px: 0.5 }}>
                            {deptSalaryStats.slice(0, 5).map((d, i) => {
                                const maxAvg = Math.max(...deptSalaryStats.map(s => s.avg)) || 1;
                                const height = (d.avg / maxAvg) * 100;
                                return (
                                    <Tooltip title={`${d.name}: ${formatCurrency(d.avg)}`} key={d.name} arrow placement="top">
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '15%', minWidth: 26, gap: 1 }}>
                                            <Box sx={{
                                                width: '100%', height: `${height}%`, minHeight: 6,
                                                background: `linear-gradient(180deg, ${theme.palette.secondary.main} 0%, ${alpha(theme.palette.secondary.main, 0.4)} 100%)`,
                                                borderRadius: '3px 3px 1px 1px'
                                            }} />
                                            <Typography variant="caption" sx={{ fontSize: '0.55rem', fontWeight: 800, color: 'text.secondary', whiteSpace: 'nowrap' }}>
                                                {d.name.substring(0, 3).toUpperCase()}
                                            </Typography>
                                        </Box>
                                    </Tooltip>
                                );
                            })}
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Stack>
    );
};

export default function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ id: "", name: "", department: "", salary: "" });
    const [confirm, setConfirm] = useState({ open: false, ids: [] }); // Array for bulk delete
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selected, setSelected] = useState([]); // Selected IDs
    const [showAnalytics, setShowAnalytics] = useState(false);

    const navigate = useNavigate();
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const { showToast } = useToast();

    // Load Data
    const load = useCallback(async (f = {}) => {
        setLoading(true);
        try {
            const params = {};
            if (f.id) params.Id = f.id;
            if (f.name) params.Name = f.name;
            if (f.department) params.Department = f.department;
            if (f.salary) params.Salary = f.salary;
            const res = await getEmployees(params);
            setEmployees(res.data || []);
            setSelected([]);
        } catch (err) {
            console.error(err);
            showToast("Failed to load employees", "error");
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    // Initial Load
    useEffect(() => { load(); }, [load]);

    // Debounced Search Effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            load(filter);
        }, 600);
        return () => clearTimeout(timeoutId);
    }, [filter, load]);

    // Handlers
    const onSearch = () => load(filter);

    const onClear = () => {
        setFilter({ id: "", name: "", department: "", salary: "" });
        setPage(0);
        showToast("Filters cleared", "info");
    };

    const onDelete = async () => {
        try {
            // Promise.all for bulk delete (real app would use bulk endpoint)
            await Promise.all(confirm.ids.map(id => deleteEmployee(id)));
            setConfirm({ open: false, ids: [] });
            showToast(`${confirm.ids.length} Employee(s) deleted successfully`, "success");
            load(filter);
        } catch (err) {
            console.error(err);
            // Some checks might fail, usually we'd want a transaction but here we do best effort
            showToast("Delete operation faced issues", "error");
            load(filter);
        }
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            // Select all visible on current page or all? Usually current page for safety, but user might expect all.
            // Let's do all currently filtered employees for simpler UX "Bulk Action"
            const newSelected = employees.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleSelectOne = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const onExportCSV = () => {
        // Simple CSV generation
        const headers = ["ID", "Name", "Department", "Salary"];
        const rows = employees.map(e => [e.id, e.name, e.department, e.salary]);

        let csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "employees_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast("Export download started", "success");
    };

    const onDownloadTemplate = () => {
        const headers = ["ID", "Name", "Department", "Salary"];
        const rows = [",John Doe,IT,600000", ",Jane Smith,HR,550000"];
        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "employee_upload_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target.result;
            const lines = text.split("\n").map(r => r.trim()).filter(r => r);

            // Determine CSV format from header
            // Expected Formats:
            // 1. ID,Name,Department,Salary
            // 2. Name,Department,Salary
            const firstLine = lines[0].split(",");
            const hasIdHeader = firstLine[0].toLowerCase() === "id" || !isNaN(parseInt(firstLine[0]));
            const startIndex = (firstLine[0].toLowerCase() === "id" || firstLine[0].toLowerCase() === "name") ? 1 : 0;

            let successCount = 0;
            let failCount = 0;
            setLoading(true);

            for (let i = startIndex; i < lines.length; i++) {
                const cols = lines[i].split(",");
                if (cols.length < 3) continue;

                let id, name, department, salary;

                if (cols.length >= 4) {
                    // Assume ID,Name,Dept,Salary
                    [id, name, department, salary] = cols;
                } else {
                    // Assume Name,Dept,Salary
                    [name, department, salary] = cols;
                }

                try {
                    const employeeData = {
                        name: name?.trim(),
                        department: department?.trim(),
                        salary: parseInt(salary?.trim() || "0")
                    };

                    const numericId = parseInt(id?.trim());
                    if (!isNaN(numericId)) {
                        await updateEmployee({ id: numericId, ...employeeData });
                    } else {
                        await addEmployee(employeeData);
                    }
                    successCount++;
                } catch (err) {
                    failCount++;
                    console.error("Import failed for row:", i, err);
                }
            }

            setLoading(false);
            showToast(`Processed ${successCount + failCount} records: ${successCount} successful, ${failCount} failed.`, successCount > 0 ? "success" : "error");
            load({}); // Refresh list

            // Reset input
            event.target.value = null;
        };
        reader.readAsText(file);
    };

    // Pagination
    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Derived
    const displayedEmployees = employees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const isSelected = (id) => selected.indexOf(id) !== -1;

    // Helper for avatar
    const stringToColor = (string) => {
        const colors = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e'];
        let hash = 0;
        for (let i = 0; i < string.length; i++) hash = string.charCodeAt(i) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <Fade in={true} timeout={800}>
            <Stack spacing={2}>
                {/* Stats & Analytics Toggle */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" fontWeight="700">
                        Total Staff: {loading ? <Skeleton width={60} inline /> : employees.length}
                    </Typography>
                    <Button
                        startIcon={showAnalytics ? <KeyboardArrowUpIcon /> : <AssessmentTwoToneIcon />}
                        onClick={() => setShowAnalytics(!showAnalytics)}
                        variant="soft"
                        sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                    >
                        {showAnalytics ? "Hide Analytics" : "View Analytics"}
                    </Button>
                </Stack>

                <Collapse in={showAnalytics}>
                    <AnalyticsDashboard employees={employees} />
                </Collapse>

                {/* Filters & Actions */}
                <Paper sx={{ p: 1.5, borderRadius: 3 }}>
                    <Grid container spacing={1.5} alignItems="center">
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                placeholder="Search by ID" size="small" fullWidth
                                value={filter.id} onChange={(e) => setFilter({ ...filter, id: e.target.value })}
                                InputProps={{ startAdornment: <InputAdornment position="start"><Box sx={{ opacity: 0.5 }}>#</Box></InputAdornment> }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                placeholder="Search Name" size="small" fullWidth
                                value={filter.name} onChange={(e) => setFilter({ ...filter, name: e.target.value })}
                                InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" sx={{ opacity: 0.5 }} /></InputAdornment> }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                placeholder="Department" size="small" fullWidth
                                value={filter.department} onChange={(e) => setFilter({ ...filter, department: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', gap: 1 }}>
                            <Button variant="contained" onClick={onSearch} sx={{ flex: 1 }}>Search</Button>
                            <Button variant="outlined" color="secondary" onClick={onClear}><RefreshRoundedIcon /></Button>
                        </Grid>
                    </Grid>

                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
                        {/* Bulk Actions */}
                        <Box>
                            {selected.length > 0 && (
                                <Fade in={true}>
                                    <Stack direction="row" alignItems="center" spacing={2} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), px: 2, py: 1, borderRadius: 2 }}>
                                        <Typography variant="subtitle2" fontWeight="700" color="primary">{selected.length} Selected</Typography>
                                        <Button
                                            size="small"
                                            color="error"
                                            startIcon={<DeleteTwoToneIcon />}
                                            onClick={() => setConfirm({ open: true, ids: selected })}
                                        >
                                            Delete
                                        </Button>
                                    </Stack>
                                </Fade>
                            )}
                        </Box>

                        <Stack direction="row" spacing={2}>
                            <Tooltip
                                title={
                                    <Box sx={{ textAlign: 'center', p: 1 }}>
                                        <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 700 }}>
                                            Format: ID,Name,Dept,Salary
                                        </Typography>
                                        <Typography variant="caption" sx={{ display: 'block', mb: 1, opacity: 0.8 }}>
                                            (Provide ID to update existing records)
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{ textDecoration: 'underline', cursor: 'pointer', color: 'secondary.light' }}
                                            onClick={(e) => { e.preventDefault(); onDownloadTemplate(); }}
                                        >
                                            Download Template
                                        </Typography>
                                    </Box>
                                }
                                arrow
                                placement="top"
                            >
                                <Button
                                    component="label"
                                    startIcon={<CloudUploadRoundedIcon />}
                                    variant="outlined"
                                    color="info"
                                    sx={{ borderRadius: 3, borderStyle: 'dashed' }}
                                >
                                    Import CSV
                                    <input type="file" hidden accept=".csv" onChange={handleFileUpload} />
                                </Button>
                            </Tooltip>
                            <Button
                                startIcon={<DownloadRoundedIcon />}
                                variant="outlined"
                                onClick={onExportCSV}
                                disabled={employees.length === 0}
                            >
                                Export CSV
                            </Button>
                            <Button
                                startIcon={<AddRoundedIcon />}
                                variant="contained"
                                color="primary"
                                onClick={() => navigate("/employees/add")}
                                sx={{
                                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                    boxShadow: "0 4px 14px 0 rgba(16, 185, 129, 0.4)",
                                    px: 3
                                }}
                            >
                                Add Employee
                            </Button>
                        </Stack>
                    </Stack>
                </Paper>

                {/* Data Table */}
                <Paper sx={{ overflow: 'hidden' }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            indeterminate={selected.length > 0 && selected.length < employees.length}
                                            checked={employees.length > 0 && selected.length === employees.length}
                                            onChange={handleSelectAll}
                                        />
                                    </TableCell>
                                    <TableCell>Employee Details</TableCell>
                                    <TableCell>Department</TableCell>
                                    <TableCell>Salary</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {loading ? (
                                    // SKELETON LOADING ROWS
                                    [1, 2, 3, 4, 5].map((n) => (
                                        <TableRow key={n}>
                                            <TableCell padding="checkbox" sx={{ py: 1 }}><Skeleton variant="rectangular" width={24} height={24} /></TableCell>
                                            <TableCell sx={{ py: 1 }}><Stack direction="row" spacing={1.5}><Skeleton variant="circular" width={32} height={32} /><Box><Skeleton width={100} /><Skeleton width={60} /></Box></Stack></TableCell>
                                            <TableCell sx={{ py: 1 }}><Skeleton width={80} /></TableCell>
                                            <TableCell sx={{ py: 1 }}><Skeleton width={70} /></TableCell>
                                            <TableCell sx={{ py: 1 }}><Skeleton width={50} /></TableCell>
                                            <TableCell align="right" sx={{ py: 1 }}><Skeleton width={80} /></TableCell>
                                        </TableRow>
                                    ))
                                ) : employees.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                            <Typography variant="body2" color="text.secondary">No employees found matching criteria.</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : displayedEmployees.map((e, index) => {
                                    const isItemSelected = isSelected(e.id);
                                    return (
                                        <Grow in={true} timeout={300 + (index * 50)} key={e.id}>
                                            <TableRow
                                                hover
                                                selected={isItemSelected}
                                                onClick={(event) => handleSelectOne(event, e.id)}
                                                sx={{
                                                    cursor: 'pointer',
                                                    '&:last-child td, &:last-child th': { border: 0 },
                                                    '& .MuiTableCell-root': { py: 1 }
                                                }}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isItemSelected}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                                        <Avatar
                                                            sx={{
                                                                bgcolor: stringToColor(e.name || "U"),
                                                                width: 32, height: 32,
                                                                fontSize: '0.9rem',
                                                                boxShadow: `0 2px 4px ${stringToColor(e.name || "U")}40`
                                                            }}
                                                        >
                                                            {(e.name || "U")[0].toUpperCase()}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="subtitle2" fontWeight={700} color="text.primary" sx={{ lineHeight: 1.2 }}>{e.name || "Unknown"}</Typography>
                                                            <Typography variant="caption" color="text.secondary" fontWeight={500}>ID: #{e.id}</Typography>
                                                        </Box>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={e.department || "General"}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                                                            fontWeight: 600,
                                                            color: 'text.secondary'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="subtitle2" fontWeight={600} fontFamily="monospace" letterSpacing="-0.5px">
                                                        {e.salary?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label="Active" color="success" size="small" variant="filled" sx={{ borderRadius: 1.5, fontWeight: 700, px: 0.5 }} />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Stack direction="row" spacing={1} justifyContent="flex-end" onClick={(e) => e.stopPropagation()}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => navigate(`/employees/edit/${e.id}`)}
                                                            sx={{ color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.1) }}
                                                        >
                                                            <EditTwoToneIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => setConfirm({ open: true, ids: [e.id] })}
                                                            sx={{ color: 'error.main', bgcolor: alpha(theme.palette.error.main || '#ef4444', 0.1) }}
                                                        >
                                                            <DeleteTwoToneIcon fontSize="small" />
                                                        </IconButton>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        </Grow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        count={employees.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25]}
                        sx={{ borderTop: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)" }}
                    />
                </Paper>

                <Dialog
                    open={confirm.open}
                    onClose={() => setConfirm({ open: false, ids: [] })}
                    PaperProps={{
                        sx: {
                            borderRadius: 4,
                            p: 2,
                            minWidth: 320,
                            backdropFilter: "blur(20px)",
                            background: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(255, 255, 255, 0.8)"
                        }
                    }}
                >
                    <DialogTitle sx={{ textAlign: "center", fontWeight: 700 }}>Confirm Deletion</DialogTitle>
                    <DialogContent sx={{ textAlign: "center" }}>
                        <Typography color="text.secondary">
                            Are you sure you want to permanently delete {confirm.ids.length > 1 ? <b>{confirm.ids.length} employees</b> : <b>employee #{confirm.ids[0]}</b>}?
                        </Typography>
                        <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                            This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                        <Button onClick={() => setConfirm({ open: false, ids: [] })} variant="text" color="inherit">Cancel</Button>
                        <Button variant="contained" color="error" onClick={onDelete} startIcon={<DeleteTwoToneIcon />} sx={{ borderRadius: 3, px: 3 }}>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Stack>
        </Fade>
    );
}
