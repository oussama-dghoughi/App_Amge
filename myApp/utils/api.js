import axios from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";

const buildApiBaseUrl = () => {
  // Highest priority: explicit env (works in dev + EAS builds/updates)
  const envUrl =
    process.env.EXPO_PUBLIC_API_URL || Constants.expoConfig?.extra?.apiUrl;

  if (envUrl) {
    const trimmed = envUrl.replace(/\/+$/, "");
    return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
  }

  // Otherwise, assemble from host + port (helps when you pick any local port)
  const port =
    process.env.EXPO_PUBLIC_API_PORT ||
    Constants.expoConfig?.extra?.apiPort ||
    "5000";

  const host =
    Constants.expoConfig?.hostUri?.split(":")[0] ||
    (Platform.OS === "android" ? "10.0.2.2" : "localhost");

  return `http://${host}:${port}/api`;
};

export const API_BASE_URL = buildApiBaseUrl();

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
