import React, { useState } from "react"
import { IoClose } from "react-icons/io5"
import toast from "react-hot-toast"

import uploadImage from "../utils/UploadImage"
import Axios from "../utils/Axios"
import SummaryApi from "../common/SummaryApi"
import AxiosToastError from "../utils/AxiosToastError"

const EditCategory = ({ close, categoryData, fetchCategory }) => {
  const [data, setData] = useState({
    categoryId: categoryData?._id || "",   // ✅ backend ke according categoryId
    name: categoryData?.name || "",
    image: categoryData?.image || ""
  })

  const [loading, setLoading] = useState(false)

  // =========================
  // Handle Input Change
  // =========================
  const handleOnChange = (e) => {
    const { name, value } = e.target

    setData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // =========================
  // Handle Submit
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (!data.name || !data.image) {
        toast.error("Please fill all required fields")
        return
      }

      setLoading(true)

      const response = await Axios({
        ...SummaryApi.updateCategory,
        data: {
          categoryId: data.categoryId, // ✅ important fix
          name: data.name,
          image: data.image
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message || "Updated Successfully")

        // ✅ latest data fetch
        if (fetchCategory) {
          await fetchCategory()
        }

        close()
      }

    } catch (error) {
      console.log(error)
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  // =========================
  // Handle Image Upload
  // =========================
  const handleUploadCategoryImage = async (e) => {
    try {
      const file = e.target.files[0]

      if (!file) return

      setLoading(true)

      const uploadImageCloudinary = await uploadImage(file)

      console.log("Upload Response:", uploadImageCloudinary)

      /*
        Expected response:
        uploadImageCloudinary.data.data.url
      */

      const imageUrl =
        uploadImageCloudinary?.data?.data?.url ||
        uploadImageCloudinary?.data?.url ||
        ""

      if (imageUrl) {
        setData((prev) => ({
          ...prev,
          image: imageUrl
        }))

        toast.success("Image uploaded successfully")
      } else {
        toast.error("Image URL not found")
        console.log("Invalid Response:", uploadImageCloudinary)
      }

    } catch (error) {
      console.log(error)
      toast.error("Image upload failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      className="fixed top-0 bottom-0 left-0 right-0 p-4
      bg-black bg-opacity-50 flex items-center
      justify-center z-50"
    >
      <div
        className="bg-white max-w-3xl w-full p-6
        rounded-2xl shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold text-xl">
            Edit Category
          </h1>

          <button
            onClick={close}
            className="hover:text-red-500 transition"
          >
            <IoClose size={25} />
          </button>
        </div>

        {/* Form */}
        <form
          className="grid gap-5"
          onSubmit={handleSubmit}
        >
          {/* Category Name */}
          <div className="grid gap-2">
            <label htmlFor="categoryName" className="font-medium">
              Category Name
            </label>

            <input
              type="text"
              id="categoryName"
              name="name"
              placeholder="Enter category name"
              value={data.name}
              onChange={handleOnChange}
              className="bg-blue-50 p-3 border border-blue-100
              focus:border-primary-200 outline-none rounded-lg"
              required
            />
          </div>

          {/* Category Image */}
          <div className="grid gap-3">
            <p className="font-medium">
              Category Image
            </p>

            <div className="flex gap-5 flex-col lg:flex-row items-center">
              {/* Preview */}
              <div
                className="border bg-blue-50 h-40 w-full lg:w-40
                flex items-center justify-center rounded-xl
                overflow-hidden"
              >
                {data.image ? (
                  <img
                    src={data.image}
                    alt="category"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p className="text-sm text-neutral-500">
                    No Image
                  </p>
                )}
              </div>

              {/* Upload Button */}
              <label htmlFor="uploadCategoryImage">
                <div
                  className={`
                    ${
                      !data.name
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-primary-200 hover:bg-primary-300 hover:scale-105"
                    }
                    px-5 py-3 rounded-lg cursor-pointer
                    transition-all duration-300 font-medium
                  `}
                >
                  {loading ? "Uploading..." : "Upload Image"}
                </div>

                <input
                  type="file"
                  id="uploadCategoryImage"
                  className="hidden"
                  disabled={!data.name}
                  onChange={handleUploadCategoryImage}
                />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-fit px-7 py-3 bg-primary-200
            hover:bg-primary-300 rounded-lg
            font-medium transition-all duration-300"
          >
            {loading ? "Please wait..." : "Update Category"}
          </button>
        </form>
      </div>
    </section>
  )
}

export default EditCategory