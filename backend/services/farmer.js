const { Article } = require("../models/Article");
const { Diagnoses } = require("../models/Diagnoses");
const { AiModel } = require("../models/AiModel");
const { supabase } = require("../config/supabaseClient");
const { v4: uuidv4 } = require("uuid");
const { detectDiseaseWithAIService } = require("./diseaseDetection");

const updateAiModelUsage = async (aiResult) => {
  const modelName = (aiResult?.model_name || "").trim();
  const modelVersion = (aiResult?.model_version || "").trim();
  if (!modelName || !modelVersion) {
    return;
  }

  const aiModel = await AiModel.findOne({
    where: {
      name: modelName,
      version: modelVersion,
      isEnabled: true,
    },
  });

  if (!aiModel) {
    return;
  }

  const currentTotal = Number(aiModel.totalPredictions) || 0;
  await aiModel.update({
    totalPredictions: currentTotal + 1,
    lastUpdated: new Date(),
  });
};

const getPublishedArticles = async () => {
  return await Article.findAll({
    where: { published: true }, // adjust if you use status instead
    order: [["created_at", "DESC"]],
  });
};

const getFarmerDiagnoses = async (userId) => {
  
  return await Diagnoses.findAll({
    where: { user_id: userId },
    order: [["created_at", "DESC"]],
  });
};

const getArticleById = async (articleId) => {
  return await Article.findOne({
    where: {
      id: articleId,
      isPublished: true, // important → farmer can only access published articles
    },
  });
};
const createDiagnosis = async ({ userId, file, context, plantName }) => {
  if (!file) {
    throw new Error("Image file is required");
  }

  if (!file.mimetype || !file.mimetype.startsWith("image/")) {
    const error = new Error("A valid image file is required");
    error.status = 422;
    throw error;
  }

  // Generate unique file name
  const fileExt = (file.originalname || "").split(".").pop() || "jpg";
  const fileName = `${uuidv4()}.${fileExt}`;

  // Upload to Supabase
  const { error: uploadError } = await supabase.storage
    .from("plant-images")
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
    });

  if (uploadError) {
    const error = new Error(`Supabase upload failed: ${uploadError.message || 'Unknown error'}`);
    error.code = "SUPABASE_UPLOAD_FAILED";
    error.status = 502;
    throw error;
  }

  // Get public URL
  const { data: publicUrlData } =  await supabase.storage
    .from("plant-images")
    .getPublicUrl(fileName);
  const imageUrl = publicUrlData?.publicUrl;
  if (!imageUrl) {
    const error = new Error("Supabase public URL generation failed");
    error.code = "SUPABASE_PUBLIC_URL_FAILED";
    error.status = 502;
    throw error;
  }

  let aiResult;
  try {
    aiResult = await detectDiseaseWithAIService({
      file,
      plantName,
      context,
    });
  } catch (aiError) {
    // Avoid leaving orphan files when inference fails.
    await supabase.storage.from("plant-images").remove([fileName]).catch(() => null);
    if (!aiError.code) {
      aiError.code = "AI_DETECTION_FAILED";
    }
    if (!aiError.status) {
      aiError.status = 502;
    }
    throw aiError;
  }

  const userPlantName = (plantName || "").trim();
  const aiPlantName = (aiResult?.plant_name || "").trim();
  const aiDiseaseName = (aiResult?.disease_name || "").trim();
  const plantConfidenceRaw = Number(aiResult?.plant_confidence);
  const plantConfidence = Number.isFinite(plantConfidenceRaw)
    ? Math.max(0, Math.min(1, plantConfidenceRaw))
    : 0;
  const plantNameOverrideThresholdRaw = Number(process.env.PLANT_NAME_OVERRIDE_THRESHOLD);
  const plantNameOverrideThreshold = Number.isFinite(plantNameOverrideThresholdRaw)
    ? Math.max(0, Math.min(1, plantNameOverrideThresholdRaw))
    : 0.6;

  const canOverrideUserTitle =
    Boolean(userPlantName) &&
    Boolean(aiPlantName) &&
    plantConfidence >= plantNameOverrideThreshold &&
    aiPlantName.toLowerCase() !== userPlantName.toLowerCase();

  const finalPlantName = canOverrideUserTitle
    ? aiPlantName
    : (userPlantName || aiPlantName || "Unknown Plant");

  // Save to DB
  try {
    const diagnosis = await Diagnoses.create({
      user_id: userId,
      image_url: imageUrl,
      plant_name: finalPlantName,
      disease_name: aiDiseaseName || null,
      symptoms: aiResult?.symptoms || null,
      confidence: aiResult.confidence,
      status: "PENDING",
      treatment: aiResult?.treatment || null,
      context: context || null,
      agronomist_notes: null,
      ai_model_version: aiResult?.model_version || null,
      validated: false,
      validated_by: null,
    });

    // Best-effort analytics and training data capture.
    await Promise.allSettled([
      updateAiModelUsage(aiResult),
    ]);

    const diagnosisPayload = diagnosis.toJSON();
    diagnosisPayload.ai_metadata = {
      provider: aiResult?.provider || null,
      model_name: aiResult?.model_name || null,
      model_type: aiResult?.model_type || null,
      model_version: aiResult?.model_version || null,
      fallback_used: Boolean(aiResult?.fallback_used),
      plant_confidence: Number.isFinite(Number(aiResult?.plant_confidence))
        ? Math.max(0, Math.min(1, Number(aiResult.plant_confidence)))
        : null,
      plant_name_override_applied: canOverrideUserTitle,
      plant_name_override_threshold: plantNameOverrideThreshold,
      plant_id: null,
      disease_id: null,
    };

    return diagnosisPayload;
  } catch (dbError) {
    console.error("Error saving diagnosis to DB:", dbError);
    const error = new Error("Failed to save diagnosis");
    error.code = "DIAGNOSIS_DB_SAVE_FAILED";
    error.status = 500;
    throw error;
  }
  
};
const getDiagnosisById = async (diagnosisId, userId) => {
  // Ensure the diagnosis belongs to the current user
  const diagnosis = await Diagnoses.findOne({
    where: {
      id: diagnosisId,
      user_id: userId,
    },
  });

  if (!diagnosis) {
    throw new Error("Diagnosis not found or you do not have access.");
  }

  return diagnosis;
};

module.exports = {
  getPublishedArticles,
  getFarmerDiagnoses,
  getArticleById,
  createDiagnosis,
  getDiagnosisById
};