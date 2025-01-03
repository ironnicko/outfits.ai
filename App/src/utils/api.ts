import axios from 'axios'

console.log(process.env)
export const api = axios.create({
    baseURL: (process.env.VITE_PUBLIC_IP || "http://18.60.57.155:8000"),
});

export const bpi = axios.create({
    baseURL: ( "http://18.60.57.155:8001"),
});
