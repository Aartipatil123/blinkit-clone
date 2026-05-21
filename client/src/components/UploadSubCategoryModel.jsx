import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import uploadImage from "../utils/UploadImage";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";

const UploadSubCategoryModel = ({ close, fetchData }) => {

  const allCategory = useSelector(
    (state) => state.product.allCategory
  );

  const [loading, setLoading] = useState(false);

  const [subCategoryData, setSubCategoryData] = useState({
    name: "",
    image: "",
    category: []
  });

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setSubCategoryData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // =========================
  // IMAGE UPLOAD
  // =========================
  const handleUploadSubCategoryImage = async (e) => {
    try {
      const file = e.target.files[0];

      if (!file) return;

      setLoading(true);

      const response = await uploadImage(file);

      const imageUrl =
        response?.data?.url ||
        response?.data?.data?.url ||
        response?.url ||
        "";

      if (!imageUrl) {
        toast.error("Image URL not found");
        return;
      }

      setSubCategoryData((prev) => ({
        ...prev,
        image: imageUrl
      }));

      toast.success("Image uploaded successfully");

    } catch (error) {
      toast.error("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SELECT CATEGORY
  // =========================
  const handleSelectCategory = (e) => {
    const value = e.target.value;

    if (!value) return;

    const categoryDetails = allCategory.find(
      (el) => el._id === value
    );

    if (!categoryDetails) return;

    // prevent duplicate
    const alreadyExists = subCategoryData.category.some(
      (el) => el._id === value
    );

    if (alreadyExists) {
      toast.error("Category already selected");
      return;
    }

    setSubCategoryData((prev) => ({
      ...prev,
      category: [...prev.category, categoryDetails]
    }));
  };

  // =========================
  // REMOVE CATEGORY
  // =========================
  const handleRemoveCategorySelected = (categoryId) => {

    const filteredCategory = subCategoryData.category.filter(
      (el) => el._id !== categoryId
    );

    setSubCategoryData((prev) => ({
      ...prev,
      category: filteredCategory
    }));
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !subCategoryData.name.trim() ||
      !subCategoryData.image ||
      subCategoryData.category.length === 0
    ) {
      toast.error("All fields are required");
      return;
    }

    try {

      setLoading(true);

      const payload = {
        name: subCategoryData.name,
        image: subCategoryData.image,
        category: subCategoryData.category.map(
          (cat) => cat._id
        )
      };

      const res = await Axios({
        ...SummaryApi.createSubCategory,
        data: payload
      });

      const { data: responseData } = res;

      if (responseData.success) {

        toast.success(
          responseData.message || "Sub Category Added"
        );

        // reset form
        setSubCategoryData({
          name: "",
          image: "",
          category: []
        });

        // close modal
        if (close) {
          close();
        }

        // refresh data
        if (fetchData) {
          fetchData();
        }
      }

    } catch (error) {

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
            Add Sub Category
          </h2>

          <button
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

          {/* SUB CATEGORY NAME */}
          <div className="grid gap-2">

            <label className="font-medium">
              Sub Category Name
            </label>

            <input
              type="text"
              name="name"
              value={subCategoryData.name}
              onChange={handleChange}
              placeholder="Enter sub category name"
              className="w-full p-3 border rounded-lg outline-none focus:border-blue-500 bg-blue-50"
            />
          </div>

          {/* SELECT CATEGORY */}
          <div className="grid gap-2">

            <label className="font-medium">
              Select Category
            </label>

            {/* SELECTED CATEGORY */}
            <div className="flex flex-wrap gap-2">

              {subCategoryData.category.map((cat) => (
                <div
                  key={cat._id}
                  className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full"
                >
                  <p className="text-sm">
                    {cat.name}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveCategorySelected(cat._id)
                    }
                    className="hover:text-red-500"
                  >
                    <IoClose size={16} />
                  </button>
                </div>
              ))}

            </div>

            {/* CATEGORY DROPDOWN */}
            <select
              value=""
              onChange={handleSelectCategory}
              className="w-full p-3 border rounded-lg outline-none focus:border-blue-500 bg-blue-50"
            >
              <option value="">
                Select Category
              </option>

              {allCategory.map((cat) => (
                <option
                  key={cat._id}
                  value={cat._id}
                >
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* IMAGE */}
          <div className="grid gap-3">

            <label className="font-medium">
              Upload Image
            </label>

            <div className="h-36 w-36 border rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">

              {subCategoryData.image ? (
                <img
                  src={subCategoryData.image}
                  alt="subcategory"
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
              onChange={handleUploadSubCategoryImage}
              className="border p-2 rounded-lg"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition ${
              subCategoryData.name &&
              subCategoryData.image &&
              subCategoryData.category.length > 0
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading
              ? "Uploading..."
              : "Add Sub Category"}
          </button>

        </form>
      </div>
    </section>
  );
};

export default UploadSubCategoryModel;