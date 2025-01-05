import axios from 'axios'

console.log(process.env)
export const api = axios.create({
    baseURL: ( "http://192.168.1.6:8000"),
});
