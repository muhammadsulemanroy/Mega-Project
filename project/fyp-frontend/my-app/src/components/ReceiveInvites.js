import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { receiveInvitesActions } from '../store/index';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Dialog from './ModalSendInvite';
import { Typography } from '@mui/material';
import HeaderVerifiedWorker from './HeaderVerifiedWorker';
import Pusher from 'pusher-js';

const pusher = new Pusher('9c1556f9773e416e3dab', {
  cluster: 'mt1',
  encrypted: true,
});

const channel = pusher.subscribe('seeker-channel');

const ReceiveInvites = () => {
  const dispatch = useDispatch();
 const receivedinvites = useSelector((state) => state.receiveJobInvite.invites);
 const rejectedInvite = useSelector((state) => state.receiveJobInvite.rejectInvites);
  const tokensaved = Cookies.get('token');
  const handleInvites = async () => {
console.log('called');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokensaved}`,
      };
    try{
     const res = await axios.get('http://127.0.0.1:8000/api/v1/workers/getAllJobInvites',{headers});
     dispatch((receiveInvitesActions.setReceivedInvites(res.data.invites)));

     console.log(res.data);
    }catch(err){
    console.log(err.message);
    }
  };
  useEffect(()=>{
    handleInvites(); 
    channel.bind('new-invite', (data)=>{
      handleInvites(); 
    });
    return () => {
      channel.unbind('new-invite');
    };   
  },[])
  const rejectInviteHandler = async ()=>{
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokensaved}`,
    };
  
  try{
   const res = await axios.patch('http://127.0.0.1:8000/api/v1/workers/getAllJobInvites', {
  data:{status:'rejected' } ,
  },{headers});
  
   console.log(res.data.status);
  }catch(err){
  console.log(err.message);
  }
  }
 const updateStatusHandler =async()=>{
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${tokensaved}`,
  };

try{
 const res = await axios.patch('http://127.0.0.1:8000/api/v1/workers/getAllJobInvites', {
data:{status:'approved' } ,
},{headers});
handleInvites();  
 console.log(res.data.status);
}catch(err){
console.log(err.message);
}
 }
  return (
    <> 
    <Box className='view-jobs-applicants'>
    <HeaderVerifiedWorker/>
    <Box >

    {receivedinvites.length === 0 || receivedinvites.some(invite => invite.status === 'rejected') ? (
  <Typography variant='h3'>No Invites</Typography>
) : (
  <Typography variant='h3'>Received Invites</Typography>
)}
   <Box className='view-jobs-top'>
   
{receivedinvites.map((invites,index)=>{

  
  if(invites.status === 'pending') {
  
    return(
    <Box>
    <Box key={index} className='view-jobs-head'>
    <Box>{invites.hourlyBudget}</Box>
        <Box>{invites.address}</Box>
       <Box> {invites.timeOfService}</Box>
       <Box> {invites.requiredService}</Box>
       <Box> {invites.detail}</Box>
       <Button> {invites.status}</Button>
       <Button variant='contained' onClick={updateStatusHandler}>Approve</Button>
       <Button variant='contained' onClick={ rejectInviteHandler }>Reject</Button>
    </Box>
    </Box>
    );

  }else if(invites.status === 'approved') {
    return(
    <Box>
    <Box key={index} className='view-jobs-head'>
    <Box>{invites.hourlyBudget}</Box>
        <Box>{invites.address}</Box>
       <Box> {invites.timeOfService}</Box>
       <Box> {invites.requiredService}</Box>
       <Box> {invites.detail}</Box>
       <Button> {invites.status}</Button>

    </Box>
    </Box>
    );
  }else 
  return '';
})}

 
  </Box>
</Box>
   </Box>
   </>
  );
};

export default ReceiveInvites;
