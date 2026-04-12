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

const buildTranscriptionErrorMessage = (error, fallbackMessage) => {
  const stdoutRaw = error?.stdout ? String(error.stdout).trim() : "";
  const stderrRaw = error?.stderr ? String(error.stderr).trim() : "";

  const parsedStdout = parseJsonPayload(stdoutRaw);
  if (parsedStdout && parsedStdout.ok === false && parsedStdout.error) {
    return parsedStdout.error;
  }

  const parsedStderr = parseJsonPayload(stderrRaw);
  if (parsedStderr && parsedStderr.ok === false && parsedStderr.error) {
    return parsedStderr.error;
  }

  if (stderrRaw) {
    return stderrRaw;
  }

  if (stdoutRaw && !parsedStdout) {
    return stdoutRaw;
  }

  return fallbackMessage;
};

const createTranscriptionError = (error, fallbackMessage) => {
  const stdoutRaw = error?.stdout ? String(error.stdout).trim() : "";
  const stderrRaw = error?.stderr ? String(error.stderr).trim() : "";

  const parsedStdout = parseJsonPayload(stdoutRaw);
  if (parsedStdout && parsedStdout.ok === false) {
    const transcriptionError = new Error(parsedStdout.error || fallbackMessage);
    transcriptionError.code = parsedStdout.code || "TRANSCRIPTION_ERROR";
    transcriptionError.status = parsedStdout.status || 500;
    return transcriptionError;
  }

  const parsedStderr = parseJsonPayload(stderrRaw);
  if (parsedStderr && parsedStderr.ok === false) {
    const transcriptionError = new Error(parsedStderr.error || fallbackMessage);
    transcriptionError.code = parsedStderr.code || "TRANSCRIPTION_ERROR";
    transcriptionError.status = parsedStderr.status || 500;
    return transcriptionError;
  }

  const transcriptionError = new Error(buildTranscriptionErrorMessage(error, fallbackMessage));
  transcriptionError.code = error?.code || "TRANSCRIPTION_ERROR";
  transcriptionError.status = error?.status || 500;
  return transcriptionError;
};

const transcribeWithAIService = async (file) => {
  if (!file?.buffer) {
    throw new Error("Audio file is required");
  }

  const extension = path.extname(file.originalname || "") || ".audio";
  const tempPath = path.join(os.tmpdir(), `agritech-voice-${Date.now()}${extension}`);
  const pythonScript = path.join(__dirname, "..", "ai", "speech_recognition.py");
  const pythonExecutable = process.env.PYTHON_EXECUTABLE || "python3";

  try {
    await fs.writeFile(tempPath, file.buffer);

    console.info("[speechRecognition] Starting transcription", {
      pythonExecutable,
      pythonScript,
      tempPath,
      originalName: file.originalname,
      size: file.size,
    });

    const { stdout } = await execFileAsync(
      pythonExecutable,
      [pythonScript, tempPath],
      {
        timeout: 150000,
        maxBuffer: 1024 * 1024,
      }
    );

    const parsed = JSON.parse((stdout || "").trim());
    if (!parsed?.ok) {
      throw new Error(parsed?.error || "Failed to transcribe audio");
    }

    return (parsed.text || "").trim();
  } catch (error) {
    const transcriptionError = createTranscriptionError(error, error.message || "Failed to transcribe audio");

    console.error("[speechRecognition] Transcription failed", {
      message: transcriptionError.message,
      code: transcriptionError.code,
      status: transcriptionError.status,
      rawCode: error?.code,
      killed: error?.killed,
      signal: error?.signal,
      stdout: error?.stdout ? String(error.stdout).trim() : "",
      stderr: error?.stderr ? String(error.stderr).trim() : "",
    });

    throw transcriptionError;
  } finally {
    await fs.unlink(tempPath).catch(() => null);
  }
};

module.exports = {
  transcribeWithAIService,
};
