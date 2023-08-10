import { useState,memo } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Field, Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("Morate uneti ime"),
  age: yup.number().positive().integer("Morate uneti ceo broj").required("Morate uneti vaš broj godina").min(18,"Morate biti punoletni"),
  email: yup.string().email("nevalidna mejl adresa").required("Morate uneti mejl adresu"),
  picture: yup.string(),
  username:yup.string().required("Morate uneti ime korisničkog naloga"),
  password: yup.string().required("Morate uneti šifru"),
  typeTrader: yup.string().required("Morate izabrati jednu od opcija"),
  
});

const loginSchema = yup.object().shape({
  username:yup.string().required("Morate uneti ime korisničkog naloga"),
  password: yup.string().required("Morate uneti šifru"),
});

const initialValuesRegister = {
  firstName: "",
  age:"",
  email: "",
  picture: "",
  username:"",
  password: "",
  typeTrader:"",
 
};

const initialValuesLogin = {
  username:"",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  const [msg, setMsg] = useState("");
  const [regmsg,setRegMsg]=useState("");

  const register = async (values, onSubmitProps) => {
    // this allows us to send form info with image
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    if(values.picture){
      formData.append("picturePath", values.picture.name);
    }
    
    

    const savedUserResponse = await fetch(
      "http://localhost:3001/users/register",
      {
        method: "POST",
        body: formData,
      }
    );
    const savedUser = await savedUserResponse.json();
    //console.log(savedUser);
    onSubmitProps.resetForm();

    if (savedUser.message==="Success") {
      setPageType("login");
      setRegMsg("");
      
    }
    else {
      //console.log(savedUser);
      setRegMsg(savedUser.message);
      
    }
  };

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch("http://localhost:3001/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();
    if (loggedIn.user) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate("/home");

    }
     else  {
      setMsg(loggedIn.message);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };


  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
      validateOnChange={false}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
             display="grid"
             gap="30px"
             textAlign="center"
          >
            {isRegister && (
              <>
                <TextField
                  label="Ime"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName ||""}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 4" }}
                />
                {/* <TextField
                  label="Prezime"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                /> */}

                <TextField
                  label="Godine"
                  type="number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.age ||""}
                  name="age"
                  error={Boolean(touched.age) && Boolean(errors.age)}
                  helperText={touched.age && errors.age}
                  sx={{ gridColumn: "span 4" }}
                />

                <TextField
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email ||""}
                  name="email"
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 4" }}
                />
                
                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) =>
                      setFieldValue("picture", acceptedFiles[0])
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                          <p>Dodaj profilnu sliku ovde</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>

                <Box 
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  
                  <Typography
                    style={{fontSize:"large"}}
                  >
                    Koji tip korisnika želite da budete?
                  </Typography>

                  <RadioGroup 
                    aria-label="typeTrader" 
                    name="typeTrader" 
                    value={values.typeTrader ||""} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{ display: "inline-flex", flexDirection: "row", alignItems: "center" }}
    
                  >
                    <FormControlLabel value="profi" control={<Radio />} label="Profesionalni trejder" />
                    <FormControlLabel value="begginer" control={<Radio />} label="Trejder početnik"/>

                    
                    
                  </RadioGroup>

                  {!values.typeTrader && (
                      <Typography
                      
                      >
                        Niste čekirali dugme
                      </Typography>
                      ) }

                </Box>

                <Box
                  gridColumn="span 4"
                  borderRadius="5px"
                  p="1rem"
                >
                  {regmsg && (<Typography>
                    {regmsg}
                  </Typography>)}
                </Box>

              </>
            )}

            <TextField
              label="Korisničko ime"
              type="text"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.username ||""}
              name="username"
              error={Boolean(touched.username) && Boolean(errors.username)}
              helperText={touched.username && errors.username}
              sx={{ gridColumn: "span 4" }}
              
            />
            
            <TextField
              label="Šifra"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password ||""}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />

            <Box>
              {msg && (<Typography>
                {msg}
              </Typography>)}
            </Box>
        

            
          </Box>
          <Typography
              onClick={() => {
                navigate("/forget");
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin && "Zaboravili ste lozinku?"}
            </Typography>

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {isLogin ? "ULOGUJTE SE" : "REGISTRUJ SE"}
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
                setMsg("");
                setRegMsg("");
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin
                ? "Nemate nalog? Registrujte se ovde."
                : "Već imate nalog? Prijavite se ovde."}
            </Typography>
          </Box>
        </form>
        
      )}
    </Formik>
  );
};

export default memo(Form);
