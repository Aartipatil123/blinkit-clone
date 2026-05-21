import SummaryApi from "../common/SummaryApi";
import Axios from "./Axios";

const fetchUserDetails = async () => {
    try {
        // access token check first
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            return {
                success: false,
                error: true,
                message: "No access token found"
            };
        }

        const response = await Axios({
            ...SummaryApi.userDetails
        });

        return response.data;

    } catch (error) {
        console.log(
            "Fetch User Error:",
            error?.response?.data || error.message
        );

        return {
            success: false,
            error: true,
            message: "User not logged in"
        };
    }
};

export default fetchUserDetails;