import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {filterWorkerActions} from '../store/index';
import axios from 'axios';
import Stars from './Stars';
import CardImage from '../Assets/card.png';
import Cookies from 'js-cookie';
import DialogThree from './ModalSendInviteFilter';
import HeaderVerified from './HeaderVerified';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';
import Avatar from '@mui/material/Avatar';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Sidebar from './Sidebar';
import { width } from '@mui/system';




  

const FindWorker = () => {
  const dispatch = useDispatch();
  const minhourlyRate = useSelector(state=>state.filterWorker.minhourlyRate);
  const maxhourlyRate = useSelector(state=>state.filterWorker.maxhourlyRate);
  const category = useSelector(state=>state.filterWorker.category);
  const minExperience = useSelector(state=>state.filterWorker.minExperience);
  const maxExperience = useSelector(state=>state.filterWorker.maxExperience);
  const results = useSelector(state=>state.filterWorker.results);
  const selectedOption = useSelector(state=>state.filterWorker.selectedOption);
  const imagePath = useSelector(state=>state.filterWorker.imagePath);
  const show = useSelector(state => state.viewPostedJobs.show);
  const showSendInvite = useSelector(state => state.filterWorker.showInviteModal);
  const message = useSelector(state => state.filterWorker.InviteModalMessage);
  const tokensaved = Cookies.get('token');
  const [age, setAge] = React.useState('');


  const handleChangeSelect = (event) => {
    setAge(event.target.value);
  };
  const handleChange = (event) => {
    dispatch(filterWorkerActions.setSelectedOption(event.target.value));
  };
  const handleMinhourlyRate = (event) => {
    dispatch(filterWorkerActions.setMinHourlyRate(event.target.value));
  };
  const handleMaxhourlyRate = (event) => {
    dispatch(filterWorkerActions.setMaxHourlyRate(event.target.value));
  };
  const handleCategory = (event) => {
    dispatch(filterWorkerActions.setCategory(event.target.value));
  };
  const handleMinExperience = (event) => {
    dispatch(filterWorkerActions.setMinExperience(event.target.value));
  };
  const handleMaxExperience = (event) => {
    dispatch(filterWorkerActions.setMaxExperience(event.target.value));
  };
  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokensaved}`,
    };
    try {
        console.log({
            minhourlyRate,
            maxhourlyRate,
            category,
            minExperience,
            maxExperience,
          });
      const response = await axios.get('http://127.0.0.1:8000/api/v1/workers/filter', {
        params: {
          minhourlyRate,
          maxhourlyRate,
          category,
          minExperience,
          maxExperience,
        },
        headers:headers
      }
      );
        console.log(response.data);
      dispatch(filterWorkerActions.setResult(response.data));
    } catch (error) {
      console.error('Error filtering workers:', error);
    }
  };
  const sendInviteHandler =(worker)=>{
    dispatch((filterWorkerActions.setInviteModal(true)));
    dispatch((filterWorkerActions.setInviteModalMessage('For Which Job You Want to Send Invite')));
    dispatch((filterWorkerActions.setInviteWorker(worker._id)));
  
    }
    const handleCloseModelHandler =()=>{
      dispatch((filterWorkerActions.setInviteModal(false)))
      }
  
      const columns = [
        {
          width: 30,
          label: 'picture',
          dataKey: 'picture',
        },
        {
          width: 30,
          label: 'Name',
          dataKey: 'name',
          numeric: true,
        },
        {
          width: 30,
          label: 'Hourly Rate',
          dataKey: 'hourlyrate',
          numeric: true,
        },
        {
          width: 30,
          label: 'Category',
          dataKey: 'category',
          numeric: true,
        },
        {
          width: 30,
          label: 'Experience',
          dataKey: 'experience',
          numeric: true,
        },
        {
          width: 30,
          label: 'Rating',
          dataKey: 'rating',
          numeric: true,
        },
        {
          width: 40,
          label: '',
          dataKey: 'worker-Invite-button',
          numeric: true,
        },
      
      ];
      

      const VirtuosoTableComponents = {
        Scroller: React.forwardRef((props, ref) => (
          <TableContainer component={Paper} {...props} ref={ref} sx={{borderRadius:'15px',boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)'}}/>
        )),
        Table: (props) => (
          <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
        ),
        TableHead,
        TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
        TableBody: React.forwardRef((props, ref) => (
          <TableBody {...props} ref={ref} />
        )),
      };


      
  function fixedHeaderContent() {
    return (
      <TableRow>
        {columns.map((column) => (
          <TableCell
            key={column.dataKey}
            variant="head"
            align={column.numeric || false ? 'right' : 'left'}
            style={{ width: column.width }}
            sx={{
              color:'#69383E',
            backgroundColor: "#F0F4F8",
            }}
          >
            {column.label}
          </TableCell>
        ))}
      </TableRow>
    );
  }
  

  function rowContent(_index, row) {
    return (
      <React.Fragment>
        {columns.map((column) => (
          <TableCell
            key={column.dataKey}
            align={column.numeric || false ? 'right' : 'left'}
          >
            {row[column.dataKey]}
          </TableCell>
        ))}
      </React.Fragment>
    );
  }


  const rows = React.useMemo(() => (
    results.map((worker,index) => ({
    
  

  picture:<Avatar alt='' src={`http://127.0.0.1:8000/uploads/${worker.picture}`} className='worker-image'/>,
