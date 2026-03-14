const express = require("express");
const router = express.Router();
const farmerController = require("../controllers/farmer");
const { authenticate } = require("../middleware/auth");
const {requireFarmer} = require("../middleware/roles");
const upload = require("../middleware/multer");

// Get all published articles
router.get("/articles", authenticate, requireFarmer,farmerController.getArticles);

// Get my diagnoses
router.get("/diagnoses", authenticate, requireFarmer,farmerController.getMyDiagnoses);

// Get article by ID
router.get("/articles/:id",authenticate,requireFarmer,farmerController.getArticle);


// Create new diagnosis
router.post("/diagnose",authenticate, requireFarmer, upload.single("image"), farmerController.createDiagnosis);

// Get single diagnosis by ID
router.get("/diagnoses/:id", authenticate, requireFarmer, farmerController.getSingleDiagnosis);

module.exports = router;