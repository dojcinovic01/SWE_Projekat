import { Box, Typography,useTheme,useMediaQuery } from "@mui/material";
import Navbar from "scenes/navbar";
import Form from "./Form";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const LoginPage=()=>{

    const theme = useTheme();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const token=Boolean(useSelector((state=>state.token)));
    const navigate=useNavigate();
    const mode=(useSelector((state=>state.mode)));


    useEffect(()=>{
      if(token){
        navigate("/home");
      }
    },[]);
    return (
        <Box>
            <Box position="sticky" top="0" zIndex="100">
              <Navbar />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              {isNonMobileScreens && (<Box
                sx={{ height: "30%", width: "30%", marginTop:"40px", marginLeft:"90px" }}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <img
                  style={{ objectFit: "cover", width: "95%", height: "auto" }}
                  alt="logo"
                  src={mode==="dark" ? "http://localhost:3001/assets/TTLogoWhite.png" : "http://localhost:3001/assets/TTLogo.png"}
                />
              </Box>)}
              <Box
                width={isNonMobileScreens ? "25%" : "93%"}
                p="1.5rem"
                m="1.5rem auto"
                borderRadius="1.5rem"
                backgroundColor={theme.palette.background.alt}
              >
                <Typography fontWeight="300" variant="h5" sx={{ mb: "1.5rem", textAlign: "center" }}>
                  Dobro došli
                </Typography>

                <Form />
              </Box>
            </Box>


    </Box>
    )
}

export default LoginPage;
