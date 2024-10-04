import axios from "axios";

const instance = axios.create({
    baseURL:`https://urlshortener-backend-2gko.onrender.com/api`
    // timeout:1000
})

export default instance;