const { fn, col, where } = require("sequelize");
const { Plant } = require("../models/Plant");
const { Disease } = require("../models/Disease");

const normalizeCatalogName = (value) => (value || "").trim().replace(/\s+/g, " ");

const lookupByLowerName = async (Model, name, transaction) => {
  const normalized = normalizeCatalogName(name);
  if (!normalized) {
    return null;
  }

  return Model.findOne({
    where: where(fn("LOWER", col("name")), normalized.toLowerCase()),
    transaction,
  });
};

const resolvePlantRecord = async ({ plantName, transaction }) => {
  const normalized = normalizeCatalogName(plantName);
  if (!normalized) {
    return null;
  }

  const existing = await lookupByLowerName(Plant, normalized, transaction);
  if (existing) {
    return existing;
  }

  return Plant.create(
    {
      name: normalized,
      description: null,
    },
    { transaction }
  );
};

const resolveDiseaseRecord = async ({ plantId, diseaseName, symptoms, treatment, transaction }) => {
  const normalized = normalizeCatalogName(diseaseName);
  if (!plantId || !normalized) {
    return null;
  }

  const existingDiseases = await Disease.findAll({
    where: { plant_id: plantId },
    transaction,
  });

  const existing = existingDiseases.find(
    (disease) => normalizeCatalogName(disease.name).toLowerCase() === normalized.toLowerCase()
  );

  if (existing) {
    const updates = {};
    if (!existing.symptoms && normalizeCatalogName(symptoms)) {
      updates.symptoms = normalizeCatalogName(symptoms);
    }
    if (!existing.treatment && normalizeCatalogName(treatment)) {
      updates.treatment = normalizeCatalogName(treatment);
    }

    if (Object.keys(updates).length > 0) {
      await existing.update(updates, { transaction });
    }

    return existing;
  }

  return Disease.create(
    {
      plant_id: plantId,
      name: normalized,
      symptoms: normalizeCatalogName(symptoms) || null,
      treatment: normalizeCatalogName(treatment) || null,
    },
    { transaction }
  );
};

module.exports = {
  normalizeCatalogName,
  resolvePlantRecord,
  resolveDiseaseRecord,
};