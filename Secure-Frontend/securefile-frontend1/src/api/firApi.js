import axios from "axios";
import { FIR_API_URL } from "../config";

const FIR_URL = FIR_API_URL;

export const createFIR = async (data, token) => {
  const response = await axios.post(FIR_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getAllFIR = async (token) => {
  const response = await axios.get(FIR_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
