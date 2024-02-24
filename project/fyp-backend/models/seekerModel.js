const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const seekerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please Enter Your First Name"],
    unique: true,
  },
  lastName: {
    type: String,
    required: [true, "Please Enter Your last Name"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please Enter Your last Name"],
    unique: true,
    validate: [validator.isEmail, "Please Enter Valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
  },
  requiredService: {
    type: String,
    required: [true, "Please Enter Your Required Service"],
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
  detailOfRequiredService: {
    type: String,
    required: [true, "Please Enter  Details Of Required Service"],
  },
  address: {
    type: String,
    required: [true, "Please Enter Your address"],
  },
  estimatedHourlyBudget: {
    type: Number,
    required: [true, "please Enter Your Budget"],
  },
  timeOfService: {
    type: Number,
    required: [true, "please Enter Time Of Service"],
  },
  user: {
    type: String,
    default: "care seeker",
  },
  picture: {
    type: String,
    required: [true, "Please Enter Your Picture"],
  },
});

seekerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
});

seekerSchema.methods.comparePassword = async function (
  candidatePassword,
  Password
) {
  return await bcrypt.compare(candidatePassword, Password);
};
const Seeker = mongoose.model("Seeker", seekerSchema);
module.exports = Seeker;