name:worker.firstName,
hourlyrate:worker.hourlyRate,
category:worker.category,
experience:worker.experience,
rating:<Stars rating={worker.rating}/>,
'worker-Invite-button':<Button variant='contained' onClick={()=>sendInviteHandler(worker)}>send Invite</Button>,

  
      }
    ))
), [ results]);
  return (
    <>
    <DialogThree open={showSendInvite} onClose= {handleCloseModelHandler} message={message} />
    <Box sx={{display:'flex'}}>
     <HeaderVerified/> 
      <Sidebar/>


     
      <Box style={{display:'flex', flexDirection:'column', gap:'2rem', alignItems:'center',width:'100%'}}>
        
     <Typography variant='h1' style={{fontFamily:'sans-serif', fontWeight:'700', fontSize:'2.875rem'}}>Find Worker</Typography>
 

 <form onSubmit={handleFilterSubmit} style={{display:'flex', minHeight:'10rem', width:'70rem', justifyContent:'space-around'}}>
 
      
     <Box sx={{width:'30rem'}}>
 {selectedOption === 'byprice' && (
           
 <Box  style={{minHeight:'9rem',display:'flex' ,width:'40rem',alignItems: 'flex-end'}}>
          
           <>
           <Box>
             <label className='category-label'>
              <span>Min Hourly Rate:</span> 
               <TextField type="number"   required   label="Min Hourly Rate" value={minhourlyRate} onChange={handleMinhourlyRate} style={{width:'90%'}}/>
             </label>
           </Box>
          
   
           <Box>
             <label className='category-label'>
               <span>Max Hourly Rate:</span>
               <TextField type="number"  required label="Max Hourly Rate" value={maxhourlyRate} onChange={handleMaxhourlyRate} style={{width:'90%'}} />
             </label>
           </Box>
           </>
      
           </Box>
           ) }


           {selectedOption === 'bycategory' && (
           <Box  style={{minHeight:'9rem',display:'flex' ,width:'40rem',alignItems: 'flex-end'}}>
        
      
             <label className='category-label'>
               <span>Category:</span>
               <TextField type="text"  required   value={category} onChange={handleCategory} />
             </label>
        
    
           </Box>

           )}


           {selectedOption === 'byexperience' && (
           <Box style={{minHeight:'9rem', display:'flex', width:'40rem', alignItems: 'flex-end'}}>
 
        <>
            <Box>
                <label className='category-label'>
                    <span>Min Experience:</span>
                    <TextField type="number" required value={minExperience} onChange={handleMinExperience}  style={{width:'90%'}}/>
                </label>
            </Box>
            <Box>
                <label className='category-label'>
                    <span>Max Experience:</span> 
                    <TextField type="number" required value={maxExperience} onChange={handleMaxExperience} style={{width:'90%'}}/>
                </label>
            </Box>
        </>

</Box>

)}

</Box>


           <Box  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' ,width:'20rem',maxHeight:'8.5rem'}}>
         <Button type="submit" variant="contained" color="primary" style={{minHeight:'2.5rem', width:'9rem'}}>
             Search
           </Button>
        

        
  <FormControl fullWidth size="small" >
    <InputLabel sx={{textAlign:'start'}}>Filter</InputLabel>
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={selectedOption}
      label="Filter"
      onChange={handleChange}
      style={{ minWidth: 120, height:'2.5rem' }}
    >
      <MenuItem value="byprice">By Price</MenuItem>
      <MenuItem value="bycategory">By category</MenuItem>
      <MenuItem value="byexperience" >By Experience</MenuItem>
    </Select>
  </FormControl>



       </Box>
         </form>


        <Box style={{display:'flex', flexDirection:'column' , minHeight:'160rem',gap:'2rem'}}>

       





        <Paper style={{ height: 400, width: 1000 }}>
      <TableVirtuoso
        data={rows}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
      />
    </Paper>
        </Box>
      </Box>
    </Box>
    </>
  );
};

export default FindWorker;
