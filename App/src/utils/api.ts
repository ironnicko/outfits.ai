import axios from 'axios'

console.log(process.env)
export const api = axios.create({
    baseURL: (process.env.VITE_PUBLIC_IP || "http://18.212.84.180:8000"),
});