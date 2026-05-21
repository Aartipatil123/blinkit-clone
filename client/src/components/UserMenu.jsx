import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineExternalLink } from "react-icons/hi"
import toast from 'react-hot-toast'

import Divider from './Divider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { logout } from '../store/userSlice'
import AxiosToastError from '../utils/AxiosToastError'
import isAdmin from '../utils/isAdmin'

const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      console.log("Logout Clicked")

      const response = await Axios({
        ...SummaryApi.logout,
        withCredentials: true
      })

      console.log("Logout Response:", response.data)

      if (response.data.success) {
        dispatch(logout())
        localStorage.clear()

        toast.success(response.data.message || "Logout Successfully")

        navigate("/")

        if (close) {
          close()
        }
      }

    } catch (error) {
      console.log("Logout Error:", error.response?.data)
      AxiosToastError(error)
    }
  }

  const handleClose = () => {
    if (close) {
      close()
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">

      {/* Account Title */}
      <div className="font-semibold text-lg">
        My Account
      </div>

      {/* User Info */}
      <div className="text-sm flex items-center gap-2 mt-2">
        <span className="max-w-52 text-ellipsis line-clamp-1">
          {user?.name || user?.mobile || "User"}

          <span className="text-sm text-red-600 ml-2 font-medium">
            {user?.role === "ADMIN" ? "(Admin)" : ""}
          </span>
        </span>

        <Link
          to="/dashboard/profile"
          onClick={handleClose}
          className="hover:text-primary-200"
        >
          <HiOutlineExternalLink size={15} />
        </Link>
      </div>

      <Divider />

      {/* Menu Links */}
      <div className="text-sm grid gap-2 mt-3">

        {/* Admin Only */}
        {
          isAdmin(user?.role) && (
            <>
              <Link
                to="/dashboard/category"
                onClick={handleClose}
                className="px-3 py-2 hover:bg-orange-200 rounded transition"
              >
                Category
              </Link>

              <Link
                to="/dashboard/subcategory"
                onClick={handleClose}
                className="px-3 py-2 hover:bg-orange-200 rounded transition"
              >
                Sub Category
              </Link>

              <Link
                to="/dashboard/upload-product"
                onClick={handleClose}
                className="px-3 py-2 hover:bg-orange-200 rounded transition"
              >
                Upload Product
              </Link>
            

             <Link
          to="/dashboard/product"
          onClick={handleClose}
          className="px-3 py-2 hover:bg-orange-200 rounded transition"
        >
          Product
        </Link>
        </>
          )
        }

        {/* Common Links */}
       

        <Link
          to="/dashboard/myorders"
          onClick={handleClose}
          className="px-3 py-2 hover:bg-orange-200 rounded transition"
        >
          My Orders
        </Link>

        <Link
          to="/dashboard/address"
          onClick={handleClose}
          className="px-3 py-2 hover:bg-orange-200 rounded transition"
        >
          Save Address
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-left px-3 py-2 hover:bg-orange-200 rounded transition"
        >
          Log Out
        </button>

      </div>
    </div>
  )
}

export default UserMenu