import React from "react";
import { useStateyrew,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import { Box, Typography,Snackbar, FormControl, TextField, Button } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import HeaderVerifiedWorker from "./HeaderVerifiedWorker";
import Dialog from './Model';
import { applyJobActions } from '../store/index';
import Cookies from 'js-cookie';
import InputAdornment from '@mui/material/InputAdornment';
import Pusher from 'pusher-js';

const pusher = new Pusher('9c1556f9773e416e3dab', {
  cluster: 'mt1',
  encrypted: true,
});

const channel = pusher.subscribe('seeker-channel');
const ApplyJob = (open) => {
  const dispatch = useDispatch();

  const data = useSelector(state => state.applyjob.applyJobData);
  const tokensaved = Cookies.get('token');
  console.log(data);
 

   const result = useSelector(state => state.applyjob.applyJobResult);
 const error = useSelector(state => state.applyjob.error);
 const isSuccess = useSelector(state => state.applyjob.isSuccessModel);
 const openSnackbar = useSelector(state => state.applyjob.openSnackbar);

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
  return (
    <>
    <Dialog open= {isSuccess} onClose= {handleCloseModel} message={result}/>

     <Box><span>Apply Here</span></Box>
   
    
    </>
  );
};
export default ApplyJob;
