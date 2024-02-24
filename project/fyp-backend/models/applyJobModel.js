const mongoose = require("mongoose");

const applyJobSchema = new mongoose.Schema({
  workerId:{
    type:String,
   required:[true, 'no worker id'],
  
   },
 
  jobId: {
    type: String,
    required: [true, "Id is Not Valid"],
  },
  name: {
    type: String,
    required: [true, "Enter Your Name Please"],
 
  },
  category: {
    type: String,
    required: [true, "Enter Your Category Please"],
    enum: {
      values: [
        "sick",
        "babycare",
        "cooking",
        "personalcare",
        "animalcare",
        "gyminstructor",
        "domesticassistance",
      ],
      message: "Your Enter Service is not correct",
    },
  },
  experience: {
    type: Number,
    required: [true, "Enter Your Experience Please"],
  },
  hourlyRate: {
    type: Number,
    required: [true, "Enter Your hourlyRate Please"],
  },
  mobileNo: {
    type: Number,
    required: [true, "Enter Your Mobile No Please"],
    min:8
  },
  picture: {
    type: String,
    required: [true, "Enter Your Picture Please"],
  },
});

const applyJob = mongoose.model("ApplyJob", applyJobSchema);
module.exports = applyJob;
