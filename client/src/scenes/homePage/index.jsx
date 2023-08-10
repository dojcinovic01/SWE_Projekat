import { Box, useMediaQuery} from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import PostsWidget from "scenes/widgets/PostsWidget";


const HomePage=()=>{

  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const{id,profilePicture,tip}=useSelector((state=>state.user));
  

  return (
    <Box>
      <Box position="sticky" top="0" zIndex="100">
        <Navbar />
      </Box>
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "20%" : undefined}>
          <UserWidget userId={id} profilePicture={profilePicture} />
        </Box>

        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <PostsWidget />
        </Box>

        
          <Box flexBasis="20%">
            {tip!=="Admin" && <AdvertWidget />}
            <Box m="2rem 0" />
            <FriendListWidget />
          </Box>
        
      </Box>
    </Box>
  )
};

export default HomePage;