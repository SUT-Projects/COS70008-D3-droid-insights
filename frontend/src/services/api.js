import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000", // your FastAPI backend
});

export const predictCSV = (file) => {
  const data = new FormData();
  data.append("file", file);
  return API.post("/predict/csv", data);
};

export const predictOne = (record) =>
  API.post("/predict", { data: [record] });



// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://127.0.0.1:8000'
// });

// export const uploadCSV = (file) => {
//   const form = new FormData();
//   form.append('file', file);
//   return api.post('/predict/csv', form, {
//     headers: { 'Content-Type': 'multipart/form-data' }  
    
//   });
// };

// export const listUsers = () => api.get('/users');
// export const createUser = (u) => api.post('/users', u);
// export const listModels = () => api.get('/models');
// export const uploadModel = (m) => api.post('/models', m);
// export const getLogs = () => api.get('/logs');
// export const getReports = () => api.get('/reports');
// export const getStatus = () => api.get('/status');
