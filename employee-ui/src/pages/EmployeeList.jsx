import React, { useEffect, useState } from "react";
import { getEmployees, deleteEmployee } from "../services/employeeApi";
import { useNavigate } from "react-router-dom";

import {
    Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography, Box, TextField, Stack, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";

export default function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [filter, setFilter] = useState({ id: "", name: "", department: "", salary: "" });
    const [confirm, setConfirm] = useState({ open: false, id: null });
    const navigate = useNavigate();

    const load = async (f = {}) => {
        try {
            const params = {};
            if (f.id) params.Id = f.id;
            if (f.name) params.Name = f.name;
            if (f.department) params.Department = f.department;
            if (f.salary) params.Salary = f.salary;
            const res = await getEmployees(params);
            setEmployees(res.data);
        } catch (err) {
            console.error(err);
            alert("Failed to load employees");
        }
    };

    useEffect(() => { load(); }, []);

    const onSearch = () => load(filter);

    const onClear = () => {
        setFilter({ id: "", name: "", department: "", salary: "" });
        load({});
    };

    const onDelete = async () => {
        try {
            await deleteEmployee(confirm.id);
            setConfirm({ open: false, id: null });
            load(filter);
        } catch (err) {
            console.error(err);
            alert("Delete failed");
        }
    };

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">Employees</Typography>
                <Button variant="contained" onClick={() => navigate("/employees/add")}>Add Employee</Button>
            </Stack>

            <Paper sx={{ p: 2, mb: 2 }}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField label="Id" value={filter.id} onChange={(e) => setFilter({ ...filter, id: e.target.value })} />
                    <TextField label="Name" value={filter.name} onChange={(e) => setFilter({ ...filter, name: e.target.value })} />
                    <TextField label="Department" value={filter.department} onChange={(e) => setFilter({ ...filter, department: e.target.value })} />
                    <TextField label="Salary" value={filter.salary} onChange={(e) => setFilter({ ...filter, salary: e.target.value })} />
                    <Button variant="contained" onClick={onSearch}>Search</Button>
                    <Button variant="outlined" onClick={onClear}>Clear</Button>
                </Stack>
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Salary</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {employees.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No records found</TableCell>
                            </TableRow>
                        ) : employees.map((e) => (
                            <TableRow key={e.id}>
                                <TableCell>{e.id}</TableCell>
                                <TableCell>{e.name}</TableCell>
                                <TableCell>{e.department}</TableCell>
                                <TableCell>{e.salary}</TableCell>
                                <TableCell align="right">
                                    <Button size="small" onClick={() => navigate(`/employees/edit/${e.id}`)}>Edit</Button>
                                    <Button size="small" color="error" onClick={() => setConfirm({ open: true, id: e.id })} sx={{ ml: 1 }}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={confirm.open} onClose={() => setConfirm({ open: false, id: null })}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete employee id {confirm.id}?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirm({ open: false, id: null })}>Cancel</Button>
                    <Button color="error" onClick={onDelete}>Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
