const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const validator = require("validator");

const workerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please Enter Your First Name"],
    unique: true,
  },
  lastName: {
    type: String,
    required: [true, "Please Enter Your Last Name"],
    unique: true,
  },
  mobileNo: {
    type: Number,
    required: [true, "Please Enter Your Mobile No"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please Enter Your Email"],
    validate: [validator.isEmail, "Please Enter Valid Email"],
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
  },
  qualificationDetails: {
    type: String,
    required: [true, "please Enter Your Qualifivation Details"],
  },
  picture: {
    type: String,
    required: [true, "Please Enter Your Picture"],
  },
  experience: {
    type: Number,
    required: [true, "Please Enter Your Experience"],
  },
  bio: {
    type: String,
    required: [true, "Please Enter Your Bio"],
  },
  hourlyRate: {
    type: Number,
    required: [true, "Please Enter Your Horly Rate"],
  },
  category: {
    type: String,
    required: [true, "please enter category"],
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
      message:
        "please enter category from sick OR babycare OR cooking OR personalcare OR animalcare OR gyminstructor OR domesticassistance",
    },
  },

  referenceName: {
    type: String,
    required: [true, "Please Enter Your Referance Name"],
    unique: true,
  },
  referenceRelation: {
    type: String,
    required: [true, "Please Enter Your relation With referance"],
  },
  referenceContactNo: {
    type: Number,
    required: [true, "Please Enter Your reference Contact No"],
  },
  rating: {
    type: Number,
    default: 3,
  },
  user: {
    type: String,
    default: "support worker",
  },
});

workerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
});

workerSchema.methods.comparePassword = async function (
  candidatePassword,
  password
) {
  return await bcrypt.compare(candidatePassword, password);
};
const Worker = mongoose.model("Worker", workerSchema);

module.exports = Worker;
