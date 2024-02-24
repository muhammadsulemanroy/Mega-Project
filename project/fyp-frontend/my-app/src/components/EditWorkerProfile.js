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
import  Divider  from '@mui/material/Divider';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { availableJobsActions } from '../store/index';
import Avatar from '@mui/material/Avatar';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { Tooltip } from '@mui/material/Tooltip';
import { makeStyles } from '@mui/styles';
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
    overflowY: 'hidden', 
    overflowX:'hidden',// Prevent vertical scrolling
    height: '100vh', 
    width:'100%',
    display:'flex',
    alignContent:'center'
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

const useStyles = makeStyles((theme) => ({
  textField: {
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
     // Change the border color here
      borderColor: '#C6C7C9'
    },
   
  },
 
}));



const EditWorkerProfile = ({ open,message }) => {
  const SendInviteConfirmation = useSelector(state => state.viewPostedJobs.showInviteModal);
    const inviteSuccessModel = useSelector(state => state.viewPostedJobs.inviteWorkersuccessmodel);
 const openSnackbarError = useSelector(state => state.viewPostedJobs.openSnackbarError);
 const showCloseButton = useSelector(state => state.viewPostedJobs.showCloseButton);
 const tokensaved = Cookies.get('token');
 const loggedWorker = useSelector(state=> state.availableJobs.loggedWorker);




 const isSuccess = useSelector((state) => state.postingJob.isSuccessModel);
 const openSnackbar = useSelector((state) => state.postingJob.openSnackbar);
 const jobs = useSelector((state) => state.viewPostedJobs.jobs);
 const jobId = useSelector((state) => state.viewPostedJobs.jobId);
 const sentinvites = useSelector((state) => state.viewPostedJobs.inviteStatus);
 const classes = useStyles(); 
 const [data, setData] = useState({
    firstName:'',
    lastName:'',
    mobileNo:'',
    email:'',
    password:'',
    qualificationDetails:'',
    picture:null,
    experience:'',
    bio:'',
    hourlyRate:'',
    category:'',
    referenceName:'',
    referenceRelation:'',
    referenceContactNo:''
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
    if(event.target.name === "picture"){
      setData({...data, [event.target.name]:event.target.files[0]});
    }else{
      setData({...data, [event.target.name]:event.target.value});
      if (name === 'mobileNo') {
        if (value.length < 8) {
          // Handle the validation error, e.g., show an error message or disable the submit button
          // You can also set an error state to indicate the validation status
          // For example: setMobileNoError('Mobile No must have at least 8 digits');
          return;
        }
      }
      if (name === 'referenceContactNo') {
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

   
  };

const formSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
           if (key === 'picture' && value) {
        // If it's the 'picture' field and there's a value, append it with the name
        formData.append(key, value, value.name);
      } else {
        formData.append(key, value);
      }
      });
       console.log(data);
       console.log(formData);
       const res = await axios.patch('http://127.0.0.1:8000/api/v1/workers/updateWorker', formData, { headers });
      console.log(res.data.status);
      setResult(res.data.status); // Assuming your API response has a 'status' field
  
    } catch (err) {
      setError(err.response.data.message);
      console.log(err.response.data);
    }
  };
  

   
    const handleInviteSuccessModel =()=>{

      dispatch(viewPostedJobsActions.inviteJobSuccessModel(true));
     }
     
    
   

    const closeEditModalHandler =()=>{
        dispatch(updateProfileActions.SetOpenEditWorkerModel(false));
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
    
      const bull = (
        <Box
          component="span"
          sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
        >
          •
        </Box>
      );
      
      const card = (
        <React.Fragment>
          <CardContent style={{display:'flex',flexDirection:'column', justifyContent:'space-between', height:'37rem' }}>
          <Box sx={{ display:'flex', alignItems:'start', justifyContent:'center'}}>
           <Typography variant='h1' style={{fontFamily:'sans-serif', fontWeight:'700', fontSize:'2.875rem'}}>My Profile</Typography>
           </Box>
          <Divider sx={{color:'red' , height:'1%'}}/>
            
                 <form  onSubmit={formSubmitHandler} encType="multipart/form-data" style={{display:'flex', justifyContent:'space-between',flexDirection:'column',height:'33rem'}}>
               <Box  style={{display:'flex', justifyContent:'space-around',height:'31rem'}}>
               
                 <label htmlFor="upload-button" style={{ position: 'relative', display: 'inline-block' ,width: '10rem', height: '10rem',}}>
  <Avatar
    alt=""
    style={{ width: '10rem', height: '10rem', cursor: 'pointer' }}
    src={`http://127.0.0.1:8000/uploads/${loggedWorker.picture}`}
  />
<div

  style={{ 
    position: 'absolute', 
    top: '70%', 
    left: '63%', 
    width: '2.5rem', 
    height: '2.5rem', 
    borderRadius: '50%', 
    backgroundColor: 'white',
    padding: 0, 
    zIndex:100,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',

  }}
></div>
  <EditRoundedIcon sx={{"&:hover": { color: "black" } , position: 'absolute', top: '75%', left: '69%',  zIndex:100, color:'grey' }} />
  <input
    id="upload-button"
    type="file"
    name="picture"
    style={{ display: 'none' }}
    onChange={formOnChangeHandler}
    accept="image/*"
  />
</label> 

<FormControl className="editworker_formControl">
<Box className="editworkernamefields">
              <TextField
                fullWidth
                size="small"
                type="text"
                name="firstName"
                label="First Name"
                variant="outlined"
                onChange={formOnChangeHandler}
                required
                className={classes.textField}
                InputProps={{
                    sx: {
                      borderRadius: "7px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.08)", 
                    },
                  
                  }}
              />
         
              <TextField
                fullWidth
                size="small"
                type="text"
                label="LastName"
                variant="outlined"
                name="lastName"
                onChange={formOnChangeHandler}
                required
                className={classes.textField}
                InputProps={{
                    sx: {
                      borderRadius: "7px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.08)", 
                    },
                  
                  }}
              />
      
            </Box>

      
            <Box className="editworkernamefields">
            <TextField
                   fullWidth
              size="small"
              type="email"
              name="email"
              label="Email"
              variant="outlined"
              onChange={formOnChangeHandler}
              required

              className={classes.textField}
                InputProps={{
                    sx: {
                      borderRadius: "7px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.08)", 
                    },
                  
                  }}
            />
         

            <TextField
                   fullWidth
              size="small"
              type="password"
              name="password"
              label="Password"
              variant="outlined"
              onChange={formOnChangeHandler}
              required

              className={classes.textField}
                InputProps={{
                    sx: {
                      borderRadius: "7px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.08)", 
                    },
                  
                  }}
            />
       
       </Box>
       

       <Box className="editworkernamefields">
       <TextField
              fullWidth
              size="small"
              type="number"
              name="mobileNo"
              label="MobileNo"
              variant="outlined"
              onChange={formOnChangeHandler}
              className={classes.textField}
              required
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
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.08)", 
                    }
      }}
            />

            <TextField
                   fullWidth
              size="small"
              type="text"
              name="qualificationDetails"
              label="QualificationDetails"
              variant="outlined"
              onChange={formOnChangeHandler}
              required
              className={classes.textField}
                InputProps={{
                    sx: {
                      borderRadius: "7px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.08)", 
                    },
                  
                  }}
            />
            </Box>
            <Box className="editworkernamefields">
            

              <TextField
                fullWidth
                size="small"
                type="number"
                name="experience"
                label="Experience"
                variant="outlined"
                onChange={formOnChangeHandler}
                required
                className={classes.textField}
                InputProps={{
                    sx: {
                      borderRadius: "7px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.08)", 
                    },
                  
                  }}
              />

            
       
         
              <TextField
                fullWidth
                size="small"
                type="text"
                name="bio"
                label="Bio"
                variant="outlined"
                onChange={formOnChangeHandler}
                required
                className={classes.textField}
                InputProps={{
                    sx: {
                      borderRadius: "7px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.08)", 
                    },
                  
                  }}
              />
             </Box>


              <TextField
                fullWidth
                size="small"
                type="number"
                name="hourlyRate"
                label="Hourly rate"
                variant="outlined"
                onChange={formOnChangeHandler}
                required
                className={classes.textField}
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
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.08)", 
                    }
      }}
                
              />
       
        

       <Box className="editworkernamefields">
              <TextField
                fullWidth
                size="small"
                type="text"
                name="category"
                label="Category"
                variant="outlined"
                onChange={formOnChangeHandler}
                required

                className={classes.textField}
                InputProps={{
                    sx: {
                      borderRadius: "7px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.08)", 
                    },
                  
                  }}
              />
        
              <TextField
                fullWidth
                size="small"
                type="text"
                name="referenceName"
                label="Reference Name"
                variant="outlined"
                onChange={formOnChangeHandler}
                required

                className={classes.textField}
                InputProps={{
                    sx: {
                      borderRadius: "7px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.08)", 
                    },
                  
                  }}
              />
       
            </Box>

            <Box className="editworkernamefields">
              <TextField
                fullWidth
                size="small"
                type="text"
                name="referenceRelation"
                label="Reference Relation"
                variant="outlined"
                onChange={formOnChangeHandler}
                required

                className={classes.textField}
                InputProps={{
                    sx: {
                      borderRadius: "7px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.08)", 
                    },
                  
                  }}
              />
        
              <TextField
                fullWidth
                size="small"
                type="number"
                name="referenceContactNo"
                label=" Reference Contact No"
                variant="outlined"
                onChange={formOnChangeHandler}
                required
                className={classes.textField}
                InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {data.referenceContactNo.length > 0 && data.referenceContactNo.length < 8 && (
              <span style={{ color: 'red' }}>
                Minimum 8 characters
              </span>
            )}
          </InputAdornment>
        ),

        sx: {
                      borderRadius: "7px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.08)", 
                    }
      }}

     
              />
       
            </Box>
            
          
         {result && <Box style={{ backgroundColor: 'green' }} >{result}</Box>}  
         {error && <Box style={{ backgroundColor: 'red' }} >{error}</Box>}  
          </FormControl>
          </Box>

          <Divider sx={{color:'red' , height:'1%'}}/>
         <Box sx={{display:'flex' , justifyContent:'flex-end',  gap:'2rem', height:'5rem', alignItems:'center'}}>
            
         <Button 
    onClick={closeEditModalHandler}
    sx={{ 
        color: '#32384A', 
        fontWeight: 'bold', 
        border: '1px solid #CDD7E1',
        height:'3rem',
        '&:hover': {
            border: '1px solid #CDD7E1', // Set the same border color on hover to prevent change
        },
    }} 
    variant="outlined"
>
Cancel
</Button>
           
           <Button size="small" type="submit" variant="contained"    sx={{
            height: '3rem',
        }}>
              Register
            </Button>
            </Box>
        </form>

      
          </CardContent>
          
        </React.Fragment>
      );

  return (
    <>

    <TransparentDialog open={open}  fullScreen>
      <div style={styles.container}>
     
        <DialogTitle style={styles.title}></DialogTitle>
        {inviteSuccessModel=== true ?<><DialogTitle style={styles.title}></DialogTitle>
        <CheckCircleIcon style={styles.icon} /></>:''}
        <DialogContent style={styles.content}>
        <Box  sx={{display:'flex',justifyContent:'center'}}>
        <Box sx={{ minWidth: 800  } }>
  
  <Card variant="outlined" sx={{backgroundColor:'#FBFCFE'}}>{card}</Card>
  <br/>

</Box>
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

export default EditWorkerProfile;
