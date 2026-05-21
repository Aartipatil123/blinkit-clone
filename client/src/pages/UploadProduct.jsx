import React, { useState } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa"
import uploadImage from '../utils/UploadImage'
import ViewImage from '../components/ViewImage'
import { IoClose } from "react-icons/io5"
import { useSelector } from 'react-redux'
import AddFieldComponent from '../components/AddFieldComponent'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import successAlert from '../utils/SuccessAlert'
import AxiosToastError from '../utils/AxiosToastError'
import { useEffect } from 'react'

const UploadProduct = () => {

  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: {},
  })

  const [loading, setLoading] = useState(false)
  const [viewImageURL, setViewImageURL] = useState("")
  const [selectCategory, setSelectCategory] = useState("")
  const [selectSubCategory, setSelectSubCategory] = useState("")
  const [openAddField, setOpenAddField] = useState(false)
  const [fieldName, setFieldName] = useState("")

  const allCategory = useSelector(state => state.product.allCategory)
  const allSubCategory = useSelector(state => state.product.allSubCategory)

  // ================= INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target

    setData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // ================= IMAGE UPLOAD =================
  const handleUploadImage = async (e) => {
    try {

      const file = e.target.files[0]

      if (!file) return

      setLoading(true)

      const response = await uploadImage(file)

      const imageUrl =
        response?.data?.url ||
        response?.data?.data?.url ||
        response?.url ||
        ""

      if (imageUrl) {
        setData(prev => ({
          ...prev,
          image: [...prev.image, imageUrl]
        }))
      }

    } catch (error) {
      console.log(error)
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  // ================= REMOVE IMAGE =================
  const handleRemoveImage = (index) => {
    setData(prev => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index)
    }))
  }

  // ================= CATEGORY =================
  const handleAddCategory = (value) => {

    const category = allCategory.find(el => el._id === value)

    if (!category) return

    const alreadyExists = data.category.some(el => el._id === value)

    if (alreadyExists) return

    setData(prev => ({
      ...prev,
      category: [...prev.category, category],
      subCategory: []
    }))
  }

  const handleRemoveCategory = (id) => {
    setData(prev => ({
      ...prev,
      category: prev.category.filter(el => el._id !== id),
      subCategory: []
    }))
  }

  // ================= SUB CATEGORY =================
  const handleAddSubCategory = (value) => {

    const sub = allSubCategory.find(el => el._id === value)

    if (!sub) return

    const alreadyExists = data.subCategory.some(el => el._id === value)

    if (alreadyExists) return

    setData(prev => ({
      ...prev,
      subCategory: [...prev.subCategory, sub]
    }))
  }

  const handleRemoveSubCategory = (id) => {
    setData(prev => ({
      ...prev,
      subCategory: prev.subCategory.filter(el => el._id !== id)
    }))
  }

  // ================= ADD MORE FIELD =================
  const handleAddField = () => {

    if (!fieldName) return

    setData(prev => ({
      ...prev,
      more_details: {
        ...prev.more_details,
        [fieldName]: ""
      }
    }))

    setFieldName("")
    setOpenAddField(false)
  }

  // ================= FILTER SUB CATEGORY =================
  const filteredSubCategory =
    data.category.length === 0
      ? allSubCategory
      : allSubCategory.filter(sub =>
        data.category.some(cat =>
          sub.category?.some(c => c._id === cat._id)
        )
      )

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      if (data.image.length === 0) {
        return alert("Please upload product image")
      }

      if (data.category.length === 0) {
        return alert("Please select category")
      }

      if (data.subCategory.length === 0) {
        return alert("Please select sub category")
      }

      const payload = {
        ...data,
        category: data.category.map(cat => cat._id),
        subCategory: data.subCategory.map(sub => sub._id)
      }

      console.log("Final Payload :", payload)

      const response = await Axios({
        ...SummaryApi.createProduct,
        data: payload
      })

      const { data: responseData } = response

      if (responseData.success) {
        successAlert(responseData.message)

        // RESET FORM
        setData({
          name: "",
          image: [],
          category: [],
          subCategory: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          more_details: {},
        })
      }

    } catch (error) {
      console.log(error)
      AxiosToastError(error)
    }
  }

  useEffect(()=>{
    successAlert("Upload Successfully")
  },[])

  return (
    <section className='p-4'>

      <h2 className='text-xl font-bold mb-4'>
        Upload Product
      </h2>

      <div className='bg-white p-4 rounded-xl shadow'>

        <form
          onSubmit={handleSubmit}
          className='grid gap-4'
        >

          {/* PRODUCT NAME */}
          <div className='grid gap-1'>
            <label className='font-semibold'>
              Product Name
            </label>

            <input
              type='text'
              name='name'
              placeholder='Enter Product Name'
              value={data.name}
              onChange={handleChange}
              className='p-2 border rounded bg-blue-50'
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div className='grid gap-1'>
            <label className='font-semibold'>
              Description
            </label>

            <textarea
              name='description'
              placeholder='Enter Description'
              value={data.description}
              onChange={handleChange}
              className='p-2 border rounded bg-blue-50'
              required
            />
          </div>

          {/* IMAGE */}
          <div className='grid gap-1'>

            <label className='font-semibold'>
              Product Image
            </label>

            <label className='h-24 border rounded bg-blue-50 flex justify-center items-center cursor-pointer'>

              <div className='flex flex-col items-center'>

                <FaCloudUploadAlt size={35} />

                <p className='text-sm'>
                  {loading ? "Uploading..." : "Upload Image"}
                </p>

              </div>

              <input
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleUploadImage}
              />

            </label>

            {/* IMAGE PREVIEW */}
            <div className='flex gap-3 flex-wrap'>

              {
                data.image.map((img, index) => {
                  return (
                    <div
                      key={index}
                      className='relative w-20 h-20 border rounded bg-blue-50'
                    >

                      <img
                        src={img}
                        alt='product'
                        className='w-full h-full object-contain cursor-pointer'
                        onClick={() => setViewImageURL(img)}
                      />

                      <div
                        onClick={() => handleRemoveImage(index)}
                        className='absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 cursor-pointer'
                      >
                        <IoClose size={14} />
                      </div>

                    </div>
                  )
                })
              }

            </div>
          </div>

          {/* CATEGORY */}
          <div className='grid gap-1'>

            <label className='font-semibold'>
              Category
            </label>

            <select
              value={selectCategory}
              onChange={(e) => {
                handleAddCategory(e.target.value)
                setSelectCategory("")
              }}
              className='p-2 border rounded bg-blue-50'
            >
              <option value="">Select Category</option>

              {
                allCategory.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))
              }

            </select>

            <div className='flex gap-2 flex-wrap'>

              {
                data.category.map(cat => (
                  <div
                    key={cat._id}
                    className='bg-blue-100 px-3 py-1 rounded flex items-center gap-1'
                  >
                    {cat.name}

                    <IoClose
                      className='cursor-pointer'
                      onClick={() => handleRemoveCategory(cat._id)}
                    />
                  </div>
                ))
              }

            </div>
          </div>

          {/* SUB CATEGORY */}
          <div className='grid gap-1'>

            <label className='font-semibold'>
              Sub Category
            </label>

            <select
              value={selectSubCategory}
              onChange={(e) => {
                handleAddSubCategory(e.target.value)
                setSelectSubCategory("")
              }}
              className='p-2 border rounded bg-blue-50'
            >

              <option value="">Select Sub Category</option>

              {
                filteredSubCategory.map(sub => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))
              }

            </select>

            <div className='flex gap-2 flex-wrap'>

              {
                data.subCategory.map(sub => (
                  <div
                    key={sub._id}
                    className='bg-green-100 px-3 py-1 rounded flex items-center gap-1'
                  >
                    {sub.name}

                    <IoClose
                      className='cursor-pointer'
                      onClick={() => handleRemoveSubCategory(sub._id)}
                    />
                  </div>
                ))
              }

            </div>

          </div>

          {/* UNIT */}
          <div className='grid gap-1'>

            <label className='font-semibold'>
              Unit
            </label>

            <input
              type='text'
              name='unit'
              placeholder='500ml / 1kg / 1 piece'
              value={data.unit}
              onChange={handleChange}
              className='p-2 border rounded bg-blue-50'
              required
            />

          </div>

          {/* STOCK */}
          <div className='grid gap-1'>

            <label className='font-semibold'>
              Stock
            </label>

            <input
              type='number'
              name='stock'
              placeholder='Enter Stock'
              value={data.stock}
              onChange={handleChange}
              className='p-2 border rounded bg-blue-50'
              required
            />

          </div>

          {/* PRICE */}
          <div className='grid gap-1'>

            <label className='font-semibold'>
              Price
            </label>

            <input
              type='number'
              name='price'
              placeholder='Enter Price'
              value={data.price}
              onChange={handleChange}
              className='p-2 border rounded bg-blue-50'
              required
            />

          </div>

          {/* DISCOUNT */}
          <div className='grid gap-1'>

            <label className='font-semibold'>
              Discount
            </label>

            <input
              type='number'
              name='discount'
              placeholder='Enter Discount'
              value={data.discount}
              onChange={handleChange}
              className='p-2 border rounded bg-blue-50'
            />

          </div>

          {/* MORE DETAILS */}
          <div>

            {
              Object.keys(data.more_details).map((key, index) => {
                return (
                  <div
                    key={index}
                    className='grid gap-1 mb-3'
                  >

                    <label>
                      {key}
                    </label>

                    <input
                      type='text'
                      value={data.more_details[key]}
                      onChange={(e) => {

                        const value = e.target.value

                        setData(prev => ({
                          ...prev,
                          more_details: {
                            ...prev.more_details,
                            [key]: value
                          }
                        }))
                      }}
                      className='p-2 border rounded bg-blue-50'
                    />

                  </div>
                )
              })
            }

          </div>

          {/* ADD FIELD BUTTON */}
          <div
            onClick={() => setOpenAddField(true)}
            className='w-32 text-center py-2 rounded bg-primary-200 hover:bg-primary-300 cursor-pointer font-semibold'
          >
            Add Fields
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type='submit'
            disabled={loading}
            className='bg-primary-200 hover:bg-primary-300 p-2 rounded font-semibold'
          >
            {
              loading ? "Uploading..." : "Upload Product"
            }
          </button>

        </form>

      </div>

      {/* VIEW IMAGE */}
      {
        viewImageURL && (
          <ViewImage
            url={viewImageURL}
            close={() => setViewImageURL("")}
          />
        )
      }

      {/* ADD FIELD MODAL */}
      {
        openAddField && (
          <AddFieldComponent
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            submit={handleAddField}
            close={() => setOpenAddField(false)}
          />
        )
      }

    </section>
  )
}

export default UploadProduct