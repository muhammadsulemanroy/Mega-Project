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
import Dialog from "./Model";
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
import JobPostingNew from './JobPostingNew';
import applyJobActions from "../store/index"
import Sidebar from "./Sidebar";


import { styled, useTheme } from '@mui/material/styles';

import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';

import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';







const JobPosting = () => {
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
const openpostjobModal = useSelector((state) => state.postingJob.applyjobModel);
const theme = useTheme();
  const jobApplications = useSelector(
    (state) => state.viewPostedJobs.jobApplications
  );
  const show = useSelector((state) => state.viewPostedJobs.show);
  const showSendInvite = useSelector(
    (state) => state.viewPostedJobs.showInviteModal
  );
  const message = useSelector(
    (state) => state.viewPostedJobs.InviteModalMessage
  );
  const pusher = new Pusher('9c1556f9773e416e3dab', {
    cluster: 'mt1',
    encrypted: true,
  });
  
  const channel = pusher.subscribe('seeker-channel');


  const seekerIdHandler = (jobs)=>{
    const seekerId = jobs.seekerId;
    sessionStorage.setItem('postedJobSeekerId', seekerId);
  }



  const handleJobs = async () => {
    console.log(jobs.length);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokensaved}`,
    };
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/v1/seekers/viewPostedJobs",
        { headers }
      );
      dispatch(viewPostedJobsActions.setViewPostedJobs(res.data.jobs));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleJobs();
    channel.bind('new-job', (data) => {
      handleJobs();
    });


    return () => {
      channel.unbind('new-job');
    };
  }, []);
  


  const JobIdHandler = async (JobId, jobs) => {
    dispatch(viewPostedJobsActions.setInviteModalConfirmationJob(jobs));
    dispatch(viewPostedJobsActions.setViewPostedJobId(JobId));
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokensaved}`,
    };
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/v1/workers/getAllJobApplicant",
        {
          params: { JobId },
          headers: headers,
        }
      );
      dispatch(
        viewPostedJobsActions.setViewPostedJobsApplications(res.data.jobs)
      );
      dispatch(viewPostedJobsActions.setInvitesStatus(res.data.invites));
      dispatch(viewPostedJobsActions.setShowApplicants(true));

      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
  
    channel.bind('new-apply-job', (data) => {
      JobIdHandler();
    });

    return () => {
      channel.unbind('new-apply-job');
    };
  }, []);
  
  const sendInviteHandler = (applicants) => {
    const currentWorkerId = applicants.workerId;

    // Dispatch actions as needed
    dispatch(viewPostedJobsActions.setInviteModal(true));
    dispatch(
      viewPostedJobsActions.setInviteModalMessage(
        `Are You Sure You Want to Send Invite For Job ${applicants.jobId}`
      )
    );
    dispatch(viewPostedJobsActions.setInviteWorker(currentWorkerId));
    dispatch(viewPostedJobsActions.setInviteModalConfirmation(true));
    dispatch(
      viewPostedJobsActions.setInviteModalConfirmationJobId(applicants.jobId)
    );

    console.log(currentWorkerId);
  };

  const cancelInviteHandler = async()=>{
    dispatch((viewPostedJobsActions.setInviteShowCloseButton(true)));
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokensaved}`,
    };
    try {
      const res = await axios.delete('http://127.0.0.1:8000/api/v1/seekers/sendInvite',{
        params: { jobId },
        headers: headers,
      });
      console.log(res); 
   
    
    } catch (err) {
      handleSnackbarError()
 
      console.log(err);
    }
  }
  const handleCloseModelHandler = () => {
    dispatch(viewPostedJobsActions.setInviteModal(false));
  };

  const handleInvites = async () => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokensaved}`,
    };
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/v1/seekers/getAllInvitesStatus",
        { headers }
      );
      dispatch(viewPostedJobsActions.setInvitesStatus(res.data.invites));
      console.log(res.data.invites);
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    handleInvites();
    sessionStorage.removeItem("readstatus" );
  }, []);

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
 

  const sendMessageHandler = (applicants) => {
    const currentWorkerId = applicants.workerId;
    const readstatus = true;
    sessionStorage.setItem("readstatus", readstatus );
    console.log(currentWorkerId);
    sessionStorage.setItem("invitedWorkerId", currentWorkerId);
    console.log(applicants);
    navigate("/chat");
  };

  const openEditJobModal =(id)=>{
    dispatch(viewPostedJobsActions.setOpenJobEditModal(true));
    dispatch(viewPostedJobsActions.setEditJobId(id));
  }


  const openDeleteJobModal =(id)=>{
    dispatch(viewPostedJobsActions.setOpenJobDeleteModal(true));
    dispatch(viewPostedJobsActions.setDeleteJobId(id));
  }
  
  
