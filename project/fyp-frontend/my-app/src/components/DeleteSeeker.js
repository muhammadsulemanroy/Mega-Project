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
import { useNavigate } from "react-router-dom";
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
    width:'30rem',
   
 
  },
  icon: {
    color: 'green',
    fontSize: '4rem',
    marginBottom: '1rem',
  },
};

const DeleteSeekerProfile= ({ open,message }) => {
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
 const [data, setData] = useState({
    firstName:'',
    lastName:'',
    email:'',
    password:'',
    requiredService:'',
    detailOfRequiredService:'',
    address:'',
    estimatedHourlyBudget:'',
    timeOfService:'',
    picture:null,
  });

  const headers = {
    "Content-Type": 'application/json',
    Authorization: `Bearer ${tokensaved}`,
  };

   const [result,setResult] = useState(null);
   const [error, setError] = useState(null);
 const dispatch = useDispatch();
 const navigate = useNavigate();
 const formOnChangeHandler = (event) => {
    const { name, value } = event.target;

   if(event.target.name === "picture"){
    setData({...data, [event.target.name]:event.target.files[0]});
  }else{
    setData({...data, [event.target.name]:event.target.value})
  }

  if (name === 'estimatedHourlyBudget') {
    const numericValue =value;
  
    if ( numericValue < 2 || numericValue > 20) {
      // Handle the validation error
      return;
    }
  }
};

const deleteProfileHandler = async (event) => {
    try {
      const res = await axios.delete('http://127.0.0.1:8000/api/v1/seekers/deleteSeeker', { headers });
      setResult(res.data.status);
  
      // Use setTimeout to ensure the state is updated before navigation
      setTimeout(() => {
        navigate('/signupseeker', { replace: true });
        console.log("After navigation");
      }, 0);
    } catch (err) {
      setError(err.response.data.message);
      console.log(err.response.data);
    }
  };
  
   
    const handleInviteSuccessModel =()=>{

      dispatch(viewPostedJobsActions.inviteJobSuccessModel(true));
     }
     
    
   

     const closeEditModalHandler =()=>{
      dispatch(updateProfileActions.SetOpenEditModel(false));
  }

    const handleSuccessModel = () => {
        dispatch(postingJobActions.postJobSuccessModel(true));
      };
      const handleCloseModel = () => {
        dispatch(postingJobActions.postJobSuccessModel(false));
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

      const closeDeleteProfile =()=>{
        dispatch(updateProfileActions.SetOpenDeleteModel(false));
      }
    
  return (
    <>

    <TransparentDialog open={open}  fullScreen>
      <div style={styles.container}>
     
        <DialogTitle style={styles.title}>Edit Profile</DialogTitle>
        {inviteSuccessModel=== true ?<><DialogTitle style={styles.title}></DialogTitle>
        <CheckCircleIcon style={styles.icon} /></>:''}
        <DialogContent style={styles.content}>
          
      <Button onClick={deleteProfileHandler }>Yes</Button>
      <Button onClick={closeDeleteProfile}>No</Button>
        </DialogContent>
        
       
      </div>
    </TransparentDialog>
    
    </>
  );
};

export default DeleteSeekerProfile;
