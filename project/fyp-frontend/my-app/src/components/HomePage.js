import * as React from 'react';
import { useState,useEffect } from 'react';
import axios from 'axios';
import "../App.css";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CareLogo from '../Assets/carelogo.png';
import Link from  '@mui/material/Link';
import AboutImage from '../Assets/aboutus-image.png';
import Twitter from '../Assets/twitter-link.png';
import Facebook from '../Assets/facebook-link.png';
import Whatsapp from '../Assets/whatsapp-link.png';
import Instagram from '../Assets/instagram-link.png';
import Linkedin from '../Assets/linkedin-link.png';
import CardImage from '../Assets/card.png'
import SliderComponent from './SliderComponent';
import ServicesSlider from './ServicesSlider';
import Stars from './Stars';
import Header from './Header';
import Avatar from '@mui/material/Avatar';

const HomePage=()=> {
  const [data,setData] = useState([]);
  const [imagePath,setImagePath] =useState('');


  const fetchWorkers =async ()=>{
    try{
      const response = await axios.get('http://127.0.0.1:8000/api/v1/workers/top-three-workers');
      setImagePath(process.env.IMAGE_PATH+response.picture)
      setData(response.data.data.workers);
    }catch(error){
         console.log(error);
    }
  }
  useEffect(()=>{
    fetchWorkers();
  },[])
  return (
    <>

   <Box className='container'>
   <Header/>
    <Box className='slider-one-section'>
    <ServicesSlider/>
    </Box>
    <Box className='about-section'>
      <Box className='about-section-image'>
        <img src={AboutImage} alt=''/>
      </Box>
      <Box className='about-section-text'>
          <Typography variant='h4'><span className='about-heading'>About Us</span></Typography>
          <br/>
          <Typography ><span className='small-paragraph'>
Care Seeker: Simplifying care for your loved ones. Connect with trusted support workers across Baby Care, Cooking, Personal Care, Animal Care, Gym Instruction, and Domestic Assistance. Experience transparent and direct collaborations, prioritizing individual needs. Join our community where compassion meets convenience, building a network that enhances lives.</span></Typography>
          <Typography variant='h6'><span className='small-heading'>Our Commitment: Trustworthy Connections</span></Typography>
          <Typography><span className='small-paragraph-one'>Discover peace of mind as Care Seeker prioritizes trust through a stringent registration process for support workers, offering verified profiles, hourly rates, experience, and references.</span></Typography>
          <Typography variant='h6'><span className='small-heading'>Seamless Collaboration: Direct Communication</span></Typography>
          <Typography><span className='small-paragraph-one'>Connect directly with support workers through our messaging service for transparent discussions, term finalization,  building trust before accepting a job.</span></Typography>
      </Box>
    </Box>
    
   <Box className='support-worker-head'>
    <Box className='support-worker-section'>
       <span className='support-worker-heading'>Meet Our Care And Support Workers</span>
    </Box>

    <Box className='workers-card-head'>
    {data.map((worker, index) => (
      <>
      <Box className='card-one' >
          <img src={CardImage} alt='' className='card'/>
      
         <div className='worker-image-top' ><Avatar alt=""  sx={{ width: 96, height: 96 }} src={`http://127.0.0.1:8000/uploads/${worker.picture}`}  /></div> 
        <div  ><span style={{color:'white'}} className='worker-firstname-top'>Name:&nbsp;</span><div className='worker-inner-name'><span >{worker.firstName} {worker.lastName}</span></div></div>
        <div  className='worker-hourlyrate-top'><span style={{color:'white'}}>Hourly rate:&nbsp;{worker.hourlyRate}/hr</span></div>
        <div ><span  className='worker-category-top' style={{color:'white'}}>Category:&nbsp;</span><span className='worker-inner-category'>&nbsp;&nbsp; {worker.category}</span></div>
        <div  className='worker-experience-top'><span style={{color:'white'}}>Experience:&nbsp;{worker.experience} year</span></div>
        <div className='worker-rating'>Rating:&nbsp;<Stars rating={worker.rating}/></div>
      
      </Box>
    
      </>
    ))}
    </Box>
   </Box> 

   <Box className='testimonial-section'>
    <Box className='support-worker-section'>
       <span className='support-worker-heading'>what Our Clients Say About Us</span>
    </Box>
     <SliderComponent/>
   </Box>

    <Box className='footer'>
  
       <Box className='footer-logo'>
          <img src={CareLogo} alt=''/>
       </Box>

       <Box className='footer-text-top'>
       
            <Box className='head-office-head'>
            <Box>
             <span className='head-office'>Head Office</span>
             </Box>
             <Box>
               <span className='pakistan'>Pakistan<br/></span>
               <span className='Lorem'>Lorem ipsum Dorem blodum</span><br/><br/>
             </Box>

             <Box>
               <span className='pakistan'>Canada<br/></span>
               <span className='Lorem'>Lorem Ipsum Dorem blodum</span>
             </Box>

            </Box>

             <Box className=''>
              <span className='head-office'>Sections</span><br/><br/>
              <Box className='home-head'>
                <span>Home</span>
                <span>About</span>
                <span>About Us</span>
                <span>Top Rated</span>
                <span>Testimonials</span>
             </Box>
             </Box>

             <Box className='footer-text-three'><br/>
             <Box className='footer-text-three-child'>
             <span>+92&nbsp;312&nbsp;456&nbsp;789</span>
             <span>+1&nbsp;123&nbsp;456&nbsp;7982</span>
             <span>abcdefg@help.com</span>
             </Box>
             <Box className='social-links'>
              <img src={Whatsapp} className='whatsapp-link' alt=''/>
              <img src={Linkedin} className='whatsapp-link'  alt=''/>
              <img src={Instagram} className='whatsapp-link'  alt=''/>
              <img src={Twitter} className='whatsapp-link'  alt=''/>
              <img src={Facebook} className='whatsapp-link'  alt=''/>
             </Box>
           
             </Box>
       
          </Box>
          
          <Box className='footer-policy-head'>
            <Box>Privacy Policy</Box>
            <Box>©&nbsp;Copyright 2022 abc All rights reserved</Box>
            <Box>Terms & Services</Box>
          </Box>
      

  </Box> 
</Box>
</>
  );
}

export default HomePage;