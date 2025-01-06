import axios from 'axios'

console.log(process.env)
export const api = axios.create({

    baseURL: ( "http://127.0.0.1:8000"),
});
