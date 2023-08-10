import { Box, Typography,useTheme,useMediaQuery } from "@mui/material";
import Navbar from "scenes/navbar";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ForgetForm from "./ForgetForm";
const ForgetPage=()=>{

    const theme = useTheme();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const token=Boolean(useSelector((state=>state.token)));
    const navigate=useNavigate();


    useEffect(()=>{
      if(token){
        navigate("/home");
      }
    },[]);
    return (
        <Box>
            <Navbar/>
            <Box
              width={isNonMobileScreens ? "30%" : "93%"}
              p="1.5rem"
              m="1.5rem auto"
              borderRadius="1.5rem"
              backgroundColor={theme.palette.background.alt}
            >
              <Typography fontWeight="300" variant="h5" sx={{ mb: "1.5rem",textAlign:"center" }}>
                Unesite Vašu mejl adresu ili korisničko ime
              </Typography>

              <ForgetForm/>
              
            </Box>

    </Box>
    )
}

export default ForgetPage;
