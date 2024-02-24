const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();

const Seeker = require("../models/seekerModel");
const Worker = require("../models/workerModel");

const signupToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signUpSeeker = async (req, res) => {
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
    const seeker = await Seeker.create({
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
    });

    const token = signupToken(seeker._id);

    res.status(200).json({
      status: "user submitted successfully",
      token,
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
    } else {
      // For other errors, provide a generic message
      return res.status(400).json({
        status: "failed",
        message: err.message,
      });
    }
  }
};

exports.signUpWorker = async (req, res) => {
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
      referenceContactNo,
    } = req.body;

    const picture = req.file ? req.file.filename: null;
    const worker = await Worker.create({
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
      picture,
    });

    const token = signupToken(worker._id);

    res.status(200).json({
      status: "user submitted successfully",
      token,
    });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern.email) {
      return res.status(400).json({
        status: "failed",
        message: "Email is already registered.",
      });
    } else if (err.code === 11000 && err.keyPattern.firstName) {
      return res.status(400).json({
        status: "failed",
        message: "First name is already registered.",
      });
    } else if (err.code === 11000 && err.keyPattern.lastName) {
      return res.status(400).json({
        status: "failed",
        message: "Last name is already registered.",
      });
    } else if (err.code === 11000 && err.keyPattern.referenceName) {
      return res.status(400).json({
        status: "failed",
        message: "Reference name is already registered.",
      });
    } else {
      return res.status(400).json({
        status: "failed",
        message: err.message,
      });
    }
  }
};

exports.protect = async (req, res,next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
console.log(req.headers.authorization.split(' '));
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - Missing token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized - Missing user ID in token",
      });
    }

next();
    
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized - Invalid token",
    });
  }
};

//     exports.logInWorker =async( req,res,next)=>{
//         try{
//     const {email,password} = req.body;
//     if(!email || !password){
//         return res.status(401).json({
//             message:'please enter your email and password'
//         })
//     }
//     const worker = await Worker.findOne({email}).select('+password');

//     if(!email || !(await worker.comparePassword(password,worker.password))) {
//         return res.status(400).json({
//             message:'please enter correct email or password'
//         })
//     }

//     const token = signupToken(worker._id);
//     res.status(200).json({
//       result:'sucessfully logged in',
//       token
//     })
// }catch(err){
//     res.status(400).json({
//         message:err.message
//     })
// }
//     }
