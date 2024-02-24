import React from 'react';
import { makeStyles } from '@mui/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Fab from '@mui/material/Fab';
import { useDispatch, useSelector } from 'react-redux';
import { messageActions } from '../store/index';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import Button from '@mui/material/Button';
import Cookies from 'js-cookie';
import Pusher from 'pusher-js';
import Badge from '@mui/material/Badge';
import { ListItemButton } from '@mui/material';
import HeaderVerifiedWorker from './HeaderVerifiedWorker';
import Sidebar from "./Sidebar";
import HeaderVerified from "./HeaderVerified";
//import SendIcon from '@mui/material/Send';
// const socket = io('http://localhost:8000');

const pusher = new Pusher('9c1556f9773e416e3dab', {
  cluster: 'mt1',
  encrypted: true,
});

const channel = pusher.subscribe('seeker-channel');


const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: '100%',
    height: '80vh'
  },
  headBG: {
      backgroundColor: '#e0e0e0'
  },
  borderRight500: {
      borderRight: '1px solid #e0e0e0'
  },
  messageArea: {
    height: '70vh',
    overflowY: 'auto'
  }
});

const Chat = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const oldmessages = useSelector((state) => state.chat.oldMessages);
  const [message, setMessage] = useState('');
  const [isSender, setIsSender] = useState(false);
  const tokensaved = Cookies.get('token');
  const user =  sessionStorage.getItem('user');
  const senderId =  useSelector((state) => state.chat.senderId);
  const  allMessages =  useSelector((state) => state.chat.allMessages);
  const   allData =  useSelector((state) => state.chat.allData);
  
  const [messageSaved, setMessageSaved]=useState('');
  const   loggedUserInfo =  useSelector((state) => state.chat.loggedUserInfo);
  const     otherChatsInfo =  useSelector((state) => state.chat.otherChatsInfo);
  const    count =  useSelector((state) => state.chat.count);
  const selectedId = sessionStorage.getItem("invitedWorkerId");
  const selectedInfo = otherChatsInfo.find((info) => info._id === selectedId);
  const selectedIndex = otherChatsInfo.indexOf(selectedInfo);
  const readstatus = sessionStorage.getItem("readstatus");
const loggedUserId = loggedUserInfo._id
  const channeltwo = pusher.subscribe(`seeker-channel-${loggedUserId}`);
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${tokensaved}`,
  };

 let receiverId ;

  if(user === 'support worker'){
    receiverId = sessionStorage.getItem('postedJobSeekerId');
  } else if(user === 'care seeker'){
   receiverId = sessionStorage.getItem('invitedWorkerId');
  }else{
    
  }

  const handleSendMessage = async () => {
      
    if (message.trim() !== '') {
  
      // socket.emit('message');
     await  axios.post('http://127.0.0.1:8000/save-message', {
        content: message,
        receiver: receiverId
      },{headers})
      .then((response) => {
        console.log('Saved successfully', response.data);
        setMessageSaved(response.data.sender);
        console.log(response.data.sender);

      })
      .catch((error) => {
        console.error('Error saving message:', error);
      });

      setMessage('');
    }
  };

  const Obj =  { unRead: false }
 const setReceivedId = async (info)=>{
  console.log('called');
  let currentWorkerId  = info._id
  console.log('info',info);
  if(info.user === 'support worker'){
    sessionStorage.setItem('invitedWorkerId', currentWorkerId);
    receiverId = currentWorkerId;
  
  const res= await axios.patch(`http://127.0.0.1:8000/update-message-status?receiver=${receiverId}`, Obj,{headers});
  console.log(res);
  getMessages();
  } else {
    receiverId =  sessionStorage.setItem('postedJobSeekerId', currentWorkerId);
    receiverId = currentWorkerId;

   const res = await axios.patch(`http://127.0.0.1:8000/update-message-status?receiver=${receiverId}`,  Obj,{headers});
    console.log(res);
   }

    
  console.log(receiverId);

 }


 const getLoggedUser =  async()=>{

  try{
   const response =  await axios.get('http://127.0.0.1:8000/get-logged-user',{headers});

   if(response.data.infoSeekerOne !== undefined){
    dispatch(messageActions.setLoggedUserinfo(response.data.infoSeekerOne));

  }else if (response.data.infoWorkerOne !== undefined) {
    dispatch(messageActions.setLoggedUserinfo(response.data.infoWorkerOne));

  }else{
    return;
  }
  }catch(error){
    console.log(error);
  }

 }
  const getMessages = async () => {
    // Fetch messages from the backend
    if(user === 'support worker'){
      receiverId = sessionStorage.getItem('postedJobSeekerId');
    } else if(user === 'care seeker'){
     receiverId = sessionStorage.getItem('invitedWorkerId');
    }else{
      
    }
    console.log(receiverId);
    await axios.get(`http://127.0.0.1:8000/get-messages?receiver=${receiverId}`,{headers})
      .then((response) => {
        console.log(response.data.count);
        dispatch(messageActions.setSenderId(response.data.sender));
     
    

        if(response.data.dataLoggedSeeker !== undefined){

          dispatch(messageActions.setOtherChatsinfo(response.data.dataOtherChatWorker));
        }else if (response.data.dataLoggedWorker !== undefined) {

          dispatch(messageActions.setOtherChatsinfo(response.data.dataOtherChatSeeker));
        }else{
          return;
        }
        dispatch(messageActions.setMessageCount(response.data.count));
        // Dispatch the received messages to Redux store
        dispatch(messageActions.setMessages(response.data.messagesOne));
      
        console.log(response);
      })
      .catch((error) => {
        console.error('Error fetching messages:', error);
      });
  };

