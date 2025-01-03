import axios from 'axios'

console.log(process.env)
export const api = axios.create({
    baseURL: (process.env.VITE_PUBLIC_IP || "http://98.130.119.141:8000"),
});
