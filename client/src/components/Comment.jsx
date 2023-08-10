import { Delete, PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setDeleteComment } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

const Comment = ({commentId,profileId, username, profilePicture, content, postId}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;


  

  return (
    <FlexBetween onClick={() => {
        navigate(`/profile/${profileId}`);
        navigate(0);
      
    }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <UserImage image={profilePicture} size="40px" />
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
            {username}
          </Typography>
          <Typography color={medium} fontSize="0.75rem" marginRight="0.7rem">
            {content}
          </Typography>
          
        </Box>

        
      </Box>
      
      
    </FlexBetween>

  );
};

export default Comment;
