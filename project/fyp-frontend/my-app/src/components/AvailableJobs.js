import { useDispatch, useSelector } from 'react-redux';
import { availableJobsActions } from '../store/index';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import HeaderVerifiedWorker from './HeaderVerifiedWorker';
import Pusher from 'pusher-js';
import { receiveInvitesActions } from '../store/index';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import Sidebar from './Sidebar';
import SidebarWorker from './SidebarWorker';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';
import Avatar from '@mui/material/Avatar';
import React from "react";
import { useNavigate } from "react-router-dom";
import ApplyJobModal from './ApplyJobModal';
import { applyJobActions } from '../store/index';
import Dialog from './Model';
const pusher = new Pusher('9c1556f9773e416e3dab', {
  cluster: 'mt1',
  encrypted: true,
});

const channel = pusher.subscribe('seeker-channel');

const AvailableJobs = () => {
  const dispatch = useDispatch();
  
  const result = useSelector(state => state.applyjob.applyJobResult);
  const isSuccess = useSelector(state => state.applyjob.isSuccessModel);
  const Jobs = useSelector((state) => state.availableJobs.jobs);
  const tokensaved = Cookies.get('token');
  const receivedinvites = useSelector((state) => state.receiveJobInvite.invites);
const rejectedInvite = useSelector((state) => state.receiveJobInvite.rejectInvites);
const openApplyJobModel = useSelector((state) => state.applyjob.applyjobModel);
const navigate = useNavigate();
const jobId = sessionStorage.getItem('jobIdApplication');
  const seekerIdHandler = (jobs)=>{
    const seekerId = jobs.seekerId;
    sessionStorage.setItem('postedJobSeekerId', seekerId);
    navigate('/chat')
  }
  const handleJobs = async () => {
  console.log(Jobs);
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokensaved}`,
      };
    try{
     const res = await axios.get('http://127.0.0.1:8000/api/v1/seekers/postjob',{headers});
     dispatch((availableJobsActions.setAvailableJobs(res.data.jobs)));
    }catch(err){
    console.log(err);
    }
  };
  useEffect(()=>{
    handleJobs(); 
    channel.bind('new-job', (data)=>{
      handleJobs(); 
    });
    return () => {
      channel.unbind('new-job');
    };   
  },[])


  const JobIdHandler = (JobId)=>{
    dispatch((applyJobActions.setApplyJobsData(JobId)));
    const currentJobId = JobId;
     sessionStorage.setItem('jobIdApplication',currentJobId);
     
     dispatch((applyJobActions.openApplyJobModel(true)));
  }


 

  const handleInvites = async () => {
console.log('called');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokensaved}`,
      };
    try{
     const res = await axios.get('http://127.0.0.1:8000/api/v1/workers/getAllJobInvites',{headers});
     dispatch((receiveInvitesActions.setReceivedInvites(res.data.invites)));

     console.log(res.data);
    }catch(err){
    console.log(err.message);
    }
  };
  const handleCloseModel=()=>{
    dispatch(applyJobActions.postJobSuccessModel(false));
  }

  useEffect(()=>{
    handleInvites(); 
    channel.bind('new-invite', (data)=>{
      handleInvites(); 
    });
    return () => {
      channel.unbind('new-invite');
    };   
  },[])
  const rejectInviteHandler = async ()=>{
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokensaved}`,
    };
  
  try{
   const res = await axios.patch('http://127.0.0.1:8000/api/v1/workers/getAllJobInvites', {
  data:{status:'rejected' } ,
  },{headers});
  
   console.log(res.data.status);
  }catch(err){
  console.log(err.message);
  }
  }
 const updateStatusHandler =async()=>{
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${tokensaved}`,
  };

try{
 const res = await axios.patch('http://127.0.0.1:8000/api/v1/workers/getAllJobInvites', {
data:{status:'approved' } ,
},{headers});
handleInvites();  
 console.log(res.data.status);
}catch(err){
console.log(err.message);
}
 }



 const columns = [
  {
    width: 30,
    label: 'Hourly Rate',
    dataKey: 'hourlyBudget',
  },
  {
    width: 30,
    label: 'Address',
    dataKey: 'address',
    numeric: true,
  },
  {
    width: 40,
    label: 'Time Of Service',
    dataKey: 'timeOfService',
    numeric: true,
  },
  {
    width: 45,
    label: 'Required Service',
    dataKey: 'requiredService',
    numeric: true,
  },
  {
    width: 30,
    label: 'Detail',
    dataKey: 'detail',
    numeric: true,
  },
  {
    width: 30,
    label: 'Status',
    dataKey: 'status',
    numeric: true,
  },
  {
    width: 30,
    label: '',
    dataKey: 'approve-button',
    numeric: true,
  },
  {
    width: 30,
    label: '',
    dataKey: 'reject-button',
    numeric: true,
  },
];


