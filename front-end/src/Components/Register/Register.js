import { Link, Navigate } from 'react-router-dom'
import { useContext, useState } from 'react';
import './Register.css'
import { useForm } from 'react-hook-form'

import toast, {Toaster} from 'react-hot-toast';
import { userContext } from '../../userContext';

export default function Register() {
   
    const [redirect, setRedirect] = useState(false);
    const {setUserInfo}  = useContext(userContext);
    const {register,handleSubmit, formState} =useForm();
    const {errors} = formState;
    const onSubmit = async(data)=>{
        if(data.password === data.confirm_password)
        {
            const response = await fetch(`${process.env.REACT_APP_VERCEL_URL}/api/register`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {'Content-type':'application/json'},
                credentials: 'include'
            })
            if(response.status===200)
            {
                toast.success("account created successfully")
                response.json().then(userInfo=>{
                    setUserInfo(userInfo);
                    setRedirect(true);
                  })
            }
            if(response.status===400)
            {
                toast.error("Email already exists!")
            }
            else
            {
                
                toast.error("internal error")
            }
        }
        else
        {
            toast.error("password didn't match");
        }
    }

    if(redirect)
    {
        return <Navigate to={'/'} />
    }


    return (
        <>
        <Toaster />
        <div className="bg-gray-50">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <Link to="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900">
                    <img className="w-8 h-8 mr-2" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/800px-Bitcoin.svg.png" alt="logo" />
                    CryptoMania
                </Link>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 ">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Create your account
                        </h1>
                        <form onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4 md:space-y-6">
                            <div className="grid gap-6 mb-6 md:grid-cols-2">
                                <div>
                                    <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-900 ">First name</label>
                                    <input
                                    {...register("firstName")} 
                                    type="text" 
                                    id="firstName" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="John" required 
                                    // value={firstName}
                                    // onChange={e=>{
                                    //     setFirstName(e.target.value)
                                    //}}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-900 ">Last name</label>
                                    <input 
                                    {...register("lastName")}
                                    type="text" 
                                    id="lastName" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Doe" required 
                                    // value={lastName}
                                    // onChange={e=>{
                                    //     setLastName(e.target.value)
                                    // }}
                                    />
                                </div>
                            </div>
                            <div className="mb-6">
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">Email address</label>
                                <input
                                {...register("email", {
                                    pattern: {
                                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                      message: "Invalid Email Format",
                                    },
                                })} 
                                type="email" 
                                id="email" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="john.doe@company.com" required 
                                // value={usermail}
                                //     onChange={e=>{
                                //         setUsermail(e.target.value)
                                //     }}
                                />
                            </div>
                            <p>{errors.email?.message}</p>
                            <div className="mb-6">
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                                <input 
                                 {...register("password", {
                                    required: "password is required",
                                    minLength: {
                                      value: 8,
                                      message: "password should be more than 8 length",
                                    },
                                  })}
                                type="password" 
                                id="password" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="•••••••••" required 
                                // value={password}
                                //     onChange={e=>{
                                //         setPassword(e.target.value)
                                //     }}
                                />
                            </div>
                            <p>{errors.password?.message}</p>
                            <div className="mb-6">
                                <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-gray-900">Confirm password</label>
                                <input
                                 {...register("confirm_password", {
                                    required: "password is required",
                                    minLength: {
                                      value: 8,
                                      message: "password should be more than 8 length",
                                    },
                                  })} 
                                type="password" 
                                id="confirm_password" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="•••••••••" required 
                                // value={confirm}
                                //     onChange={e=>{
                                //         setConfirm(e.target.value)
                                //     }}
                                />
                            </div>
                            <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  px-5 py-2.5 text-center">Submit</button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
        </>
    )
}