// Sidebar.js
import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import {updateProfileActions}  from '../store/index';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import axios from 'axios';
import { availableJobsActions } from '../store/index';
import  { useState,useEffect  } from "react";
import Dialog from "./ModalUpdateSeeker";
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import Avatar from '@mui/material/Avatar';
import { Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import LogoutIcon from '@mui/icons-material/Logout';
import Box from '@mui/material/Box';
import WorkIcon from '@mui/icons-material/Work';
import { sidebarActions} from '../store/index';
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';

const  SidebarWorker = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tokensaved = Cookies.get('token');
  const opensidebar = useSelector(state=> state.updateProfile.opensidebar);
  const loggedWorker = useSelector(state=> state.availableJobs.loggedWorker);
  const openUpdateProfileModal = useSelector(state=> state.updateProfile.openUpdateModal);


  const [arrowWidth, setArrowWidth] = useState('9rem');

  const drawerWidth =  useSelector((state) => state.sidebar.sidebarWidth);
  const open =  useSelector((state) => state.sidebar.opensidebar);
  const someShow =  useSelector((state) => state.sidebar.someShow);
  const someWidth =  useSelector((state) => state.sidebar.someWidth);

  const updateModalHandler =()=>{
    dispatch(updateProfileActions.SetOpenUpdateModal(true));
  }
  
 
   const handleToggleSidebar = () => {

    dispatch(updateProfileActions.SetOpenSidebar(false));
     
      };



console.log(loggedWorker);

  const headers = {
    'Content-Type': 'multipart/form-data',
    'Authorization': `Bearer ${tokensaved}`,
  };
  const logoutHandler = ()=>{
    Cookies.remove('token');
    navigate('/login')
   }

   const messageHandler = ()=>{
 
    navigate('/chat')
   }
   const JobHandler = ()=>{

    navigate('/availablejobs')
   }

  
   const  loggedWorkerHandler =  async ()=>{
    try{
      const response = await axios.get('http://127.0.0.1:8000/api/v1/workers/getWorker',{headers});
      dispatch(availableJobsActions.setfirstPageWorker( response.data.data.worker));
      const worker =  response.data.data.worker
      sessionStorage.setItem('loginWorker', worker);
      console.log('Response Data:', response);
    }catch(err){
       console.log(err);
    }
  }
  const showFullContent =()=>{

    dispatch(sidebarActions.setSomeShow(true));
    dispatch(sidebarActions.setSomeWidth('22%'));
 
    setArrowWidth('41rem');
   }
  
   const hideFullContent =()=>{
    dispatch(sidebarActions.setSomeShow(false));
    dispatch(sidebarActions.setSomeWidth('5%'));
    setArrowWidth('9rem');
   }
  useEffect(()=>{
    loggedWorkerHandler();
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

    <Drawer
    variant='permanent'
    sx={{}}
  open={open}
  


      >

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
             <Avatar alt="" style={{ width:'3rem', height:'3rem'}} src={`http://127.0.0.1:8000/uploads/${loggedWorker.picture}`} />
         {open?<Typography>{loggedWorker.firstName} { loggedWorker.lastName}<br/>{loggedWorker.user}</Typography>:''}  
          </ListItemButton>
          <ListItemButton   sx={{
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
       
      }}  onClick={updateModalHandler}> 
         <PersonIcon className='button' style={{ width:'2rem' }} />
          {open? <Button className='button' sx={{  width: '6rem',
            color: '#01005E',
  height:'2rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontWeight:'bolder !important' }}>Profile</Button>:''}
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
       
      }}     onClick={JobHandler}> 
           <WorkIcon  className='button' style={{ width:'2rem' }}/>
     {open? <Button  className='button' sx={{  width: '6rem',
            color: '#01005E',
  height:'2rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontWeight:'bolder !important' }}>Jobs</Button>:''}
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
       
      }}  onClick={messageHandler}> 
       <MailIcon className='button' style={{ width:'2rem' }}/>
       {open?<Button  className='button' sx={{  width: '6rem',
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
       
      }}   onClick={logoutHandler}> 
             <LogoutIcon className='button' style={{ width:'2rem' }}/>
       {open?<Button className='button' sx={{  width: '6rem',
            color: '#01005E',
  height:'2rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontWeight:'bolder !important' }}>Logout</Button>:''}
          </ListItemButton>
      </Drawer>

</>
  );
};


export default SidebarWorker;
