import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";

import uploadImage from "../utils/UploadImage";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";

const UploadCategoryModel = ({ close, fetchData }) => {

  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const [categoryData, setCategoryData] = useState({
    name: "",
    image: ""
  });

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {

    const { name, value } = e.target;

    setCategoryData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // =========================
  // IMAGE UPLOAD
  // =========================
  const handleUploadCategoryImage = async (e) => {

    try {

      const file = e.target.files[0];

      if (!file) return;

      setImageLoading(true);

      const response = await uploadImage(file);

      console.log("Upload Response :", response);

      // ✅ Correct URL extraction
      const imageUrl =
        response?.data?.data?.secure_url ||
        response?.data?.data?.url ||
        response?.data?.secure_url ||
        response?.data?.url ||
        "";

      console.log("Image URL :", imageUrl);

      if (!imageUrl) {

        toast.error("Image URL not found");
        return;
      }

      setCategoryData((prev) => ({
        ...prev,
        image: imageUrl
      }));

      toast.success("Image uploaded successfully");

    } catch (error) {

      console.log("Image Upload Error :", error);

      toast.error("Image upload failed");

    } finally {

      setImageLoading(false);
    }
  };

  // =========================
  // SUBMIT CATEGORY
  // =========================
  const handleSubmit = async (e) => {

    e.preventDefault();

    console.log("Submitting Data :", categoryData);

    // Validation
    if (
      !categoryData.name.trim() ||
      !categoryData.image
    ) {

      toast.error("All fields are required");
      return;
    }

    try {

      setLoading(true);

      // ✅ FIXED API NAME
      const res = await Axios({
        ...SummaryApi.addCategory,
        data: categoryData,
        withCredentials: true
      });

      console.log("API Response :", res);

      const { data: responseData } = res;

      if (responseData.success) {

        toast.success(
          responseData.message || "Category Added Successfully"
        );

        // Reset Form
        setCategoryData({
          name: "",
          image: ""
        });

        // Close Modal
        if (close) {
          close();
        }

        // Refresh Data
        if (fetchData) {
          fetchData();
        }

      } else {

        toast.error(responseData.message);
      }

    } catch (error) {

      console.log(
        "Category Add Error :",
        error?.response?.data || error
      );

      AxiosToastError(error);

    } finally {

      setLoading(false);
    }
  };

  return (
    <section className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-5">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b pb-3">

          <h2 className="text-xl font-semibold">
            Add Category
          </h2>

          <button
            type="button"
            onClick={close}
            className="hover:text-red-500 transition"
          >
            <IoClose size={26} />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="mt-5 grid gap-5"
        >

          {/* CATEGORY NAME */}
          <div className="grid gap-2">

            <label className="font-medium">
              Category Name
            </label>

            <input
              type="text"
              name="name"
              value={categoryData.name}
              onChange={handleChange}
              placeholder="Enter category name"
              className="w-full p-3 border rounded-lg outline-none focus:border-blue-500 bg-blue-50"
            />
          </div>

          {/* IMAGE */}
          <div className="grid gap-3">

            <label className="font-medium">
              Upload Image
            </label>

            <div className="h-36 w-36 border rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">

              {categoryData.image ? (
                <img
                  src={categoryData.image}
                  alt="category"
                  className="w-full h-full object-cover"
                />
              ) : (
                <p className="text-sm text-gray-500">
                  No Image
                </p>
              )}

            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleUploadCategoryImage}
              className="border p-2 rounded-lg cursor-pointer"
            />

            {imageLoading && (
              <p className="text-sm text-blue-500">
                Uploading image...
              </p>
            )}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={
              loading ||
              imageLoading ||
              !categoryData.name ||
              !categoryData.image
            }
            className={`w-full py-3 rounded-lg font-semibold text-white transition ${
              categoryData.name &&
              categoryData.image
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading
              ? "Adding..."
              : "Add Category"}
          </button>

        </form>
      </div>
    </section>
  );
};

export default UploadCategoryModel;