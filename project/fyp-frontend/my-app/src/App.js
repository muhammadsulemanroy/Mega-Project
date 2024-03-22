import React from "react";
import "./App.css";
import FirstPage from "./components/FirstPage";
import Login from "./components/Login";
import SignUpWorker from "./components/SignUpWorker";
import SignUpSeeker from "./components/SignUpSeeker";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import  Chat  from "./components/Chat";
import JobPosting from "./components/JobPosting";
import Header from "./components/Header"
import HeaderVerified from "./components/HeaderVerified";
import HomePage from "./components/HomePage";
import ApplyJobModal from "./components/ApplyJobModal";
import FindWorker from "./components/FindWorker";
import ModelSignUp from "./components/ModelSignUp";
import FirstPageWorker from "./components/FirstPageWorker";
import AvailableJobs from "./components/AvailableJobs";
import ProtectedRoutes from "./components/ProtectedRoutes";
import ViewPostedJobs from "./components/ViewPostedJobs"
import ReceiveInvites from "./components/ReceiveInvites";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path="/signupworker" element={<SignUpWorker/>} />
        <Route path="/signupseeker" element={<SignUpSeeker/>} />
        <Route path="/login" element={<Login/>} />
        <Route path='/' element={<HomePage/>}/>

        <Route element={<ProtectedRoutes />}>
          <Route path='/headerverified' element={<HeaderVerified/>}/>
          <Route path='/header' element={<Header/>}/>
          <Route path='/firstpage' element={<FirstPage/>}/>
          <Route path='/firstpageworker' element={<FirstPageWorker/>}/>
          <Route path='/chat' element={<Chat/>}/>
          <Route path='/jobposting' element={<JobPosting/>}/>
          <Route path='/receiveinvites' element={<ReceiveInvites/>}/>
          <Route path='/applyjobmodal' element={<ApplyJobModal/>}/>
          <Route path='/findworker' element={<FindWorker/>}/>
          <Route path='/availablejobs' element={<AvailableJobs/>}/>
          <Route path='/viewPostedJobs' element={<ViewPostedJobs/>}/>
        </Route>
        </Routes>
      </Router>
    
   
    </div>
  );
}

export default App;
