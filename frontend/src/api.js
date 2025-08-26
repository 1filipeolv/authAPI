import axios from "axios";

const api = axios.create({
  baseURL: "https://authapiback.vercel.app/api/auth", 
});

export default api;
