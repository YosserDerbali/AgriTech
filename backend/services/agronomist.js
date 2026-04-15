const { sequelize } = require("../config/database");
const { Diagnoses } = require("../models/Diagnoses");
const { Prediction } = require("../models/Prediction");
const { Article } = require("../models/Article");
const { resolveDiseaseRecord, resolvePlantRecord, normalizeCatalogName } = require("./taxonomy");

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

const syncPredictionStatus = async ({ diagnosis, status, reviewerId, transaction }) => {
  if (!diagnosis?.image_id) {
    return;
  }

  const latestPrediction = await Prediction.findOne({
    where: { image_id: diagnosis.image_id },
    order: [["created_at", "DESC"]],
    transaction,
  });

  if (!latestPrediction) {
    return;
  }

  await latestPrediction.update(
    {
      status,
      validated: status === "APPROVED",
      validated_by: reviewerId || null,
    },
    { transaction }
  );
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

    const plantRecord = diagnosis.plant_id ? null : await resolvePlantRecord({ plantName: diagnosis.plant_name, transaction });
    const resolvedPlantId = diagnosis.plant_id || plantRecord?.id || null;
    const resolvedDiseaseName = normalizeCatalogName(diseaseName) || diagnosis.disease_name || null;
    const resolvedSymptoms = normalizeReviewText(symptoms) ?? (diagnosis.symptoms || null);
    const resolvedTreatment = normalizeReviewText(treatment) ?? (diagnosis.treatment || null);
    const resolvedAgronomistNotes = normalizeReviewText(agronomistNotes);
    const nextStatus = hasStatusTransition ? normalizedStatusInput : diagnosis.status;

    let diseaseRecord = null;
    if (resolvedPlantId && resolvedDiseaseName) {
      diseaseRecord = await resolveDiseaseRecord({
        plantId: resolvedPlantId,
        diseaseName: resolvedDiseaseName,
        symptoms: resolvedSymptoms,
        treatment: resolvedTreatment,
        transaction,
      });
    }

    await diagnosis.update(
      {
        status: nextStatus,
        disease_name: diseaseRecord?.name || resolvedDiseaseName,
        disease_id: diseaseRecord?.id || diagnosis.disease_id || null,
        plant_id: resolvedPlantId,
        symptoms: diseaseRecord?.symptoms || resolvedSymptoms,
        treatment: resolvedTreatment,
        agronomist_notes: resolvedAgronomistNotes !== undefined ? resolvedAgronomistNotes : diagnosis.agronomist_notes,
        updated_at: new Date(),
      },
      { transaction }
    );

    if (hasStatusTransition) {
      await syncPredictionStatus({ diagnosis, status: normalizedStatusInput, reviewerId, transaction });
    }

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
  Article.create({
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
  if (payload.coverImageUrl !== undefined) article.cover_image_url = payload.coverImageUrl || null;
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
