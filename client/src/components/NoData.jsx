import React from 'react'
import noDataImage from '../assets/nothing_hear_yet.png'

const NoData = () => {
  return (
    <div
      className="min-h-[300px] flex flex-col items-center
      justify-center bg-white rounded-xl shadow-sm
      border border-neutral-200 p-6"
    >
      {/* Image */}
      <img
        src={noDataImage}
        alt="No Data"
        className="w-40 md:w-52 object-contain mb-4"
      />

      {/* Title */}
      <h2 className="text-lg font-semibold text-neutral-700">
        No Data Found
      </h2>

      {/* Subtitle */}
      <p
        className="text-sm text-neutral-500 text-center
        max-w-sm mt-2"
      >
        Nothing is available here right now.
        Once data is added, it will appear here.
      </p>
    </div>
  )
}

export default NoData