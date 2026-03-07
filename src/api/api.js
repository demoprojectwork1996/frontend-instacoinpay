import axios from "axios";

const API = axios.create({
  baseURL: "https://versel-backend-1z91.onrender.com/api",
  withCredentials: true,              // ✅ REQUIRED for Render + auth
  timeout: 30000                      // ✅ Prevent silent failures
});

// 🔐 Attach JWT automatically
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ DEBUG (remove later if you want)
    console.log("➡️ API REQUEST:", req.method?.toUpperCase(), req.url);

    return req;
  },
  (error) => {
    console.error("❌ REQUEST ERROR:", error);
    return Promise.reject(error);
  }
);

// 🔁 Global response error visibility (VERY IMPORTANT)
API.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error(
      "❌ API RESPONSE ERROR:",
      error.response?.status,
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

export default API;
