import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/actas`;

export const createActaTarjeta = (data) =>
  axios.post(API_URL, data);
