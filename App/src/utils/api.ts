import axios from 'axios'


export const api = axios.create({

    baseURL: ( "http://ec2-18-60-153-234.ap-south-2.compute.amazonaws.com:8000"),
    
});
