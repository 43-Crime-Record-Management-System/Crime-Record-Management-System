import axios from "axios";
import { ANALYTICS_API_URL } from "../config";

const ANALYTICS_URL = ANALYTICS_API_URL;

export const getDashboardStats = async (token) => {
  const response = await axios.get(`${ANALYTICS_URL}/analytics/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
