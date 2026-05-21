import React, { useEffect, useState } from "react"
import UploadCategoryModel from "../components/UploadCategoryModel"
import EditCategory from "../components/EditCategory"
import ConfirmBox from "../components/ConfirmBox"
import Loading from "../components/Loading"
import NoData from "../components/NoData"

import Axios from "../utils/Axios"
import SummaryApi from "../common/SummaryApi"
import AxiosToastError from "../utils/AxiosToastError"
import toast from "react-hot-toast"

const CategoryPage = () => {

  const [openUploadCategory, setOpenUploadCategory] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)

  const [loading, setLoading] = useState(false)
  const [categoryData, setCategoryData] = useState([])

  const [editData, setEditData] = useState(null)

  const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false)
  const [deleteCategory, setDeleteCategory] = useState(null)

  // =========================
  // FETCH CATEGORY
  // =========================
  const fetchCategory = async () => {
    try {
      setLoading(true)

      const response = await Axios({
        ...SummaryApi.getCategory
      })

      const { data: responseData } = response

      if (responseData.success) {
        setCategoryData(responseData.data)
      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategory()
  }, [])

  // =========================
  // DELETE CATEGORY
  // =========================
  const handleDeleteCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteCategory,
        data: {
          _id: deleteCategory?._id
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)

        setOpenConfirmBoxDelete(false)
        setDeleteCategory(null)

        fetchCategory() // refresh
      }

    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <section className="min-h-screen bg-gray-50 p-4">

      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-sm border px-6 py-4 flex justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Category Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your product categories easily
          </p>
        </div>

        <button
          onClick={() => setOpenUploadCategory(true)}
          className="bg-primary-200 hover:bg-primary-300 px-5 py-2.5 rounded-xl font-medium transition"
        >
          + Add Category
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="mt-10">
          <Loading />
        </div>
      )}

      {/* NO DATA */}
      {!loading && categoryData.length === 0 && (
        <div className="mt-10">
          <NoData />
        </div>
      )}

      {/* CATEGORY GRID */}
      {!loading && categoryData.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {categoryData.map((category) => (
            <div
              key={category._id}
              className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition group"
            >
              {/* IMAGE */}
              <div className="h-44 bg-gray-50 flex items-center justify-center p-4">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition"
                />
              </div>

              {/* CONTENT */}
              <div className="p-4 border-t">

                <h3 className="font-semibold text-gray-800 text-center line-clamp-1">
                  {category.name}
                </h3>

                {/* ACTION */}
                <div className="justify-center gap-3 mt-4 hidden group-hover:flex">

                  <button
                    onClick={() => {
                      setEditData(category)
                      setOpenEdit(true)
                    }}
                    className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      setDeleteCategory(category)
                      setOpenConfirmBoxDelete(true)
                    }}
                    className="px-4 py-2 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD MODAL */}
      {openUploadCategory && (
        <UploadCategoryModel
          close={() => {
            setOpenUploadCategory(false)
            fetchCategory()
          }}
        />
      )}

      {/* EDIT MODAL */}
      {openEdit && editData && (
        <EditCategory
          close={() => setOpenEdit(false)}
          categoryData={editData}
          fetchCategory={fetchCategory}
        />
      )}

      {/* DELETE CONFIRM */}
      {openConfirmBoxDelete && (
        <ConfirmBox
          close={() => setOpenConfirmBoxDelete(false)}
          cancel={() => setOpenConfirmBoxDelete(false)}
          confirm={handleDeleteCategory}
        />
      )}

    </section>
  )
}

export default CategoryPage