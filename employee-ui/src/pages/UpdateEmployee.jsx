import { useEffect, useState } from "react";
import { getEmployees, updateEmployee } from "../services/employeeApi";
import UpdateEmployeeDto from "../dto/UpdateEmployeeDto";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateEmployee() {
    const { id } = useParams();
    const [emp, setEmp] = useState(UpdateEmployeeDto());
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            const filter = { id: parseInt(id) };
            const res = await getEmployees(filter);
            setEmp(res.data[0]);
        };
        load();
    }, [id]);

    const submit = async () => {
        await updateEmployee(id, emp);
        navigate("/");
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Edit Employee</h2>

            <input
                placeholder="Name"
                value={emp.name}
                onChange={(e) => setEmp({ ...emp, name: e.target.value })}
            /><br /><br />

            <input
                placeholder="Department"
                value={emp.department}
                onChange={(e) => setEmp({ ...emp, department: e.target.value })}
            /><br /><br />

            <input
                placeholder="Salary"
                value={emp.salary}
                onChange={(e) => setEmp({ ...emp, salary: e.target.value })}
            /><br /><br />

            <button onClick={submit}>Update</button>
        </div>
    );
}
