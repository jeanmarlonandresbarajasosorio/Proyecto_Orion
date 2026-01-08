import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const sendActaTarjetaEmail = (data) => {
  return axios.post(`${API_URL}/emails/acta-tarjeta`, data);
};
