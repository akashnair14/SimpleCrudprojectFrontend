import React, { useState } from "react";
import { addEmployee } from "../services/employeeApi";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Paper, Typography } from "@mui/material";

export default function AddEmployee() {
    const [form, setForm] = useState({ name: "", department: "", salary: "" });
    const navigate = useNavigate();

    const submit = async () => {
        try {
            const payload = { name: form.name, department: form.department, salary: parseFloat(form.salary) || 0 };
            await addEmployee(payload);
            navigate("/employees");
        } catch (err) {
            console.error(err);
            alert("Add failed");
        }
    };

    return (
        <Paper sx={{ p: 3, maxWidth: 600 }}>
            <Typography variant="h6" mb={2}>Add Employee</Typography>
            <Box sx={{ display: "grid", gap: 2 }}>
                <TextField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <TextField label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
                <TextField label="Salary" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} type="number" />
                <Box>
                    <Button variant="contained" onClick={submit} sx={{ mr: 1 }}>Save</Button>
                    <Button variant="outlined" onClick={() => navigate("/employees")}>Cancel</Button>
                </Box>
            </Box>
        </Paper>
    );
}
