import Constants from "expo-constants";
import { Platform } from "react-native";

const BACKEND_PORT = 3000;

const normalizeHost = (value: string | null | undefined): string | null => {
  if (!value) {
    return null;
  }

  try {
    return new URL(value.includes("://") ? value : `http://${value}`).hostname;
  } catch {
    const hostname = value.split(":")[0]?.split("/")[0]?.trim();
    return hostname || null;
  }
};

const getExpoHost = (): string | null => {
  const manifest = Constants.manifest as { debuggerHost?: string; hostUri?: string } | null;
  const manifest2 = Constants.manifest2 as
    | { extra?: { expoGo?: { developer?: { hostUri?: string } } } }
    | null;

  return (
    normalizeHost(Constants.expoConfig?.hostUri) ||
    normalizeHost(manifest?.hostUri) ||
    normalizeHost(manifest?.debuggerHost) ||
    normalizeHost(manifest2?.extra?.expoGo?.developer?.hostUri)
  );
};

const getFallbackHost = () => {
  if (Platform.OS === "android") {
    return "10.0.2.2";
  }

  return "localhost";
};

const joinUrl = (baseUrl: string, path = "") => {
  const trimmedBase = baseUrl.replace(/\/$/, "");
  const trimmedPath = path ? `/${path.replace(/^\//, "")}` : "";
  return `${trimmedBase}${trimmedPath}`;
};

export const getApiBaseUrl = (path = "") => {
  const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

  if (configuredUrl) {
    return joinUrl(configuredUrl, path);
  }

  const host = getExpoHost() || getFallbackHost();
  return joinUrl(`http://${host}:${BACKEND_PORT}`, path);
};
