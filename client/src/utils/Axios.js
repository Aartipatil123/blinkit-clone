import axios from "axios";
import SummaryApi, { baseURL } from "../common/SummaryApi";

const Axios = axios.create({
    baseURL: baseURL,
    withCredentials: true
});

// Send access token in request header
Axios.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// Refresh access token when access token expires
Axios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {

        const originRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originRequest.retry
        ) {
            originRequest.retry = true;

            const refreshToken = localStorage.getItem("refreshToken");

            if (refreshToken) {

                const newAccessToken =
                    await refreshAccessToken(refreshToken);

                if (newAccessToken) {

                    originRequest.headers.Authorization =
                        `Bearer ${newAccessToken}`;

                    return Axios(originRequest);
                }
            }
        }

        return Promise.reject(error);
    }
);


const refreshAccessToken = async (refreshToken) => {

    try {

        const response = await Axios({
            ...SummaryApi.refreshToken,
            headers: {
                Authorization: `Bearer ${refreshToken}`
            }
        });

        const accessToken =
            response.data.data.accessToken;

        localStorage.setItem(
            "accessToken",
            accessToken
        );

        return accessToken;

    } catch (error) {

        console.log(error);

    }
};


export default Axios;