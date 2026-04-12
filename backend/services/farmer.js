const { Article } = require("../models/Article");
const { Diagnoses } = require("../models/Diagnoses");
const { supabase } = require("../config/supabaseClient");
const { v4: uuidv4 } = require("uuid");

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

  // Generate unique file name
  const fileExt = file.originalname.split(".").pop();
  const fileName = `${uuidv4()}.${fileExt}`;

  // Upload to Supabase
  const { error: uploadError } = await supabase.storage
    .from("plant-images")
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
    });

  if (uploadError) {
    throw uploadError;
  }

  // Get public URL
  const { data: publicUrlData } =  await supabase.storage
    .from("plant-images")
    .getPublicUrl(fileName);
  const imageUrl = publicUrlData.publicUrl;
  // Placeholder AI result
  const aiResult = {
    plant_name: plantName || "Unknown Plant",
    disease_name: "Analyzing...",
    confidence: null,
  };

  // Save to DB
  try {
  const diagnosis = await Diagnoses.create({
    user_id: userId,
    image_url: imageUrl,
    plant_name: aiResult.plant_name,
    disease_name: aiResult.disease_name,
    confidence: aiResult.confidence,
    status: "PENDING",
    treatment: null,
    context: context || null,
    agronomist_notes: null,
  });
  return diagnosis;
  } catch (dbError) {
    console.error("Error saving diagnosis to DB:", dbError);
    throw new Error("Failed to save diagnosis");
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