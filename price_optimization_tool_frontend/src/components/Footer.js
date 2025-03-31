import React from "react";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "40px",
        maxHeight: '30px',
        backgroundColor: "#282c34",
        padding: "10px",
        display: "flex",
        justifyContent: "right"
      }}
    >
      <Button variant="outlined" color="info" onClick={() => navigate("/dashboard")}
        style={{
          fontSize: "12px",
          padding: "0 8px",
          lineHeight: "1",
        }}>
        Cancel
      </Button>
      <Button variant="contained" color="info"
        style={{
          fontSize: "12px",
          padding: "0 8px",
          lineHeight: "1",
          margin: '0px 20px'
        }}>
        Save
      </Button>
    </Box>
  );
};

export default Footer;
