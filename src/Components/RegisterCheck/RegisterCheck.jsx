import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import http from "../../../utils/http";
import "./RegisterCheck.css";

function RegisterCheck() {
  const { registerToken } = useParams();
  const [animation, setAnimation] = useState(true);
  const [error, setError] = useState("");
  const verifyUserRegistration = async (registerToken) => {
    try {
      const res = await http.get(`/auth/checkRegisterUser/${registerToken}`);
      if (res.status == 200) {
        setAnimation(false);
      }
    } catch (err) {
      setAnimation(false);
      if (err.message == "Network Error") {
        setError("Connection timeout! DB not responding");
      } else if (err.response.status == 400) {
        setError(err.response.data);
      } else {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    verifyUserRegistration(registerToken);
  }, []);

  return (
    <>
      <div className="RegisterCheck_Container">
        {animation && !error ? (
          <>
          <div className="RegisterCheck_Loading">
            <CircularProgress />
            </div>
          </>) : ""}
        {!animation && !error ? (
          <>
          <div className="RegisterCheck_Success">
          <h2>Verification Success</h2>
          <p>Please login with your email and password</p>
          </div>
          </>) : ""}
        {!animation && error ? (
          <>
          <div className="RegisterCheck_Error">
            <h2>Error Verifying Register</h2>
            <p>{error}</p>
          </div>
          </>) : ""}
      </div>
    </>
  );
}

export default RegisterCheck;
