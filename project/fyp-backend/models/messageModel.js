const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
  unRead: {
    type: String,
    default:true
  },

});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
