import {
  ManageAccountsOutlined,
  Edit,
  LocationOnOutlined,
  WorkOutlineOutlined,
  Instagram,
  LinkedIn,
  Cancel,
  Stars,
  Delete,
  TextFields,
  MonetizationOn
} from "@mui/icons-material";
import { 
  Box,
  Typography, 
  Divider, 
  useTheme, 
  Modal,
  IconButton,
  InputBase,
  Button,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField} from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector,useDispatch } from "react-redux";
import { useEffect, useState,memo,useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ModalChangeData from "components/ModalChangeData";
import { setFriend } from "state";


const UserWidget = ({userId,profilePicture,isProfile=false}) => {
  const {id,name, age, tip, friends,picturePath,ratinzi}=useSelector((state)=>state.user);
  const isFriend=useSelector((state)=>state.isFriend);
  const [dataModal,setdataModal]=useState(false);
  const [rateModal,setRateModal]=useState(false);
  const [deleteModal, setDeleteModal]= useState(false);
  const [instaModal, setInstaModal]= useState(false);
  const [linkedInModal, setLinkedInModal]=useState(false);
  const [linkedInLink, setLinkedInLink]=useState("");
  const [user, setUser] = useState({});
  const [instaLink, setInstaLink]=useState("");
  const [dataChanged, setDataChanged]=useState(false);
  const [monetizationModal, setMonetizationModal]=useState(false);
  const [adValue, setAdValue]= useState("");
  const [dayValue, setDayValue] = useState("");
  const [sloganValue, setSloganValue]= useState("");
  const [touched, setTouched] = useState(false);
  const [msg,setMsg]=useState("");
  const [firstEffectComplete, setFirstEffectComplete] = useState(false);

  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dispatch=useDispatch();

  
  let average;
  let sum=0;
  if (user && user.ratinzi) {
    user.ratinzi.forEach((ratingObj) => {
      sum+=ratingObj;
    });

    average= sum/ user.ratinzi.length;
    average=average.toFixed(2);
  }
  
  

  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const friendId=userId;
  //console.log(user.id);

  //const isFriend = friends.find((friend) => friend.id === userId);

  const FriendCheck = async () => {
    const response = await fetch(
      `http://localhost:3001/users/isFriend`,
      {
        method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId })
        },
    );
    const res = await response.json();
    //console.log(res.message);
    if(res.message==="true"){
      dispatch(setFriend({isFriend:res.message}));
    }
    else{
      dispatch(setFriend({isFriend:res.message}))
    }
    
  };

  const Subscribe = async () => {
    const response = await fetch(
      `http://localhost:3001/users/subscribe`,
      {
        method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ friendId })
        },
    );
    const msg = await response.json();
    //console.log(msg.message);
    if(response.status===200){
      if(msg.message==="Uklonili ste korisnika iz liste praćenja"){
        dispatch(setFriend({isFriend:"false"}));
      }
      else{
        dispatch(setFriend({isFriend:"true"}));
      }
      
    }
    else {
      //console.log(msg.message);
    }
    
  };

  useEffect(() => {
    getUser();
  }, [dataChanged]);

  useEffect(() => {
    if(firstEffectComplete===true){
      if(!isProfile || user.tip==="begginer" || id===userId){
        dispatch(setFriend({isFriend:"true"}));
      }
      else{
        FriendCheck();
      }
    }
    
  }, [firstEffectComplete]);

  const getUser = async () => {
    //console.log("USO u GETUSER");
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    //console.log(data.user);
    setUser(data.user);
    setFirstEffectComplete(true);
  };

  

  const handleInstaLink = async () => {
    //console.log(instaLink);
    const response = await fetch(
      `http://localhost:3001/users/dodajNalog-instagram`,
      {
        method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ socials:instaLink })
        },
    );
    const msg = await response.json();
    //console.log(msg.message);
    if(msg.message==="Uspesno ste dodali Instagram nalog"){
      setDataChanged(prev=>!prev);
    }
  };

  const handleLinkedInLink = async () => {
    const response = await fetch(
      `http://localhost:3001/users/dodajNalog-linkedin`,
      {
        method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ socials:linkedInLink })
        },
    );
    const msg = await response.json();
    //console.log(msg.message);
    if(msg.message==="Uspesno ste dodali Linkedin nalog"){
      setDataChanged(prev=>!prev);
    }
  };

  const handleAdChange = (event) => {
    setAdValue(event.target.value);
  };

  const handleDayChange = (event) => {
    setDayValue(event.target.value);
  };

  const handleSloganChange= (event) =>{
    setSloganValue(event.target.value);
  }

  const handleBlur = () => {
    setTouched(true);
  };

  const validateDay = (value) => {
    if (value.trim() === "") {
      return "Polje je obavezno.";
    }
    if (isNaN(value)) {
      return "Unesite validan broj dana.";
    }
    if(value<=0){
      return"Morate uneti broj veći od nule"
    }
    // Dodajte druge validacije prema potrebama

    return "";
  };

  

  const error = touched && validateDay(dayValue);
  const helperText = touched && error;

  const handleReklamiraj= async () =>{
    const response= await fetch("http://localhost:3001/users/reklamiraj",{
      method:"POST",
      headers:{
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ trajanje:dayValue, tip: adValue, slogan:sloganValue}) 
    });

    const mes= await response.json();
    //console.log(mes.message);
    setMsg(mes.message);
  };

  return (
    <WidgetWrapper>
      {/* PRVI RED */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => navigate(`/profile/${userId}`)}
      >
        <FlexBetween gap="1rem">
          <UserImage image={user.profilePicture} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {user.name}
            </Typography>

            <Typography
              variant="h6"
              color={dark}
              fontWeight="200"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {user.username}
            </Typography>

            {user.tip==="begginer" && <Typography color={medium}> Praćenje: {user.friendsNumber} </Typography>}
          </Box>
        </FlexBetween>
      </FlexBetween>

      <Divider />

      {/* DRUGI RED */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <Typography color={medium}>Godine:{user.age}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>Tip:{user.tip}</Typography>
        </Box>
      </Box>

      <Divider />

      {/* TRECI RED */}
      <Box p="1rem 0">
        {user.tip==="profi" && (
          <Box>
            <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
                 Društvene mreže
             </Typography>

            <FlexBetween gap="1rem" mb="0.5rem">
              <FlexBetween gap="1rem">
              {userId===id ? (
                  <Box>
                    <Instagram 
                      onClick={()=>setInstaModal(prevModal=>!prevModal)}
                        sx={{
                          "&:hover": {
                            color: palette.primary.light,
                            cursor: "pointer",
                          },
                        }}
                    />
                    <Modal
                    open={instaModal}
                    onClose={()=>setInstaModal(prevModal=>!prevModal)}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-delete"
                    >
                    <Box 
                    sx={{position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: palette.background.default,
                        border: '2px solid #000',
                        boxShadow: 20,
                        p: 4,
                        textAlign:"center",
                        maxHeight:"80%",
                        overflow:"auto"
                        }}
                      >
                      <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
                        <IconButton onClick={()=>setInstaModal(prevModal=>!prevModal)}>
                          <Cancel />
                        </IconButton>
                      </Box>

                        <Typography id="modal-title" variant="h6" component="h2">
                          Unesite link Vašeg instagram profila  
                        </Typography>
                        <Box id="modal-description"  >
                            <InputBase
                                  onChange={(e) => setInstaLink(e.target.value)}
                                  value={instaLink}
                                  sx={{
                                    width: "100%",
                                    backgroundColor: palette.neutral.light,
                                    borderRadius: "2rem",
                                    padding: "1rem 2rem",
                                    marginBottom:"20px",
                                  }}
                              />
                            <Button
                              onClick={()=>{
                                handleInstaLink();
                                setInstaModal(prevModal=>!prevModal);
                              }}
                              
                              sx={{
                                color:palette.background.default,
                                backgroundColor: palette.primary.main,
                                borderRadius: "3rem",
                                marginRight:"10px"
                              }}
                              >
                              Dodaj link
                            </Button>
                        </Box>
                      </Box>
                      
                </Modal>
              
              </Box>
              )              
              : (
                  <Instagram 
                  onClick={() => {
                    if(user.socials.instagram){
                      window.open(user.socials.instagram);
                    }
                    
                  
                  }}
                    sx={{
                      "&:hover": {
                        color: palette.primary.light,
                        cursor: "pointer",
                      },
                    }}
                  />
                
                )}
                <Box>
                  <Typography color={main} fontWeight="500">
                    Instagram
                  </Typography>
                </Box>
              </FlexBetween>
            </FlexBetween>

            <FlexBetween gap="1rem" mb="0.5rem">
              <FlexBetween gap="1rem">
              {userId===id ? (
                  <Box>
                    <LinkedIn 
                      onClick={()=>setLinkedInModal(prevModal=>!prevModal)}
                        sx={{
                          "&:hover": {
                            color: palette.primary.light,
                            cursor: "pointer",
                          },
                        }}
                    />
                    <Modal
                    open={linkedInModal}
                    onClose={()=>setLinkedInModal(prevModal=>!prevModal)}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-delete"
                    >
                    <Box 
                    sx={{position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: palette.background.default,
                        border: '2px solid #000',
                        boxShadow: 20,
                        p: 4,
                        textAlign:"center",
                        maxHeight:"80%",
                        overflow:"auto"
                        }}
                      >
                      <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
                        <IconButton onClick={()=>setLinkedInModal(prevModal=>!prevModal)}>
                          <Cancel />
                        </IconButton>
                      </Box>
                      <Typography id="modal-title" variant="h6" component="h2">
                        Unesite link Vašeg linkedIn profila  
                      </Typography>
                      <Box id="modal-description"  >
                          <InputBase
                                onChange={(e) => setLinkedInLink(e.target.value)}
                                value={linkedInLink}
                                sx={{
                                  width: "100%",
                                  backgroundColor: palette.neutral.light,
                                  borderRadius: "2rem",
                                  padding: "1rem 2rem",
                                  marginBottom:"20px",
                                }}
                            />
                          <Button
                            onClick={()=>{
                              handleLinkedInLink();
                              setLinkedInModal(prevModal=>!prevModal);
                            }}
                            
                            sx={{
                              color:palette.background.default,
                              backgroundColor: palette.primary.main,
                              borderRadius: "3rem",
                              marginRight:"10px"
                            }}
                            >
                            Dodaj link
                          </Button>
                      </Box>
                    </Box>
                </Modal>
                </Box>
              
              )
              
              
              : (
                  <LinkedIn 
                    onClick={() => {
                      if(user.socials.linkedin){
                        window.open(user.socials.linkedin);
                      }
                      
                    
                    }}
                    sx={{
                      "&:hover": {
                        color: palette.primary.light,
                        cursor: "pointer",
                      },
                    }}
                  />
                
                )}
                <Box>
                  <Typography color={main} fontWeight="500">
                    LinkedIn
                  </Typography>
                </Box>
              </FlexBetween>
            </FlexBetween>

          </Box>
        )}

        {userId===id &&(<FlexBetween gap="1rem">
          <FlexBetween gap="1rem">
            <Edit 
            onClick={()=>setdataModal(prevModal=>!prevModal)}
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
            />
              <Modal
                open={dataModal}
                onClose={()=>setdataModal(prevModal=>!prevModal)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                >
                <Box 
                sx={{position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: palette.background.default,
                    border: '2px solid #000',
                    boxShadow: 20,
                    p: 4,
                    textAlign:"center",
                    maxHeight:"80%",
                    overflow:"auto"
                    }}
                  >
                  <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
                    <IconButton onClick={()=>setdataModal(prevModal=>!prevModal)}>
                      <Cancel />
                    </IconButton>
                  </Box>
                  <Typography id="modal-title" variant="h6" component="h2">
                      Unesite podatke koje menjate
                  </Typography>
                  <ModalChangeData id="modal-description" setDataChanged={setDataChanged} changeData={dataModal} setChangeData={setdataModal}/>
                </Box>
            </Modal>
              <Box>
                <Typography color={main} fontWeight="500">
                  Promeni svoje podatke
                </Typography>
              </Box>
          </FlexBetween>
        </FlexBetween>)}

        {userId!==id  &&(
        
        <FlexBetween gap="1rem">  
            { user.tip ==="profi" && user.tip!=="Admin"  && (<Box>
              <FlexBetween>
                  <Stars 
                  onClick={()=>{
                    if(tip==="begginer" && isFriend){
                      setRateModal(prevModal=>!prevModal)
                    }
                    
                  
                  }}
                  sx={{
                    "&:hover": {
                      color:tip==="begginer" && palette.primary.light,
                      cursor: tip==="begginer" && "pointer",
      
                    },
                  }}
                  />
                  <Typography color={main} fontWeight="500" marginLeft="16px">
                      {isFriend ? "Unesite ocenu" : "Ocena"}
                  </Typography>
              </FlexBetween>

              {!isNaN(average) && <Typography>{average}</Typography>}
            </Box>)}
            
              <Modal
                open={rateModal}
                onClose={()=>setRateModal(prevModal=>!prevModal)}
                aria-labelledby="modal-title"
                aria-describedby="modal-rate"
                >
                <Box 
                sx={{position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: palette.background.default,
                    border: '2px solid #000',
                    boxShadow: 20,
                    p: 4,
                    textAlign:"center",
                    maxHeight:"80%",
                    overflow:"auto"
                    }}
                  >
                  <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
                    <IconButton onClick={()=>setRateModal(prevModal=>!prevModal)}>
                      <Cancel />
                    </IconButton>
                  </Box>
                  <Typography id="modal-title" variant="h6" component="h2">
                      Ocenite trejdera
                  </Typography>
                  <ModalChangeData id="modal-rate" setDataChanged={setDataChanged} rateModal={rateModal} setRateModal={setRateModal} />
                </Box>
            </Modal>
              
          
        </FlexBetween>)}

        {userId===id  && tip!=="Admin" &&(
          <Box >
            {tip!=="begginer" &&(
            <>
              <Box gap="1rem" display="flex" flexDirection="row" marginTop="5px">
              
              <Stars 
                />
                  <Typography color={main} fontWeight="500" >
                        Ocena
                  </Typography>
            
              </Box>
              {!isNaN(average) && <Typography>{average}</Typography>}
            </>
            )}
            
            

          <FlexBetween gap="1rem">
            <FlexBetween gap="1rem">
                <Delete
                onClick={()=>setDeleteModal(prevModal=>!prevModal)}
                sx={{
                  "&:hover": {
                    color: palette.primary.light,
                    cursor: "pointer",
                  },
                }}
                />
                  <Modal
                    open={deleteModal}
                    onClose={()=>setDeleteModal(prevModal=>!prevModal)}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-delete"
                    >
                    <Box 
                    sx={{position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: palette.background.default,
                        border: '2px solid #000',
                        boxShadow: 20,
                        p: 4,
                        textAlign:"center",
                        maxHeight:"80%",
                        overflow:"auto"
                        }}
                      >
                      <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
                        <IconButton onClick={()=>setDeleteModal(prevModal=>!prevModal)}>
                          <Cancel />
                        </IconButton>
                      </Box>
                      <Typography id="modal-title" variant="h6" component="h2">
                        Da biste izbrisali vaš nalog morate uneti vaše podatke  
                      </Typography>
                      <ModalChangeData id="modal-delete" deleteModal={deleteModal} setDeleteModal={setDeleteModal}/>
                    </Box>
                </Modal>
                  <Box>
                    <Typography color={main} fontWeight="500">
                      Brisanje naloga 
                    </Typography>
                  </Box>
            
            </FlexBetween>
           
            </FlexBetween>
            
        </Box>
        )}

        {userId!==id && user.tip==="profi" && tip==="begginer" &&(<FlexBetween  gap="1rem">
          <FlexBetween gap="1rem">
          <TextFields
             onClick={()=>Subscribe()}
            sx={{
              "&:hover": {
                color: isFriend ? palette.primary.dark : palette.primary.light,
                cursor: "pointer",
              },
              color: isFriend ? palette.primary.light : undefined,
            }}
          />
            <Box>
              <Typography color={main} fontWeight="500">
               {isFriend ? "Prekini pretplatu": "Pretplatite se na ovaj profil" } 
              </Typography>
            </Box>

          </FlexBetween>
        </FlexBetween>)}

        {userId===id && user.tip==="profi" &&(<FlexBetween gap="1rem">
          <FlexBetween gap="1rem">
            <MonetizationOn 
            onClick={()=>setMonetizationModal(prevModal=>!prevModal)}
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
            />
              <Modal
                open={monetizationModal}
                onClose={()=>setMonetizationModal(prevModal=>!prevModal)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                >
                <Box 
                sx={{position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: palette.background.default,
                    border: '2px solid #000',
                    boxShadow: 20,
                    p: 4,
                    textAlign:"center",
                    maxHeight:"80%",
                    overflow:"auto"
                    }}
                  >
                  <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
                    <IconButton onClick={()=>{
                      setMonetizationModal(prevModal=>!prevModal);
                      setDayValue("");
                      setAdValue("");
                      }}>
                      <Cancel />
                    </IconButton>
                  </Box>
                  {!msg ? (
                    <Box> 
                      <Typography id="modal-title" variant="h6" component="h2">
                       Izaberite na koji način želite da reklamirate Vaš profil
                       </Typography>
                      <Box id="modal-description"  >
                        <RadioGroup 
                          aria-label="typeAd" 
                          name="typeAd" 
                          value={adValue ||""} 
                          onChange={handleAdChange}
                          style={{ display: "inline-flex", flexDirection: "row", alignItems: "center" }}
          
                        >
                          <FormControlLabel value="Mala" control={<Radio />} label="Mala reklama" />
                          <FormControlLabel value="Velika" control={<Radio />} label="Velika reklama"/>

                        </RadioGroup>
                        <TextField
                          label="Broj dana"
                          type="number"
                          onBlur={handleBlur}
                          onChange={handleDayChange}
                          value={dayValue}
                          name="day"
                          error={Boolean(error)}
                          helperText={helperText}
                          sx={{ width:"70%"}}
                        />
                        <TextField
                          label="Slogan"
                          onBlur={handleBlur}
                          onChange={handleSloganChange}
                          value={sloganValue}
                          name="day"
                          sx={{ width:"70%", marginTop:"30px"}}
                        />
                        <Typography sx={{marginTop:"30px", marginBottom:"30px"}}>
                          Mala reklama košta 5$ po danu, velika 10$ po danu
                        </Typography>
                              {dayValue>0 && adValue && (<Button
                                onClick={()=>{
                                  handleReklamiraj();
                                  setDayValue("");
                                  setAdValue("");
                                  setSloganValue("");
                                }}
                                
                                sx={{
                                  color:palette.background.default,
                                  backgroundColor: palette.primary.main,
                                  borderRadius: "3rem",
                                  marginRight:"10px"
                                }}
                                >
                                Potvrdi
                              </Button>)}
                          </Box>
                        </Box>
                      ):(
                        <Box> 
                          <Typography id="modal-title" variant="h6" component="h2">
                             Reklamiranje Vašeg profila
                         </Typography>
                         <Box id="modal-description">
                          
                        </Box>
                        <Typography sx={{marginTop:"30px", marginBottom:"30px"}}>
                          {msg}
                        </Typography>
                        </Box>
                      )}
                </Box>
            </Modal>
              <Box>
                <Typography color={main} fontWeight="500">
                  Reklamiraj svoj profil
                </Typography>
              </Box>
          </FlexBetween>
        </FlexBetween>)}

        
        {tip==="Admin" &&(<FlexBetween gap="1rem">
          <FlexBetween gap="1rem">
          <Delete
                onClick={()=>setDeleteModal(prevModal=>!prevModal)}
                sx={{
                  "&:hover": {
                    color: palette.primary.light,
                    cursor: "pointer",
                  },
                }}
                />
                  <Modal
                    open={deleteModal}
                    onClose={()=>setDeleteModal(prevModal=>!prevModal)}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-delete"
                    >
                    <Box 
                    sx={{position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: palette.background.default,
                        border: '2px solid #000',
                        boxShadow: 20,
                        p: 4,
                        textAlign:"center",
                        maxHeight:"80%",
                        overflow:"auto"
                        }}
                      >
                      <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
                        <IconButton onClick={()=>setDeleteModal(prevModal=>!prevModal)}>
                          <Cancel />
                        </IconButton>
                      </Box>
                      <Typography id="modal-title" variant="h6" component="h2">
                        Brisanje naloga  
                      </Typography>
                      <ModalChangeData id="modal-delete" deleteModal={deleteModal} setDeleteModal={setDeleteModal}/>
                    </Box>
                </Modal>
                  <Box>
                    <Typography color={main} fontWeight="500">
                      Brisanje naloga 
                    </Typography>
                  </Box>
          </FlexBetween>
        </FlexBetween>)}
        
          

      </Box>
    </WidgetWrapper>
  );
};

export default memo(UserWidget);