const readStatusHandler = ()=>{
  const readstatus = true;
  sessionStorage.setItem("readstatus", readstatus );
}

  
useEffect(() => {
  getLoggedUser();
    getMessages();
    channel.bind('new-message', (data) => {
      console.log(data);
      console.log('Pusher connected:', pusher.connection.state);
      dispatch(messageActions.setMessages( data ));
    console.log(data);
    if(readstatus && data >0 ){
      setReceivedId();
     }
     
    });
  
    channeltwo.bind('new-count', (data) => {
      console.log(data);
      dispatch(messageActions.setMessageCount(data));
    });
    

   
  return () => {
    // Unbind channel event listener
    channel.unbind('new-message');
    channeltwo.unbind('new-count');

  };
},[]);







    
    // Set up socket event listeners
    // socket.on('message', (data) => {
    //   console.log('Received message:', data);
    //   dispatch(messageActions.addMessage(data));
    // });

    // socket.on('connect', () => {
    //   setIsSender(true); // The current socket is the sender
    // });

    // socket.on('disconnect', () => {
    //   setIsSender(false); // The current socket is not the sender
    // });

  //   return () => {
  //     channel.unbind('new-message');
  //     // socket.off('message');
  //     // socket.off('connect');
  //     // socket.off('disconnect');
  //   };
  // }, []);

  return (
    
      <Box sx={{display:'flex'}}>

   
      <Box sx={{width:'100%'}}>
        <Grid container>
            <Grid item xs={12} >
                <Typography variant="h5" className="header-message">Chat</Typography>
            </Grid>
        </Grid>
        <Grid container component={Paper} className={classes.chatSection}>
            <Grid item xs={3} className={classes.borderRight500}>
                <List>
                    <ListItem button key="RemySharp">
                  
                        <ListItemIcon>
                        <Avatar alt="" src={`http://127.0.0.1:8000/uploads/${loggedUserInfo.picture}`} />
                        </ListItemIcon>
                        <ListItemText >{loggedUserInfo.firstName} {loggedUserInfo.lastName}</ListItemText>
                    </ListItem>
                </List>
                <Divider />
                <Grid item xs={12} style={{padding: '10px'}}>
                    <TextField id="outlined-basic-email" label="Search" variant="outlined" fullWidth />
                </Grid>
                <Divider />


{otherChatsInfo.map((info, index) => (
  <List key={index}>
    <ListItemButton
      button
      onClick={() => {setReceivedId(info, index);readStatusHandler()}}
    >
      <ListItemIcon>
        <Avatar alt="" src={`http://127.0.0.1:8000/uploads/${info.picture}`} />
      </ListItemIcon>
      <ListItemText>{info.firstName} {info.lastName}</ListItemText>
      <Box><Badge color="primary" badgeContent={count}></Badge></Box>
    </ListItemButton>
  </List>
))}

            </Grid>
            <Grid item xs={9}>
                <List className={classes.messageArea}>
                    <Box margin="10px" height="80%" overflowY="auto">
        {oldmessages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent:  msg.sender === senderId ?'flex-end' : 'flex-start',
              margin: '5px',
            }}
          >
            <Box
              sx={{
                background:   msg.sender === senderId? 'lightgreen' : 'lightblue',
                padding: '10px',
                borderRadius: '10px',
              }}
            >
              <span style={{ fontWeight: 'bold' }}>{   msg.sender === senderId ? 'You' : 'Other'}:</span> {msg.content}
            </Box>
          </Box>
        ))}
      </Box>
                  
                </List>
                <Divider />
                <Box display="flex" justifyContent="flex-end" width="80%" height="20%">
        <TextField
          style={{ width: '60%', borderRadius: '10px' }}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          label="Type your message"
        />
        <Button
          style={{ width: '10%', height: '46%', borderRadius: '12px', marginLeft: '10px' }}
          variant="contained"
          onClick={handleSendMessage}
        >
          Send
        </Button>
      </Box>
            </Grid>
        </Grid>
        </Box>
      </Box>
  );
}

export default Chat;