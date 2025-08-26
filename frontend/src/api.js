import axios from "axios";

const api = axios.create({
  baseURL: "https://authapiback.vercel.app/api", 
});

export default api;
