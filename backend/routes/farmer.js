const express = require("express");
const router = express.Router();
const farmerController = require("../controllers/farmer");
const { authenticate } = require("../middleware/auth");
const { requireFarmer } = require("../middleware/roles");
const upload = require("../middleware/multer");

router.get("/articles", authenticate, requireFarmer, farmerController.getArticles);

router.get("/diagnoses", authenticate, requireFarmer, farmerController.getMyDiagnoses);

router.get("/articles/:id", authenticate, requireFarmer, farmerController.getArticle);

router.post("/diagnose", authenticate, requireFarmer, upload.single("image"), farmerController.createDiagnosis);

router.post("/transcribe", authenticate, requireFarmer, upload.single("audio"), farmerController.transcribeVoiceNote);

router.get("/diagnoses/:id", authenticate, requireFarmer, farmerController.getSingleDiagnosis);

router.patch("/profile", authenticate, requireFarmer, farmerController.updateProfile);

router.post("/change-password", authenticate, requireFarmer, farmerController.changePassword);

module.exports = router;