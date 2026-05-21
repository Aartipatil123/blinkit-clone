import React from 'react'
import { IoClose } from "react-icons/io5";

const ViewImage = ({ url, close }) => {
  return (
    <div 
      className='fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4'
      onClick={close}
    >
      <div 
        className='relative bg-white rounded-lg p-4 max-w-md w-full'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={close}
          className='absolute top-2 right-2 text-gray-700 hover:text-red-500'
        >
          <IoClose size={25}/>
        </button>

        {/* Image */}
        <img
          src={url}
          alt='Full Screen'
          className='w-full h-full object-contain rounded-lg'
        />
      </div>
    </div>
  )
}

export default ViewImage