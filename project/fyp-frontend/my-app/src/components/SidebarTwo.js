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

const Sidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tokensaved = Cookies.get('token');
  const loggedSeeker = useSelector(state=> state.availableJobs.loggedSeeker);
  const opensidebar = useSelector(state=> state.updateProfile.opensidebar);
  const openUpdateProfileModal = useSelector(state=> state.updateProfile.openUpdateModal);

  const updateModalHandler =()=>{
    dispatch(updateProfileActions.SetOpenUpdateModal(true));
  }
  
  const logoutHandler = ()=>{
    Cookies.remove('token');
    navigate('/login')
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
 useEffect(()=>{
  loggedSeekerHandler();
},[])

  return (
    <>
    <Dialog open={openUpdateProfileModal}  fullScreen/>
    <Drawer
    anchor="left"
open={opensidebar}
onClose={handleToggleSidebar}
BackdropProps={{ invisible: true }}
ModalProps={{ disableScrollLock: true }}

   >
    <ListItemButton> 
      <img alt="" src={`http://127.0.0.1:8000/uploads/${loggedSeeker.picture}`} />
       </ListItemButton>
     <ListItemButton> 
       <Button className='hyper-links' onClick={updateModalHandler}>My Profile</Button>
       </ListItemButton>

       <ListItemButton> 
         <Link to='/jobposting' className='hyper-links'>Post Job</Link>
       </ListItemButton>
       <ListItemButton> 
         <Link to='/findworker' className='hyper-links'>Find Worker</Link>
       </ListItemButton>
       <ListItemButton> 
         <Link to='/chat' className='hyper-links'>Messages</Link>
       </ListItemButton>
       <ListItemButton> 
       <Button className='hyper-links' onClick={logoutHandler}>Logout</Button>
       </ListItemButton>
   </Drawer>
</>
  );
};


export default Sidebar;
