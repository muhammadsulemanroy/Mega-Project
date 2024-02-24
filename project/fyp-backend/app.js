const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const app = express();
const http = require("http");
const socketIO = require("socket.io");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const jwt = require("jsonwebtoken");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());

const Seeker = require("./models/seekerModel");
const Worker = require("./models/workerModel");

const Message = require("./models/messageModel");
const authController = require("./controllers/authController");
const server = http.createServer(app);

const io = socketIO(server);

const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1747942",
  key: "9c1556f9773e416e3dab",
  secret: "15a9f296336c6fd500b1",
  cluster: "mt1",
  useTLS: true
});

app.use(cors());
server.prependListener("request", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
});

const port = process.env.PORT || 8000;

const workerRouter = require("./routes/workerRoutes");
const seekerRouter = require("./routes/seekerRoutes");

app.use(express.urlencoded({ extended: true }));

const signupToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

app.post("/api/v1/login", async (req, res) => {
  try {
    const { email, password, user } = req.body;
    if (!email || !password || !user) {
      return res.status(400).json({
        message: "Please provide email, password, and user type.",
      });
    }

    let userModel;
    if (user === "care seeker") {
      userModel = Seeker;
      const userInstance = await userModel
        .findOne({ email })
        .select("password user _id");

      if (
        !userInstance ||
        !(await userInstance.comparePassword(
          password,
          userInstance.password
        )) ||
        userInstance.user !== user
      ) {
        return res.status(401).json({
          message: "incorrect email or password or user",
        });
      }
      const token = signupToken(userInstance._id);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const id = decoded.id;
      res.status(200).json({
        result: "successfully logged in",
        id,
        token,
        user: "seeker",
      });
    } else if (user === "support worker") {
      userModel = Worker;
      const userInstance = await userModel
        .findOne({ email })
        .select("password user _id");

      if (
        !userInstance ||
        !(await userInstance.comparePassword(
          password,
          userInstance.password
        )) ||
        userInstance.user !== user
      ) {
        return res.status(401).json({
          message: "incorrect email or password or user",
        });
      }
      const token = signupToken(userInstance._id);
      res.status(200).json({
        result: "successfully logged in",
        token,
        user: "worker",
      });
    } else {
      return res.status(400).json({
        message: "Incorrect user type.",
      });
    }
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
});

app.post("/save-message", authController.protect, async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const sender = decoded.id;
    const { content, receiver } = req.body;
    if (receiver === null || undefined) {
      res.status(404).json("error try again");
      return;
    }
    const message = await Message.create({ content, sender, receiver });
    pusher.trigger('seeker-channel', 'new-message',{ content, sender, receiver } );
    // Emit the new message to the sender and receiver
    const unreadCount = await Message.countDocuments({
      $and: [
        {
          $or: [
          
            { sender: sender, receiver: receiver },
          ],
        },
        { unRead: true },
      ],
    });
    console.log(unreadCount);
    pusher.trigger(`seeker-channel-${receiver}`, 'new-count', unreadCount);
  
    // io.emit("message", message);
 
    
  const totalUnreadCount = await Message.countDocuments({
    $and: [
      {
        $or: [
        
          {  receiver: receiver },
        ],
      },
      { unRead: true },
    ],
  });
  console.log('totalUnreadCount',totalUnreadCount);

  pusher.trigger(`seeker-channel-${receiver}`, 'total-count', totalUnreadCount);
    res.status(200).json({
      result: "success",
      message: message,
      sender,
    });
  } catch (error) {
    res.status(404).json(error.message);
  }
});


// io.on("connection", (socket) => {
//   console.log("User connected");

//   socket.on("message", (message) => {
//     io.emit("message", message);
//     console.log("Received message:", message);
//   });
//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });

// app.get("/get-messages-user", authController.protect,async (req, res) => {
//   const token = req.headers.authorization.split(' ')[1];
//   const decoded = jwt.verify(token, process.env.JWT_SECRET);
//   const sender = decoded.id;
//   console.log(sender);
//   try {

//     // Query the database to retrieve messages

//     // Assuming you have a Message model defined
//     const messages = await Message.find({
//       $or: [{ sender}, { receiver: sender }]
//     });

//   console.log('user',messages);
//   let messagesId = [];

//   messages.forEach(message => {
//     if (messagesId.sender || messagesId.receiver!== undefined && messagesId.sender || messagesId.receiver !== null) {
//       // If either sender or receiver exists, assign it to messagesId
//       messagesId = message.sender || message.receiver;
//       // Break the loop if you only want to get the first occurrence
//       // Remove this line if you want to find the last occurrence or all occurrences
//       return;
//     }
//   });

//     console.log('users',messagesId);
//     const dataSeeker = await Seeker.find({ _id: { $in: messagesId } });
//     const dataWorker = await Worker.find({ _id: { $in: messagesId } });

//   console.log('dataSeeker:', dataSeeker);
//   console.log('dataWorker:', dataWorker);

//   if (dataSeeker !== undefined && dataSeeker.length !== 0) {

//    if(dataSeeker._id[index].toString() === sender ) {
//       const loggedId = dataSeeker[index];
//            console.log('logged Id' ,loggedId);
//    }else {
//      return dataSeeker
//    }

