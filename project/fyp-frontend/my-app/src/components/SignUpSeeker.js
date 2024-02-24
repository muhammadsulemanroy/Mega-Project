import React from "react";
import { useState } from "react";
import axios from 'axios';
import { Box, Typography } from "@mui/material";
import { Button, FormControl, TextField } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import Image1 from '../Assets/firstImage.jpg';
import Image2 from '../Assets/SecondImage.jpg';
import Image3 from '../Assets/ThirdImage.jpg';
import Image4 from '../Assets/FourthImage.jpg';
import Image5 from '../Assets/FifthImage.jpg';
import  ImageCarousel from './ImageCarousel';
import { makeStyles } from '@mui/styles';





const useStyles = makeStyles((theme) => ({
  textField: {
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
     // Change the border color here
      borderColor: '#1976d2'
    },
    
  },
}));

const SignUpSeeker = () => {
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




   const [result,setResult] = useState(null);
   const [error, setError] = useState(null);
   const images = [Image1,Image2,Image3,Image4,Image5]
   const classes = useStyles(); 


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
      const res = await axios.post('http://127.0.0.1:8000/api/v1/seekers/signupseeker', formData);
      console.log(res.data.status);
      setResult(res.data.status); // Assuming your API response has a 'status' field
  
    } catch (err) {
      setError(err.response.data.message);
      console.log(err.response.data);
    }
  };

 

  return (
    <>
 `     <Box className="container-signup-parent">
      <Box className="container-signup-head">`
      <Box className="container-signup">
        <form className="signupclass" onSubmit={formSubmitHandler}>
          <Box className="black-form-head">
            <Typography className="form-head-text" variant="p">
              Registration Form
            </Typography>
          </Box>

          <FormControl className="signup_formControl">
            <Box className="namefields">
              <TextField
                fullWidth
                size="small"
                type="text"
                name="firstName"
                label="First Name"
                variant="outlined"
                onChange={formOnChangeHandler}
                required

                InputProps={{
                    sx: {
                      borderRadius: "7px",
                    },
                 
                  }}

                  className={classes.textField}
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

                InputProps={{
                    sx: {
                      borderRadius: "7px",
                    },
                    
                  }}
                  className={classes.textField}
              />
      
            </Box>

            <TextField
              size="small"
              type="email"
              name="email"
              label="Email"
              variant="outlined"
              onChange={formOnChangeHandler}
              required

              InputProps={{
                    sx: {
                      borderRadius: "7px",
                    },
                    
                  }}
                  className={classes.textField}
            />
      

            <TextField
              size="small"
              type="password"
              name="password"
              label="Password"
              variant="outlined"
              onChange={formOnChangeHandler}
              required
              InputProps={{
                    sx: {
                      borderRadius: "7px",
                    },
                    
                  }}
                  className={classes.textField}
            />
         

            <TextField
              size="small"
              type="text"
              name="requiredService"
              label="Required Service"
              variant="outlined"
              onChange={formOnChangeHandler}
              required
              InputProps={{
                    sx: {
                      borderRadius: "7px",
                    },
                    
                  }}
                  className={classes.textField}
            />
       
            <TextField
              size="small"
              type="text"
              name="detailOfRequiredService"
              label="Detail Of Required Service"
              variant="outlined"
              onChange={formOnChangeHandler}
              required
              InputProps={{
                    sx: {
                      borderRadius: "7px",
                    },
                    
                  }}
                  className={classes.textField}
            />
            <TextField
              size="small"
              type="text"
              name="address"
              label="Address"
              variant="outlined"
              onChange={formOnChangeHandler}
              required
              InputProps={{
                    sx: {
                      borderRadius: "7px",
                    },
                    
                  }}
                  className={classes.textField}
            />

             <TextField
                fullWidth
                size="small"
                accept="image/*"
                type="file"
                name="picture"
              
                variant="outlined"
                onChange={formOnChangeHandler}
                required
                InputProps={{
                    sx: {
                      borderRadius: "7px",
                    },
                    
                  }}
                  className={classes.textField}
              />

            <Box className="namefields">
              <TextField
                fullWidth
                size="small"
                accept="image/*"
                type="number"
                name="estimatedHourlyBudget"
                label="Estimated Hourly Budget"
                variant="outlined"
                onChange={formOnChangeHandler}
                required
                InputProps={{
        endAdornment: (
          <InputAdornment position="end">
        {(data.estimatedHourlyBudget !== '' && (data.estimatedHourlyBudget < 2 || data.estimatedHourlyBudget > 20)) ? (
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
      className={classes.textField}
   
              />
           

              <TextField
                fullWidth
                size="small"
                className="upload-picture"
                type="number"
                name="timeOfService"
                label="Time Of Service"
                variant="outlined"
                onChange={formOnChangeHandler}
                required

                InputProps={{
                    sx: {
                      borderRadius: "7px",
                    },
                    
                  }}
                
              />
              
       
             
           
            
            </Box>
            

       

            <Button size="small" type="submit" variant="contained">
              Register
            </Button>
         {result && <Box style={{ backgroundColor: 'green' }} >{result}</Box>}  
         {error && <Box style={{ backgroundColor: 'red' }} >{error}</Box>}  
          </FormControl>

        </form>
      </Box>
      </Box>

      <Box className='signup-carousel'>
      <ImageCarousel images={images}/>
      </Box>
      </Box>
    </>
  );
};
export default SignUpSeeker;
