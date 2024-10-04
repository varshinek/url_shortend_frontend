import instance from "./http";

const setAuthToken = (Token) => {
    if(Token){
        instance.defaults.headers.common.Authorization = `Bearer ${Token}`
    } else {
        delete instance.defaults.headers.common.Authorization
    }
}

export default setAuthToken;