//     res.status(200).json({
//       result: "success",
//       messages: messages,
//       sender: sender,
//       data:dataSeeker,
//       loggedId,
//     });
//   } else if (dataWorker !== undefined && dataWorker.length !== 0){
//     if(dataSeeker._id === sender ) {
//       const loggedId = dataWorker[index];
//       console.log('logged Id info' ,loggedId);
//    }else {
//      return dataSeeker
//    }
//    console.log('logged Id info' ,loggedId);
//     res.status(200).json({
//       result: "success",
//       messages: messages,
//       sender: sender,
//       data:dataWorker,
//       loggedId
//     });
//   }else{
//     res.status(404).json(error.message);
//   }
//   } catch (error) {
//     res.status(404).json(error.message);
//   }
// });

// Your existing get-messages route
app.get("/get-messages", authController.protect, async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const sender = decoded.id;
  console.log(sender);
  try {
    const { receiver } = req.query;

    // Query the database to retrieve messages

    // Assuming you have a Message model defined
    const messagesOne = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    });
console.log(messagesOne);
    const messages = await Message.find({
      $or: [{ sender }, { receiver: sender }],
    });


    let messagesIds = [];

      messagesIds = messages.map((message) => {
      if (message.sender === sender) {
        return message.receiver; // Update the receiver value if sender matches
      } else if (message.receiver === sender) {
        return message.sender; // Update the receiver value if receiver matches
      }
      return message._id; // If neither sender nor receiver matches, keep the original _id
    });
    

    

    const uniqueIds = messagesIds.filter(
      (value, index, self) => self.indexOf(value) === index
    );


    const dataSeeker = await Seeker.find({ _id: { $in: uniqueIds } });
    const dataWorker = await Worker.find({ _id: { $in: uniqueIds } });

    const dataOtherChatSeeker = dataSeeker.filter(
      (item) => item._id.toString() !== sender
    );
    const dataLoggedSeeke = dataSeeker.filter(
      (item) => item._id.toString() === sender
    );

    let dataLoggedSeeker = dataLoggedSeeke.length > 0 ? dataLoggedSeeke[0] : {};

   

    const dataOtherChatWorker = dataWorker.filter(
      (item) => item._id.toString() !== sender
    );
    const dataLoggedWorke = dataWorker.filter(
      (item) => item._id.toString() === sender
    );

    let dataLoggedWorker = dataLoggedWorke.length > 0 ? dataLoggedWorke[0] : {};

    const infoSeekerOne = await Seeker.findById(sender);
    const infoWorkerOne = await Worker.findById(sender);

    const unreadCount = await Message.countDocuments({
      $and: [
        {
          $or: [
          
            { sender: receiver, receiver: sender },
          ],
        },
        { unRead: true },
      ],
    });
    
    if (
      infoSeekerOne &&
      dataSeeker !== undefined &&
      infoSeekerOne.length !== 0
    ) {
      res.status(200).json({
        result: "success",
        messages: messages,
        sender: sender,
        dataSeeker,
        infoSeekerOne,
        messagesOne,
        dataLoggedSeeker,
        dataOtherChatWorker,
        count:unreadCount
      });
    } else if (
      infoWorkerOne &&
      dataWorker !== undefined &&
      infoWorkerOne.length !== 0
    ) {
      res.status(200).json({
        result: "success",
        messages: messages,
        sender: sender,
        dataWorker,
        infoWorkerOne,
        messagesOne,
        dataOtherChatSeeker,
        dataLoggedWorker,
        count:unreadCount

      });
    } else {
      res.status(404).json(error.message);
    }
  } catch (error) {
    res.status(404).json(error.message);
  }
});

app.get("/total-unread-count", authController.protect, async(req,res)=>{
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const sender = decoded.id;
  console.log(sender);
  try {
 

  const unreadCount = await Message.countDocuments({
    $and: [
      {
        $or: [
        
          {  receiver: sender },
        ],
      },
      { unRead: true },
    ],
  });


  res.status(200).json({
    status:'success',
    unreadCount
  })
}catch(err){
  res.status(400).json({
    status:'failed',
    message:err.message
  })
}
})


app.patch("/update-message-status", authController.protect, async(req,res)=>{
  try{
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const sender = decoded.id;
    const { receiver } = req.query;
    const  unRead  = req.body;

  console.log("unread",unRead);
    const updateResult = await Message.updateMany(
      {
        $or: [
          { sender: receiver, receiver: sender },
        ],
      },
      { $set:  unRead }
    );
    console.log(updateResult);
   
    res.status(200).json({
      result: "success",

    });
  }catch(error){
    res.status(404).json(error.message);
  }
})


// Your existing get-messages route
app.get("/get-logged-user", authController.protect, async (req, res) => {

  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const sender = decoded.id;

  try{


const infoSeekerOne = await Seeker.findOne({_id:sender});
const infoWorkerOne = await Worker.findOne({_id:sender});

if (
  infoSeekerOne &&
  infoSeekerOne.length !== 0
) {
  res.status(200).json({
    result: "success",
    infoSeekerOne,

 
  });
} else if (
  infoWorkerOne &&
  infoWorkerOne.length !== 0
) {
  res.status(200).json({
    result: "success",
    infoWorkerOne,
  });
} else {
  res.status(404).json(error.message);
}
  }catch (error) {
    res.status(404).json(error.message);
  }

});










app.use("/api/v1/workers", workerRouter);
app.use("/api/v1/seekers", seekerRouter);

const DB = process.env.DATABASE;
mongoose
  .connect(DB, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });


server.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
