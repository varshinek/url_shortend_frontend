import React, { useState, useEffect } from "react";
import http from "../../../utils/http";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import "./GetUrl.css";
import { Link } from "react-router-dom";

function GetUrl() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [changes, setChanges] = useState("ALL");
  const [mainData, setMainData] = useState([]);

  const copyContent = async (text,data) => {
    await navigator.clipboard.writeText(text);
    alert(`Successfully Copied URL - ${data}`)
  };

  const deleteURL = async (_id) => {
    alert("Deleting the  URL");
    try {
      await http.delete(`/url/delete/${_id}`);
      getUserURL();
    } catch (err) {
      if (err.message == "Network Error") {
        alert("Connection timeout! / DB not responding");
      } else if (err.response.status == 400) {
        alert(err.response.data);
      } else {
        alert(err.message);
      }
    }
  };

  const handleSelect = (e) => {
    setChanges(e.target.value);
  };

  const getUserURL = async () => {
    try {
      const { data } = await http.get("/url/get");
      // data.userURLs.sort((a, b) => a._id.localeCompare(b._id));
      data.userURLs.sort((a,b)=>Date.parse(b.createdAt) - Date.parse(a.createdAt))
      setData(data.userURLs);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.message == "Network Error") {
        setError("Connection timeout! / DB not responding");
      } else if (err.response.status == 400) {
        setError(err.response.data);
      } else {
        setError(err.message);
      }
    }
  };

  const openNewTab = (url) => {
    window.open(url, "_blank").focus();
    getUserURL();
  };

  useEffect(() => {
    getUserURL();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      if (changes == "ALL") {
        console.log('all');
        setMainData(data);
      }
      if(changes == "24-hrs"){
        const today = Date.now();
        const last24hrs = today - 86400000;

        const newData = data.filter(
          (ele) =>
            Date.parse(ele.createdAt) <= today &&
            Date.parse(ele.createdAt) >= last24hrs
        );
        setMainData(newData);
      }
      if (changes == "10-Days") {
        const today = Date.now();
        const tendays = today - 864000000;

        const newData = data.filter(
          (ele) =>
            Date.parse(ele.createdAt) <= today &&
            Date.parse(ele.createdAt) >= tendays
        );
        setMainData(newData);
      }
      if (changes == "30-Days") {
        console.log("30")
        const today = Date.now();
        const month = today - 2592000000;

        const newData = data.filter(
          (ele) =>
            Date.parse(ele.createdAt) <= today &&
            Date.parse(ele.createdAt) >= month
        );
        setMainData(newData);
      }
    }
  }, [data, changes]);

  return (
    <>
      {loading && !error ? (
        <>
        <div className="GetUrl_Container">
          <div className="GetUrl_Loading">
            <CircularProgress size={50} />
            <br></br>
            <p style={{marginTop:"10px"}}>Loading Users URLs</p>
          </div>
        </div>
        </>
      ) : (
        ""
      )}
      {!loading && error ? (
        <>
        <div className="GetUrl_Container">
          <div className="GetUrl_Error">
            <h3 style={{marginTop:"5px",fontWeight:"900",color:"#f1f1f1"}}>Error while getting user URLs</h3>
            <p style={{marginTop:"5px"}}>{error}</p>
          </div>
        </div>
        </>
      ) : (
        ""
      )}
      {!loading && !error && data.length == 0 ? (
        <>
        <div className="GetUrl_Container">
          <div className="GetUrl_NoData">
            <h3 style={{marginTop:"5px",fontWeight:"900",color:"#f1f1f1"}}>No data to show!</h3>
          </div>
        </div>
        </>
      ) : (
        ""
      )}
      {!loading && !error && data.length > 0 ? (
        <>
        <div className="GetUrl_Container">
          <div className="GetUrl_Filter">
            <div><h3>Table showing all URL's</h3></div>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                  Filter
                </InputLabel>
                <NativeSelect
                  defaultValue="ALL"
                  onChange={handleSelect}
                  inputProps={{
                    name: "filter",
                    id: "selectTag",
                  }}
                >
                  <option value="ALL">All</option>
                  <option value="24-hrs">last 24 hrs</option>
                  <option value="10-Days">10 Days</option>
                  <option value="30-Days">30 Days</option>
                </NativeSelect>
              </FormControl>
            </Box>
          </div>
          <div style={{ width: "100%" }}>
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 350, tableLayout: "fixed" }}
                size="small"
                aria-label="a dense table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Si. No</TableCell>
                    <TableCell align="left">Long URL</TableCell>
                    <TableCell align="center">Shortr URL</TableCell>
                    <TableCell align="center">Click Count</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mainData.map((ele, index) => (
                    <TableRow key={ele._id}>
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <Link to={`${ele.longURL}`} target="_blank">
                          {ele.longURL}
                        </Link>
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <button
                          style={{
                            border: "none",
                            backgroundColor: "white",
                            color: "blue",
                            textDecoration: "underline",
                          }}
                          onClick={() => openNewTab(`/${ele.shortURL}`)}
                        >
                          /{ele.shortURL}
                        </button>
                      </TableCell>
                      <TableCell align="center">{ele.clickCount}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          aria-label="copyURL"
                          onClick={() =>
                            copyContent(`https://sparkling-snickerdoodle-5bba03.netlify.app/${ele.shortURL}`,ele.shortURL)
                          }
                        >
                          <ContentCopyIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          aria-label="delete"
                          onClick={() => deleteURL(ele._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
        </>
      ) : (
        ""
      )}
    </>
  );
}

export default GetUrl;
