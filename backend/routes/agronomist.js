const express = require("express");
const router = express.Router();
const agronomistController = require("../controllers/agronomist");
const { authenticate } = require("../middleware/auth");
const { requireAgronomist } = require("../middleware/roles");

router.get("/diagnoses/pending", authenticate, requireAgronomist, agronomistController.getPendingDiagnoses);
router.get("/diagnoses/:id", authenticate, requireAgronomist, agronomistController.getDiagnosisById);
router.patch("/diagnoses/:id/approve", authenticate, requireAgronomist, agronomistController.approveDiagnosis);
router.patch("/diagnoses/:id/reject", authenticate, requireAgronomist, agronomistController.rejectDiagnosis);

router.get("/articles", authenticate, requireAgronomist, agronomistController.getMyArticles);
router.post("/articles", authenticate, requireAgronomist, agronomistController.createArticle);
router.patch("/articles/:id", authenticate, requireAgronomist, agronomistController.updateArticle);
router.delete("/articles/:id", authenticate, requireAgronomist, agronomistController.deleteArticle);

module.exports = router;
