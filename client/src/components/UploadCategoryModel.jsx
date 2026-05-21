import React, { useEffect, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import uploadImage from "../utils/UploadImage";
import ViewImage from "../components/ViewImage";
import AddFieldComponent from "../components/AddFieldComponent";

import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import successAlert from "../utils/SuccessAlert";
import AxiosToastError from "../utils/AxiosToastError";

import {
  setAllCategory,
  setAllSubCategory
} from "../store/productSlice";

const UploadProduct = () => {

  const dispatch = useDispatch();

  const allCategory = useSelector(
    (state) => state.product.allCategory
  );

  const allSubCategory = useSelector(
    (state) => state.product.allSubCategory
  );

  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: {},
  });

  const [loading, setLoading] = useState(false);
  const [viewImageURL, setViewImageURL] = useState("");
  const [selectCategory, setSelectCategory] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState("");
  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState("");

  // =========================
  // FETCH CATEGORY
  // =========================
  const fetchCategory = async () => {

    try {

      const response = await Axios({
        ...SummaryApi.getCategory
      });

      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(setAllCategory(responseData.data));
      }

    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // FETCH SUB CATEGORY
  // =========================
  const fetchSubCategory = async () => {

    try {

      const response = await Axios({
        ...SummaryApi.getSubCategory
      });

      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(setAllSubCategory(responseData.data));
      }

    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {

    fetchCategory();
    fetchSubCategory();

  }, []);

  // =========================
  // INPUT HANDLE
  // =========================
  const handleChange = (e) => {

    const { name, value } = e.target;

    setData((prev) => ({
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

      if (!imageUrl) {
        toast.error("Image upload failed");
        return;
      }

      setData((prev) => ({
        ...prev,
        image: [...prev.image, imageUrl]
      }));

      toast.success("Image uploaded");

    } catch (error) {

      console.log(error);
      AxiosToastError(error);

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // REMOVE IMAGE
  // =========================
  const handleRemoveImage = (index) => {

    setData((prev) => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index)
    }));
  };

  // =========================
  // ADD CATEGORY
  // =========================
  const handleAddCategory = (value) => {

    if (!value) return;

    const category = allCategory.find(
      (el) => el._id === value
    );

    if (!category) return;

    const alreadyExists = data.category.some(
      (el) => el._id === value
    );

    if (alreadyExists) {
      toast.error("Category already selected");
      return;
    }

    setData((prev) => ({
      ...prev,
      category: [...prev.category, category],
      subCategory: []
    }));
  };

  // =========================
  // REMOVE CATEGORY
  // =========================
  const handleRemoveCategory = (id) => {

    setData((prev) => ({
      ...prev,
      category: prev.category.filter(
        (el) => el._id !== id
      ),
      subCategory: []
    }));
  };

  // =========================
  // ADD SUB CATEGORY
  // =========================
  const handleAddSubCategory = (value) => {

    if (!value) return;

    const subCategory = allSubCategory.find(
      (el) => el._id === value
    );

    if (!subCategory) return;

    const alreadyExists = data.subCategory.some(
      (el) => el._id === value
    );

    if (alreadyExists) {
      toast.error("Sub Category already selected");
      return;
    }

    setData((prev) => ({
      ...prev,
      subCategory: [...prev.subCategory, subCategory]
    }));
  };

  // =========================
  // REMOVE SUB CATEGORY
  // =========================
  const handleRemoveSubCategory = (id) => {

    setData((prev) => ({
      ...prev,
      subCategory: prev.subCategory.filter(
        (el) => el._id !== id
      )
    }));
  };

  // =========================
  // ADD MORE FIELD
  // =========================
  const handleAddField = () => {

    if (!fieldName.trim()) {
      toast.error("Field name required");
      return;
    }

    setData((prev) => ({
      ...prev,
      more_details: {
        ...prev.more_details,
        [fieldName]: ""
      }
    }));

    setFieldName("");
    setOpenAddField(false);
  };

  // =========================
  // FILTER SUB CATEGORY
  // =========================
  const filteredSubCategory =
    data.category.length === 0
      ? allSubCategory
      : allSubCategory.filter((sub) =>
          data.category.some((cat) =>
            sub.category?.some(
              (c) => c._id === cat._id
            )
          )
        );

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (data.image.length === 0) {
        toast.error("Please upload product image");
        return;
      }

      if (data.category.length === 0) {
        toast.error("Please select category");
        return;
      }

      if (data.subCategory.length === 0) {
        toast.error("Please select sub category");
        return;
      }

      const payload = {
        ...data,
        category: data.category.map(
          (cat) => cat._id
        ),
        subCategory: data.subCategory.map(
          (sub) => sub._id
        )
      };

      setLoading(true);

      const response = await Axios({
        ...SummaryApi.createProduct,
        data: payload
      });

      const { data: responseData } = response;

      if (responseData.success) {

        successAlert(responseData.message);

        setData({
          name: "",
          image: [],
          category: [],
          subCategory: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          more_details: {},
        });
      }

    } catch (error) {

      console.log(error);
      AxiosToastError(error);

    } finally {

      setLoading(false);
    }
  };

  return (
    <section className="p-4">

      <h2 className="text-2xl font-bold mb-4">
        Upload Product
      </h2>

      <div className="bg-white p-5 rounded-xl shadow-md">

        <form
          onSubmit={handleSubmit}
          className="grid gap-5"
        >

          {/* PRODUCT NAME */}
          <div className="grid gap-1">

            <label className="font-semibold">
              Product Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter Product Name"
              value={data.name}
              onChange={handleChange}
              className="p-3 border rounded-lg bg-blue-50"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div className="grid gap-1">

            <label className="font-semibold">
              Description
            </label>

            <textarea
              name="description"
              placeholder="Enter Description"
              value={data.description}
              onChange={handleChange}
              className="p-3 border rounded-lg bg-blue-50"
              rows={4}
              required
            />
          </div>

          {/* IMAGE */}
          <div className="grid gap-2">

            <label className="font-semibold">
              Product Images
            </label>

            <label className="h-28 border-2 border-dashed rounded-lg bg-blue-50 flex items-center justify-center cursor-pointer">

              <div className="flex flex-col items-center">
                <FaCloudUploadAlt size={35} />
                <p>
                  {loading ? "Uploading..." : "Upload Image"}
                </p>
              </div>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUploadImage}
              />
            </label>

            {/* IMAGE PREVIEW */}
            <div className="flex flex-wrap gap-3">

              {data.image.map((img, index) => (
                <div
                  key={index}
                  className="relative w-24 h-24 border rounded-lg overflow-hidden"
                >

                  <img
                    src={img}
                    alt="product"
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() =>
                      setViewImageURL(img)
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveImage(index)
                    }
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  >
                    <IoClose size={14} />
                  </button>

                </div>
              ))}

            </div>
          </div>

          {/* CATEGORY */}
          <div className="grid gap-2">

            <label className="font-semibold">
              Category
            </label>

            <select
              value={selectCategory}
              onChange={(e) => {
                handleAddCategory(e.target.value);
                setSelectCategory("");
              }}
              className="p-3 border rounded-lg bg-blue-50"
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

            <div className="flex flex-wrap gap-2">

              {data.category.map((cat) => (
                <div
                  key={cat._id}
                  className="bg-blue-100 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  <p>{cat.name}</p>

                  <IoClose
                    className="cursor-pointer"
                    onClick={() =>
                      handleRemoveCategory(cat._id)
                    }
                  />
                </div>
              ))}

            </div>
          </div>

          {/* SUB CATEGORY */}
          <div className="grid gap-2">

            <label className="font-semibold">
              Sub Category
            </label>

            <select
              value={selectSubCategory}
              onChange={(e) => {
                handleAddSubCategory(e.target.value);
                setSelectSubCategory("");
              }}
              className="p-3 border rounded-lg bg-blue-50"
            >

              <option value="">
                Select Sub Category
              </option>

              {filteredSubCategory.map((sub) => (
                <option
                  key={sub._id}
                  value={sub._id}
                >
                  {sub.name}
                </option>
              ))}

            </select>

            <div className="flex flex-wrap gap-2">

              {data.subCategory.map((sub) => (
                <div
                  key={sub._id}
                  className="bg-green-100 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  <p>{sub.name}</p>

                  <IoClose
                    className="cursor-pointer"
                    onClick={() =>
                      handleRemoveSubCategory(sub._id)
                    }
                  />
                </div>
              ))}

            </div>
          </div>

          {/* UNIT */}
          <div className="grid gap-1">

            <label className="font-semibold">
              Unit
            </label>

            <input
              type="text"
              name="unit"
              placeholder="500ml / 1kg / 1 piece"
              value={data.unit}
              onChange={handleChange}
              className="p-3 border rounded-lg bg-blue-50"
              required
            />
          </div>

          {/* STOCK */}
          <div className="grid gap-1">

            <label className="font-semibold">
              Stock
            </label>

            <input
              type="number"
              name="stock"
              placeholder="Enter Stock"
              value={data.stock}
              onChange={handleChange}
              className="p-3 border rounded-lg bg-blue-50"
            />
          </div>

          {/* PRICE */}
          <div className="grid gap-1">

            <label className="font-semibold">
              Price
            </label>

            <input
              type="number"
              name="price"
              placeholder="Enter Price"
              value={data.price}
              onChange={handleChange}
              className="p-3 border rounded-lg bg-blue-50"
              required
            />
          </div>

          {/* DISCOUNT */}
          <div className="grid gap-1">

            <label className="font-semibold">
              Discount
            </label>

            <input
              type="number"
              name="discount"
              placeholder="Enter Discount"
              value={data.discount}
              onChange={handleChange}
              className="p-3 border rounded-lg bg-blue-50"
            />
          </div>

          {/* MORE DETAILS */}
          <div className="grid gap-3">

            {Object.keys(data.more_details).map(
              (key, index) => (
                <div
                  key={index}
                  className="grid gap-1"
                >

                  <label>{key}</label>

                  <input
                    type="text"
                    value={data.more_details[key]}
                    onChange={(e) => {

                      const value = e.target.value;

                      setData((prev) => ({
                        ...prev,
                        more_details: {
                          ...prev.more_details,
                          [key]: value
                        }
                      }));
                    }}
                    className="p-3 border rounded-lg bg-blue-50"
                  />
                </div>
              )
            )}
          </div>

          {/* ADD FIELD */}
          <div
            onClick={() =>
              setOpenAddField(true)
            }
            className="w-36 text-center py-2 rounded-lg bg-primary-200 hover:bg-primary-300 cursor-pointer font-semibold"
          >
            Add Fields
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className={`p-3 rounded-lg font-semibold text-white ${
              loading
                ? "bg-gray-400"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading
              ? "Uploading..."
              : "Upload Product"}
          </button>

        </form>
      </div>

      {/* VIEW IMAGE */}
      {viewImageURL && (
        <ViewImage
          url={viewImageURL}
          close={() =>
            setViewImageURL("")
          }
        />
      )}

      {/* ADD FIELD MODAL */}
      {openAddField && (
        <AddFieldComponent
          value={fieldName}
          onChange={(e) =>
            setFieldName(e.target.value)
          }
          submit={handleAddField}
          close={() =>
            setOpenAddField(false)
          }
        />
      )}

    </section>
  );
};

export default UploadProduct;