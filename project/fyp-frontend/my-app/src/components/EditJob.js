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

const EditJob = ({ open,message }) => {
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
 const editjobId = useSelector((state) => state.viewPostedJobs.JobEditId);
 const [data, setData] = useState({
    requiredService:'',
    detail:'',
    address:'',
    hourlyBudget:'',
    timeOfService:'',
    
  });

  const headers = {
    "Content-Type": 'multipart/form-data',
    Authorization: `Bearer ${tokensaved}`,
  };

   const [result,setResult] = useState(null);
   const [error, setError] = useState(null);
 const dispatch = useDispatch();

 const formOnChangeHandler = (event) => {
    const { name, value } = event.target;
setData({...data, [event.target.name]:event.target.value})
 

  if (name === 'estimatedHourlyBudget') {
    const numericValue =value;
  
    if ( numericValue < 2 || numericValue > 20) {
      // Handle the validation error
      return;
    }
  }
};

const editJobData = {
    ...data,
    editjobId 
}
const formSubmitHandler = async (event) => {
    event.preventDefault();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokensaved}`,
    };
    try {
      const res = await axios.patch(
        "http://127.0.0.1:8000/api/v1/seekers/postjob",
        editJobData,
        { headers }
      );
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
    
  const closeEditJobModal =()=>{
    dispatch(viewPostedJobsActions.setOpenJobEditModal(false));
  }
  return (
    <>

    <TransparentDialog open={open} onClose={closeEditJobModal} fullScreen>
      <div style={styles.container}>
     
        <DialogTitle style={styles.title}>Edit Job</DialogTitle>
        {inviteSuccessModel=== true ?<><DialogTitle style={styles.title}></DialogTitle>
        <CheckCircleIcon style={styles.icon} /></>:''}
        <DialogContent style={styles.content}>
        
        <Box className="container-jobposting">
          <form
            className="job-posting-class"
            method="post"
            onSubmit={formSubmitHandler}
          >
            <Box className="jobpost-form-head">
              <Typography className="form-head-text" variant="p">
                Job posting Form
              </Typography>
            </Box>

            <FormControl className="signup_formControl">
              <TextField
                size="large"
                type="text"
                name="requiredService"
                label="Required Service"
                variant="outlined"
                onChange={formOnChangeHandler}
                required
                disabled={openSnackbar}
                value={data.requiredService}
              />

              <TextField
                size="large"
                type="text"
                name="detail"
                label="Detail"
                variant="outlined"
                onChange={formOnChangeHandler}
                required
                disabled={openSnackbar}
                value={data.detail}
              />

              <TextField
                size="large"
                type="text"
                name="address"
                label="Address"
                variant="outlined"
                onChange={formOnChangeHandler}
                required
                disabled={openSnackbar}
                value={data.address}
              />

              <TextField
                size="large"
                type="number"
                name="hourlyBudget"
                label="Hourly Rate"
                variant="outlined"
                onChange={formOnChangeHandler}
                required
                disabled={openSnackbar}
                value={data.hourlyBudget}
              />

              <TextField
                fullWidth
                size="large"
                type="number"
                name="timeOfService"
                label="Time of Service"
                variant="outlined"
                onChange={formOnChangeHandler}
                required
                disabled={openSnackbar}
                value={data.timeOfService}
              />
              <Button
                size="large"
                type="submit"
                variant="contained"
                disabled={openSnackbar}
              >
                Register
              </Button>
            </FormControl>
            <Snackbar
              open={openSnackbar}
              // autoHideDuration={6000}  // Comment out or remove this line
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <MuiAlert
                elevation={6}
                onClose={handleClose}
                variant="filled"
                severity="error"
              >
                {error}
              </MuiAlert>
            </Snackbar>
          </form>
        </Box>
      <Button onClick={closeEditJobModal}>Close</Button>
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

export default EditJob;
