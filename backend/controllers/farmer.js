const farmerService = require('../services/farmer');
const { transcribeWithAIService } = require('../services/speechRecognition');

const getArticles = async (req, res) => {
  try {
    const articles = await farmerService.getPublishedArticles();
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMyDiagnoses = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    
    const diagnoses = await farmerService.getFarmerDiagnoses(userId);
    res.status(200).json(diagnoses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await farmerService.getArticleById(id);

    if (!article) {
      return res.status(404).json({
        message: "Article not found or not published",
      });
    }

    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const createDiagnosis = async (req, res) => {
  try {
    const diagnosis = await farmerService.createDiagnosis({
      userId: req.user.id,
      file: req.file,
      context: req.body.context,
      plantName: req.body.plantName,
    });
    

    return res.status(201).json({
      message: "Diagnosis created successfully",
      diagnosis,
    });

  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const transcribeVoiceNote = async (req, res) => {
  try {
    console.info("[farmer.transcribeVoiceNote] Incoming request", {
      hasFile: Boolean(req.file),
      fileName: req.file?.originalname,
      mimeType: req.file?.mimetype,
      size: req.file?.size,
      bodyKeys: Object.keys(req.body || {}),
    });

    if (!req.file) {
      return res.status(422).json({
        message: 'Audio file is required',
        code: 'AUDIO_FILE_MISSING',
      });
    }

    const text = await transcribeWithAIService(req.file);
    return res.status(200).json({ text });
  } catch (error) {
    return res.status(error.status || 400).json({
      message: error.message,
      code: error.code || 'TRANSCRIPTION_ERROR',
    });
  }
};
const getSingleDiagnosis = async (req, res) => {
  try {
    const diagnosisId = req.params.id;

    // userId comes from authenticated user (assuming middleware sets req.user)
    const userId = req.user.id;

    const diagnosis = await farmerService.getDiagnosisById(diagnosisId, userId);

    res.json(diagnosis);
  } catch (error) {
    console.error("Get diagnosis by ID error:", error);
    res.status(404).json({ message: error.message });
  }
};
module.exports = {
  getArticles,
  getMyDiagnoses,
  getArticle,
  createDiagnosis,
  getSingleDiagnosis,
  transcribeVoiceNote,
};