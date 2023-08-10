import { Dangerous } from "@mui/icons-material";
import { Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";


const AdvertWidget = () => {
  const { palette } = useTheme();
  const token=useSelector((state)=>state.token);
  const [advertisment, setAdvertisment] =useState({});
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;



  const Comercial= async () => {
    const response= await fetch("http://localhost:3001/users/reklama",{
        method:"POST",
        headers:{
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
    });

    const ad=await response.json();

    if(ad.reklama!==undefined ){
      setAdvertisment(ad.reklama)
    }
    

  };
  
  useEffect(()=>{
    Comercial();

  }, []);

  

  return (
    <WidgetWrapper
    >
        <Typography color={dark} variant="h5" fontWeight="500" textAlign="center" marginBottom="10px">
          Sponzorisano
        </Typography>
        <Friend
            key={advertisment.id}
            friendId={advertisment.id}
            name={advertisment.name}
            username={advertisment.username}
            profilePicture={advertisment.picture}
            
          />

        <Typography style={{ fontStyle: 'italic', fontFamily: 'Arial', marginTop:"15px", textAlign:"center" }}>
          {advertisment.slogan}
        </Typography>

    </WidgetWrapper>
  );
};

export default memo(AdvertWidget);