const postJobModel = ()=>{
  dispatch(postingJobActions.openApplyJobModel(true));
  
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
      width: 30,
      label: 'Time Of Service',
      dataKey: 'timeOfService',
      numeric: true,
    },
    {
      width: 30,
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
      width: 80,
      label: '',
      dataKey: 'seeapplicants',
      numeric: true,
    },
    {
      width: 50,
      label: '',
      dataKey: 'editjob',
      numeric: true,
    },
    {
      width: 70,
      label: '',
      dataKey: 'deletejob',
      numeric: true,
    },
  ];
  
  const columnsTwo = [
    {
      width: 20,
      label: 'Picture',
      dataKey: 'picture',
    },
    {
      width: 40,
      label: 'Name',
      dataKey: 'name',
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
      label: 'Hourly Rate',
      dataKey: 'hourlyRate',
      numeric: true,
    },
    {
      width: 30,
      label: 'Mobile No',
      dataKey: 'mobileNo',
      numeric: true,
    },
    {
      width: 30,
      label: 'Status',
      dataKey: 'sent-invite-status',
      numeric: true,
    },
   
    {
      width: 60,
      label: '',
      dataKey: 'sent-invite-button',
      numeric: true,
    },
    {
      width: 70,
      label: '',
      dataKey: 'sent-message-button',
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
  

  const VirtuosoTableComponentsTwo = {
    Scroller: React.forwardRef((props, ref) => (
      <TableContainer component={Paper} {...props} ref={ref}  sx={{borderRadius:'15px',boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)'}} />
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
            sx={{    backgroundColor: "#FBFCFE", color:'#9B5E68'}}
          >
            {row[column.dataKey]}
          </TableCell>
        ))}
      </React.Fragment>
    );
  }
 
  function rowContentTwo(_indexTwo, rowsTwo) {
    return (
      <React.Fragment>
        {columnsTwo.map((column) => (
          <TableCell
            key={column.dataKey}
            align={column.numeric || false ? 'right' : 'left'}
            sx={{    backgroundColor: "#FBFCFE", color:'#9B5E68'}}
          >
            {rowsTwo[column.dataKey]}
          </TableCell>
        ))}
      </React.Fragment>
    );
  }
 




  const rows = React.useMemo(() => (
    jobs.map((job, index) => ({
        hourlyBudget: job.hourlyBudget,
        address: job.address,
        timeOfService: job.timeOfService,
        requiredService: job.requiredService,
        detail: job.detail,
        
            
                seeapplicants:<Button onClick={() => JobIdHandler(job._id, job)} >See Applicants</Button>,
                editjob:<Button onClick={() => openEditJobModal(job._id)} variant="contained" sx={{width:'7.5rem'}}>Edit Job</Button>,
                deletejob:<Button onClick={() => openDeleteJobModal(job._id)} variant="contained">Delete Job</Button>,
            
       
    }))
), [jobs]);
const rowsTwo = React.useMemo(() => (
  show === false ? (
      []
  ) : (
      jobApplications.map((applicant, index) => {
          const inviteStatus = sentinvites && sentinvites.workerId !== null && sentinvites.workerId !== undefined
              ? applicant.workerId === sentinvites.workerId
                  ? sentinvites.status === 'approved'
                      ? sentinvites.status
                      : sentinvites.status === 'pending'
                          ? sentinvites.status
                          : 'Invite Not Sent'
                  : 'Invite Not Sent'
              : 'Invite Not Sent';

          const inviteButton = sentinvites && sentinvites.workerId !== null && sentinvites.workerId !== undefined
              ? applicant.workerId === sentinvites.workerId
              ? sentinvites.status === 'approved'
              ? ''
              : sentinvites.status === 'pending'
                  ? <Button key={index} variant="contained" onClick={() => cancelInviteHandler()}>Cancel Invite</Button>
                  : <Button key={index} variant="contained" onClick={() => sendInviteHandler(applicant)}>Send Invite</Button>
          :<Button key={index} variant="contained" onClick={() => sendInviteHandler(applicant)}>Send Invite</Button>
      :<Button key={index} variant="contained" onClick={() => sendInviteHandler(applicant)}>Send Invite</Button>;





          return {
              key: index,
              picture: <Avatar alt="" src={`http://127.0.0.1:8000/uploads/${applicant.picture}`} className="applicant-image" />,
              name: applicant.name,
              category: applicant.category,
              experience: applicant.experience,
              hourlyRate: applicant.hourlyRate,
              mobileNo: applicant.mobileNo,
              'sent-invite-status': inviteStatus,
              'sent-invite-button': inviteButton,
              'sent-message-button': <Button key={index} variant="contained" onClick={(e) => sendMessageHandler(applicant)}>Send Message</Button>,
          };
      })
  )
), [show, jobApplications, sentinvites]);






  return (
    <>
          <JobPostingNew/>
      <Dialog open={isSuccess} onClose={handleCloseModel} message={result} />
      <EditJob open={ openjobeditModal}/>
      <DeleteJob open={ openjobdeleteModal}/>
      <ModalSendInvite
        open={showSendInvite}
        onClose={handleCloseModelHandler}
        message={message}
      />
<Box sx={{display:'flex'}}>
<HeaderVerified />
   <Sidebar/>


   <Box  sx={{display:'flex', flexDirection:'column', width:'100%', alignItems:'center', minHeight:'90rem', justifyContent:'space-around'}}>
      <Box sx={{display:'flex',flexDirection:'column', gap:'2rem'}}>
      

           
        <Typography variant='h1' style={{fontFamily:'sans-serif', fontWeight:'700', fontSize:'2.875rem'}}>Job Posted</Typography>

          <Paper style={{ height: 400, width: 1200 }}>
      <TableVirtuoso
        data={rows}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
      />
    </Paper>
 



        
      </Box>

      <Box className="container-jobposting" sx={{width:'85%', display:'flex', justifyContent:'flex-end'}}>
      <Box sx={{display:'flex', flexDirection:'column', gap:'2rem'}}>
      <Typography variant='h1' style={{fontFamily:'sans-serif', fontWeight:'700', fontSize:'2.875rem'}}>Post Your job</Typography>
        <Button variant="contained" onClick={postJobModel} sx={{width:'7rem'}}>post job</Button>
        </Box>
      </Box>
          

      <Box sx={{display:'flex',flexDirection:'column', gap:'2rem'}}>
      <Typography variant='h1' style={{fontFamily:'sans-serif', fontWeight:'700', fontSize:'2.875rem'}}>Applicants</Typography>

          <Paper style={{ height: 400, width: 1200 }}>
      <TableVirtuoso
        data={rowsTwo}
        components={VirtuosoTableComponentsTwo}
        fixedHeaderContent={fixedHeaderContentTwo}
        itemContent={rowContentTwo}
      />
    </Paper>
        </Box>
        </Box>
 
        </Box>
    </>
  );
};
export default JobPosting;
