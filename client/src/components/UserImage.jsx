import { Box } from "@mui/material";
import {AccountCircle} from "@mui/icons-material"

const UserImage = ({ image, size = "50px" }) => {
  let imageName;
  if(image){
    imageName=image.replace('public\\assets\\','');
  }
  
  return (
    <Box width={size} height={size}>
      {imageName ? (
        <img
          style={{ objectFit: "cover", borderRadius: "50%" }}
          width={size}
          height={size}
          alt="user"
          src={`http://localhost:3001/assets/${imageName}`}
        />
      ) : (
        <AccountCircle sx={{ fontSize: size }} />
      )}
    </Box>
  );
};

export default UserImage;
