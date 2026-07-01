import axios from "axios";
import { CRIMINAL_API_URL } from "../config";

const CRIMINAL_URL = CRIMINAL_API_URL;

export const addCriminal = async (data, token) => {
  const response = await axios.post(CRIMINAL_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getCriminals = async (token) => {
  const response = await axios.get(CRIMINAL_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
