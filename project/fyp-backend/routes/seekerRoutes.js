const express = require("express");
const seekerController = require("../controllers/seekerController");
const authController = require("../controllers/authController"); // Assuming protect middleware is defined in 'app.js'
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());
const multer = require("multer");
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_'+ file.originalname)
    
  },
});

const upload = multer({ storage });
 router.post("/signupseeker", upload.single("picture"), authController.signUpSeeker);

// Routes without authentication
router
  .route("/")
  .get(authController.protect, seekerController.getAllSeekers);

// Routes requiring authentication
 // Applying protect middleware to the following routes

router.route("/postjob").post(authController.protect,seekerController.postJob).get(authController.protect,seekerController.getAllPostedJobs).patch(authController.protect,seekerController.editJob).delete(authController.protect,seekerController.deleteJob);
router.route("/sendInvite").post(authController.protect,seekerController.sendInvite).delete(authController.protect,seekerController.cancelInvite);
router.route("/viewPostedJobs").get(authController.protect,seekerController.getPostedJobs);
router.route("/getAllInvitesStatus").get(authController.protect,seekerController.getAllInvites);
router.route("/getSeeker").get(authController.protect,seekerController.getSeeker);
router.route("/updateSeeker").patch(authController.protect,upload.single("picture"),seekerController.updateSeekerProfile);
router.route("/deleteSeeker").delete(authController.protect,seekerController.deleteSeekerProfile);
router
  .route("/:id")
  .patch(authController.protect,seekerController.updateSeekerProfile)
  .delete(authController.protect,seekerController.deleteSeekerProfile);

module.exports = router;
