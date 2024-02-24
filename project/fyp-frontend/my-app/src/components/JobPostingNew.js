import React from "react";
import { useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Snackbar,
  FormControl,
  TextField,
  Button,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import HeaderVerified from "./HeaderVerified";
import Dialog from '@mui/material/Dialog';
import ModalSignUp from "./ModelSignUp";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { postingJobActions } from "../store/index";
import { Link } from "react-router-dom";
import { viewPostedJobsActions } from "../store/index";
import { useEffect } from "react";
import ModalSendInvite from "./ModalSendInvite";
import { useNavigate } from "react-router-dom";
import EditJob from "./EditJob";
import DeleteJob from "./DeleteJob";
import Pusher from 'pusher-js';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';
import Avatar from '@mui/material/Avatar';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { makeStyles } from '@mui/styles';
import { styled } from '@mui/system';

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
  

const  JobPostingNew= () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tokensaved = Cookies.get("token");
  const data = useSelector((state) => state.postingJob.postingJobText);
  const result = useSelector((state) => state.postingJob.result);
  const error = useSelector((state) => state.postingJob.error);
  const isSuccess = useSelector((state) => state.postingJob.isSuccessModel);
  const openSnackbar = useSelector((state) => state.postingJob.openSnackbar);
  const jobs = useSelector((state) => state.viewPostedJobs.jobs);
  const jobId = useSelector((state) => state.viewPostedJobs.jobId);
  const sentinvites = useSelector((state) => state.viewPostedJobs.inviteStatus);
const openjobeditModal = useSelector((state) => state.viewPostedJobs.openJobEditModal);
const openjobdeleteModal = useSelector((state) => state.viewPostedJobs.openJobDeleteModal);
const inviteSuccessModel = useSelector(state => state.viewPostedJobs.inviteWorkersuccessmodel);
const openSnackbarError = useSelector(state => state.viewPostedJobs.openSnackbarError);
const openpostjobModal = useSelector((state) => state.postingJob.applyjobModel);

  const pusher = new Pusher('9c1556f9773e416e3dab', {
    cluster: 'mt1',
    encrypted: true,
  });
  
  const channel = pusher.subscribe('seeker-channel');


  const seekerIdHandler = (jobs)=>{
    const seekerId = jobs.seekerId;
    sessionStorage.setItem('postedJobSeekerId', seekerId);
  }

  const handleCloseModelHandler = () => {
    dispatch(viewPostedJobsActions.setInviteModal(false));
  };

  const formOnChangeHandler = (event) => {
    dispatch(
      postingJobActions.setPostingJobs({
        [event.target.name]: event.target.value,
      })
    );
  };
  const handleSuccessModel = () => {
    dispatch(postingJobActions.postJobSuccessModel(true));
  };
  const handleCloseModel = () => {
    dispatch(postingJobActions.openApplyJobModel(false));
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

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokensaved}`,
    };
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/v1/seekers/postjob",
        data,
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
 

 






 

 
 


  
  return (
    <>
      
     

      <TransparentDialog open={openpostjobModal} onClose={handleCloseModel} fullScreen>
      <div style={styles.container}>
     
        <DialogTitle style={styles.title}>Post Job</DialogTitle>
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
             
            </form>
            <Button variant="contained" onClick={handleCloseModel }>Cancel</Button>
          </Box>

     

        

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
export default JobPostingNew;
