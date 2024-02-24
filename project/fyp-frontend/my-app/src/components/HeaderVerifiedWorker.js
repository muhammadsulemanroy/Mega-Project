import React, { useEffect } from "react";
import  { useState } from "react";
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import CareLogo from '../Assets/carelogo.png';
import "../App.css";
import Cookies from 'js-cookie';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer from '@mui/material/Drawer';
import { useNavigate } from "react-router-dom";
import ModalSignUp from "./ModelSignUp";
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import axios from 'axios';
import { availableJobsActions } from '../store/index';
import { useDispatch, useSelector } from 'react-redux';
import {updateProfileActions}  from '../store/index';
import Pusher from 'pusher-js';
import { messageActions } from '../store/index';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { Tooltip } from '@mui/material/Tooltip';
import { makeStyles } from '@mui/styles';
import  Divider  from '@mui/material/Divider';
import MuiAppBar from '@mui/material/AppBar';
import { styled, useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';




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
const HeaderVerifiedWorker = ()=>{
  const getWorkerInfo = sessionStorage.getItem('loginWorker')
  const   loggedUserInfo =  useSelector((state) => state.chat.loggedUserInfo);
  const loggedUserId = loggedUserInfo._id
  const channeltwo = pusher.subscribe(`seeker-channel-${loggedUserId}`);
  const    totalcount =  useSelector((state) => state.chat.totalcount);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const someWidth =  useSelector((state) => state.sidebar.someWidth);
  const open =  useSelector((state) => state.sidebar.opensidebar);
  const drawerWidth =  useSelector((state) => state.sidebar.sidebarWidth);


const handleToggleSidebar = () => {

  dispatch(updateProfileActions.SetOpenSidebar(true))
   
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
    

    return(
      <>

    <AppBar position="fixed" open={open} sx={{ backgroundColor:'white'}}>
    <Toolbar>
      <Box className='care-logo-image-verified'>
      
      
        <img src={CareLogo} alt='' />
      </Box>

   
      <Box className='links-controller-verified'>
      <Link to='/availablejobs' className='hyper-links'>Jobs/Vacancies</Link>
         <Link to='/chat' className='hyper-links'>Messages<Badge badgeContent={totalcount} color="primary">
  <MailIcon color="action" />
</Badge></Link>
         <Button className='hyper-links' onClick={logoutHandler}>Logout</Button>
      </Box>
      </Toolbar>
    </AppBar>
</>
  );
}

export default HeaderVerifiedWorker;