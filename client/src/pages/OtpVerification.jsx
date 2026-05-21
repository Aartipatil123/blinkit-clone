import React, { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/summaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { useNavigate, Link } from 'react-router-dom'

const OtpVerification = () => {

    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const navigate = useNavigate()
    const inputRefs = useRef([])

    // ✅ check all fields filled
    const validValue = otp.every(el => el !== "")

    // ✅ handle change + auto focus
    const handleChange = (value, index) => {

        if (!/^[0-9]?$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        if (value && index < 5) {
            inputRefs.current[index + 1].focus()
        }
    }

    // ✅ handle backspace
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus()
        }
    }

    // ✅ submit (FIXED 🔥)
    const handleSubmit = async (e) => {
        e.preventDefault()

        const email = localStorage.getItem("email")  // ✅ get email

        if (!email) {
            toast.error("Email not found. Please try again.")
            navigate("/forgot-password")
            return
        }

        const finalOtp = otp.join("")

        console.log("Sending Data:", { email, otp: finalOtp })

        try {
            const res = await Axios({
                ...SummaryApi.forgot_password_otp_verification,
                data: {
                    email: email,          // ✅ FIX
                    otp: finalOtp          // ✅ FIX
                }
            })

            console.log("Response:", res)

            if (res.data.error) {
                toast.error(res.data.message)
            }

            if (res.data.success) {
                toast.success(res.data.message)
                setOtp(["", "", "", "", "", ""])
                navigate("/reset-password")
            }

        } catch (error) {
            console.log("Error:", error)
            AxiosToastError(error)
        }
    }

    return (
        <section className='w-full container mx-auto px-2'>
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>

                <p className='text-lg font-semibold text-center'>Enter OTP</p>

                <form className='grid gap-4 mt-6' onSubmit={handleSubmit}>

                    <div className='text-center'>
                        <label className='block mb-2'>Enter Your OTP :</label>

                        <div className='flex justify-center gap-2'>
                            {
                                otp.map((element, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength="1"
                                        value={element}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        onChange={(e) => handleChange(e.target.value, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        className='w-10 h-10 text-center border rounded bg-blue-50 focus:border-green-500 outline-none'
                                    />
                                ))
                            }
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!validValue}
                        className={`${validValue
                                ? "bg-green-800 hover:bg-green-700"
                                : "bg-gray-500 cursor-not-allowed"
                            } text-white py-2 rounded font-semibold my-3 tracking-wide`}
                    >
                        Verify OTP
                    </button>

                </form>

                <p className='text-center'>
                    Back to{" "}
                    <Link
                        to={"/login"}
                        className='font-semibold text-green-700 hover:text-green-800'
                    >
                        Login
                    </Link>
                </p>

            </div>
        </section>
    )
}

export default OtpVerification