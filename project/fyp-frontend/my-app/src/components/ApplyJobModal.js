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
import { useState} from "react";

import { Box, Typography ,FormControl, TextField} from "@mui/material";

import HeaderVerifiedWorker from "./HeaderVerifiedWorker";

import { applyJobActions } from '../store/index';

import InputAdornment from '@mui/material/InputAdornment';
import Pusher from 'pusher-js';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { makeStyles } from '@mui/styles';


const useStyles = makeStyles(() => ({
  textField: {
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
     // Change the border color here
      borderColor: '#1976d2'
    },
    centeredLabel: {
      textAlign: 'center'
    },
    select: {
      '&:hover': {
        borderColor: 'red' // Change border color on hover
      }
    }
  },
}));




const pusher = new Pusher('9c1556f9773e416e3dab', {
  cluster: 'mt1',
  encrypted: true,
});

const channel = pusher.subscribe('seeker-channel');
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
    width:'100%'
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

const ApplyJobModal = ({ open, onClose,message }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const data = useSelector(state => state.applyjob.applyJobData);
  const tokensaved = Cookies.get('token');
  console.log(data);
  const showCloseButton = useSelector(state => state.viewPostedJobs.openeditmodal);
  const inviteSuccessModel = useSelector(state => state.viewPostedJobs.inviteWorkersuccessmodel);
   const result = useSelector(state => state.applyjob.applyJobResult);
 const error = useSelector(state => state.applyjob.error);
 const isSuccess = useSelector(state => state.applyjob.isSuccessModel);
 const openSnackbar = useSelector(state => state.applyjob.openSnackbar);
 const openSnackbarError = useSelector(state => state.viewPostedJobs.openSnackbarError);

  const formOnChangeHandler = (event) => {
    const { name, value } = event.target;
   
        dispatch(applyJobActions.setApplyJobsData({[event.target.name]:event.target.value}));
        if (name === 'mobileNo') {
          if (value.length < 8) {
            // Handle the validation error, e.g., show an error message or disable the submit button
            // You can also set an error state to indicate the validation status
            // For example: setMobileNoError('Mobile No must have at least 8 digits');
            return;
          }
        }
   
    
      // Perform your validation here
    if (name === 'hourlyRate') {
      const numericValue =value;

      if ( numericValue < 2 || numericValue > 20) {
        // Handle the validation error
        return;
      }
    }
  }
    useEffect(()=>{
      const jobId = sessionStorage.getItem('jobIdApplication')
      dispatch(applyJobActions.setApplyJobsData({'jobId':jobId}));

    },[])

    const handleSuccessModel =()=>{

      dispatch(applyJobActions.postJobSuccessModel(true));
     }
      const handleCloseModel=()=>{
        dispatch(applyJobActions.postJobSuccessModel(false));
      }
    
      const handleSnackbarError =()=>{
        dispatch(applyJobActions.openSnackbarError(true));
      }
      const handleClose = (event, reason) => {
        if (reason === "clickaway") {
          return;
        }
        dispatch(applyJobActions.openSnackbarError(false));
      };
 const handleCloseNew =()=>{
  dispatch((applyJobActions.openApplyJobModel(false)));
 }
  const formSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(data.jobId);
    const headers = {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${tokensaved}`,
    };
    try {
      
   
      const res = await axios.post('http://127.0.0.1:8000/api/v1/workers/applyforjob', data,{headers});
      console.log(res.data.message); 
      handleSuccessModel()
      dispatch(applyJobActions.setApplyJobResult(res.data.message));
  
    } catch (err) {

      handleSnackbarError()
      dispatch(applyJobActions.errorJobResult(err.response.data.message));
      console.log(err.response.data.message);
    }
    dispatch(applyJobActions.resetPostingJobs());
  
  }
  const closeUpdateModalHandler =()=>{
    dispatch(updateProfileActions.SetOpenUpdateModal(false));
  }

 

  return (
  
    <>

  <TransparentDialog open={open} fullScreen>
      <div style={styles.container}>
     
        <DialogTitle style={styles.title}>Apply Job</DialogTitle>
        {inviteSuccessModel=== true ?<><DialogTitle style={styles.title}></DialogTitle>
        <CheckCircleIcon style={styles.icon} /></>:''}
        <DialogContent style={styles.content}>
        
  
        <>

        <form className="job-apply-class" method="post"  encType="multipart/form-data" onSubmit={formSubmitHandler}>
          <Box className="jobpost-form-head">
            <Typography className="form-head-text" variant="p">
              Application Form
            </Typography>
          </Box>

          <FormControl className="signup_formControl">
      
            

         


          <Box sx={{ minWidth: 420 }}>
      <FormControl fullWidth>
        <InputLabel  >Select User Type</InputLabel>
        <Select
         className={classes.select} 
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={data.category}
          label="Select User Type"
          onChange={formOnChangeHandler} 
          style={{ minWidth: 120, height:'2.5rem' }}
          name="category"
          
        >
          <MenuItem value="sick">Sick</MenuItem>
          <MenuItem value="babycare">Baby Care</MenuItem>
          <MenuItem value="cooking">Cooking</MenuItem>
          <MenuItem value="personalcare">Personal Care</MenuItem>
          <MenuItem value="animalcare">Animal Care</MenuItem>
          <MenuItem value="gyminstructor">Gym Instructor</MenuItem>
          <MenuItem value="domesticassistance">Domestic Assistance</MenuItem>
        </Select>
      </FormControl>
    </Box>

            <TextField
               fullWidth
              size="large"
              type="number"
              name="experience"
              label="Experience"
              variant="outlined"
              onChange={formOnChangeHandler}
              required
              disabled={openSnackbar}
              value={data.experience}
              inputProps={{
        min: 1, // Minimum value
        max: 30, // Maximum value
      }}

      InputProps={{
                    sx: {
                      borderRadius: "7px",
                    },
                  
                  }}

                  InputLabelProps={{
        style: { color: '#7a7b7c' } // Change placeholder color here
      }}
                  className={classes.textField}
    
            />
       
            <TextField
               fullWidth
              size="large"
              type="number"
              name="hourlyRate"
              label="Hourly Rate"
              variant="outlined"
              onChange={formOnChangeHandler}
              required
              disabled={openSnackbar}
              value={data.hourlyRate}
              InputProps={{
        endAdornment: (
          <InputAdornment position="end">
        {(data.hourlyRate !== '' && (data.hourlyRate < 2 || data.hourlyRate > 20)) ? (
              <span style={{ color: 'red' }}>
                Invalid Hourly Rate
              </span>
            ) : null}
          </InputAdornment>
        ),
        sx: {
                      borderRadius: "7px",
                    },
                  
      }}

    

                  InputLabelProps={{
        style: { color: '#7a7b7c' } // Change placeholder color here
      }}
                  className={classes.textField}
            />
       
          
              <TextField
                fullWidth
                size="large"
                type="number"
                name="mobileNo"
                label="Mobile No"
                variant="outlined"
                onChange={formOnChangeHandler}
                required
                disabled={openSnackbar}
                value={data.mobileNo}
                InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {data.mobileNo.length > 0 && data.mobileNo.length < 8 && (
              <span style={{ color: 'red' }}>
                Minimum 8 characters
              </span>
            )}
          </InputAdornment>
        ),
        sx: {
                      borderRadius: "7px",
                    },
      }}
   

                  InputLabelProps={{
        style: { color: '#7a7b7c' } // Change placeholder color here
      }}
                  className={classes.textField}
              />

       
            <Button size="large" type="submit" variant="contained"  disabled={openSnackbar}>
              Register
            </Button>
     
          </FormControl>
          <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert elevation={6} onClose={handleClose} variant="filled" severity="error">
          {error}
        </MuiAlert>
      </Snackbar>
        </form>

          <Button onClick={handleCloseNew} color="primary" variant="contained">
           Cancel
          </Button>
          </>
     
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

export default ApplyJobModal;
