const { Diagnoses } = require("../models/Diagnoses");
const { Article } = require("../models/Article");

const getPendingDiagnoses = async () => {
  return Diagnoses.findAll({
    where: { status: "PENDING" },
    order: [["created_at", "DESC"]],
  });
};

const getDiagnosisById = async (id) => {
  return Diagnoses.findByPk(id);
};

const approveDiagnosis = async (id, treatment, agronomistNotes) => {
  const diagnosis = await Diagnoses.findByPk(id);

  if (!diagnosis) {
    throw new Error("Diagnosis not found");
  }

  diagnosis.status = "APPROVED";
  diagnosis.treatment = treatment;
  diagnosis.agronomist_notes = agronomistNotes || null;
  diagnosis.updated_at = new Date();

  await diagnosis.save();
  return diagnosis;
};

const rejectDiagnosis = async (id, agronomistNotes) => {
  const diagnosis = await Diagnoses.findByPk(id);

  if (!diagnosis) {
    throw new Error("Diagnosis not found");
  }

  diagnosis.status = "REJECTED";
  diagnosis.agronomist_notes = agronomistNotes;
  diagnosis.updated_at = new Date();

  await diagnosis.save();
  return diagnosis;
};

const getMyArticles = async (authorId) => {
  return Article.findAll({
    where: { author_id: authorId },
    order: [["created_at", "DESC"]],
  });
};

const createArticle = async (authorId, authorName, payload) => {
  return Article.create({
    author_id: authorId,
    author_name: authorName || "Agronomist",
    title: payload.title,
    content: payload.content,
    excerpt: payload.excerpt,
    cover_image_url: payload.coverImageUrl || null,
    source: "AGRONOMIST",
    tags: Array.isArray(payload.tags) ? payload.tags : [],
    published: payload.published !== undefined ? payload.published : true,
  });
};

const updateArticle = async (authorId, articleId, payload) => {
  const article = await Article.findOne({
    where: {
      id: articleId,
      author_id: authorId,
      source: "AGRONOMIST",
    },
  });

  if (!article) {
    throw new Error("Article not found");
  }

  if (payload.title !== undefined) article.title = payload.title;
  if (payload.content !== undefined) article.content = payload.content;
  if (payload.excerpt !== undefined) article.excerpt = payload.excerpt;
  if (payload.coverImageUrl !== undefined) article.cover_image_url = payload.coverImageUrl || null;
  if (payload.tags !== undefined) article.tags = Array.isArray(payload.tags) ? payload.tags : article.tags;
  if (payload.published !== undefined) article.published = Boolean(payload.published);
  article.updated_at = new Date();

  await article.save();
  return article;
};

const deleteArticle = async (authorId, articleId) => {
  const article = await Article.findOne({
    where: {
      id: articleId,
      author_id: authorId,
      source: "AGRONOMIST",
    },
  });

  if (!article) {
    throw new Error("Article not found");
  }

  await article.destroy();
  return article;
};

module.exports = {
  getPendingDiagnoses,
  getDiagnosisById,
  approveDiagnosis,
  rejectDiagnosis,
  getMyArticles,
  createArticle,
  updateArticle,
  deleteArticle,
};
