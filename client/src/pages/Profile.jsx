import React, { useEffect, useState } from 'react'
import { FaRegUserCircle } from "react-icons/fa"
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

import UserProfileAvatarEdit from '../components/UserProfileAvatarEdit'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'

const Profile = () => {
  const user = useSelector((state) => state.user)

  const [openProfileAvatarEdit, setProfileAvatarEdit] = useState(false)

  const [userData, setUserData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    mobile: user?.mobile || ""
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setUserData({
      name: user?.name || "",
      email: user?.email || "",
      mobile: user?.mobile || ""
    })
  }, [user])

  const handleOnChange = (e) => {
    const { name, value } = e.target

    setUserData((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      const response = await Axios({
        ...SummaryApi.updateUserDetails,
        data: userData
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">

      {/* Profile Title */}
      <h2 className="text-xl font-semibold mb-4">
        My Profile
      </h2>

      {/* Profile Avatar */}
      <div
        className="w-20 h-20 bg-red-500 flex items-center justify-center
        rounded-full overflow-hidden drop-shadow-sm"
      >
        {
          user?.avatar ? (
            <img
              src={user.avatar}
              alt={user?.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <FaRegUserCircle
              size={60}
              className="text-white"
            />
          )
        }
      </div>

      {/* Edit Profile Button */}
      <button
        onClick={() => setProfileAvatarEdit(true)}
        className="text-sm min-w-24 border border-primary-100
        hover:border-primary-200 hover:bg-primary-200
        px-4 py-2 rounded-full mt-4 transition"
      >
        Edit Profile
      </button>

      {/* Avatar Edit Popup */}
      {
        openProfileAvatarEdit && (
          <UserProfileAvatarEdit
            close={() => setProfileAvatarEdit(false)}
          />
        )
      }

      {/* User Details Form */}
      <form
        className="my-6 grid gap-4"
        onSubmit={handleSubmit}
      >
        {/* Name */}
        <div className="grid gap-1">
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            className="p-2 bg-blue-50 outline-none border
            focus:border-primary-200 rounded"
            value={userData.name}
            onChange={handleOnChange}
            required
          />
        </div>

        {/* Email */}
        <div className="grid gap-1">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your Email"
            className="p-2 bg-blue-50 outline-none border
            focus:border-primary-200 rounded"
            value={userData.email}
            onChange={handleOnChange}
            required
          />
        </div>

        {/* Mobile */}
        <div className="grid gap-1">
          <label htmlFor="mobile">Mobile</label>
          <input
            type="text"
            id="mobile"
            name="mobile"
            placeholder="Enter your Mobile"
            className="p-2 bg-blue-50 outline-none border
            focus:border-primary-200 rounded"
            value={userData.mobile}
            onChange={handleOnChange}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="border px-4 py-2 font-semibold
          hover:bg-primary-100 border-primary-100
          text-primary-200 hover:text-neutral-800
          rounded transition"
        >
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>

    </div>
  )
}

export default Profile