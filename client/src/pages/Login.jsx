import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUserDetails } from '../store/userSlice'

const Login = () => {

    const [data, setData] = useState({
        email: "",
        password: ""
    })

    const [showPassword, setShowPassword] = useState(false)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        const { name, value } = e.target

        setData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const validValue = Object.values(data).every(el => el)

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const res = await Axios({
                ...SummaryApi.login,
                data: data
            })

            console.log("FULL RESPONSE:", res)
            console.log("DATA:", res.data)

            if (res.data.error) {
                toast.error(res.data.message)
                return
            }

            if (res.data.success) {
                toast.success(res.data.message)

                const accessToken = res.data?.data?.accessToken
                const refreshToken = res.data?.data?.refreshToken
                const user = res.data?.data?.user

                console.log("ACCESS TOKEN:", accessToken)
                console.log("REFRESH TOKEN:", refreshToken)
                console.log("USER DATA:", user)

                // Save Tokens
                if (accessToken && refreshToken) {
                    localStorage.setItem("accessToken", accessToken)
                    localStorage.setItem("refreshToken", refreshToken)

                    console.log("✅ Tokens stored in localStorage")
                } else {
                    console.log("❌ Tokens missing in response")
                }

                // 🔥 MOST IMPORTANT FIX
                // Login ke turant baad Redux update hoga
                if (user) {
                    dispatch(setUserDetails(user))
                    console.log("✅ User stored in Redux")
                }

                // Redirect
                navigate("/")
            }

        } catch (error) {
            console.log("ERROR:", error.response?.data)
            AxiosToastError(error)
        }
    }

    return (
        <section className='w-full container mx-auto px-2'>
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
                <p className='text-lg font-semibold text-center'>Login</p>

                <form className='grid gap-4 mt-6' onSubmit={handleSubmit}>

                    {/* Email */}
                    <div className='grid gap-1'>
                        <label htmlFor="email">Email :</label>
                        <input
                            type="email"
                            id='email'
                            className='bg-blue-50 p-2 border rounded'
                            name='email'
                            value={data.email}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Password */}
                    <div className='grid gap-1'>
                        <label htmlFor="password">Password :</label>

                        <div className='bg-blue-50 p-2 border rounded flex items-center'>
                            <input
                                type={showPassword ? "text" : "password"}
                                id='password'
                                className='w-full bg-transparent outline-none'
                                name='password'
                                value={data.password}
                                onChange={handleChange}
                            />

                            <div
                                onClick={() => setShowPassword(prev => !prev)}
                                className='cursor-pointer ml-2'
                            >
                                {
                                    showPassword
                                        ? <FaRegEye />
                                        : <FaRegEyeSlash />
                                }
                            </div>
                        </div>

                        <Link
                            to={"/forgot-password"}
                            className='block ml-auto hover:text-green-600'
                        >
                            Forgot Password
                        </Link>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={!validValue}
                        className={`${
                            validValue
                                ? "bg-green-800 hover:bg-green-700"
                                : "bg-gray-500 cursor-not-allowed"
                        } text-white py-2 rounded font-semibold my-3 tracking-wide`}
                    >
                        Login
                    </button>

                </form>

                <p className='text-center'>
                    Don’t have account?{" "}
                    <Link
                        to={"/register"}
                        className='font-semibold text-green-700 hover:text-green-800'
                    >
                        Register
                    </Link>
                </p>
            </div>
        </section>
    )
}

export default Login