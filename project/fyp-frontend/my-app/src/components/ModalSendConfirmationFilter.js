import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { styled } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Cookies from 'js-cookie';
import { filterWorkerActions, viewPostedJobsActions } from '../store';
import { Box, Typography,Snackbar, FormControl, TextField, Button } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
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

const  ModalSendConfirmationFilter = ({ open, onClose }) => {
    const jobs= useSelector((state) => state.filterWorker.jobs);
    const showSendInviteConfirm = useSelector(state => state.filterWorker.InviteModalConfirmation);
    const jobIndex = useSelector((state) => state.filterWorker.InviteModalConfirmationIndex);
    const selectedJob= useSelector((state) => state.filterWorker.confirmationIndexJob);
    const inviteWorkerId= useSelector((state) => state.filterWorker.inviteWorker);
    const error = useSelector(state => state.filterWorker.error);
 const openSnackbar = useSelector(state => state.filterWorker.openSnackbar);
 const successInvite = useSelector(state => state.filterWorker.inviteWorkerResult);
 const errorInvite = useSelector(state => state.filterWorker.inviteWorkererror);
 const inviteSuccessModel = useSelector(state => state.filterWorker.inviteWorkersuccessmodel);
 const openSnackbarError = useSelector(state => state.filterWorker.openSnackbarError);
 const tokensaved = Cookies.get('token');
    const dispatch = useDispatch();
    const jobInvite = {
      workerId:inviteWorkerId,
      jobId:selectedJob._id,
      seekerId:selectedJob.seekerId,
      requiredService:selectedJob.requiredService,
      detail:selectedJob.detail,
      address:selectedJob.address,
      hourlyBudget:selectedJob.hourlyBudget,
      timeOfService:selectedJob.timeOfService,
    }
    const handleInviteSuccessModel =()=>{

      dispatch(filterWorkerActions.inviteJobSuccessModel(true));

    };
      const handleSnackbarError =()=>{
        dispatch(filterWorkerActions.openSnackbarError(true));
      }
      const handleClose = (event, reason) => {
        if (reason === "clickaway") {
          return;
        }
        dispatch(filterWorkerActions.openSnackbarError(false));
      };
    const sendInvite =async()=>{
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokensaved}`,
    };
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/v1/seekers/sendInvite',jobInvite,{headers});
      console.log(res.data.message); 
      handleInviteSuccessModel()
      dispatch(filterWorkerActions.setsentInviteResult(res.data.message));
    
    } catch (err) {
      handleSnackbarError()
      dispatch(filterWorkerActions.errorInviteResult(err.response.data.message));
      console.log(err);
    }


  };

  return ( 
    <>
    <TransparentDialog open={showSendInviteConfirm } onClose={onClose} fullScreen>
      <div style={styles.container}>
     
        <DialogTitle style={styles.title}>Are Your Sure To Send Job Invite For Job{jobIndex}!</DialogTitle>
    
        {inviteSuccessModel=== true ?<><DialogTitle style={styles.title}>{successInvite}</DialogTitle>
        <CheckCircleIcon style={styles.icon} /></>:''}
        
            <Button variant='contained' onClick={sendInvite}>job{jobIndex}</Button>
      
          <Button onClick={onClose} color="primary" variant="contained">
            Close
          </Button>
 
      </div>
    </TransparentDialog>
    <Snackbar
        open={openSnackbarError}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert elevation={6} onClose={handleClose} variant="filled" severity="error">
          {error}
        </MuiAlert>
      </Snackbar>
      </>
  );

}
export default ModalSendConfirmationFilter;
