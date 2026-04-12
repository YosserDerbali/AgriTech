const agronomistService = require("../services/agronomist");

exports.getPendingDiagnoses = async (req, res) => {
  try {
    const diagnoses = await agronomistService.getPendingDiagnoses();
    return res.status(200).json(diagnoses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getDiagnosisById = async (req, res) => {
  try {
    const diagnosis = await agronomistService.getDiagnosisById(req.params.id);

    if (!diagnosis) {
      return res.status(404).json({ message: "Diagnosis not found" });
    }

    return res.status(200).json(diagnosis);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.approveDiagnosis = async (req, res) => {
  try {
    const { treatment, agronomistNotes } = req.body;

    if (!treatment || !String(treatment).trim()) {
      return res.status(400).json({ message: "Treatment is required" });
    }

    const diagnosis = await agronomistService.approveDiagnosis(
      req.params.id,
      String(treatment).trim(),
      agronomistNotes ? String(agronomistNotes).trim() : null
    );

    return res.status(200).json(diagnosis);
  } catch (error) {
    if (error.message === "Diagnosis not found") {
      return res.status(404).json({ message: error.message });
    }

    return res.status(500).json({ message: error.message });
  }
};

exports.rejectDiagnosis = async (req, res) => {
  try {
    const { agronomistNotes } = req.body;

    if (!agronomistNotes || !String(agronomistNotes).trim()) {
      return res.status(400).json({ message: "Rejection notes are required" });
    }

    const diagnosis = await agronomistService.rejectDiagnosis(
      req.params.id,
      String(agronomistNotes).trim()
    );

    return res.status(200).json(diagnosis);
  } catch (error) {
    if (error.message === "Diagnosis not found") {
      return res.status(404).json({ message: error.message });
    }

    return res.status(500).json({ message: error.message });
  }
};

exports.getMyArticles = async (req, res) => {
  try {
    const articles = await agronomistService.getMyArticles(req.user.id);
    return res.status(200).json(articles);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.createArticle = async (req, res) => {
  try {
    const { title, content, excerpt } = req.body;

    if (!title || !content || !excerpt) {
      return res.status(400).json({ message: "title, content, and excerpt are required" });
    }

    const article = await agronomistService.createArticle(req.user.id, req.user.name, req.body);
    return res.status(201).json(article);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const article = await agronomistService.updateArticle(req.user.id, req.params.id, req.body);
    return res.status(200).json(article);
  } catch (error) {
    if (error.message === "Article not found") {
      return res.status(404).json({ message: error.message });
    }

    return res.status(500).json({ message: error.message });
  }
};

exports.deleteArticle = async (req, res) => {
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
