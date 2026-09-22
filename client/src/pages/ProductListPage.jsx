import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { Link, useParams } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from '../components/Loading'
import CardProduct from '../components/CardProduct'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'

const ProductListPage = () => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPage, setTotalPage] = useState(1)
  const params = useParams()
  const AllSubCategory = useSelector(state => state.product.allSubCategory)
  const [DisplaySubCatory, setDisplaySubCategory] = useState([])

  console.log(AllSubCategory)

  const subCategory = params?.subCategory?.split("-")
  const subCategoryName = subCategory?.slice(0, subCategory?.length - 1)?.join(" ")

  const categoryId = params.category.split("-").slice(-1)[0]
  const subCategoryId = params.subCategory.split("-").slice(-1)[0]


  const fetchProductdata = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          page: page,
          limit: 8,
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        if (responseData.page == 1) {
          setData(responseData.data)
        } else {
          setData([...data, ...responseData.data])
        }
        setTotalPage(responseData.totalCount)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductdata()
  }, [params])


  useEffect(() => {
    const sub = AllSubCategory.filter(s => {
      const filterData = s.category.some(el => {
        return el._id == categoryId
      })

      return filterData ? filterData : null
    })
    setDisplaySubCategory(sub)
  }, [params, AllSubCategory])

  return (
    <section className='bg-gray-100 min-h-screen pt-2'>
      <div className="container mx-auto px-2 lg:px-4 grid grid-cols-[90px,1fr] md:grid-cols-[220px,1fr] lg:grid-cols-[280px,1fr] gap-4">
        {/**sub category **/}
        <div className="sticky top-24 h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-lg border border-gray-100 p-2 scrollbarCustom">
          {
            DisplaySubCatory.map((s, index) => {
               const link = `/${valideURLConvert(s?.category[0]?.name)}-${s?.category[0]?._id}/${valideURLConvert(s.name)}-${s._id}`
              return (
                <Link to={link} className={`flex flex-col lg:flex-row items-center gap-3 p-3 rounded-xl transition-all duration-300 mb-2 border

${
subCategoryId === s._id
? "bg-green-500 text-white shadow-md"
: "bg-white hover:bg-green-50 hover:shadow"
}
`}
                >
                  <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img
                      src={s.image}
                      alt='subCategory'
                      className="w-12 h-12 object-contain transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                  <p
className={`text-center lg:text-left text-xs lg:text-sm font-medium

${subCategoryId===s._id?"text-white":"text-gray-700"}

`}
>{s.name}</p>
                </Link>
              )
            })
          }
        </div>


        {/**Product **/}
        <div className="flex flex-col">
          <div className="sticky top-20 bg-white rounded-2xl shadow-lg border border-gray-100 px-6 py-4 z-20">
            <h3 className="text-2xl font-bold text-gray-800">{subCategoryName}</h3>
          </div>
          <div>

           <div className="mt-4 h-[80vh] overflow-y-auto rounded-2xl bg-white shadow-lg border border-gray-100 scrollbarCustom">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 p-5">
                {
                  data.map((p, index) => {
                    return (
                      <CardProduct
                        data={p}
                        key={p._id + "productSubCategory" + index}
                      />
                    )
                  })
                }
              </div>
           </div>

           {
loading && (
<div className="flex justify-center py-10">
<Loading />
</div>
)
}

          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductListPage