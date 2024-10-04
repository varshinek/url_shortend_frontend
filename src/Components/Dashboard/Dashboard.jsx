import React, { useEffect, useState } from "react";
import { useToken } from "../../TokenContext/TokenProvider";
import "./Dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import http from "../../../utils/http";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

function Dashboard() {
  const navigate = useNavigate();
  const user = useToken();
  const [data, setData] = useState([]);
  const [totalUrl, setTotalUrl] = useState(0);
  const [totalClick, setTotalClick] = useState(0);
  const [highestClickURL, setHighestClickURL] = useState("");
  const [lastfiveDays, setLastfiveDays] = useState(0);
  const [daywiseURL, setDaywiseURL] = useState([]);

  const getData = async () => {
    try {
      const { data } = await http.get("/url/get");
      data.userURLs.sort((a, b) => a._id.localeCompare(b._id));
      setData(data.userURLs);
    } catch (err) {
      if (err.message == "Network Error") {
        setError("Connection timeout! / DB not responding");
      } else if (err.response.status == 400) {
        setError(err.response.data);
      } else {
        setError(err.message);
      }
    }
  };

  const getDaywiseData = async (lastfiveDaysofURL, today, fiveDays) => {
    let endDate = today;
    let startDate = endDate - 86400000;
    let array = [];
    for (var i = 0; i < 5; i++) {
      const lastOneDayData = await lastfiveDaysofURL.filter(
        (ele) =>
          Date.parse(ele.createdAt) <= endDate &&
          Date.parse(ele.createdAt) >= startDate
      );
      array.push(lastOneDayData.length);
      endDate = startDate;
      startDate = endDate - 86400000;
    }
    setDaywiseURL(array);
  };

  useEffect(() => {
    if (user) {
      getData();
    }
  }, []);

  useEffect(() => {
    if (user && data.length > 0) {
      const today = Date.now();
      const fiveDays = today - 432000000;

      const lastfiveDaysofURL = data.filter(
        (ele) =>
          Date.parse(ele.createdAt) <= today &&
          Date.parse(ele.createdAt) >= fiveDays
      );
      setLastfiveDays(lastfiveDaysofURL.length);

      getDaywiseData(lastfiveDaysofURL, today, fiveDays);
    }
  }, [data]);

  useEffect(() => {
    if (user && data.length > 0) {
      data.sort((a, b) => b.clickCount - a.clickCount);
      setTotalUrl(data.length);
      if (data[0].clickCount > 0) {
        setHighestClickURL(data[0]);
      }
      let clicks = 0;
      data.map((ele) => {
        clicks = clicks + ele.clickCount;
      });
      setTotalClick(clicks);
    }
  }, [data]);

  return (
    <>
      {!user && (
        <>
          <div className="Container">
            <div className="Container1">
              <h3>Login / SignUp to use Application</h3>
              <div className="Container2">
                <div className="Login">
                  <h3>Already have an Account</h3>
                  <button onClick={() => navigate("/login")}>Login</button>
                </div>
                <div className="Register">
                  <h3>No Account? No problem! Create now</h3>
                  <button onClick={() => navigate("/register")}>Sign Up</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {user && (
        <>
          <div className="Container">
            <div className="Welcome_User">
              <h2>Welcome, {`${user.firstname}${user.lastname}`}!</h2>
            </div>
            <div className="Dashboard_Cards">
              
            <Card sx={{minHeight:170, display:"flex", margin:'5px',textAlign: "center",alignItems:"center", alignContent:"center", maxWidth:280}}>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div" sx={{width: "150px"}}>
                    Total URL's
                  </Typography>
                  <Typography variant="body2" sx={{fontSize:"3rem", marginTop:"15px", fontWeight:900, color:"rgb(159, 62, 32)"}} color="text.secondary">
                    {totalUrl}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
            
            
            <Card sx={{minHeight:170, display:"flex", margin:'5px',textAlign: "center", maxWidth:280}}>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div" sx={{width: "150px"}}>
                    Total Click count
                  </Typography>
                  <Typography variant="body2" sx={{fontSize:"3rem", marginTop:"15px", fontWeight:900, color:"rgb(220, 167, 43)"}} color="text.secondary">
                    {totalClick}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
            
            {highestClickURL ? (
              
              <Card sx={{minHeight:170, display:"flex", margin:'5px',textAlign: "center", maxWidth:280}}>
                <CardActionArea>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" sx={{width: "150px"}}>
                      Highest clickout url
                    </Typography>
                    <Typography variant="body2" sx={{fontSize:"1.5rem", marginTop:"15px", fontWeight:900}} color="text.secondary">
                      <Link to={`/${highestClickURL.shortURL}`} target="_blank">
                        /{highestClickURL.shortURL}
                      </Link>
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
              
            ) : (
              
              <Card sx={{minHeight:170, display:"flex", margin:'5px',textAlign: "center", maxWidth:280}}>
                <CardActionArea>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" sx={{width: "150px"}}>
                      Highest clickout url
                    </Typography>
                    <Typography sx={{fontSize:"3rem", color:"gray",marginTop:"15px", fontWeight:900}} variant="body2" color="text.secondary">
                      None
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
              
            )}
            
            <Card sx={{minHeight:170, display:"flex", margin:'5px',textAlign: "center", maxWidth:280}}>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div" sx={{width: "150px"}}>
                    Total URL created last 5 days
                  </Typography>
                  <Typography sx={{fontSize:"3rem", marginTop:"15px", fontWeight:900, color:"yellowgreen"}} variant="body2" color="text.secondary">
                    {lastfiveDays}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
            </div>
            <div className="Tabel_Header">
              <h2>Last 5 days of Record</h2>
            </div>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 280 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Si. No</TableCell>
                    <TableCell align="center">Past Days</TableCell>
                    <TableCell align="center">Total URl created</TableCell>
                  </TableRow>
                </TableHead>
                {daywiseURL.length > 0 ?<TableBody>
                  {daywiseURL.map((ele, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell align="center">Day-{index + 1}</TableCell>
                      <TableCell align="center">{ele}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>:(
                  <>
                    <p className="Tabel_Header"><h3 style={{color:"darkgray"}}>No Recent Records!</h3></p>
                  </>
                )}
              </Table>
            </TableContainer>
          </div>
        </>
      )}
    </>
  );
}

export default Dashboard;
