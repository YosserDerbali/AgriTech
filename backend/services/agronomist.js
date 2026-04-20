const { sequelize } = require("../config/database");
const { Diagnoses } = require("../models/Diagnoses");
const { Article } = require("../models/Article");
const { supabase } = require("../config/supabaseClient");
const { v4: uuidv4 } = require("uuid");
const normalizeCatalogName = (value) => (value || "").trim().replace(/\s+/g, " ");
const ARTICLE_COVER_BUCKET = "plant-images";

const uploadArticleCover = async (file) => {
  if (!file) {
    return null;
  }

  if (!file.mimetype || !file.mimetype.startsWith("image/")) {
    const error = new Error("Cover image must be an image file");
    error.status = 422;
    throw error;
  }

  const fileExt = (file.originalname || "cover.jpg").split(".").pop() || "jpg";
  const fileName = `article-covers/${uuidv4()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from(ARTICLE_COVER_BUCKET)
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (uploadError) {
    const error = new Error(`Supabase upload failed: ${uploadError.message || "Unknown error"}`);
    error.status = 502;
    throw error;
  }

  const { data } = supabase.storage.from(ARTICLE_COVER_BUCKET).getPublicUrl(fileName);
  if (!data?.publicUrl) {
    const error = new Error("Supabase public URL generation failed");
    error.status = 502;
    throw error;
  }

  return data.publicUrl;
};

const getDiagnosisQueue = async () => Diagnoses.findAll({ order: [["created_at", "DESC"]] });

const getPendingDiagnoses = async () =>
  Diagnoses.findAll({ where: { status: "PENDING" }, order: [["created_at", "DESC"]] });

const getDiagnosisForReview = async (diagnosisId) => {
  const diagnosis = await Diagnoses.findByPk(diagnosisId);
  if (!diagnosis) {
    throw new Error("Diagnosis not found");
  }

  return diagnosis;
};

const normalizeReviewText = (value) => {
  if (value === undefined || value === null) {
    return undefined;
  }

  const normalized = String(value).trim();
  return normalized.length > 0 ? normalized : null;
};

const updateDiagnosisReview = async ({ diagnosisId, reviewerId, status, treatment, agronomistNotes, diseaseName, symptoms }) => {
  const normalizedStatusInput = String(status || "").toUpperCase();
  const hasStatusTransition = Boolean(normalizedStatusInput);

  if (hasStatusTransition && !["APPROVED", "REJECTED"].includes(normalizedStatusInput)) {
    const error = new Error("Invalid diagnosis status");
    error.status = 400;
    error.code = "INVALID_DIAGNOSIS_STATUS";
    throw error;
  }

  return sequelize.transaction(async (transaction) => {
    const diagnosis = await Diagnoses.findByPk(diagnosisId, { transaction });
    if (!diagnosis) {
      const error = new Error("Diagnosis not found");
      error.status = 404;
      error.code = "DIAGNOSIS_NOT_FOUND";
      throw error;
    }

    const resolvedDiseaseName = normalizeCatalogName(diseaseName) || diagnosis.disease_name || null;
    const resolvedSymptoms = normalizeReviewText(symptoms) ?? (diagnosis.symptoms || null);
    const resolvedTreatment = normalizeReviewText(treatment) ?? (diagnosis.treatment || null);
    const resolvedAgronomistNotes = normalizeReviewText(agronomistNotes);
    const nextStatus = hasStatusTransition ? normalizedStatusInput : diagnosis.status;
    const nextValidated = hasStatusTransition ? normalizedStatusInput === "APPROVED" : diagnosis.validated;
    const nextValidatedBy = hasStatusTransition
      ? (normalizedStatusInput === "APPROVED" ? reviewerId || null : null)
      : diagnosis.validated_by;

    await diagnosis.update(
      {
        status: nextStatus,
        disease_name: resolvedDiseaseName,
        symptoms: resolvedSymptoms,
        treatment: resolvedTreatment,
        agronomist_notes: resolvedAgronomistNotes !== undefined ? resolvedAgronomistNotes : diagnosis.agronomist_notes,
        validated: nextValidated,
        validated_by: nextValidatedBy,
        updated_at: new Date(),
      },
      { transaction }
    );

    const refreshedDiagnosis = await diagnosis.reload({ transaction });
    if (!refreshedDiagnosis) {
      const error = new Error("Diagnosis not found after review update");
      error.status = 500;
      error.code = "DIAGNOSIS_RELOAD_FAILED";
      throw error;
    }

    return refreshedDiagnosis;
  });
};

const approveDiagnosis = async (diagnosisId, treatment, agronomistNotes) =>
  updateDiagnosisReview({ diagnosisId, status: "APPROVED", treatment, agronomistNotes });

const rejectDiagnosis = async (diagnosisId, agronomistNotes) =>
  updateDiagnosisReview({ diagnosisId, status: "REJECTED", agronomistNotes });

const getMyArticles = async (authorId) =>
  Article.findAll({ where: { author_id: authorId }, order: [["created_at", "DESC"]] });

const createArticle = async (authorId, authorName, payload) =>
  (async () => {
    const uploadedCoverImageUrl = await uploadArticleCover(payload.coverImageFile);

    return Article.create({
      author_id: authorId,
      author_name: authorName || "Agronomist",
      title: payload.title,
      content: payload.content,
      excerpt: payload.excerpt,
      cover_image_url: uploadedCoverImageUrl || null,
      source: "AGRONOMIST",
      tags: Array.isArray(payload.tags) ? payload.tags : [],
      published: payload.published !== undefined ? payload.published : true,
    });
  })();

const updateArticle = async (authorId, articleId, payload) => {
  const article = await Article.findOne({
    where: { id: articleId, author_id: authorId, source: "AGRONOMIST" },
  });

  if (!article) {
    throw new Error("Article not found");
  }

  if (payload.title !== undefined) article.title = payload.title;
  if (payload.content !== undefined) article.content = payload.content;
  if (payload.excerpt !== undefined) article.excerpt = payload.excerpt;
  if (payload.coverImageFile) {
    article.cover_image_url = await uploadArticleCover(payload.coverImageFile);
  } else if (payload.removeCoverImage === true) {
    article.cover_image_url = null;
  }
  if (payload.tags !== undefined) article.tags = Array.isArray(payload.tags) ? payload.tags : article.tags;
  if (payload.published !== undefined) article.published = Boolean(payload.published);
  article.updated_at = new Date();

  await article.save();
  return article;
};

const deleteArticle = async (authorId, articleId) => {
  const article = await Article.findOne({
    where: { id: articleId, author_id: authorId, source: "AGRONOMIST" },
  });

  if (!article) {
    throw new Error("Article not found");
  }

  await article.destroy();
  return article;
};

module.exports = {
  getDiagnosisQueue,
  getPendingDiagnoses,
  getDiagnosisForReview,
  getDiagnosisById: getDiagnosisForReview,
  updateDiagnosisReview,
  approveDiagnosis,
  rejectDiagnosis,
  getMyArticles,
  createArticle,
  updateArticle,
  deleteArticle,
};
