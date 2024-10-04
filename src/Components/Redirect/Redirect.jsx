import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import http from '../../../utils/http'
import CircularProgress from "@mui/material/CircularProgress";
import './Redirect.css'

function Redirect() {
    const {shortURL} = useParams();
    const [error,setError] = useState('');
    const [loading,setLoading] = useState(true);

    const redirectURL = async() =>{
        try{
            const res = await http.get(`/url/redirect/${shortURL}`)
            window.location.assign(res.data.longURL);
        } catch(err){
            setLoading(false);
            if (err.message == "Network Error") {
                setError("Connection timeout! / DB not responding");
              } else if (err.response.status == 400) {
                setError(err.response.data);
              } else {
                setError(err.message);
              }
        }
    }

    useEffect(()=>{
        redirectURL();
    },[])
  return (
    <div className='Redirect_Container'>
      <h2>Redirect link - {shortURL}</h2>
      {error && 
      <div className='Redirect_Error'>
        <h2>Error</h2>
         <p>{error}</p>
      </div>}
      {loading && <div className='Redirect_Loading'>
        <CircularProgress size={50}/><br></br>
        <p>Redirecting to your site please wait!!</p>
        </div>}
    </div>
  )
}

export default Redirect
