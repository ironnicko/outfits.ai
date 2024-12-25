import axios from 'axios'

console.log(process.env)
export const api = axios.create({
    baseURL: (process.env.VITE_PUBLIC_IP || "http://52.203.4.16:8000"),
});