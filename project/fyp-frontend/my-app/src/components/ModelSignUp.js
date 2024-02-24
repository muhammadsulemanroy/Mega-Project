import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import SignUpSeeker from './SignUpSeeker';
import SignUpWorker from './SignUpWorker';
import { Link } from 'react-router-dom';
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
  button: {
    margin: '0.5rem',
    width:'18rem',
  },
};

const ModalSignUp = ({ open, onClose,  }) => {
  return (
    <TransparentDialog open={open} onClose={onClose} fullScreen>
      <div style={styles.container}>
        <DialogTitle style={styles.title}>Choose Your Account Type</DialogTitle>
        <DialogContent style={styles.content}>
        <Link to='/signupseeker'>
          <Button style={styles.button}  color="primary" variant="contained">
            Signup As Care Seeker
          </Button>
          </Link>
          <Link to='/signupworker'>
          <Button style={styles.button}  color="primary" variant="contained">
          Signup As Support Worker
          </Button>
          </Link>
          <Button style={styles.button} onClick={onClose}  color="primary" variant="contained">
            Close
          </Button>
        </DialogContent>
      </div>
    </TransparentDialog>
  );
};

export default ModalSignUp;
