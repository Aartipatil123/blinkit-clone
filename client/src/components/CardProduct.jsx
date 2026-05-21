import React from 'react'
import { DisplayPriceInRuppes } from '../utils/DisplayPriceInRupees'
import { Link } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'

const CardProduct = ({ data }) => {

    const url = `/${valideURLConvert(data.name)}-${data._id}`

    return (

        <div className='border lg:p-4 p-2 grid gap-2 lg:gap-3 max-w-32 lg:min-w-52 rounded-xl bg-white'>

            <Link to={url}>

                <div className='min-h-20 w-full max-h-24 lg:max-h-32 rounded overflow-hidden'>
                    <img
                        src={data?.image?.[0]}
                        alt={data?.name}
                        className='w-full h-full object-scale-down hover:scale-105 transition-all duration-300'
                    />
                </div>

                <div className='rounded text-xs w-fit p-[1px] px-2 text-green-600 bg-green-50 mt-2'>
                    10 min
                </div>

                <div className='font-medium text-sm lg:text-base line-clamp-2 mt-1'>
                    {data?.name}
                </div>

                <div className='text-sm lg:text-base text-gray-500'>
                    {data?.unit}
                </div>

            </Link>

            <div className='flex items-center justify-between gap-3 text-sm lg:text-base'>

                <div className='font-semibold'>
                    {DisplayPriceInRuppes(data?.price)}
                </div>

                <button className='bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg text-sm'>
                    Add
                </button>

            </div>

        </div>
    )
}

export default CardProduct