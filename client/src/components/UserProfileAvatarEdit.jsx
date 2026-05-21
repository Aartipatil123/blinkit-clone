import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { FaRegUserCircle } from "react-icons/fa"
import { IoClose } from "react-icons/io5";

import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'

const UserProfileAvatarEdit = ({ close }) => {
  const user = useSelector((state) => state.user)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  const handleUploadAvatarImage = async (e) => {
    try {
      const file = e.target.files[0]

      if (!file) return

      setLoading(true)

      const formData = new FormData()
      formData.append("avatar", file)

      const response = await Axios({
        ...SummaryApi.uploadAvatar,
        data: formData
      })

      console.log(response)

      setLoading(false)

    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <section
      className="fixed top-0 bottom-0 left-0 right-0
      bg-neutral-900 bg-opacity-60 p-4 flex
      items-center justify-center z-50"
    >
      <div
        className="bg-white max-w-sm w-full rounded-lg p-6
        flex flex-col items-center justify-center shadow-lg"
      >
        <button onClick={close} className='text-neutral-800 w-fit block ml-auto'>
            <IoClose  size={20}/>
        </button>
        {/* Profile Avatar */}
        <div
          className="w-20 h-20 bg-red-500 flex items-center
          justify-center rounded-full overflow-hidden drop-shadow-sm"
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
                size={65}
                className="text-white"
              />
            )
          }
        </div>

        {/* Upload Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-4 flex flex-col items-center"
        >
          <label htmlFor="uploadProfile">

            <div
              className="border border-primary-200
              hover:bg-primary-200 px-5 py-2
              rounded text-sm cursor-pointer transition"
            >
              {loading ? "Loading..." : "Upload"}
            </div>

          </label>

          <input
            onChange={handleUploadAvatarImage}
            type="file"
            id="uploadProfile"
            className="hidden"
          />
        </form>

        {/* Close Button */}
        <button
          onClick={close}
          className="mt-4 text-sm text-gray-500 hover:text-black"
        >
          Cancel
        </button>

      </div>
    </section>
  )
}

export default UserProfileAvatarEdit