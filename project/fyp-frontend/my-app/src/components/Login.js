import React from "react";
import { useState } from "react";
import axios from 'axios'
import Box from "@mui/material/Box";
import { TextField, Typography, Button, FormControl } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import Image1 from '../Assets/firstImage.jpg';
import Image2 from '../Assets/SecondImage.jpg';
import Image3 from '../Assets/ThirdImage.jpg';
import Image4 from '../Assets/FourthImage.jpg';
import Image5 from '../Assets/FifthImage.jpg';
import  ImageCarousel from './ImageCarousel';
import { makeStyles } from '@mui/styles';

const initialState = {
  email: '',
  password: '',
  user: ''
}

const useStyles = makeStyles((theme) => ({
  textField: {
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
     // Change the border color here
      borderColor: '#1976d2'
    },
    
  },
}));

const Login = () => {
  const [test, setTest] = useState(initialState);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isSelectFocused, setIsSelectFocused] = useState(false);
  const classes = useStyles(); 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formOnChangeHandler = (event) => {
    setTest({ ...test, [event.target.name]: event.target.value });
  };


  const images = [Image1,Image2,Image3,Image4,Image5]
  
  const formSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/login', test);
      console.log('login',response.data.token);
      setResult(response.data.token);
      const token = response.data.token;
      Cookies.set('token', token, { expires: 7, secure: true });
      console.log(response.data.id);
      console.log(response.data);

      if(response.data.user === 'seeker') {
        navigate('/firstPage', { replace: true })
      } else if(response.data.user === 'worker'){
        navigate('/firstpageworker', { replace: true })
      }
      // Reset form values
      setTest(initialState);
       
    } catch (err) {
      setError(err.response.data.message);
      console.log(err.message);
    }
  };

  return (
    <>
      <Box className="container-login">
        <Box className='loginClass-head'>
          <Box className="LoginClass">
            <Box className="login-text-box" style={{ backgroundColor: '#01005E' }}>
              <Typography className="login-text" variant="p">Login Form</Typography>
            </Box>
            <form onSubmit={formSubmitHandler} className="Login_formControl-head">
              <FormControl className="Login_formControl">
                <TextField
                  fullWidth
                  name="email"
                  variant="outlined"
                  onChange={formOnChangeHandler}
                  value={test.email}
                  label='Email'
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
                  type="password"
                  variant="outlined"
                  name="password"
                  onChange={formOnChangeHandler}
                  value={test.password}
                  required
                  label='Password'
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

                <select
                  className="custom-select"
                  onChange={(event) => {
                    formOnChangeHandler(event);
                    setIsSelectFocused(true);
                  }}
                  onBlur={() => setIsSelectFocused(true)}
                  name="user"
                  value={test.user}
                >
                  <option value="">Select User Type</option>
                  <option value="care seeker">Care Seeker</option>
                  <option value="support worker">Support Worker</option>
                </select>
                <Button type="submit" variant="contained" className="login-button">
                  Login
                </Button>
                {result && <Box style={{ backgroundColor: 'green' }}>{result}</Box>}
                {error && <Box style={{ backgroundColor: 'red' }}>{error}</Box>}
              </FormControl>
            </form>
          </Box>
        </Box>
        <Box className = 'login-pic-top'>
          <ImageCarousel images={images}/>
        </Box>
      </Box>
    </>
  );
}

export default Login;
