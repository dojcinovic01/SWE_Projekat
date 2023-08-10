
import {
    Box,
    Typography,
  } from "@mui/material";

  import {
    Error
  } from "@mui/icons-material";


const ErrorPage = () => {
  

  return (
    <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
    }}
  >
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Error sx={{ fontSize: "10rem", marginBottom: "2rem", color: "error.main" }} />
      <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: "bold", color: "primary.main" }}>
        Malo ste zalutali?
      </Typography>
      <Typography variant="h5" sx={{ fontStyle: "italic", color: "text.secondary" }}>
        Vratite se nazad!
      </Typography>
    </Box>
  </Box>
  );
};

export default ErrorPage;
