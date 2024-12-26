import axios from 'axios'

console.log(process.env)
export const api = axios.create({
    baseURL: (process.env.VITE_PUBLIC_IP || "http://54.162.185.194:8000"),
});