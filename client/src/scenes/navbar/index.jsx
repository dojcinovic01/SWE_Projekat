import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  useRadioGroup,
} from "@mui/material";
import {
  Search,
  FlashlightOn,
  FlashlightOff,
  Info,
  Menu,
  Close,
  Login,
  Notifications,
  NotificationAdd
} from "@mui/icons-material";

import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout,setNotifications } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import { useEffect, useState,memo } from "react";
import SearchBar from "components/SearchBar";
import SearchResultList from "components/SearchResultList";
import UserImage from "components/UserImage";
import NotificationDisplay from "components/NotificationDisplay";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token=useSelector((state)=>state.token);
  const notifikacije=useSelector((state)=>state.notifications);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [results,setResults]= useState([]);
  const [isNotification, setIsNotification]= useState(false);
  const [checkNotifi, setCheckNotifi]=useState("false");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const name=user ? user.username:"";

  
  

  const getNotification= async ()=>{
    const response= await fetch("http://localhost:3001/users/getNotifications",{
      method:"POST",
      headers:{
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });

    const notifi=await response.json();
    //console.log(notifi.notifikacije);
    dispatch(setNotifications({notifikacije:notifi.notifikacije}));
    setCheckNotifi("false");

  }

  const checkNotification = async () => {
    const response= await fetch("http://localhost:3001/users/flagNotification",{
      method:"POST",
      headers:{
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });

    const fleg= await response.json();


    setCheckNotifi(fleg.message);
    //console.log(fleg.message);
  }

  useEffect(()=>{
    if(user){
      checkNotification();
    }
  },[]);

  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      <FlexBetween gap="1.75rem">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="primary"
          onClick={() => {
            if(user)
                navigate("/home");
                navigate(0);
          } }
          sx={{ 
            "&:hover": {
              color: user? primaryLight :undefined,
              cursor: user? "pointer" :undefined,
            },
            fontFamily: 'Arial, serif',
          }}
        >
          TradeTime
        </Typography>
      </FlexBetween>

      {user && (
        <Box sx={{ position: 'relative' }}>
          <SearchBar setResults={setResults} />
          {results.length > 0 && (
            <Box
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
              }}
            >
              <SearchResultList results={results} />
            </Box>
          )}
        </Box>
      )}


      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <FlashlightOff sx={{ fontSize: "25px" }} />
            ) : (
              <FlashlightOn sx={{ color:theme.palette.primary.main, fontSize: "25px" }} />
            )}
          </IconButton>

          {!user ? (
            <>
              <IconButton onClick={()=>navigate("/")}>
                <Login sx={{ fontSize: "25px" }} />          
              </IconButton>
              <IconButton onClick={()=>navigate("/information")}>
                <Info sx={{ fontSize: "25px" }} />          
              </IconButton>
            </>
          ):(
            <Box sx={{ position: 'relative' }}>
              
                {checkNotifi==="true" ? (
                  <IconButton
                    onClick={()=>{
                    setIsNotification(prev=>!prev);
                    getNotification();
                    }}
                    sx={{color: theme.palette.primary.main}}
                  >
                    <NotificationAdd sx={{ fontSize: "25px" }}/>
                  </IconButton>
                 ) :(
                  <IconButton 
                    onClick={()=>{
                    setIsNotification(prev=>!prev);
                    }}
                    sx={{color: theme.palette.primary.main}}
                  >
                   <Notifications sx={{ fontSize: "25px" }}/>
                  </IconButton>
                  
                  )}
              
              {isNotification && (
                <Box 
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    width:'200px',
                    left: 70,
                    backgroundColor: neutralLight,
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto',
                    gap:'5px',
                    marginTop:'17px',
                    maxHeight:'200px'
                    }}
                > 
                {notifikacije.map((notifikacija)=>{
                  return (
                    <NotificationDisplay key={notifikacija.id} poruka={notifikacija.poruka} slika={notifikacija.slika} tip={notifikacija.tip} />
                )
                })}
                </Box>
              )}
            </Box>
            
          )}

          
         
           
          
         { user &&(
          <Box>
            <FormControl variant="standard" value={name}>  
                <Select
                  value={name}
                  sx={{
                    backgroundColor: neutralLight,
                    width: "200px",
                    borderRadius: "0.25rem",
                    p: "0.25rem 1rem",
                    "& .MuiSvgIcon-root": {
                      pr: "0.25rem",
                      width: "3rem",
                    },
                    "& .MuiSelect-select:focus": {
                      backgroundColor: neutralLight,
                    },
                  }}
                  input={<InputBase />}
                >
                  <MenuItem 
                  onClick={() => {
                    navigate(`/profile/${user.id}`);
                    navigate(0);
                    
                  }}
                  value={name} sx={{ display: 'flex', alignItems: 'center' }}>
                    <FlexBetween>
                      <UserImage image={user.profilePicture} size={30} sx={{ marginRight: '10px' }} />
                      <Typography sx={{marginLeft:'30px'}}>{name}</Typography>
                    </FlexBetween>
                    
                  </MenuItem>

                  <MenuItem onClick={() => {
                    dispatch(setLogout())
                    navigate('/');
                  }}>
                    Odjavi se
                  </MenuItem>
                </Select>
              </FormControl>
          </Box>)
          
        }
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu />
        </IconButton>
      )}

      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
        >
          {/* CLOSE ICON */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
          >
            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: "25px" }}
            >
              {theme.palette.mode === "dark" ? (
                <FlashlightOff sx={{ fontSize: "25px" }} />
              ) : (
                <FlashlightOn sx={{ color: theme.palette.primary.main, fontSize: "25px" }} />
              )}
            </IconButton>
            
            {!user ? (
            <>
              <IconButton onClick={()=>navigate("/")}>
                <Login sx={{ fontSize: "25px" }} />          
              </IconButton>
              <IconButton onClick={()=>navigate("/information")}>
                <Info sx={{ fontSize: "25px" }} />          
              </IconButton>
            </>
          ):(
            <Box sx={{ position: 'relative' }}>
              <IconButton onClick={()=>{
                setIsNotification(prev=>!prev);
                getNotification();
                }}
                sx={{color: theme.palette.primary.main}}
              >
                <Notifications sx={{ fontSize: "25px" }}/> 
              </IconButton>
              {isNotification && (
                <Box 
                  sx={{
                    position: 'absolute',
                    top: 200,
                    width:'200px',
                    left: -60,
                    backgroundColor: neutralLight,
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto',
                    gap:'5px',
                    marginTop:'17px',
                    maxHeight:'200px'
                    }}
                > 
                {notifikacije.map((notifikacija)=>{
                  return (
                    <NotificationDisplay key={Math.random().toString()} poruka={notifikacija.poruka} slika={notifikacija.slika} tip={notifikacija.tip} />
                )
                })}
                </Box>
              )}
            </Box>
            
          )}
            

            {  user && (<FormControl variant="standard" value={name}>
                <Select
                    value={name}
                    sx={{
                    backgroundColor: neutralLight,
                    width: "150px",
                    borderRadius: "0.25rem",
                    p: "0.25rem 1rem",
                    "& .MuiSvgIcon-root": {
                        pr: "0.25rem",
                        width: "3rem",
                    },
                    "& .MuiSelect-select:focus": {
                        backgroundColor: neutralLight,
                    },
                    }}
                    input={<InputBase />}
                >
                    <MenuItem value={name}>
                    <Typography>{name}</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => {
                    dispatch(setLogout())
                    navigate('/');
                    }}>
                    Odjavi se
                    </MenuItem>
                </Select>
                </FormControl>)
            }
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default memo(Navbar);
