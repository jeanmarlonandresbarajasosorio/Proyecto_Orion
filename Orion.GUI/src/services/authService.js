import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/auth";

export const googleLogin = async (data) => {
  const res = await axios.post(`${API_URL}/google`, data);
  return res;
};
