const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
   
  seekerId:{
   type:String,
  required:[true, 'no seeker id']
  },

  requiredService: {
    type: String,
    required: [true, "Enter Required Service"],
    
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
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
