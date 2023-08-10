import { Box, useMediaQuery} from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import { useParams,useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";

const ProfilPage=()=>{

    const { userId } = useParams();
    const{id, tip}= useSelector((state)=>state.user);
    const [user, setUser] = useState({});;
    const token = useSelector((state) => state.token);
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const isAll=Boolean(userId===id);
    const navigate = useNavigate(); 
    //console.log(userId);

    const getUser = async () => {
        
        const response = await fetch(`http://localhost:3001/users/${userId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if(response.status===200){
            setUser(data.user);
            //console.log(data.user);
        }
        else if (Object.keys(user).length===0){
            navigate('/home');
            return null;
        }
        
      };
    
      useEffect(() => {
        getUser();

      }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

      if (Object.keys(user).length===0) {
        return null;
      }

    return (
        <Box key={userId}>
            <Box position="sticky" top="0" zIndex="100">
             <Navbar />
            </Box>
            <Box
                width="100%"
                padding="2rem 6%"
                display={isNonMobileScreens ? "flex" : "block"}
                gap="0.5rem"
            >
                <Box flexBasis={isNonMobileScreens ? "20%" : undefined}>
                    <UserWidget userId={userId} profilePicture={user.profilePicture} isProfile/>
                    <Box m="2rem 0" />
                    <FriendListWidget userId={userId} isProfile typeTrader={user.tip}/>
                </Box>

                <Box
                    flexBasis={isNonMobileScreens ? "35%" : undefined}
                    mt={isNonMobileScreens ? undefined : "2rem"}
                    marginLeft={isNonMobileScreens? "100px" : undefined } 
                >
                    {userId===id && <MyPostWidget />}
                    <Box m="2rem 0" />
                    <PostsWidget  userId={userId} isProfile />
                </Box>

                {tip!=="Admin" && <Box flexBasis={isNonMobileScreens ? "20%" : undefined}
                    mt={isNonMobileScreens ? undefined : "2rem"}
                    marginLeft={isNonMobileScreens? "100px" : undefined }  >
                     <AdvertWidget />
                </Box>}

            </Box>

        </Box>
    )
}

export default ProfilPage;