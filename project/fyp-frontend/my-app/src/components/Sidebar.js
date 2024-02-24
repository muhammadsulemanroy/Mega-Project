// Sidebar.js
import React from 'react';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import {sidebarActions, updateProfileActions}  from '../store/index';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import axios from 'axios';
import { availableJobsActions } from '../store/index';
import  { useState,useEffect  } from "react";
import Dialog from "./ModalUpdateSeeker";
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import MailIcon from '@mui/icons-material/Mail';
import LogoutIcon from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { css } from "@emotion/react";
import { Typography } from '@mui/material';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';


import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import InboxIcon from '@mui/icons-material/MoveToInbox';









const Sidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tokensaved = Cookies.get('token');
  const loggedSeeker = useSelector(state=> state.availableJobs.loggedSeeker);
  const opensidebar = useSelector(state=> state.updateProfile.opensidebar);
  const openUpdateProfileModal = useSelector(state=> state.updateProfile.openUpdateModal);
const [someShow, setSomeShow] = useState(false);
const [someWidth, setSomeWidth] = useState('5%');
const [arrowWidth, setArrowWidth] = useState('9rem');
const open =  useSelector((state) => state.sidebar.opensidebar);
const theme = useTheme();

const drawerWidth =  useSelector((state) => state.sidebar.sidebarWidth);





  const updateModalHandler =()=>{
    dispatch(updateProfileActions.SetOpenUpdateModal(true));
  }
  
  const logoutHandler = ()=>{
    Cookies.remove('token');
    navigate('/login')
   }

  
   const findWorkerHandler = ()=>{
    navigate('/findworker')
   }


   const postJobHandler = ()=>{

    navigate('/jobposting')
   }

   const messageHandler = ()=>{
 
    navigate('/chat')
   }

   const handleToggleSidebar = () => {

    dispatch(updateProfileActions.SetOpenSidebar(false));
     
      };
    
  const headers = {
   'Content-Type': 'multipart/form-data',
   'Authorization': `Bearer ${tokensaved}`,
 };
  const  loggedSeekerHandler =  async ()=>{
   try{
     const response = await axios.get('http://127.0.0.1:8000/api/v1/seekers/getSeeker',{headers});
     dispatch(availableJobsActions.setfirstPageSeeker( response.data.data.seeker));
     const seeker =  response.data.data.seeker
     sessionStorage.setItem('loginWorker', seeker);
     console.log('Response Data:', response.data.data.seeker);
   }catch(err){
      console.log(err);
   }
 }

 const showFullContent =()=>{
  setSomeShow(true);
  setSomeWidth('22%');
  setArrowWidth('41rem');
 }

 const hideFullContent =()=>{
  setSomeShow(false);
  setSomeWidth('5%');
  setArrowWidth('9rem');
 }
 useEffect(()=>{
  loggedSeekerHandler();
},[])


const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    position:'relative',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);





const handleDrawerClose = () => {
  dispatch(sidebarActions.SetOpenSidebar(false));
  dispatch(sidebarActions.SetSidebarWidth(60));
};


const handleDrawerOpen = () => {
  dispatch(sidebarActions.SetOpenSidebar(true));

};

if(open){
  dispatch(sidebarActions.SetSidebarWidth(300));
}

  return (
    <>
    <Dialog open={openUpdateProfileModal}  fullScreen/>
    <ArrowCircleRightIcon onClick={open ? handleDrawerClose : handleDrawerOpen } sx={{   
 color:'#01005E',position:'absolute', left: `${drawerWidth - 10}px`,top:'7rem', zIndex:'1203' }}/>
    <Drawer variant="permanent" open={open}>

  
 

    <ListItemButton

sx={{
        width: '85%',
        borderRadius: '1rem',
        display: 'flex',
        gap: '1rem',
        
        justifyContent:'center',
        ':hover': {
          backgroundColor: 'white',
       
        },
      }}
    >
             <Avatar alt="" style={{ width:'3rem', height:'3rem'}} src={`http://127.0.0.1:8000/uploads/${loggedSeeker.picture}`} />
         {open?<Typography>{loggedSeeker.firstName} { loggedSeeker.lastName}<br/>{loggedSeeker.user}</Typography>:''}  
          </ListItemButton>




          <ListItemButton  sx={{
        width: '90%',
        borderRadius: '1rem',
        display: 'flex',
        gap: '1rem',
        "&:hover": {
          backgroundColor: '#01005E',
            cursor: "pointer",
            "& .button": {
              color: "white"
            } },
        justifyContent:'center',
       
      }}   onClick={updateModalHandler}> 
         <PersonIcon  style={{ width:'2rem' , color:'grey' ,   "&:hover": { color:'red'
        
           }}} />
          {open? <Button   className="button" sx={{  width: '6rem',
            color: '#01005E',
  height:'2rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontWeight:'bolder !important' }} >Profile</Button>:''}
          </ListItemButton>


  

  
<ListItemButton sx={{
        width: '90%',
        borderRadius: '1rem',
        display: 'flex',
        gap: '1rem',
        "&:hover": {
          backgroundColor: '#01005E',
            cursor: "pointer",
            "& .button": {
              color: "white"
            } },
        justifyContent:'center',
       
      }}   onClick={postJobHandler}> 
         <WorkIcon className="button" style={{ width:'2rem' }} />
          {open? <Button className="button"  sx={{  width: '6rem',
            color: '#01005E',
  height:'2rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontWeight:'bolder !important' }}>Post Job</Button>:''}
          </ListItemButton>




          <ListItemButton sx={{
        width: '90%',
        borderRadius: '1rem',
        display: 'flex',
        gap: '1rem',
        "&:hover": {
          backgroundColor: '#01005E',
            cursor: "pointer",
            "& .button": {
              color: "white"
            } },
        justifyContent:'center',
       
      }}  onClick={findWorkerHandler}> 
         <PersonSearchIcon className="button" style={{ width:'2rem' }} />
          {open? <Button className="button"  sx={{  width: '6rem',
            color: '#01005E',
  height:'2rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontWeight:'bolder !important' }}>Find Worker</Button>:''}
          </ListItemButton>



          <ListItemButton sx={{
        width: '90%',
        borderRadius: '1rem',
        display: 'flex',
        gap: '1rem',
        "&:hover": {
          backgroundColor: '#01005E',
            cursor: "pointer",
            "& .button": {
              color: "white"
            } },
        justifyContent:'center',
       
      }}   onClick={messageHandler}> 
         <MailIcon  className="button" style={{ width:'2rem' }} />
          {open? <Button className="button"  sx={{  width: '6rem',
            color: '#01005E',
  height:'2rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontWeight:'bolder !important' }}>Messages</Button>:''}
          </ListItemButton>




          <ListItemButton sx={{
        width: '90%',
        borderRadius: '1rem',
        display: 'flex',
        gap: '1rem',
        "&:hover": {
          backgroundColor: '#01005E',
            cursor: "pointer",
            "& .button": {
              color: "white"
            } },
        justifyContent:'center',
       
      }}    onClick={logoutHandler}> 
         <LogoutIcon className="button" style={{ width:'2rem' }} />
          {open? <Button className="button"  sx={{  width: '6rem',
            color: '#01005E',
  height:'2rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontWeight:'bolder !important' }}>Logout</Button>:''}
          </ListItemButton>


</Drawer>

   


</>
  );};


export default Sidebar;
