import axios from 'axios'

export const api = axios.create({
    baseURL: (import.meta.env.VITE_PUBLIC_IP || "http://" + window.location.hostname) + ":8000",
});
