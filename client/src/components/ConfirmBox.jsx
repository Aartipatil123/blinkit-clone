import React from "react"
import { IoClose } from "react-icons/io5"

const ConfirmBox = ({ cancel, confirm, close }) => {
  return (
    <section
      className="fixed top-0 bottom-0 left-0 right-0
      z-50 bg-black bg-opacity-60
      flex items-center justify-center p-4"
    >
      <div
        className="bg-white w-full max-w-md
        rounded-2xl shadow-xl p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">
            Permanent Delete
          </h1>

          <button
            onClick={close}
            className="text-gray-500 hover:text-red-500 transition"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Message */}
        <div className="mt-5">
          <p className="text-gray-600 leading-relaxed">
            Are you sure you want to permanently delete this item?
            <br />
            This action cannot be undone.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={cancel}
            className="px-5 py-2 rounded-lg border
            border-green-500 text-gray-700
            hover:bg-green-600 transition"
          >
            Cancel
          </button>

          <button
            onClick={confirm}
            className="px-5 py-2 rounded-lg
            bg-red-500 text-white font-medium
            hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </section>
  )
}

export default ConfirmBox