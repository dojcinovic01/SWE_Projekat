import { PersonAddOutlined,CheckCircle, PersonRemoveOutlined,Delete,TextFields, Report,ChatBubbleOutlineOutlined,TrendingUp,  } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

const NotificationDisplay = ({  notifiId,poruka, slika, tip }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //const { id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  
  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;


  return (
    <FlexBetween 

    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {slika && (<UserImage image={slika} size="55px" />)}
        <Box sx={{ marginLeft: "1rem"}}>
          
          <Typography color={medium} fontSize="0.75rem" marginRight="0.7rem">
            {poruka}
          </Typography>
        </Box>
      </Box>
      {tip==="Lajk" &&<TrendingUp/> }
      {tip==="Report" && <Report/>}
      {tip==="Comment" && <ChatBubbleOutlineOutlined /> }
      {tip==="Subscribe" && <TextFields/>}
      {tip==="Delete" && <Delete/>}
      {tip==="Vrati" && <CheckCircle/>}
    </FlexBetween>

  );
};

export default NotificationDisplay;