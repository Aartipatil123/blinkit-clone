import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import fetchUserDetails from "./utils/fetchUserDetails";
import { setUserDetails } from "./store/userSlice";
import { setAllCategory, setAllSubCategory, setLoadingCategory } from "./store/productSlice";

import Axios from "./utils/Axios";
import SummaryApi from "./common/SummaryApi";

function App() {
  const dispatch = useDispatch();

  // =========================
  // 🔐 FETCH USER
  // =========================
  const fetchUser = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) return;

      const userData = await fetchUserDetails();

      if (userData?.success && userData?.data) {
        dispatch(setUserDetails(userData.data));
      }
    } catch (error) {
      console.log("User Error:", error?.response?.data || error.message);
    }
  };

  // =========================
  // 📦 FETCH CATEGORY
  // =========================
  const fetchCategory = async () => {
    try {
      dispatch(setLoadingCategory(true))
      const res = await Axios({
        ...SummaryApi.getCategory,
      });

      const { data: responseData } = res;

      if (responseData.success) {
        dispatch(setAllCategory(responseData.data));
      }
    } catch (error) {
      console.log("Category Error:", error?.response?.data || error.message);
    }finally{
     dispatch(setLoadingCategory(false))
  }
  };

  // =========================
  // 📦 FETCH SUBCATEGORY
  // =========================
  const fetchSubCategory = async () => {
  try {
    
    const res = await Axios({
      ...SummaryApi.getSubCategory,
    });

    const { data: responseData } = res;

    // 🔥 YAHAN ADD KARO
    console.log("SubCategory API Response:", responseData);

    if (responseData.success) {
      dispatch(setAllSubCategory(responseData.data));
    }

  } catch (error) {
    console.log("SubCategory Error:", error?.response?.data || error.message);
  }
};

  // =========================
  // 🚀 INITIAL LOAD
  // =========================
  useEffect(() => {
    fetchUser();
    fetchCategory();
    fetchSubCategory();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 🔝 HEADER */}
      <Header />

      {/* 📄 MAIN CONTENT */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* 🔚 FOOTER */}
      <Footer />

      {/* 🔔 TOAST */}
      <Toaster position="top-center" />
    </div>
  );
}

export default App;