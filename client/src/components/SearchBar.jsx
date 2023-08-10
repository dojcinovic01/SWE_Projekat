import { memo, useEffect, useState } from "react";
import {
    Box,
    IconButton,
    InputBase,
    useTheme,
  } from "@mui/material";
  import {
    Search,
  } from "@mui/icons-material";

import FlexBetween from "./FlexBetween";

const SearchBar= ({setResults})=>{

    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const [query, setQuery]=useState("");
    const [data, setData]=useState([]);


    useEffect(()=>{
        const searchData= async ()=>{
          const res = await fetch(`http://localhost:3001/users/pretrazi?q=${query}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
            const resData = await res.json();
            // const filterData = resData.filter((user) => {
            //     return query && user && user.name && user.name.toLowerCase().includes(query.toLowerCase());
            //   });
              
            setResults(resData);
        }
        searchData();

    },[query])
    

    return (
        <FlexBetween
            backgroundColor={neutralLight}
            borderRadius="9px"
            gap="3rem"
            padding="0.1rem 1.5rem"
          >
                <InputBase
                     placeholder="Search..." 
                     
                     onChange={(e)=>setQuery(e.target.value)}
                />
                <IconButton>
                    <Search />
                </IconButton>
        </FlexBetween>
        
    );
}

export default memo(SearchBar);