import React, { useEffect, useState } from 'react'
import UploadSubCategoryModel from '../components/UploadSubCategoryModel'
import NoData from '../components/NoData'
import AxiosToastError from '../utils/AxiosToastError'
import SummaryApi from '../common/SummaryApi'
import DisplayTable from '../components/DisplayTable'
import { createColumnHelper } from '@tanstack/react-table'
import Axios from '../utils/Axios'
import ViewImage from '../components/ViewImage'
import { HiPencil } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import EditSubCategory from '../components/EditSubCategory'
import ConfirmBox from '../components/ConfirmBox'
import toast from "react-hot-toast"

const SubCategoryPage = () => {

  const [openAddSubCategory, setOpenAddSubCategory] = useState(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [ImageURL, setImageURL] = useState("")

  const [openEdit, setOpenEdit] = useState(false)
  const [editData, setEditData] = useState(null)

  const [deleteSubCategory, setDeleteSubCategory] = useState({ _id: "" })
  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false)

  const columnHelper = createColumnHelper()

  // ================= FETCH =================
  const fetchSubCategory = async () => {
    try {
      setLoading(true)

      const res = await Axios({
        ...SummaryApi.getSubCategory
      })

      const { data: responseData } = res

      if (responseData.success) {
        setData(responseData.data)
      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubCategory()
  }, [])

  // ================= DELETE =================
  const handleDeleteSubCategory = async () => {
    try {
      const res = await Axios({
        ...SummaryApi.deleteSubCategory,
        data: {
          _id: deleteSubCategory._id
        }
      })

      const { data: responseData } = res

      if (responseData.success) {
        toast.success(responseData.message)
        setOpenDeleteConfirmBox(false)
        fetchSubCategory()   // ✅ refresh list
      }

    } catch (error) {
      AxiosToastError(error)
    }
  }

  // ================= TABLE =================
  const column = [

    columnHelper.accessor('name', {
      header: () => <span className="font-bold">Name</span>,
      cell: info => (
        <span className="font-semibold text-gray-900">
          {info.getValue()}
        </span>
      )
    }),

    columnHelper.accessor('image', {
      header: () => <span className="font-bold">Image</span>,
      cell: ({ row }) => (
        <div className='flex justify-center'>
          <img
            src={row.original.image}
            alt=""
            className='w-16 h-16 object-contain cursor-pointer'
            onClick={() => setImageURL(row.original.image)}
          />
        </div>
      )
    }),

    columnHelper.accessor('category', {
      header: () => <span className="font-bold">Category</span>,
      cell: (info) => {
        const cat = info.getValue()

        return (
          <div className="flex flex-wrap gap-2">
            {cat?.map((c) => (
              <span
                key={c._id}
                className="bg-gray-200 px-2 py-1 rounded text-xs font-medium"
              >
                {c.name}
              </span>
            ))}
          </div>
        )
      }
    }),

    // ================= ACTION =================
    columnHelper.accessor("_id", {
      header: () => <span className="font-bold">Action</span>,
      cell: ({ row }) => (
        <div className='flex items-center justify-center gap-3'>

          {/* EDIT */}
          <button
            onClick={() => {
              setEditData(row.original)
              setOpenEdit(true)
            }}
            className='p-2 bg-green-100 rounded-full text-green-600'
          >
            <HiPencil size={18} />
          </button>

          {/* DELETE */}
          <button
            onClick={() => {
              setDeleteSubCategory(row.original)
              setOpenDeleteConfirmBox(true)   // ✅ FIX
            }}
            className='p-2 bg-red-100 rounded-full text-red-600'
          >
            <MdDelete size={18} />
          </button>

        </div>
      )
    })
  ]

  return (
    <section className="min-h-screen bg-gray-50 p-4">

      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-sm border px-6 py-4 flex justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Sub Category Management</h2>
          <p className="text-sm text-gray-600">
            Manage your product sub categories easily
          </p>
        </div>

        <button
          onClick={() => setOpenAddSubCategory(true)}
          className="bg-primary-200 px-5 py-2.5 rounded-xl font-semibold"
        >
          + Add Sub Category
        </button>
      </div>

      {/* LOADING */}
      {loading && <p className="text-center">Loading...</p>}

      {/* TABLE */}
      {
        !loading && (
          data.length > 0 ? (
            <DisplayTable data={data} column={column} />
          ) : (
            <NoData />
          )
        )
      }

      {/* ADD MODAL */}
      {
        openAddSubCategory && (
          <UploadSubCategoryModel
            close={() => {
              setOpenAddSubCategory(false)
              fetchSubCategory()
            }}
          />
        )
      }

      {/* IMAGE VIEW */}
      {
        ImageURL && (
          <ViewImage
            url={ImageURL}
            close={() => setImageURL("")}
          />
        )
      }

      {/* EDIT MODAL */}
      {
        openEdit && editData && (
          <EditSubCategory
            data={editData}
            close={() => setOpenEdit(false)}
            fetchSubCategory={fetchSubCategory}
          />
        )
      }

      {/* DELETE CONFIRM */}
      {
        openDeleteConfirmBox && (
          <ConfirmBox
            cancel={() => setOpenDeleteConfirmBox(false)}
            close={() => setOpenDeleteConfirmBox(false)}
            confirm={handleDeleteSubCategory}
          />
        )
      }

    </section>
  )
}

export default SubCategoryPage