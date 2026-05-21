import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import CardLoading from '../components/CardLoading'
import CardProduct from './CardProduct'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

const CategoryWiseProductDisplay = ({ id, name }) => {

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    const containerRef = useRef()

    const fetchCategoryWiseProduct = async () => {
        try {
            setLoading(true)

            const response = await Axios({
                ...SummaryApi.getProductByCategory,
                data: {
                    id: id
                }
            })

            const { data: responseData } = response

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
        fetchCategoryWiseProduct()
    }, [])

    const handleScrollRight = () => {
        containerRef.current.scrollLeft += 300
    }

    const handleScrollLeft = () => {
        containerRef.current.scrollLeft -= 300
    }

    const loadingCardNumber = new Array(6).fill(null)

    return (
        <div className='container mx-auto px-4 my-6 relative'>

            <div className='flex items-center justify-between mb-4'>
                <h3 className='font-semibold text-lg md:text-xl'>
                    {name}
                </h3>

                <Link
                    to=""
                    className='text-green-600 hover:text-green-400'
                >
                    See All
                </Link>
            </div>

            {/* Scroll Buttons */}
            <div className='absolute top-[50%] left-0 right-0 hidden lg:flex justify-between px-2 z-10'>
                <button
                    onClick={handleScrollLeft}
                    className='bg-white hover:bg-gray-200 shadow-lg p-3 rounded-full'
                >
                    <FaAngleLeft />
                </button>

                <button
                    onClick={handleScrollRight}
                    className='bg-white hover:bg-gray-200 shadow-lg p-3 rounded-full'
                >
                    <FaAngleRight />
                </button>
            </div>

            {/* Product Container */}
            <div
                ref={containerRef}
                className='flex items-center gap-4 md:gap-6 lg:gap-8 overflow-x-scroll scrollbar-none scroll-smooth'
            >

                {
                    loading &&
                    loadingCardNumber.map((_, index) => {
                        return (
                            <CardLoading
                                key={"CategorywiseProductDisplay" + index}
                            />
                        )
                    })
                }

                {
                    data.map((p, index) => {
                        return (
                            <CardProduct
                                data={p}
                                key={p._id + "CategorywiseProductDisplay" + index}
                            />
                        )
                    })
                }

            </div>

        </div>
    )
}

export default CategoryWiseProductDisplay