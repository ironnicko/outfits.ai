import axios from 'axios'



export const api = axios.create({
    baseURL: process.env.VITE_PUBLIC_IP || "http://localhost" + ":8000",
});