import ForgetPage from "."
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
import { Field, Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import FlexBetween from "components/FlexBetween";

const mailSchema = yup.object().shape({
    username:yup.string().required("Morate uneti ime korisničkog naloga ili mejl adresu"),
  });

const initialValuesMail = {
    username:"",
  };

const recivedSchema = yup.object().shape({
    username:yup.string().required("Morate uneti ime korisničkog naloga ili mejl adresu"),
    code: yup.string().required("Morate uneti kod koji smo poslali na Vašu mejl adresu"),
    password: yup.string().required("Morate uneti šifru"),
  });

const initialValuesRecived = {
    username:"",
    code:"",
    password:""
  };

const ForgetForm= ()=>{
    
  const [pageType, setPageType] = useState("send");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isSend = pageType === "send";
  const isRecived = pageType === "recived";
  const [msg, setMsg] = useState("");

  const sendMail= async(values, onSubmitProps) => {
    //console.log(values.username);
    const response=await fetch("http://localhost:3001/users/sendEmail",{
        method: "POST",
        headers: {
             "Content-Type": "application/json"
        },
      body: JSON.stringify({username:values.username}),
    })

    const mail=await response.json();
    //console.log(mail.message);
    if(mail.message==="Email successfully sent"){
        setPageType("recived");
    }
    else{
        setMsg(mail.message);
    }
    onSubmitProps.resetForm();
  };

  const Recived= async(values, onSubmitProps) => {
    //console.log(values.code, values.username, values.password);
    const response=await fetch("http://localhost:3001/users/reset-password",{
        method: "POST",
        headers: {
             "Content-Type": "application/json"
        },
      body: JSON.stringify({kod:values.code, korisnik:values.username, password:values.password}),
    })

    const mail=await response.json();
    if(mail.message==="Uspesno ste promenili password"){
        navigate("/");
    }
    else{
        setMsg(mail.message);
    }
 
    onSubmitProps.resetForm();
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isSend) await sendMail(values, onSubmitProps);
    if (isRecived) await Recived(values, onSubmitProps);
  };


  return(
        <Formik
        onSubmit={handleFormSubmit}
        initialValues={isSend ? initialValuesMail : initialValuesRecived}
        validationSchema={isSend ? mailSchema : recivedSchema}
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
            
            })=>(
            <form onSubmit={handleSubmit}>
                <Box
                    display="grid"
                    gap="30px"
                    textAlign="center"
                    alignItems="center"
                >
                    <TextField
                        label="Korisničko ime ili mejl adresa"
                        type="text"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.username ||""}
                        name="username"
                        error={Boolean(touched.username) && Boolean(errors.username)}
                        helperText={touched.username && errors.username}
                        sx={{ gridColumn: "span 4" }}
                        
                    />
                    {isSend && msg && <Typography> {msg} </Typography>}

                    <Typography
                        onClick={() => {
                            setPageType("recived");
                            setMsg("");
                        }}
                        sx={{
                            textDecoration: "underline",
                            color: palette.primary.main,
                            "&:hover": {
                            cursor: "pointer",
                            color: palette.primary.light,
                            },
                            gridColumn:"span 4"
                        }}
                        >
                        {isSend && "Ako je mejl uspešno poslat kliknite ovde"}
                    </Typography>

                    {isRecived && (
                        <>
                            <TextField
                                label="Kod"
                                type="text"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.code ||""}
                                name="code"
                                error={Boolean(touched.code) && Boolean(errors.kocoded)}
                                helperText={touched.code && errors.code}
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
                        
                        </>


                    )}


                    <Box sx={{gridColumn:"span 4"}}>
                        {isSend ? (<Button

                            fullWidth
                            type="submit"
                            sx={{
                                m: "1rem auto",
                                p: "1rem",
                                backgroundColor: palette.primary.main,
                                color: palette.background.alt,
                                "&:hover": { color: palette.primary.main },
                            }}
                        >
                            {"POŠALJI KOD"}
                        </Button>):
                        (<Box >
                                <Button
                                    fullWidth
                                    type="submit"
                                    sx={{
                                        m: "2rem auto",
                                        p: "1rem",
                                        backgroundColor: palette.primary.main,
                                        color: palette.background.alt,
                                        "&:hover": { color: palette.primary.main },
                                    }}
                                >
                                 {"PROMENI PODATKE"}
                                </Button>

                            
                            <Typography
                                sx={{fontSize:"20px", color:"red"}}
                            >
                                {msg}
                            </Typography>
                        </Box>)
                        }

                        
                        
                    </Box>            
                </Box>
            </form>
        )}
        </Formik>
  );

};

export default memo(ForgetForm);