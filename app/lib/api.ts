import axios from 'axios'
const api = axios.create({
    baseURL: "http://localhost:3000/",
    withCredentials:true    //cookies ka liya
})
 
export default api;
