import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import uploadImage from "../utils/UploadImage";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";

const EditSubCategory = ({ close, data, fetchSubCategory }) => {

  const [subCategoryData, setSubCategoryData] = useState({
    _id: "",
    name: "",
    image: "",
    category: []
  });

  const allCategory = useSelector(state => state.product.allCategory);
  const [loading, setLoading] = useState(false);

  // =========================
  // PREFILL DATA
  // =========================
  useEffect(() => {
    if (data) {
      setSubCategoryData({
        _id: data._id,
        name: data.name,
        image: data.image,
        category: data.category || []
      });
    }
  }, [data]);

  // =========================
  // INPUT CHANGE
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
  const handleUploadImage = async (e) => {
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

      if (imageUrl) {
        setSubCategoryData((prev) => ({
          ...prev,
          image: imageUrl
        }));

        toast.success("Image uploaded");
      } else {
        toast.error("Image upload failed");
      }

    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SELECT CATEGORY
  // =========================
  const handleSelectCategory = (e) => {
    const value = e.target.value;

    const categoryDetails = allCategory.find(
      (el) => el._id === value
    );

    if (!categoryDetails) return;

    const alreadyExist = subCategoryData.category.some(
      (el) => el._id === value
    );

    if (alreadyExist) {
      toast.error("Category already added");
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
  const handleRemoveCategory = (id) => {
    const filtered = subCategoryData.category.filter(
      (el) => el._id !== id
    );

    setSubCategoryData((prev) => ({
      ...prev,
      category: filtered
    }));
  };

  // =========================
  // UPDATE SUB CATEGORY
  // =========================
  const handleUpdate = async (e) => {
    e.preventDefault();

    // ✅ validation
    if (
      !subCategoryData.name ||
      !subCategoryData.image ||
      subCategoryData.category.length === 0
    ) {
      toast.error("All fields required");
      return;
    }

    try {
      setLoading(true);

      // ✅ IMPORTANT: only send category ids
      const payload = {
        ...subCategoryData,
        category: subCategoryData.category.map((c) => c._id)
      };

      const res = await Axios({
        ...SummaryApi.updateSubCategory,
        data: payload
      });

      const { data: responseData } = res;

      if (responseData.success) {
        toast.success(responseData.message);

        fetchSubCategory && fetchSubCategory();
        close && close();
      }

    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">

      <div className="w-full max-w-5xl bg-white p-5 rounded-xl shadow-lg">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="font-semibold text-lg">
            Edit Sub Category
          </h1>

          <button onClick={close}>
            <IoClose size={25} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleUpdate} className="my-3 grid gap-4">

          {/* NAME */}
          <input
            name="name"
            value={subCategoryData.name}
            onChange={handleChange}
            placeholder="Enter name"
            className="p-3 bg-blue-50 border rounded"
          />

          {/* CATEGORY */}
          <div>
            <label className="font-medium">Select Category</label>

            {/* Selected */}
            <div className="flex flex-wrap gap-2 my-2">
              {
                subCategoryData.category.map((cat) => (
                  <div
                    key={cat._id}
                    className="bg-gray-200 px-2 py-1 rounded flex items-center gap-2"
                  >
                    {cat.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(cat._id)}
                    >
                      <IoClose size={16} />
                    </button>
                  </div>
                ))
              }
            </div>

            {/* Dropdown */}
            <select
              onChange={handleSelectCategory}
              className="p-3 bg-blue-50 border rounded w-full"
            >
              <option value="">Select Category</option>
              {
                allCategory.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))
              }
            </select>
          </div>

          {/* IMAGE */}
          <div>
            <div className="h-36 w-36 border flex items-center justify-center mb-2">
              {
                subCategoryData.image ? (
                  <img
                    src={subCategoryData.image}
                    alt=""
                    className="h-full object-contain"
                  />
                ) : "No Image"
              }
            </div>

            <input type="file" onChange={handleUploadImage} />
          </div>

          {/* BUTTON */}
          <button
            disabled={loading}
            className="px-4 py-2 bg-primary-200 hover:bg-primary-300 rounded font-semibold"
          >
            {loading ? "Updating..." : "Update Sub Category"}
          </button>

        </form>

      </div>
    </section>
  );
};

export default EditSubCategory;