import React, { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { styled } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { viewPostedJobsActions } from '../store/index';
import Cookies from 'js-cookie';
import MuiAlert from "@mui/material/Alert";
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import {updateProfileActions}  from '../store/index';
import EditSeekerProfile from './EditSeekerProfile';
import DeleteSeekerProfile from './DeleteSeeker';
import EditWorkerProfile from './EditWorkerProfile';

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

const ModalUpdateSeeker = ({ open, onClose,message }) => {
  const SendInviteConfirmation = useSelector(state => state.viewPostedJobs.showInviteModal);
    const inviteSuccessModel = useSelector(state => state.viewPostedJobs.inviteWorkersuccessmodel);
 const openSnackbarError = useSelector(state => state.viewPostedJobs.openSnackbarError);
 const showCloseButton = useSelector(state => state.viewPostedJobs.openeditmodal);
 const tokensaved = Cookies.get('token');
 const openEditProfileModal = useSelector(state=> state.updateProfile.openeditmodal);
 const openEditWorkerProfileModal = useSelector(state=> state.updateProfile.openeditworkermodal);
const openDeleteModal = useSelector(state=> state.updateProfile.opendeletemodal);
const sessionuser = sessionStorage.getItem('user');
 const dispatch = useDispatch();

  
   
    const handleInviteSuccessModel =()=>{

      dispatch(viewPostedJobsActions.inviteJobSuccessModel(true));
     }
     
      const handleSnackbarError =()=>{
        dispatch(viewPostedJobsActions.openSnackbarError(true));
      }
      const handleClose = (event, reason) => {
        if (reason === "clickaway") {
          return;
        }
        dispatch(viewPostedJobsActions.openSnackbarError(false));
      };
    const sendInvite =async()=>{
      dispatch((viewPostedJobsActions.setInviteShowCloseButton(true)));
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokensaved}`,
      };
      try {
        const res = await axios.post('http://127.0.0.1:8000/api/v1/seekers/sendInvite',{headers});
        console.log(res.data.message); 
        handleInviteSuccessModel()
        dispatch(viewPostedJobsActions.setsentInviteResult(res.data.message));
      
      } catch (err) {
        handleSnackbarError()
        dispatch(viewPostedJobsActions.errorInviteResult(err.response.data.message));
        console.log(err);
      }
  
  
    };
  
    const closeUpdateModalHandler =()=>{
      dispatch(updateProfileActions.SetOpenUpdateModal(false));
    }

    const editProfile =()=>{
      dispatch(updateProfileActions.SetOpenEditModel(true));
    }
   
    const editProfileWorker =()=>{
      dispatch(updateProfileActions.SetOpenEditWorkerModel(true));
    }
    const deleteProfile =()=>{
      dispatch(updateProfileActions.SetOpenDeleteModel(true));
    }

     

  return (
  
    <>
      <EditWorkerProfile open={openEditWorkerProfileModal}/>
    <EditSeekerProfile open={openEditProfileModal} />
    <DeleteSeekerProfile open={openDeleteModal}/>
  <TransparentDialog open={open} fullScreen>
      <div style={styles.container}>
     
        <DialogTitle style={styles.title}>{message}</DialogTitle>
        {inviteSuccessModel=== true ?<><DialogTitle style={styles.title}></DialogTitle>
        <CheckCircleIcon style={styles.icon} /></>:''}
        <DialogContent style={styles.content}>
        
        { showCloseButton  ? <Button onClick={onClose}>Close</Button> :
        <>
        <Button variant='contained' onClick={() => {sessionuser === 'careseeker' ? editProfile() : editProfileWorker();}}>Edit Profile</Button>


            <Button variant='contained' onClick={deleteProfile} >Delete Profile</Button>
          <Button onClick={closeUpdateModalHandler} color="primary" variant="contained">
           Cancel
          </Button>
          </>
        }
        </DialogContent>
        <Snackbar
  open={openSnackbarError}
  // autoHideDuration={6000}  // Comment out or remove this line
  onClose={handleClose}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
>
  <MuiAlert elevation={6} onClose={handleClose} variant="filled" severity="error">
    {}
  </MuiAlert>
</Snackbar>
      </div>

      </TransparentDialog>

      </>

  );
};

export default ModalUpdateSeeker;
