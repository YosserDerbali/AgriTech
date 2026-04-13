import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create({
  baseURL: "http://192.168.48.122:3000", // replace with your PC IP
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