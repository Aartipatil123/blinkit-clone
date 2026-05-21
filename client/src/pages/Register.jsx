import React, { useState } from 'react'
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/summaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {

    const [data, setData] = useState({
        name : "",
        email : "",
        password : "",
        confirmPassword : ""
    })

    const [showPassword,setShowPassword] = useState(false)
    const [showConfirmPassword,setShowConfirmPassword] = useState(false)
    const navigate = useNavigate()
    
    const handleChange = (e) =>{
        const { name, value } = e.target

        setData((prev)=>({
            ...prev,
            [name] : value
        }))
    }

    const valideValue = Object.values(data).every(el => el)

    const handleSubmit = async(e) => {
        e.preventDefault()

        if(data.password !== data.confirmPassword){
            toast.error("Password and confirm Password must be same")
            return
        }

        try{
            const res = await Axios({
                ...SummaryApi.register, 
                data : {
                    name: data.name,
                    email: data.email,
                    password: data.password
                }
            })

            if(res.data.error){
                toast.error(res.data.message)
            }

            if(res.data.success){
                toast.success(res.data.message)
                setData({
                    name : "",
                    email : "",
                    password : "",
                    confirmPassword : ""
                })
                navigate("/login")
            }

        } catch(error){
            console.log(error.response?.data)   // 🔥 debug add kiya
            AxiosToastError(error)
        }
    }

  return (
    <section className='w-full container mx-auto px-2'>
        <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
           <p>Welcome to Binkeyit</p>

           <form className='grid gap-4 mt-6' onSubmit={handleSubmit}>
            
            <div className='grid gap-1'>
                <label htmlFor="name">Name :</label>
                <input 
                   type="text" 
                   id='name'
                   autoFocus
                   className='bg-blue-50 p-2 border rounded'
                   name='name'
                   value={data.name}
                   onChange={handleChange}
                />
            </div>

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
                        onClick={()=> setShowPassword(prev => !prev)} 
                        className='cursor-pointer ml-2'
                    >
                        { showPassword ? <FaRegEye/> : <FaRegEyeSlash/> }
                    </div>
                </div>
            </div>

            <div className='grid gap-1'>
                <label htmlFor="confirmPassword">Confirm Password :</label>

                <div className='bg-blue-50 p-2 border rounded flex items-center'>
                    <input 
                       type={showConfirmPassword ? "text" : "password"} 
                       id='confirmPassword'
                       className='w-full bg-transparent outline-none'
                       name='confirmPassword'
                       value={data.confirmPassword}
                       onChange={handleChange}
                    />
                   
                    <div 
                        onClick={()=> setShowConfirmPassword(prev => !prev)} 
                        className='cursor-pointer ml-2'
                    >
                        { showConfirmPassword ? <FaRegEye/> : <FaRegEyeSlash/> }
                    </div>
                </div>
            </div>

            <button 
                disabled={!valideValue} 
                className={`${
                    valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"
                } text-white py-2 rounded font-semibold my-3 tracking-wide`}
            >
                Register
            </button>

           </form>

           <p>
            Already have account ?{" "}
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

export default Register