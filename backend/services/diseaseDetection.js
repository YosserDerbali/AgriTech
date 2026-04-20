const fs = require("fs/promises");
const os = require("os");
const path = require("path");
const { promisify } = require("util");
const { execFile } = require("child_process");

const execFileAsync = promisify(execFile);

const parseJsonPayload = (raw) => {
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (_error) {
    return null;
  }
};

const createDetectionError = (error, fallbackMessage) => {
  const stdoutRaw = error?.stdout ? String(error.stdout).trim() : "";
  const stderrRaw = error?.stderr ? String(error.stderr).trim() : "";

  const parsedStdout = parseJsonPayload(stdoutRaw);
  if (parsedStdout && parsedStdout.ok === false) {
    const detectionError = new Error(parsedStdout.error || fallbackMessage);
    detectionError.code = parsedStdout.code || "DISEASE_DETECTION_ERROR";
    detectionError.status = parsedStdout.status || 500;
    return detectionError;
  }

  const parsedStderr = parseJsonPayload(stderrRaw);
  if (parsedStderr && parsedStderr.ok === false) {
    const detectionError = new Error(parsedStderr.error || fallbackMessage);
    detectionError.code = parsedStderr.code || "DISEASE_DETECTION_ERROR";
    detectionError.status = parsedStderr.status || 500;
    return detectionError;
  }

  const message = stderrRaw || stdoutRaw || fallbackMessage;
  const detectionError = new Error(message);
  detectionError.code = "DISEASE_DETECTION_ERROR";
  detectionError.status = 500;
  return detectionError;
};

const detectDiseaseWithAIService = async ({ file, plantName, context }) => {
  if (!file?.buffer) {
    const error = new Error("Image file is required");
    error.code = "IMAGE_REQUIRED";
    error.status = 422;
    throw error;
  }

  if (!file.mimetype || !file.mimetype.startsWith("image/")) {
    const error = new Error("A valid image file is required");
    error.code = "INVALID_IMAGE_TYPE";
    error.status = 422;
    throw error;
  }

  const extension = path.extname(file.originalname || "") || ".jpg";
  const tempPath = path.join(os.tmpdir(), `agritech-disease-${Date.now()}${extension}`);
  const pythonScript = path.join(__dirname, "..", "ai", "disease_detection.py");
  const pythonExecutable = process.env.PYTHON_EXECUTABLE || "python3";

  try {
    await fs.writeFile(tempPath, file.buffer);

    const args = [pythonScript, tempPath];
    if (plantName && plantName.trim()) {
      args.push("--plant-name", plantName.trim());
    }
    if (context && context.trim()) {
      args.push("--context", context.trim());
    }
    if (file.mimetype && file.mimetype.trim()) {
      args.push("--mime-type", file.mimetype.trim());
    }

    const { stdout } = await execFileAsync(pythonExecutable, args, {
      timeout: 120000,
      maxBuffer: 1024 * 1024,
    });

    const parsed = parseJsonPayload((stdout || "").trim());
    if (!parsed?.ok) {
      const error = new Error(parsed?.error || "Disease detection failed");
      error.code = parsed?.code || "DISEASE_DETECTION_ERROR";
      error.status = parsed?.status || 500;
      throw error;
    }

    const confidence = Number(parsed.confidence);
    const safeConfidence = Number.isFinite(confidence)
      ? Math.max(0, Math.min(1, confidence))
      : null;

    const plantConfidence = Number(parsed.plant_confidence);
    const safePlantConfidence = Number.isFinite(plantConfidence)
      ? Math.max(0, Math.min(1, plantConfidence))
      : null;

    return {
      plant_name: (parsed.plant_name || "").trim(),
      disease_name: (parsed.disease_name || "").trim(),
      confidence: safeConfidence,
      plant_confidence: safePlantConfidence,
      symptoms: (parsed.symptoms || "").trim() || null,
      treatment: (parsed.treatment || "").trim() || null,
      model_version: (parsed.model_version || "stub-v1").trim(),
      model_name: (parsed.model_name || "unknown_model").trim(),
      model_type: (parsed.model_type || "unknown").trim(),
      provider: (parsed.provider || "unknown").trim(),
      fallback_used: Boolean(parsed.fallback_used),
    };
  } catch (error) {
    throw createDetectionError(error, error.message || "Disease detection failed");
  } finally {
    await fs.unlink(tempPath).catch(() => null);
  }
};

module.exports = {
  detectDiseaseWithAIService,
};
