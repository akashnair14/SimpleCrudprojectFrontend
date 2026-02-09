import axios from "axios";

const api = axios.create({
    baseURL: "https://localhost:7011", // change if your backend runs elsewhere
});

export async function getEmployees(filters = {}) {
    // filters: { id, name, department, salary }
    const response = await api.get("/api/employee/GetEmployeeList", {
        params: filters,
    });
    return response.data;
}

export async function addEmployee(employee) {
    // { name, department, salary }
    await api.post("/api/employee/AddEmployee", employee);
}

export async function updateEmployee(employee) {
    // { id, name, department, salary }
    await api.put("/api/employee/UpdateEmployee", employee);
}

export async function deleteEmployee(id) {
    await api.delete("/api/employee/DeleteEmployee", {
        data: { id },
    });
}
