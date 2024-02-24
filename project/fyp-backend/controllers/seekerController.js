const jwt = require("jsonwebtoken");
const Seeker = require("../models/seekerModel");
const Job = require("../models/postJobModel");
const  sendJobInvite = require("../models/sendInviteModel");
const Pusher = require('pusher');
const pusher = new Pusher({
  appId: "1747942",
  key: "9c1556f9773e416e3dab",
  secret: "15a9f296336c6fd500b1",
  cluster: "mt1",
  useTLS: true
});

exports.getAllSeekers = async (req, res, next) => {
  try {
    const careseeker = await Seeker.find();
    res.status(200).json({
      status: "success",
      data: {
        careseeker,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
  next();
};

exports.getSeeker = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const seekerId = decoded.id;
    const seeker = await Seeker.findById(seekerId);

    res.status(200).json({
      status: "sucess",
      data: {
        seeker : seeker ,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      error: error.message,
    });
  }
  next();
};
exports.postJob = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const seekerId = decoded.id;

    const jobData = {
      ...req.body,
      seekerId:seekerId,
    };
    console.log(jobData);
   await Job.create(jobData);
   pusher.trigger('seeker-channel', 'new-job', {
    message: 'New job posted!',
  });
    console.log(req.body);
    res.status(200).json({
      result: "sucess",
      message: "job Posted",
    
    });
  } catch (error) {
    res.status(400).json({
      status: "failed", 
      error: error.message,
    });
  }
};

exports.editJob = async (req, res) => {
  try {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const seekerId = decoded.id;
  const { requiredService,detail,address,hourlyBudget,timeOfService,editjobId } = req.body;

   console.log('editjobId',editjobId);
   const jobData = {
    seekerId,
    requiredService,
    detail,
    address
    ,hourlyBudget
    ,timeOfService
   }
   const workerinvited =  await sendJobInvite.findOne({jobId:editjobId});
   console.log('workerinvited',workerinvited);
  const workerId =  workerinvited.workerId;
  console.log('workerId',workerId);
  const updatedJobInvite = {
    ...jobData,
 
  }
  console.log('updatedJobInvite',updatedJobInvite);
  if(workerinvited) {
    await  sendJobInvite.findOneAndUpdate({jobId:editjobId },jobData , {
    new: true,
    runValidators: true,
  });
   }

    await Job.findOneAndUpdate({_id:editjobId },jobData , {
      new: true,
      runValidators: true,
    });

  
    console.log(req.body);
    res.status(200).json({
      result: "sucess",
      message: "job Edited Succesfully",
      
    });
  } catch (error) {
    res.status(400).json({
      status: "failed", 
      error: error.message,
    });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const jobId = req.query.editdeleteId; 
    console.log(jobId);
    const deletejob = await Job.findOneAndDelete({_id:jobId});
   const JobInvite = await sendJobInvite.findOneAndDelete({jobId});
    res.status(200).json({
      result: "success",
      message: "Job deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      result: "failed",
      error: error.message,
    });
  }
};

exports.getAllPostedJobs = async(req,res)=>{
  try{
    const getJob = await Job.find();
    res.status(200).json({
      status:'success',
     jobs:getJob
    })
  }catch(error){
    res.status(400).json({
      status:'failed',
      message:error.message
    })
  }

}
exports.getPostedJobs = async(req,res)=>{
  try{
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const seekerId = decoded.id;
    const getJob = await Job.find({seekerId});
  res.status(200).json({
    status:'success',
    jobs:getJob,
  })
  }catch(error){
   res.status(400).json({
    status:'failed',
    message:error.message
   })
  }
}

exports.sendInvite = async (req, res) => {
  try {
   
    const jobData = {
      ...req.body,
    };
    console.log('jobData',jobData);

    const invitedJob =  jobData.jobId
    console.log('invitedJob',invitedJob);
    const alreadyInvited = await sendJobInvite.findOne({jobId:invitedJob});
    console.log('alreadyInvited',alreadyInvited);
    if(alreadyInvited  && (alreadyInvited.status === 'approved' || alreadyInvited.status === 'pending')) {
      pusher.trigger('seeker-channel', 'new-job', {
        message: 'New job posted!',
      });
      return res.status(400).json({
       
        message: "Invite Already Sent For This Job",
       
      });
    }else if (alreadyInvited && alreadyInvited.status === 'rejected'){
      const updatedStatus = {
        status:'pending'
      }
      await  sendJobInvite.findOneAndUpdate({jobId:invitedJob},updatedStatus , {
        new: true,
        runValidators: true,
      });

      pusher.trigger('seeker-channel', 'new-job', {
        message: 'New job posted!',
      });
      res.status(200).json({
        result: "sucess",
        message: "Invite Sent",
     
      });
    }else{
      const jobpost = await  sendJobInvite.create(jobData);
      pusher.trigger('seeker-channel', 'new-invite', {
        message: 'New job posted!',
      });
      console.log(req.body);
      res.status(200).json({
        result: "sucess",
        message: "Invite Sent",
        data:{
          jobpost
        }
      });
    }


  } catch (error) {
    res.status(400).json({
      status: "failed", 
      error: error.message,
    });
  }
};


exports.cancelInvite= async (req, res) => {
  try {
    
   const jobId = req.params.JobId
    const worker = await sendJobInvite.findOneAndDelete(jobId);
    res.status(200).json({
      result: "success",
      message: "Worker profile deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      result: "failed",
      error: error.message,
    });
  }
};


exports.getAllInvites = async(req,res)=>{
  try{
     const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const seekerId = decoded.id;
    
    const invites = await  sendJobInvite.find({seekerId});
  res.status(200).json({
    status:'success',
    invites:invites,
  })
  }catch(error){
   res.status(400).json({
    status:'failed',
    message:error.message
   })
  }
}
exports.updateSeekerProfile = async (req, res) => {

    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const seekerId = decoded.id;
    
    try {

      console.log("Request Body:", req.body);
      console.log("File:", req.file);
    
      const {
        firstName,
        lastName,
        email,
        password,
        requiredService,
        detailOfRequiredService,
        address,
        estimatedHourlyBudget,
        hourlyRate,
        timeOfService,
  
       
      } = req.body;
  
      const picture = req.file ? req.file.filename: null;
      const seeker = {
        firstName,
        lastName,
        email,
        password,
        requiredService,
        detailOfRequiredService,
        address,
        estimatedHourlyBudget,
        hourlyRate,
        timeOfService,
        picture
      } 
      console.log(req.body);
  
      const seekerUpdate = await Seeker.findOneAndUpdate({_id:seekerId}, seeker, {
        new: true,
        runValidators: true,
      });
   
  
      res.status(200).json({
        status: "user Updated successfully",
       
      });
    } catch (err) {
      if (err.code === 11000 && err.keyPattern.email) {
        // Duplicate email error
        return res.status(400).json({
          status: "failed",
          message: "Email is already registered.",
        });
      } else if (err.code === 11000 && err.keyPattern.firstName) {
        // Duplicate first name error
        return res.status(400).json({
          status: "failed",
          message: "First name is already registered.",
        });
      } else if (err.code === 11000 && err.keyPattern.lastName) {
        // Duplicate first name error
        return res.status(400).json({
          status: "failed",
          message: "Last name is already registered.",
        });
      }
      else if (err.code === 11000 && err.keyPattern.password) {
        // Duplicate first name error
        return res.status(400).json({
          status: "failed",
          message: "password is already registered.",
        });
      }
      else if (err.code === 11000 && err.keyPattern.requiredService) {
        // Duplicate first name error
        return res.status(400).json({
          status: "failed",
          message: "requiredService is already registered.",
        });
      }
  
       else {
        // For other errors, provide a generic message
        return res.status(400).json({
          status: "failed",
          message: err.message,
        });
      }
    }
};

exports.deleteSeekerProfile = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    const seekerId = decoded.id;
    const seeker = await Seeker.findByIdAndDelete(seekerId);
    res.status(404).json({
      result: "success",
    });
  } catch (error) {
    res.status(400).json({
      result: "failed",
      error: error.message,
    });
  }
};
