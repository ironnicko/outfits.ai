import axios from 'axios'

console.log(process.env)
export const api = axios.create({
    baseURL: ( "http://localhost:8000"),
});
