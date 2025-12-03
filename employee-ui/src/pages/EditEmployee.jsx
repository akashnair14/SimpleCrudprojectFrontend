import React, { useEffect, useState } from "react";
import { getEmployees, updateEmployee } from "../services/employeeApi.js";
import { useNavigate, useParams } from "react-router-dom";
import { Box, TextField, Button, Paper, Typography } from "@mui/material";

export default function EditEmployee() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ id: "", name: "", department: "", salary: "" });

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getEmployees({ Id: id });
                if (res.data && res.data.length > 0) {
                    const e = res.data[0];
                    setForm({ id: e.id, name: e.name, department: e.department, salary: e.salary });
                } else {
                    alert("Employee not found");
                    navigate("/employees");
                }
            } catch (err) {
                console.error(err);
                alert("Failed to load");
            }
        };
        load();
    }, [id, navigate]);

    const submit = async () => {
        try {
            const payload = { id: parseInt(form.id), name: form.name, department: form.department, salary: parseFloat(form.salary) || 0 };
            await updateEmployee(payload);
            navigate("/employees");
        } catch (err) {
            console.error(err);
            alert("Update failed");
        }
    };

    return (
        <Paper sx={{ p: 3, maxWidth: 600 }}>
            <Typography variant="h6" mb={2}>Edit Employee</Typography>
            <Box sx={{ display: "grid", gap: 2 }}>
                <TextField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <TextField label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
                <TextField label="Salary" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} type="number" />
                <Box>
                    <Button variant="contained" onClick={submit} sx={{ mr: 1 }}>Update</Button>
                    <Button variant="outlined" onClick={() => navigate("/employees")}>Cancel</Button>
                </Box>
            </Box>
        </Paper>
    );
}
