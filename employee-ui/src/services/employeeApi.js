import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const BASE_URL = `${API_BASE}/api/GetEmployeeList`;

export const getEmployees = (filter = {}) => {
    return axios.get(`${BASE_URL}/list`, { params: filter });
};

export const addEmployee = (data) => {
    return axios.post(`${BASE_URL}/add`, data);
};

export const updateEmployee = (data) => {
    return axios.put(`${BASE_URL}/update`, data);
};

export const deleteEmployee = (id) => {
    return axios.delete(`${BASE_URL}/delete`, { data: { id } });
};
