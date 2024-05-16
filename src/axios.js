import axios from "axios";

const makeRequest = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_ORIGIN,
  withCredentials: true,
});

export default makeRequest;
