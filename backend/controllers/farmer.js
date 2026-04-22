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
    const userId = req.user.id;
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
      return res.status(404).json({ message: "Article not found or not published" });
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
    return res.status(400).json({ message: error.message });
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
    const userId = req.user.id;
    const diagnosis = await farmerService.getDiagnosisById(diagnosisId, userId);
    res.json(diagnosis);
  } catch (error) {
    console.error("Get diagnosis by ID error:", error);
    res.status(404).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;
    
    const { User } = require("../models/User");
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (name) {
      user.name = name;
      await user.save();
    }
    
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }
    
    const { User } = require("../models/User");
    const bcrypt = require("bcrypt");
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }
    
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    user.password_hash = newPasswordHash;
    await user.save();
    
    res.json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getArticles,
  getMyDiagnoses,
  getArticle,
  createDiagnosis,
  getSingleDiagnosis,
  transcribeVoiceNote,
  updateProfile,
  changePassword,
};