const getEnv = (key) => {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    const value = import.meta.env[key];

    if (!value) {
      throw new Error(`Missing environment variable: ${key}`);
    }

    return value;
  }

  throw new Error(`Environment variables are not available: ${key}`);
};

export const API_BASE_URL = getEnv("VITE_API_BASE_URL");
export const AUTH_API_URL = getEnv("VITE_AUTH_API_URL");
export const USER_API_URL = getEnv("VITE_USER_API_URL");
export const FIR_API_URL = getEnv("VITE_FIR_API_URL");
export const CRIMINAL_API_URL = getEnv("VITE_CRIMINAL_API_URL");
export const EVIDENCE_API_URL = getEnv("VITE_EVIDENCE_API_URL");
export const NOTIFICATION_API_URL = getEnv("VITE_NOTIFICATION_API_URL");
export const ANALYTICS_API_URL = getEnv("VITE_ANALYTICS_API_URL");