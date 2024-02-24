import {useState} from 'react';
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
import {updateProfileActions}  from '../store/index'
import { postingJobActions } from "../store/index";
import InputAdornment from '@mui/material/InputAdornment';
import {
  Box,
  Typography,
  FormControl,
  TextField,
} from "@mui/material";

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
    width:'80rem',
   
 
  },
  icon: {
    color: 'green',
    fontSize: '4rem',
    marginBottom: '1rem',
  },
};

const DeleteJob = ({ open,message }) => {
  const SendInviteConfirmation = useSelector(state => state.viewPostedJobs.showInviteModal);
    const inviteSuccessModel = useSelector(state => state.viewPostedJobs.inviteWorkersuccessmodel);
 const openSnackbarError = useSelector(state => state.viewPostedJobs.openSnackbarError);
 const showCloseButton = useSelector(state => state.viewPostedJobs.showCloseButton);
 const tokensaved = Cookies.get('token');





 const isSuccess = useSelector((state) => state.postingJob.isSuccessModel);
 const openSnackbar = useSelector((state) => state.postingJob.openSnackbar);
 const jobs = useSelector((state) => state.viewPostedJobs.jobs);
 const jobId = useSelector((state) => state.viewPostedJobs.jobId);
 const sentinvites = useSelector((state) => state.viewPostedJobs.inviteStatus);
 const editdeleteId = useSelector((state) => state.viewPostedJobs.JobDeleteId);
 const [data, setData] = useState({
    requiredService:'',
    detail:'',
    address:'',
    hourlyBudget:'',
    timeOfService:'',
    
  });



   const [result,setResult] = useState(null);
   const [error, setError] = useState(null);
 const dispatch = useDispatch();

 const deleteJobHandler = async (event) => {

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokensaved}`,
    };
    try {
      const res = await axios.delete(
        "http://127.0.0.1:8000/api/v1/seekers/postjob",{
       params: {editdeleteId},
        headers: headers 
    });
      console.log(res.data.message);
      handleSuccessModel();

      // Assuming your API response has a 'status' field
      console.log(res.data.message);
      dispatch(postingJobActions.postJobResult(res.data.message));
    } catch (err) {
      dispatch(postingJobActions.errorJobResult(err.response.data.error));
      handleSnackbarError();
      console.log(err.response.data.error);
    }
    dispatch(postingJobActions.resetPostingJobs());
  };



  

  

    const handleSuccessModel = () => {
        dispatch(postingJobActions.postJobSuccessModel(true));
      };
    
    
      const handleSnackbarError = () => {
        dispatch(postingJobActions.openSnackbarError(true));
      };
      const handleClose = (event, reason) => {
        if (reason === "clickaway") {
          return;
        }
        dispatch(postingJobActions.openSnackbarError(false));
      };
    
  const closeDeleteJobModal =()=>{
    dispatch(viewPostedJobsActions.setOpenJobDeleteModal(false));
  }
  return (
    <>

    <TransparentDialog open={open} onClose={closeDeleteJobModal} fullScreen>
      <div style={styles.container}>
     
        <DialogTitle style={styles.title}>Are You Sure You Want To Delete This Job</DialogTitle>
        {inviteSuccessModel=== true ?<><DialogTitle style={styles.title}></DialogTitle>
        <CheckCircleIcon style={styles.icon} /></>:''}
        <DialogContent style={styles.content}>
        
        <Button onClick={deleteJobHandler} variant="contained">Yes</Button>
      <Button onClick={closeDeleteJobModal} variant="contained">No</Button>
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

export default DeleteJob;
