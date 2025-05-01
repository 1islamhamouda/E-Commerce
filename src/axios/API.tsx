import axios from "axios";

const API = axios.create({
  baseURL: "https://ecommerce.routemisr.com/api/v1",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`, // Get token from local storage
  },
});

export default API;
