import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";


const FriendListWidget = ({ userId, isProfile=false, typeTrader=false }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const [friends, setFriends]=useState([]);

  const getRecomend = async () => {
    const response = await fetch(`http://localhost:3001/users/recommended`,{
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id:userId })
      }
    );
    const data = await response.json();
    //console.log(data.prijatelji);
    setFriends (data.prijatelji );
  
  };

  const getPopular = async () => {
    const response = await fetch(`http://localhost:3001/users/popular`,{
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
     
      });
    const data = await response.json();
    setFriends (data.najpopularniji);
    //dispatch(setFriends({friends:[]}));
  };

  useEffect(() => {
    if(isProfile){
      getRecomend();
    }
    else{
      getPopular();
    }
    
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    
    (isProfile && (typeTrader==="profi" || typeTrader==="Admin")) ? (<Box></Box>):
    (<WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem", textAlign:"center"}}
      >
        {isProfile? "Preporučeni" : "Popularni"}
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {friends && friends.map((friend) => (
          <Friend
            key={friend.id}
            friendId={friend.id}
            name={friend.name}
            username={friend.username}
            profilePicture={friend.picture}
          />
        ))}
      </Box>
    </WidgetWrapper>)
    
  );
};

export default FriendListWidget;

