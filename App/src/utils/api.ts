import axios from 'axios'

console.log(process.env)
export const api = axios.create({
    baseURL: ( "http://18.61.79.113:8000"),
});
