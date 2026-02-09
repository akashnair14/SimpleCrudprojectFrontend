import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const BASE_URL = `${API_BASE}/api/employee`;

export const getEmployees = (filter = {}) => {
    return axios.get(`${BASE_URL}/GetEmployeeList`, { params: filter });
};

export const addEmployee = (data) => {
    return axios.post(`${BASE_URL}/AddEmployee`, data);
};

export const updateEmployee = (data) => {
    return axios.put(`${BASE_URL}/UpdateEmployee`, data);
};

export const deleteEmployee = (id) => {
    return axios.delete(`${BASE_URL}/DeleteEmployee`, { data: { id } });
};
