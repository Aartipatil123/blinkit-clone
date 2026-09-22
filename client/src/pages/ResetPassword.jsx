import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'

const ResetPassword = () => {

    const location = useLocation()
    const navigate = useNavigate()

    const [data, setData] = useState({
        email: "",
        newPassword: "",
        confirmPassword: ""
    })

    // ✅ Get email from location OR localStorage
    useEffect(() => {

        if (location?.state?.email) {
            setData((prev) => ({
                ...prev,
                email: location.state.email
            }))
        } else {
            const email = localStorage.getItem("email")

            if (email) {
                setData((prev) => ({
                    ...prev,
                    email: email
                }))
            } else {
                toast.error("Session expired. Try again.")
                navigate("/forgot-password")
            }
        }

    }, [])

    // ✅ handle input change
    const handleChange = (e) => {
        const { name, value } = e.target
        setData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    // ✅ handle submit
    const handleSubmit = async (e) => {
        e.preventDefault()

        const { email, newPassword, confirmPassword } = data

        if (!email || !newPassword || !confirmPassword) {
            toast.error("All fields are required")
            return
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        try {
            console.log("Sending:", data)

            const res = await Axios({
                ...SummaryApi.reset_Password,   // ✅ MATCH YOUR API NAME
                data: {
                    email,
                    newPassword,
                    confirmPassword
                }
            })

            console.log("Response:", res)

            if (res.data?.success) {
                toast.success(res.data.message || "Password updated successfully")

                // clear email
                localStorage.removeItem("email")

                setData({
                    email: "",
                    newPassword: "",
                    confirmPassword: ""
                })

                // redirect after 1 sec
                setTimeout(() => {
                    navigate("/login")
                }, 1000)

            } else {
                toast.error(res.data?.message || "Something went wrong")
            }

        } catch (error) {
            console.log(error)
            AxiosToastError(error)
        }
    }

    return (
        <section className='w-full container mx-auto px-2'>
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7 shadow'>

                <h2 className='text-xl font-bold text-center mb-4'>
                    Reset Password
                </h2>

                <form className='grid gap-4' onSubmit={handleSubmit}>

                    <div>
                        <label>Email :</label>
                        <input
                            type="email"
                            name="email"
                            value={data.email}
                            disabled
                            className='w-full p-2 border rounded bg-gray-100'
                        />
                    </div>

                    <div>
                        <label>New Password :</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={data.newPassword}
                            onChange={handleChange}
                            className='w-full p-2 border rounded bg-blue-50'
                        />
                    </div>

                    <div>
                        <label>Confirm Password :</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={data.confirmPassword}
                            onChange={handleChange}
                            className='w-full p-2 border rounded bg-blue-50'
                        />
                    </div>

                    <button
                        type="submit"
                        className='bg-green-800 hover:bg-green-700 text-white py-2 r
                        ounded font-semibold transition'
                    >
                        Update Password
                    </button>

                </form>

            </div>
        </section>
    )
}

export default ResetPassword