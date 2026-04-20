const express = require("express");
const router = express.Router();
const agronomistController = require("../controllers/agronomist");
const upload = require("../middleware/multer");
const { authenticate } = require("../middleware/auth");
const { requireAgronomist } = require("../middleware/roles");

router.use(authenticate, requireAgronomist);

router.get("/diagnoses", agronomistController.getDiagnoses);
router.get("/diagnoses/pending", agronomistController.getPendingDiagnoses);
router.get("/diagnoses/:id", agronomistController.getDiagnosis);
router.patch("/diagnoses/:id", agronomistController.updateDiagnosis);
router.patch("/diagnoses/:id/approve", agronomistController.approveDiagnosis);
router.patch("/diagnoses/:id/reject", agronomistController.rejectDiagnosis);

router.get("/articles", agronomistController.getMyArticles);
router.post("/articles", upload.single("coverImage"), agronomistController.createArticle);
router.patch("/articles/:id", upload.single("coverImage"), agronomistController.updateArticle);
router.delete("/articles/:id", agronomistController.deleteArticle);

module.exports = router;
