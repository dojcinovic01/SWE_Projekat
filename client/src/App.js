import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import HomePage from 'scenes/homePage';
import LoginPage from 'scenes/loginPage';
import ProfilPage from 'scenes/profilPage';
import ErrorPage from 'scenes/errorPage';
import InformationPage from 'scenes/informationPage';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material';
import { themeSettings } from './theme';
import './App.css';
import ForgetPage from 'scenes/forgetPage';

function App() {

  const mode=useSelector((state)=>state.mode);
  const theme=useMemo(()=>createTheme(themeSettings(mode)),[mode]);
  const isAuth=Boolean(useSelector((state)=>state.token));

  return (
    <div className="app">
      <BrowserRouter>
      <ThemeProvider theme={theme}>
      <CssBaseline />
        <Routes>
            <Route path="/" element={<LoginPage/>} />
            <Route path="/forget" element={<ForgetPage/>} />
            <Route path="/home" element={isAuth? <HomePage/> : <Navigate to="/"/>}/>
            <Route path="/profile/:userId" element={isAuth ? <ProfilPage/>: <Navigate to="/"/>} />
            <Route path="/information" element={<InformationPage/>} />
            <Route path="/*" element={<ErrorPage/>}/>
        </Routes>
      </ThemeProvider>
      </BrowserRouter>
     
    </div>
  );
}

export default App;
