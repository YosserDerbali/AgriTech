const agronomistService = require("../services/agronomist");
const notificationService = require("../services/notification");
const { Notification } = require("../models/Notification");
const parseTags = (rawTags) => {
  if (rawTags === undefined) {
    return undefined;
  }

  if (Array.isArray(rawTags)) {
    return rawTags;
  }

  if (typeof rawTags === "string") {
    const trimmed = rawTags.trim();
    if (!trimmed) {
      return [];
    }

    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return trimmed.split(",").map((tag) => tag.trim()).filter(Boolean);
    }
  }

  return [];
};

const getDiagnoses = async (req, res) => {
  try {
    const diagnoses = await agronomistService.getDiagnosisQueue();
    return res.status(200).json(diagnoses);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message,
      code: error.code || "AGRONOMIST_QUEUE_ERROR",
      status: error.status || 500,
    });
  }
};

const getDiagnosis = async (req, res) => {
  try {
    const diagnosis = await agronomistService.getDiagnosisForReview(req.params.id);

    if (!diagnosis) {
      return res.status(404).json({ message: "Diagnosis not found" });
    }

    return res.status(200).json(diagnosis);
  } catch (error) {
    return res.status(error.status || 404).json({
      message: error.message,
      code: error.code || "DIAGNOSIS_NOT_FOUND",
      status: error.status || 404,
    });
  }
};

const updateDiagnosis = async (req, res) => {
  try {
    const diagnosis = await agronomistService.updateDiagnosisReview({
      diagnosisId: req.params.id,
      reviewerId: req.user.id,
      status: req.body.status,
      treatment: req.body.treatment,
      agronomistNotes: req.body.agronomistNotes ?? req.body.notes ?? req.body.agronomist_notes,
      diseaseName: req.body.diseaseName ?? req.body.disease_name,
      symptoms: req.body.symptoms,
    });

    return res.status(200).json({
      message: "Diagnosis review saved successfully",
      diagnosis,
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      message: error.message,
      code: error.code || "DIAGNOSIS_REVIEW_ERROR",
      status: error.status || 400,
    });
  }
};

const getPendingDiagnoses = getDiagnoses;
const getDiagnosisById = getDiagnosis;
const approveDiagnosis = async (req, res) => {
  try {
    const { id } = req.params;
    const { treatment, agronomistNotes } = req.body;

    const result = await agronomistService.approveDiagnosis(id, treatment, agronomistNotes);

    return res.status(200).json({
      message: "Diagnosis approved successfully",
      data: result,
    });

  } catch (error) {
    console.error("Approve diagnosis error:", error);
    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};


// =========================
// REJECT DIAGNOSIS CONTROLLER
// =========================
const rejectDiagnosis = async (req, res) => {
  try {
    const { id } = req.params;
    const { agronomistNotes } = req.body;

    const result = await agronomistService.rejectDiagnosis(id, agronomistNotes);

    return res.status(200).json({
      message: "Diagnosis rejected successfully",
      data: result,
    });

  } catch (error) {
    console.error("Reject diagnosis error:", error);
    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};

const getMyArticles = async (req, res) => {
  try {
    const articles = await agronomistService.getMyArticles(req.user.id);
    return res.status(200).json(articles);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createArticle = async (req, res) => {
  try {
    const { title, content, excerpt } = req.body;

    if (!title || !content || !excerpt) {
      return res.status(400).json({ message: "title, content, and excerpt are required" });
    }

    if (req.body.coverImageUrl) {
      return res.status(400).json({ message: "External image URLs are not allowed. Please upload from your device." });
    }

    const payload = {
      ...req.body,
      tags: parseTags(req.body.tags),
      coverImageFile: req.file,
      removeCoverImage: req.body.removeCoverImage === "true" || req.body.removeCoverImage === true,
    };

    const article = await agronomistService.createArticle(req.user.id, req.user.name, payload);
    return res.status(201).json(article);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateArticle = async (req, res) => {
  try {
    if (req.body.coverImageUrl) {
      return res.status(400).json({ message: "External image URLs are not allowed. Please upload from your device." });
    }

    const payload = {
      ...req.body,
      tags: req.body.tags !== undefined ? parseTags(req.body.tags) : undefined,
      coverImageFile: req.file,
      removeCoverImage: req.body.removeCoverImage === "true" || req.body.removeCoverImage === true,
    };

    const article = await agronomistService.updateArticle(req.user.id, req.params.id, payload);
    return res.status(200).json(article);
  } catch (error) {
    if (error.message === "Article not found") {
      return res.status(404).json({ message: error.message });
    }

    return res.status(500).json({ message: error.message });
  }
};

const deleteArticle = async (req, res) => {
  try {
    await agronomistService.deleteArticle(req.user.id, req.params.id);
    return res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    if (error.message === "Article not found") {
      return res.status(404).json({ message: error.message });
    }

    return res.status(500).json({ message: error.message });
  }
};
const getNotifications = async (req, res) => {
  console.log("[agronomist.getNotifications] Incoming request", )
  try {
    const userId = req.user.id;
    const notifications = await Notification.findAll({
    where: {
      user_id: userId,
      deleted_at: null, // <-- exclude soft-deleted notifications
    },
    order: [["created_at", "DESC"]],
  });
  
  res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    await Notification.update(
      { deleted_at: new Date() },
      { where: { id: notificationId } }
    );
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};


const markNotificationAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const notification = await agronomistService.markNotificationAsRead(id, userId);
    res.status(200).json(notification);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
module.exports = {
  getDiagnoses,
  getDiagnosis,
  updateDiagnosis,
  getPendingDiagnoses,
  getDiagnosisById,
  approveDiagnosis,
  rejectDiagnosis,
  getMyArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  getNotifications,
  deleteNotification,
  markNotificationAsRead,
};