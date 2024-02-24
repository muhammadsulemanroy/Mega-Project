const express = require("express");
const authController = require("../controllers/authController");
const workerController = require("../controllers/workerController");
const bodyParser = require('body-parser')

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

router.post("/signupworker", upload.single("picture"), authController.signUpWorker);

router.route("/jobs").get(authController.protect,workerController.getAllJobs);
router.route("/applyforjob").post(authController.protect,upload.single("picture"),workerController.applyjob);
router.route("/filter").get(authController.protect,workerController.filter);
router.route("/top-three-workers").get(workerController.getTopThreeWorkers);
router.route("/getAllJobApplicant").get(authController.protect,workerController.getAllJobApplicants);
router.route("/getAllJobInvites").get(authController.protect,workerController.getAllInvites).patch(authController.protect,workerController.updateInviteStatus);
router.route("/").get(workerController.getAllWorkers);
router.route("/getWorker").get(authController.protect,workerController.getWorker);
router.route("/updateWorker").patch(authController.protect,upload.single("picture"),workerController.updateWorkerProfile);
router.route("/deleteWorker").delete(authController.protect,workerController.deleteWorkerProfile);
router
  .route("/:id")

  .patch(workerController.updateWorkerProfile)


module.exports = router;
