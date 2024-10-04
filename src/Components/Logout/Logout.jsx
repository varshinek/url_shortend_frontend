import React, { useEffect } from 'react'

function Logout() {

    const remove = async () =>{
        try{
            localStorage.removeItem("token");
            window.location = "/";
        } catch (err){
            console.log(err)
        }
    }

    useEffect(()=>{remove()},[])
    
    return null;
}

export default Logout
