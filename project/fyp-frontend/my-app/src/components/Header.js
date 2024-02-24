import React, { useState } from "react";
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import Box from '@mui/material/Box';
import CareLogo from '../Assets/carelogo.png';
import "../App.css";
import ModalSignUp from "./ModelSignUp";
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import Pusher from 'pusher-js';
import Cookies from 'js-cookie';
const Header = () => {
  const tokensaved = Cookies.get('token');
  const pusher = new Pusher('9c1556f9773e416e3dab', {
    cluster: 'mt1',
    encrypted: true,
  });
  
  const channel = pusher.subscribe('seeker-channel');
    const headers = {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${tokensaved}`,
    };
  const [isSuccess,setIsSuccess] = useState(false);
  const handleSuccessModel =()=>{
    setIsSuccess(true)
   }
    const handleCloseModel=()=>{
      setIsSuccess(false);
    }
    
  return (
    <Box className="header-top">
       <ModalSignUp open={isSuccess} onClose={handleCloseModel}/>
      <Box className='care-logo-image'>
        <img src={CareLogo} alt='' />
      </Box>
      <Box className='links-control'>
        <Link to='/' className='hyper-links'>Post Job</Link>
        <Link to='/find-worker' className='hyper-links'>Find Worker</Link>
        <Link to='/testimonial' className='hyper-links'>Testimonial</Link>
        <Link to='/about' className='hyper-links'>About</Link>
      </Box>
      <Box className='header-buttons'>
       <Link to='/login'> <Button className='login-button-head' >Login</Button></Link>
        <Button className='login-button-head' onClick={handleSuccessModel}>
        Signup
        </Button>
      </Box>
    </Box>
  );
}

export default Header;
