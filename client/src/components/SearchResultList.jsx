import { useState,memo } from "react";
import {
    Box,
    Typography,
    useTheme,
  } from "@mui/material";
  import {
    Search
  } from "@mui/icons-material";
import Friend from "./Friend";


const SearchResultList=({results})=>{

    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;

    return(
        <Box
            sx={
                {
                    backgroundColor: neutralLight,
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto',
                    gap:'5px',
                    width:'305px'
                }
            }
        >
            {results.map((result,id)=>{
                return (
                    <Friend 
                    key={id} 
                    friendId={result._id}
                    name={result.name} 
                    username={result.username} 
                    profilePicture={result.picturePath} 
                    typeTrader={result.tip} />
                )
                    
            })}
        </Box>

    );
}

export default memo(SearchResultList);
