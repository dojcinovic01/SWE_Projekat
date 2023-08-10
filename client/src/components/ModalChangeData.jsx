import { useState,memo } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import { setLogout, setUser } from "state";



  const ModalChangeData= ({setDataChanged,rateModal=false, changeData=false, deleteModal=false, setRateModal,setDeleteModal, setChangeData })=>{

    const { palette } = useTheme();
    const {userId}=useParams();
    const dispatch = useDispatch();
    const navigate=useNavigate();
    const [msg, setMsg] = useState("");
    const {id,name,age,profilePicture,username, tip}=useSelector((state)=>state.user);
    const token=useSelector((state)=>state.token);

    const changeDataSchema = yup.object().shape({
        firstName: yup.string().required("Morate uneti ime"),
        age: yup.number().positive().integer("Morate uneti ceo broj").required("Morate uneti vaš broj godina").min(18,"Morate biti punoletni"),
        picture: yup.string(),
        username:yup.string(),
        oldPassword: yup.string(),
        newPassword: yup.string(),
        
      });

      const changeRateSchema = yup.object().shape({
        mark: yup.number().positive().integer("Morate uneti ceo broj").required("Unesite ocenu").min(1,"Ocena mora biti između 1 i 5").max(5,"Ocena mora biti između 1 i5")
        
      });

      const deleteAccountSchema = yup.object().shape({
        checkEmail: yup.string().email("nevalidna mejl adresa").required("Morate uneti mejl adresu"),
        checkPassword: yup.string().required("Morate uneti šifru"),
      });

    
      const initialValuesChangeData = {
        firstName: name,
        age:age,
        picture: profilePicture,
        username:username,
        oldPassword: "",
        newPassword:"",
       
      };

      const initialValuesRate = {
        mark:""
       
      };

      const initialValuesDeleteAccount = {
        checkEmail:"",
        checkPassword: "",
      };
    

    const updateData = async (values, onSubmitProps) => {
        // this allows us to send form info with image
        const formData = new FormData();
        for (let value in values) {
          formData.append(value, values[value]);
          
        }
        formData.append("picturePath", values.picture.name);
        // console.log("Picture name" + values.picture.name);
        // console.log("Picture" + values.picture);

    
        const savedUserResponse = await fetch(
          `http://localhost:3001/users/sacuvajPromene`,
          {
            headers:{
              Authorization: `Bearer ${token}`,
              //"Content-Type": "application/json"
            },
            method: "POST",
            body: formData,
          }
        );

        const savedUser = await savedUserResponse.json();
        
        if(savedUserResponse.status===202){
          //console.log(savedUser.user);
          dispatch(setUser({user:savedUser.user}));
          setMsg(savedUser.message);
        }
        else{
          setMsg(savedUser.message);
        }
        onSubmitProps.resetForm();
        setDataChanged(prev=>!prev);
    
        
        
      };

      const rateUser = async (values, onSubmitProps) => {
        //console.log(values.mark);
        //console.log(userId);
        const savedRateResponse = await fetch(`http://localhost:3001/users/oceniTrejdera`,{
          method:"POST",
          headers:{
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
            body: JSON.stringify({trejder:userId, ocena:values.mark}),
          }
        );
        const savedRate = await savedRateResponse.json();
       // console.log(savedRate);
        onSubmitProps.resetForm();
        setDataChanged(prev=>!prev);
        setRateModal(prev=>!prev);
    
  
      };

      const deleteUser = async (values, onSubmitProps) => {
        //console.log(values.checkEmail, values.checkPassword, userId);
        
        const deleteResponse = await fetch(
          "http://localhost:3001/users/deleteAccount",
          {
            method: "POST",
            headers: { 
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
          },
            body: JSON.stringify({userId:userId, email:values.checkEmail, password:values.checkPassword})
          }
          
        );
        const savedDelete = await deleteResponse.json();
        onSubmitProps.resetForm();
        setDeleteModal(prev=>!prev);

        //console.log(savedDelete.message);
          
        if (savedDelete.message==="Account je uspešno izbrisan") {
          if(tip==="Admin"){
            navigate("/home");
          }
          else{
            dispatch(setLogout());
            navigate("/");
          }

          
        }
        else {
          setMsg(savedDelete.message);
          
        }
      };

      const handleFormSubmit = async (values, onSubmitProps) => {
        if(changeData){
          //console.log("cao iz changea");
          await updateData(values, onSubmitProps);
        } 
        if(rateModal){
          //console.log("cao iz rate");
          await rateUser(values, onSubmitProps);
        }

        if(deleteModal){
          //console.log("cao iz deletea");
          await deleteUser(values,onSubmitProps);
        }
        
      };
      let initialValues;
      let schema;
      if(changeData){
        initialValues=initialValuesChangeData;
        schema=changeDataSchema;
      }

      if(rateModal){
        initialValues=initialValuesRate;
        schema=changeRateSchema;
      }

      if(deleteModal){
        initialValues=initialValuesDeleteAccount;
        schema=deleteAccountSchema;
      }

      return (
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={schema}
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
                 gap="20px"
                 textAlign="center"
                 //gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                //  sx={{
                //    "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                //  }}
              >
                  { rateModal && (
                      <TextField
                      label="Ocena"
                      type="number"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.mark ||""}
                      name="mark"
                      error={Boolean(touched.mark) && Boolean(errors.mark)}
                      helperText={touched.mark && errors.mark}
                      sx={{ gridColumn: "span 4" }}
                    />
                    )
                    }

                    { (deleteModal) && (
                      <>
                          <TextField
                          label="Email"
                          type="text"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.checkEmail ||""}
                          name="checkEmail"
                          error={Boolean(touched.checkEmail) && Boolean(errors.checkEmail)}
                          helperText={touched.checkEmail && errors.checkEmail}
                          sx={{ gridColumn: "span 4" }}
                          
                          />
                  
                          <TextField
                              label="Lozinka"
                              type="password"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.checkPassword ||""}
                              name="checkPassword"
                              error={Boolean(touched.checkPassword) && Boolean(errors.checkPassword)}
                              helperText={touched.checkPassword && errors.checkPassword}
                              sx={{ gridColumn: "span 4" }}
                          />
                       </> 
                    )
                    }

                  {changeData &&(
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
                      borderRadius="5px"
                      p="1rem"
                    >
                      {msg && (<Typography>
                        {msg}
                      </Typography>)}
                    </Box>

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
                        label="Stara lozinka"
                        type="password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.oldPassword ||""}
                        name="oldPassword"
                        error={Boolean(touched.oldPassword) && Boolean(errors.oldPassword)}
                        helperText={touched.oldPassword && errors.oldPassword}
                        sx={{ gridColumn: "span 4" }}
                    />

                    <TextField
                        label="Nova lozinka"
                        type="password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.newPassword ||""}
                        name="newPassword"
                        error={Boolean(touched.newPassword) && Boolean(errors.newPassword)}
                        helperText={touched.newPassword && errors.newPassword}
                        sx={{ gridColumn: "span 4" }}
                    />
    
                  </>)
                  
                  }
                
              </Box>
    
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
                  {deleteModal ? "Izbriši nalog" : "Sačuvaj promene"}
                </Button>
              </Box>
            </form>
            
          )}
        </Formik>
      );
    };

  export default memo(ModalChangeData);