const columnsTwo = [
  {
    width: 20,
    label: 'Hourly Rate',
    dataKey: 'hourlyBudget',
  },
  {
    width: 20,
    label: 'Address',
    dataKey: 'address',
    numeric: true,
  },
  {
    width: 35,
    label: 'Time Of Service',
    dataKey: 'timeOfService',
    numeric: true,
  },
  {
    width: 35,
    label: 'Required Service',
    dataKey: 'requiredService',
    numeric: true,
  },
  {
    width: 20,
    label: 'Detail',
    dataKey: 'detail',
    numeric: true,
  },

  {
    width: 60,
    label: '',
    dataKey: 'applyjob-button',
    numeric: true,
  },
  {
    width: 50,
    label: '',
    dataKey: 'chat-button',
    numeric: true,
  },
];

const VirtuosoTableComponents = {
  Scroller: React.forwardRef((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} sx={{borderRadius:'15px',boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)'}}/>
  )),
  Table: (props) => (
    <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed', }} />
  ),
  TableHead,
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

const VirtuosoTableComponentsTwo = {
  Scroller: React.forwardRef((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} sx={{borderRadius:'15px',boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)'}} />
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

function fixedHeaderContentTwo() {
  return (
    <TableRow>
      {columnsTwo.map((column) => (
        <TableCell
          key={column.dataKey}
          variant="head"
          align={column.numeric || false ? 'right' : 'left'}
          style={{ width: column.width }}
          sx={{
            backgroundColor: "#F0F4F8",
            color:'#69383E'
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
          sx={{    backgroundColor: "#FBFCFE", color:'#9B5E68'}}
        >
          {row[column.dataKey]}
        </TableCell>
      ))}
    </React.Fragment>
  );
}

function rowContentTwo(_index, row) {
  return (
    <React.Fragment>
      {columnsTwo.map((column) => (
        <TableCell
          key={column.dataKey}
          align={column.numeric || false ? 'right' : 'left'}
          sx={{    backgroundColor: "#FBFCFE", color:'#9B5E68'}}
        >
          {row[column.dataKey]}
        </TableCell>
      ))}
    </React.Fragment>
  );
}


const rows = React.useMemo(() => (
  receivedinvites.map((invites,index)=>{


    if(invites.status === 'pending') {
    
      return{
     
    
        hourlyBudget:invites.hourlyBudget,
        address:invites.address,
        timeOfService:invites.timeOfService,
        requiredService:invites.requiredService,
        detail:invites.detail,
        status:invites.status,
        'approve-button': <Button variant='contained' onClick={updateStatusHandler}>Approve</Button>,
        'reject-button':<Button variant='contained' onClick={ rejectInviteHandler }>Reject</Button>,
   

      };
  
    }else if(invites.status === 'approved') {
      return{
  
        hourlyBudget:invites.hourlyBudget,
        address:invites.address,
        timeOfService:invites.timeOfService,
        requiredService:invites.requiredService,
        detail:invites.detail,
        status:invites.status,
  
  
  
  }
  ;
    }else 
    return '';
  
  
  
    
  })
  
), [receivedinvites]);

const rowsTwo = React.useMemo(() => (
  Jobs.map((jobs, index) => ({
    hourlyBudget: jobs.hourlyBudget,
    address: jobs.address,
    timeOfService: jobs.timeOfService,
    requiredService: jobs.requiredService,
    detail: jobs.detail,
    'applyjob-button': <Button variant='contained'  onClick={() => JobIdHandler(jobs._id)}> Apply For Job</Button>,
    'chat-button': <Button variant='contained' sx={{width:'8rem'}} onClick={() => seekerIdHandler(jobs)}>Message</Button>
  }))
), [Jobs]);


  return (
    <>  
    <Dialog open= {isSuccess} onClose= {handleCloseModel} message={result}/>
    
    <Box sx={{display:'flex'}}>
    <HeaderVerifiedWorker/>
   <SidebarWorker/>
   <Box sx={{display:'flex', flexDirection:'column', width:'100%', alignItems:'center', minHeight:'90rem', justifyContent:'space-around'}}>

   <Box  sx={{display:'flex', flexDirection:'column',gap:'2rem'}}>
<ApplyJobModal open={openApplyJobModel} jobId={jobId}/>
<Typography variant='h1' style={{fontFamily:'sans-serif', fontWeight:'700', fontSize:'2.875rem'}}>Vacancies</Typography>

<Paper style={{ height: 400, width: 1000 }}>
      <TableVirtuoso
        data={rowsTwo}
        components={VirtuosoTableComponentsTwo}
        fixedHeaderContent={fixedHeaderContentTwo}
        itemContent={rowContentTwo}
      />
    </Paper>
   </Box>




 
    <Box sx={{display:'flex', flexDirection:'column',gap:'2rem'}}>

    {receivedinvites.length === 0 || receivedinvites.some(invite => invite.status === 'rejected') ? (
      <Typography variant='h1' style={{fontFamily:'sans-serif', fontWeight:'700', fontSize:'2.875rem'}}>No Invites</Typography>

) : (
  <Typography variant='h1' style={{fontFamily:'sans-serif', fontWeight:'700', fontSize:'2.875rem'}}>Received Invites</Typography>

)}
   <Box >
   
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
   </Box>
   </>
  );
};

export default AvailableJobs;
