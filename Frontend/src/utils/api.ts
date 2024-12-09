import axios from 'axios'

export const api = axios.create({
    baseURL: (process.env.VITE_PUBLIC_IP || import.meta.env.VITE_PUBLIC_IP || "http://" + window.location.hostname) + ":8000",
});
