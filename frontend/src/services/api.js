import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

//  Request Interceptor (token attach)
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

//  Response Interceptor (auto logout if token expired)
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      // token invalid / expired
      localStorage.removeItem("token");

      // redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;