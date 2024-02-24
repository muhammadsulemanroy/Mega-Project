import React, { useState,useEffect  } from "react";
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CareLogo from '../Assets/carelogo.png';
import "../App.css";
import Cookies from 'js-cookie';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import ModalSignUp from "./ModelSignUp";
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import { useDispatch, useSelector } from 'react-redux';
import { availableJobsActions } from '../store/index';
import axios from 'axios';
import ModalUpdateSeeker from './ModalUpdateSeeker';
import {updateProfileActions}  from '../store/index';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { messageActions } from '../store/index';
import Pusher from 'pusher-js';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import MuiAppBar from '@mui/material/AppBar';
import { styled, useTheme } from '@mui/material/styles';
import {sidebarActions } from '../store/index';
const tokensaved = Cookies.get('token');















const headers = {
  'Content-Type': 'multipart/form-data',
  'Authorization': `Bearer ${tokensaved}`,
};

const pusher = new Pusher('9c1556f9773e416e3dab', {
  cluster: 'mt1',
  encrypted: true,
});

const channel = pusher.subscribe('seeker-channel');
const HeaderVerified = () => {

  const   loggedUserInfo =  useSelector((state) => state.chat.loggedUserInfo);
  const loggedUserId = loggedUserInfo._id
  const channeltwo = pusher.subscribe(`seeker-channel-${loggedUserId}`);
  const    totalcount =  useSelector((state) => state.chat.totalcount);
  const drawerWidth =  useSelector((state) => state.sidebar.sidebarWidth);
  const open =  useSelector((state) => state.sidebar.opensidebar);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tokensaved = Cookies.get('token');
  const theme = useTheme();

  const handleToggleSidebar = () => {


 
  };

  const logoutHandler = ()=>{
    Cookies.remove('token');
    navigate('/login')
   }
   const totalUnreadCountHandler = async ()=>{
    try{
      const response =  await axios.get('http://127.0.0.1:8000/total-unread-count',{headers});
      dispatch(messageActions.setTotalMessageCount(response.data.unreadCount));
      console.log(response.data.unreadCount);
    }catch(err){
      console.log(err);
    }
   
  }


  const getLoggedUser =  async()=>{

    try{
     const response =  await axios.get('http://127.0.0.1:8000/get-logged-user',{headers});
  
     if(response.data.infoSeekerOne !== undefined){
      dispatch(messageActions.setLoggedUserinfo(response.data.infoSeekerOne));
  
    }else if (response.data.infoWorkerOne !== undefined) {
      dispatch(messageActions.setLoggedUserinfo(response.data.infoWorkerOne));
  
    }else{
      return;
    }
    }catch(error){
      console.log(error);
    }
  
   }

  useEffect(()=>{
    getLoggedUser();
    totalUnreadCountHandler();

    channel.bind('total-message', (data) => {
      totalUnreadCountHandler();
    });

    channeltwo.bind('total-count', (data) => {
      dispatch(messageActions.setTotalMessageCount(data));
    });

    return () => {
      // Unbind channel event listener
      channel.unbind('total-message');
      channel.unbind('total-count');
    };
  },[])

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer - 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
      
    }),
    marginLeft: open ? drawerWidth : 0,// Set marginLeft to drawerWidth
    width: `calc(100% - ${drawerWidth}px)`,
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
  }));
  
  






  const handleDrawerOpen = () => {
    dispatch(sidebarActions.SetOpenSidebar(true));
  };

  const handleDrawerClose = () => {

  };

  
  return(
    <>
  <AppBar position="fixed" open={open} sx={{backgroundColor:'white'}}>
  <Toolbar>
 
      <Box className='care-logo-image-verified'>
        <img src={CareLogo} alt='' />
      </Box>
      <Box className='links-controller-verified'>
        <Link to='/jobposting' className='hyper-links'>Post Job</Link>
        <Link to='/findworker' className='hyper-links'>Find Worker</Link>
        <Link to='/chat' className='hyper-links'>Messages<Badge badgeContent={totalcount} color="primary" /></Link>
        <Button className='hyper-links' onClick={logoutHandler}>Logout</Button>
      </Box>

  </Toolbar>
</AppBar>

    
    </>
  );
}

export default HeaderVerified;
