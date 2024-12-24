import axios from 'axios'

console.log(process.env)
export const api = axios.create({
    baseURL: (process.env.VITE_PUBLIC_IP || "http://192.168.1.2:8000"),
});