import React, { useState } from 'react'
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { Link, useNavigate } from 'react-router-dom'

const ForgotPassword = () => {

    const [email, setEmail] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        try{
            const res = await Axios({
                ...SummaryApi.forgotPassword,
                data: { email }
            })

            console.log("response", res.data)

            if(res.data.error){
                toast.error(res.data.message)
            }

            if(res.data.success){
                toast.success(res.data.message)

                // ✅ IMPORTANT FIX
                localStorage.setItem("email", email)

                setEmail("")

                // ✅ simple navigate
                navigate("/verification-otp")
            }

        }catch(error){
            console.log(error.response?.data)
            AxiosToastError(error)
        }
    }

  return (
    <section className='w-full container mx-auto px-2'>
        <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
            
            <p className='text-lg font-semibold'>Forgot Password</p>

            <form className='grid gap-4 mt-6' onSubmit={handleSubmit}>
                
                <div className='grid gap-1'>
                    <label htmlFor="email">Email :</label>
                    <input 
                        type="email"
                        id="email"
                        className='bg-blue-50 p-2 border rounded'
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                    />
                </div>

                <button 
                    type="submit"
                    disabled={!email}
                    className={`${
                        email ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"
                    } text-white py-2 rounded font-semibold my-3 tracking-wide`}
                >
                    Send OTP
                </button>

            </form>

            <p>
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

export default ForgotPassword