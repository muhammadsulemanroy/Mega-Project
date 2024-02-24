const mongoose = require("mongoose");

const sentInviteSchema = new mongoose.Schema({
    jobId:{
        type:String,
       required:[true, 'no Job id']
       },
  seekerId:{
   type:String,
  required:[true, 'no seeker id']
  },
  workerId:{
    type:String,
   required:[true, 'no worker id']
   },
  requiredService: {
    type: String,
    required: [true, " No Required Service"],
    
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
  detail: {
    type: String,
    required: [true, "Enter Detail Of The Job"],
  },
  address: {
    type: String,
    required: [true, "Enter Your Address"],
  },
  hourlyBudget: {
    type: Number,
    required: [true, "Enter Your hourlyBudget"],
  },
  timeOfService: {
    type: Number,
    required: [true, "Enter Your Time Required For Service"],
  },
  status:{
    type:String,
    default:'pending'
  }
});

const sendJobInvite = mongoose.model("sendInvite",sentInviteSchema );

module.exports = sendJobInvite;
