import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import http from "../../../utils/http";
import IconButton from "@mui/material/IconButton";
import ContentPasteRoundedIcon from "@mui/icons-material/ContentPasteRounded";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Snackbar from "@mui/material/Snackbar";
import { Link } from "react-router-dom";
import Alert from "@mui/material/Alert";
import "./AddUrl.css";

function AddUrl() {
  const [longURL, setLongURL] = useState("");
  const [error, setError] = useState("");
  const [animation, setAnimation] = useState(false);
  const [data, setData] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e) => {
    setAnimation(true);
    e.preventDefault();
    if(!longURL){
      setAnimation(false);
      setError("URL required to shorthen")
    }else{
    try {
      const res = await http.post("/url/create", { longURL });
      setData(res.data.new_URL);
      setAnimation(false);
      setLongURL('')
    } catch (err) {
      setAnimation(false);
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

  const pasteText = async () => {
    const text = await navigator.clipboard.readText();
    setLongURL(text);
  };

  const copyText = async (text) => {
    await navigator.clipboard.writeText(text);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="Add_Url_Container">
        <Box
          className="Add_Url_Box"
          component="form"
          sx={{ m: 1, width:"80%" }}
          noValidate
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <Typography
            variant="body2"
            className="Add_Url_header"
            sx={{
              textShadow: "1px 1px 2px gray",
              fontWeight: "800",
              marginTop: "5px",
            }}
            gutterBottom
          >
            Paste the URL to be shortened
          </Typography>
          <div className="Paste_Div">
            <TextField
              type="text"
              name="longURL"
              id="Long_URL"
              label="Paste URL..."
              variant="outlined"
              value={longURL}
              sx={{ margin: "10px 2px", width: "85%" }}
              onChange={(e) => setLongURL(e.target.value)}
            />
            <IconButton
              color="primary"
              aria-label="content_paste"
              onClick={() => pasteText()}
            >
              <ContentPasteRoundedIcon sx={{fontSize:"35px"}}/>
            </IconButton>
          </div>
          {error && (
            <>
              <Typography variant="body2" className="Add_Url_Error" gutterBottom>
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
            {!animation ? "Create URL" : <CircularProgress size={24} />}
          </Button>
          {data && (
            <>
            <div className="Result_Url">
              <p className="LongUrl_Result">longURL - {data.longURL}</p>
              <p>
                shortURL -{" "}
                <Link
                  style={{curser:'pointer'}}
                  target="_blank"
                  to={`https://sparkling-snickerdoodle-5bba03.netlify.app/${data.shortURL}`}
                >
                  {data.shortURL}
                </Link>
              </p>
              <p>
                Copy URL -
                <IconButton
                  color="primary"
                  aria-label="content_paste"
                  onClick={() =>
                    copyText(`https://sparkling-snickerdoodle-5bba03.netlify.app/${data.shortURL}`)
                  }
                >
                  <ContentCopyIcon />
                </IconButton>
              </p>
              </div>
            </>
          )}
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
            key={"top" + "right"}
          >
            <Alert
              onClose={handleClose}
              severity="success"
              variant="filled"
              sx={{ width: "100%" }}
            >
              URL Copied to clipboard!
            </Alert>
          </Snackbar>
        </Box>
      </div>
    </>
  );
}

export default AddUrl;
