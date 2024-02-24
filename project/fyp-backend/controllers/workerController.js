const jwt = require("jsonwebtoken");
const Worker = require("../models/workerModel");
const Job = require("../models/postJobModel");
const applyJob = require("../models/applyJobModel");
const sendJobInvite = require("../models/sendInviteModel");
const Seeker = require("../models/seekerModel");
const Pusher = require('pusher');
const pusher = new Pusher({
  appId: "1747942",
  key: "9c1556f9773e416e3dab",
  secret: "15a9f296336c6fd500b1",
  cluster: "mt1",
  useTLS: true
});

exports.getAllWorkers = async (req, res, next) => {
  try {
    const workers = await Worker.find();
    res.status(200).json({
      result: workers.length,
      status: "success",
      data: {
        workers,
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

exports.getTopThreeWorkers = async (req, res) => {
  try {

      const workers = await Worker.find().sort({ rating: -1 }).limit(4);
      res.status(200).json({
        result: workers.length,
        status: "success",
        data: {
          workers,
        },
      });

  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }

};

exports.getWorker = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const workerId = decoded.id;
    console.log(workerId);
    const worker = await Worker.findOne({_id:workerId});
  console.log(worker);
    res.status(200).json({
      status: "sucess",
      data: {
        worker: worker,
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
exports.filter = async (req, res) => {

    const { minhourlyRate, maxhourlyRate, category, minExperience, maxExperience } = req.query;
    console.log('Received query parameters:', req.query);
    let query = {};
   
    if (minhourlyRate !== undefined && maxhourlyRate !== undefined) {
      query.hourlyRate = {
        $gte: minhourlyRate,
        $lte:maxhourlyRate,
      };
    }

    if (category !== undefined ) {
      query.category = category;
    }
    if (minExperience !== undefined && maxExperience !== undefined) {
      query.experience = {
        $gte: minExperience,
        $lte: maxExperience,
      };
    }
  
    let sortOrder = 1;
    if (req.query.sortBack === "desc") {
      sortOrder = -1;
    }
  
    try {
      const results = await Worker.find(query).sort({ hourlyRate: sortOrder });
  
      res.status(200).json(results);
    } catch (error) { 
      res.status(400).json(error.message);
    }
  };
  


exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json({
      status: "success",
      data: {
        jobs,
      },
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

exports.applyjob = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const workerId = decoded.id;

    const {
      jobId,
      category,
      experience,
      hourlyRate,
      mobileNo
    } = req.body;

    const workerData = await Worker.findOne({ _id: workerId });
    const name =  workerData.firstName + ' ' + workerData.lastName;
    const picture = workerData.picture;

    const jobapply = await applyJob.findOne({
      workerId,
      jobId
    });

    if (jobapply) {
      return res.status(400).json({
        result: "failed",
        message: "User already registered for this job."
      });
    }

    await applyJob.create({
      workerId,
      jobId,
      name,
      category,
      experience,
      hourlyRate,
      mobileNo,
      picture
    });
    pusher.trigger('seeker-channel', 'new-apply-job', {
      message: 'New Application!',
    });
    res.status(200).json({
      result: "success",
      message: "Application Submitted"
    });
  } catch (err) {
   
   res.status(400).json({
        result: "failed",
        message: err.message
      });

  }
};

exports.getAllJobApplicants = async(req,res)=>{
  try{
   const jobId = req.query.JobId;
   const token = req.headers.authorization.split(' ')[1];
   const decoded = jwt.verify(token, process.env.JWT_SECRET);
   const seekerId = decoded.id;
   
   const invites = await  sendJobInvite.findOne({seekerId});
    const getJob = await applyJob.find({jobId});

    console.log(getJob);
  res.status(200).json({
    status:'success',
    jobs:getJob,
    invites:invites,
  })
  }catch(error){
   res.status(400).json({
    status:'failed',
    message:error.message
   })
  }
}

exports.getAllInvites = async(req,res)=>{
  try{
     const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const workerId = decoded.id;
    console.log(workerId);
    const invites = await sendJobInvite.find({workerId});
    console.log(invites);
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

exports.updateWorkerProfile = async (req, res) => {

  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const workerId = decoded.id;
  
  try {

    console.log("Request Body:", req.body);
    console.log("File:", req.file);
  
    const {
  firstName,
  lastName,
  mobileNo,
  email,
  password,
  qualificationDetails,
  experience,
  bio,
  hourlyRate,
  category,
  referenceName,
  referenceRelation,
  referenceContactNo
     
    } = req.body;

    const picture = req.file ? req.file.filename: null;
    const worker = {
      firstName,
  lastName,
  mobileNo,
  email,
  password,
  qualificationDetails,
  experience,
  bio,
  hourlyRate,
  category,
  referenceName,
  referenceRelation,
  referenceContactNo,
  picture
    } 
    console.log(req.body);

    const workerUpdate = await Worker.findOneAndUpdate({_id:workerId}, worker, {
      new: true,
      runValidators: true,
    });
 

    res.status(200).json({
      status: "Support Worker Updated successfully",
     
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
    else if (err.code === 11000 && err.keyPattern.experience) {
      // Duplicate first name error
      return res.status(400).json({
        status: "failed",
        message: "experience is already registered.",
      });
    }
    else if (err.code === 11000 && err.keyPattern.hourlyRate) {
      // Duplicate first name error
      return res.status(400).json({
        status: "failed",
        message: "hourlyRate is already registered.",
      });
    }
    else if (err.code === 11000 && err.keyPattern.category) {
      // Duplicate first name error
      return res.status(400).json({
        status: "failed",
        message: "category is already registered.",
      });
    }
    else if (err.code === 11000 && err.keyPattern.referenceName) {
      // Duplicate first name error
      return res.status(400).json({
        status: "failed",
        message: "referenceName is already registered.",
      });
    }
    else if (err.code === 11000 && err.keyPattern.referenceRelation) {
      // Duplicate first name error
      return res.status(400).json({
        status: "failed",
        message: "referenceRelation is already registered.",
      });
    }
    else if (err.code === 11000 && err.keyPattern.referenceContactNo) {
      // Duplicate first name error
      return res.status(400).json({
        status: "failed",
        message: "referenceContactNo is already registered.",
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



exports.deleteWorkerProfile = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const workerId = decoded.id;
    console.log(workerId);
    const worker = await Worker.findByIdAndDelete(workerId);

    if (!worker) {
      return res.status(404).json({
        result: "failed",
        error: "Worker not found",
      });
    }

    // Delete the worker profile
 
    await Worker.findByIdAndDelete(workerId);
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

exports.updateInviteStatus = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const workerId = decoded.id;
    console.log(workerId);
    console.log(req.body);
    const seeker = await sendJobInvite.findOneAndUpdate({workerId}, req.body.data, {
      new: true,
      runValidators: true,
    });
    if (!seeker) {
      return res.status(404).json({
        error: 'Worker not found',
      });
    }
    res.status(200).json({
      status: "update successfully",
      seeker,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};
exports.updateWorkerProfile = async (req, res) => {
  try {
    const worker = await Worker.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "update successfully",
      worker,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

