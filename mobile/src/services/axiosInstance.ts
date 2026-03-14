import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create({
  baseURL: "http://172.20.10.8:3000", // replace with your PC IP
});

// Request interceptor
axiosInstance.interceptors.request.use(
   async (config) => {
    const token = await AsyncStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;