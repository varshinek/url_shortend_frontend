import React, {useState,useEffect} from 'react'
import http from '../../../utils/http.js'
import { useNavigate } from "react-router-dom";
import {useToken} from '../../TokenContext/TokenProvider.jsx'
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from '@mui/material/CircularProgress';
import './Register.css'

function Register() {
  const user = useToken();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [animation,setAnimation] = useState(false);

  const [loginDetails, setLoginDetails] = useState({
    firstname:"",
    lastname:"",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginDetails((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loginDetails.email || !loginDetails.password || !loginDetails.firstname || !loginDetails.lastname) {
      setError("Credentials required for login");
      return;
    } else {
      setAnimation(true);
      try {
        const res = await http.post("/auth/sendRegisterMail", loginDetails);
        if(res.status == 200){
          setAnimation(false);
          alert(`Account Verification link sent to your email - ${loginDetails.email}`)
          setLoginDetails({
            firstname:"",
            lastname:"",
            email: "",
            password: ""
          })
        }
      } catch (err) {
        setAnimation(false)
        if (err.message == "Network Error") {
          setError("Connection timeout! / DB not responding");
        } else if (err.response.status == 400) {
          setError(err.response.data);
        } else {
          setError(err.message);
        }
      }
    }
  };

  useEffect(()=>{
    if(user){
      navigate('/')
    }
  },[])
  return (
    <>
        <div className="Register_Form">
        <Box
          className="Register_Box"
          component="form"
          sx={{ m: 1, maxWidth: "300px" }}
          noValidate
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <Typography
            variant="body2"
            className="Register_header"
            sx={{
              textShadow: "-2px 0px 2px gray",
              fontWeight: "600",
              margin: "10px",
            }}
            gutterBottom
          >
            Provide valid credentials to Register account
          </Typography>
          <div>
          <TextField
            type="text"
            name="firstname"
            id="FirstName"
            label="First Name"
            variant="outlined"
            value={loginDetails.firstname}
            sx={{ margin: "10px 2px", width: "85%" }}
            onChange={handleChange}
          />
          <TextField
            type="text"
            name="lastname"
            id="LastName"
            label="Last Name"
            variant="outlined"
            value={loginDetails.lastname}
            sx={{ margin: "10px 2px", width: "85%" }}
            onChange={handleChange}
          />
          </div>
          <TextField
            type="email"
            name="email"
            id="Email"
            label="Email"
            variant="outlined"
            value={loginDetails.email}
            sx={{ margin: "10px 2px", width: "85%" }}
            onChange={handleChange}
          />
          <TextField
            type="password"
            name="password"
            id="Password"
            label="Password"
            variant="outlined"
            value={loginDetails.password}
            sx={{ margin: "10px 2px", width: "85%" }}
            onChange={handleChange}
          />
          {error && (
            <>
              <Typography variant="body2" className="Register_Error" gutterBottom>
                {error}
              </Typography>
            </>
          )}
          <Button
            variant="contained"
            sx={{ marginTop: "10px", marginBottom: "20px" }}
            type="submit"
            color="success"
          >
            {!animation ? "Sign Up" : <CircularProgress size={24}/>}
          </Button>
        </Box>
      </div>
    </>
  )
}

export default Register
