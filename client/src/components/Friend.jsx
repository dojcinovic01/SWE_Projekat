import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

const Friend = ({ friendId, name,username, profilePicture, typeTrader=false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  //const friends = useSelector((state) => state.user.friends);
  const contentLength=friendId ? friendId.length : 0;
  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  

  return (
    <FlexBetween onClick={() => {
      if (contentLength>5) {
        navigate(`/profile/${friendId}`);
        navigate(0);
      }
    }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <UserImage image={profilePicture} size="55px" />
        <Box sx={{ marginLeft: "1rem"}}>
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
               "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
               marginRight: "0.7rem" 
            }}
            
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem" marginRight="0.7rem">
            {username}
          </Typography>
          {typeTrader && (
            <Typography color={medium} fontSize="0.75rem">
              {typeTrader}
            </Typography>
          )}
        </Box>
      </Box>
      {/* <IconButton
        onClick={() => patchFriend()}
        sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
      >
        {isFriend ? (
          <PersonRemoveOutlined sx={{ color: primaryDark }} />
        ) : (
          <PersonAddOutlined sx={{ color: primaryDark }} />
        )}
      </IconButton> */}
    </FlexBetween>

  );
};

export default Friend;
