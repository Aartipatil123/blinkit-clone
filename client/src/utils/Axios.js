import axios from "axios";
import SummaryApi, { baseURL } from "../common/SummaryApi";

const Axios = axios.create({
    baseURL: baseURL,
    withCredentials: true
});

/*
========================================
REQUEST INTERCEPTOR
========================================
*/
Axios.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/*
========================================
REFRESH ACCESS TOKEN FUNCTION
========================================
*/
const refreshAccessToken = async () => {
    try {
        const response = await Axios({
            ...SummaryApi.refreshToken
        });

        const newAccessToken = response?.data?.data?.accessToken;

        if (newAccessToken) {
            localStorage.setItem("accessToken", newAccessToken);
            return newAccessToken;
        }

        return null;

    } catch (error) {
        console.log("Refresh Token Error:", error?.response?.data || error.message);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        window.location.href = "/login";

        return null;
    }
};

/*
========================================
RESPONSE INTERCEPTOR
========================================
*/
Axios.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        /*
        IMPORTANT:
        refresh-token API khud agar fail ho jaye
        to infinite loop nahi chalna chahiye
        */
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/refresh-token")
        ) {
            originalRequest._retry = true;

            const newAccessToken = await refreshAccessToken();

            if (newAccessToken) {
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return Axios(originalRequest);
            }
        }

        return Promise.reject(error);
    }
);

export default Axios;