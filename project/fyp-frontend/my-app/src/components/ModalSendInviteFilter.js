import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { styled } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import DialogFour from './ModalSendConfirmationFilter';
import { filterWorkerActions, viewPostedJobsActions } from '../store/index';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useEffect } from 'react';

const TransparentDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    position: 'relative',
    backgroundColor: 'transparent',
  },
  '& .MuiDialog-paper:before': {
    content: '""',
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: -1,
  },
}));

const styles = {
  container: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    padding: '2rem',
    borderRadius: '10px',
    backgroundColor: 'white',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  content: {
    fontSize: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  icon: {
    color: 'green',
    fontSize: '4rem',
    marginBottom: '1rem',
  },
};


const ModalSendInviteFilter = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const ShowInviteConfirmation = useSelector(state => state.filterWorker.showInviteModal);
    const jobs = useSelector((state) => state.filterWorker.jobs);
    const jobsMessage = useSelector((state) => state.filterWorker.jobs);
    const showSendInviteConfirmation =(index,job)=>{
        dispatch((filterWorkerActions.setInviteModalConfirmation(true)));
        dispatch((filterWorkerActions.setInviteModalConfirmationIndex(index)));
        dispatch((filterWorkerActions.setInviteModalConfirmationJob(job)));
    }
    const handleCloseConfirmationModel =()=>{
        dispatch((filterWorkerActions.setInviteModalConfirmation(false)))
    }

    const handleJobs = async () => {
        const tokensaved = Cookies.get('token');
    
        console.log(jobs.length);
          const headers = {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${tokensaved}`,
            };
          try{
           const res = await axios.get('http://127.0.0.1:8000/api/v1/seekers/viewPostedJobs',{headers});
           dispatch((filterWorkerActions.setViewPostedJobs(res.data.jobs)));
          }catch(err){
          console.log(err);
          }
        };
        useEffect(()=>{
          handleJobs();    
        },[])
  return (
    <>
    <DialogFour open= {ShowInviteConfirmation} onClose= {handleCloseConfirmationModel}  />
    <TransparentDialog open={open} onClose={onClose} fullScreen>
      <div style={styles.container}>
     
        <DialogTitle style={styles.title}>For Which Job You Want to Send Invite!</DialogTitle>
        <DialogContent style={styles.content}>
        
          <div>{jobsMessage.map((job,index)=>(
            <Button variant='contained' onClick={()=>showSendInviteConfirmation([index],job)}>job{[index]}</Button>
          ))}</div>
          <Button onClick={onClose} color="primary" variant="contained">
            Close
          </Button>
        </DialogContent>
      </div>
    </TransparentDialog>
    </>
  );
};

export default ModalSendInviteFilter;
