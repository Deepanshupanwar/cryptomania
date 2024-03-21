import { Link, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import "./Login.css";
import { useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { userContext } from "../../userContext";
import { io } from "socket.io-client";

export default function Login() {
  // const [usermail, setUsermail] = useState('');
  // const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { register, handleSubmit, formState } = useForm();
  const {setUserInfo,setSocket} = useContext(userContext);

  const {errors} = formState;
  const onSubmit = async(data) => {
    const response = await fetch('http://localhost:4000/api/login/',{
      method: 'POST',
      body: JSON.stringify(data),
      headers:{'Content-type': 'application/json'},
      credentials: 'include',
    });
    if(response.ok){
      response.json().then(userInfo=>{
        setUserInfo(userInfo);
        setRedirect(true);
        setSocket(io('http://localhost:4000/'))
      })
    }
    else
    {
      const res= await response.json();
      toast.error(res.error)
    }
  };

  if(redirect)
  {
    return <Navigate to={'/'}/>
  }
  
  return (
    <>
    <Toaster/>
    <section className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Link
          to="/"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900"
        >
          <img
            className="w-8 h-8 mr-2"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/800px-Bitcoin.svg.png"
            alt="logo"
          />
          CryptoMania
        </Link>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 ">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Sign in to your account
            </h1>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 md:space-y-6"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Your email
                </label>
                <input
                  {...register("email", {
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid Email Format",
                    },
                  })}
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="name@company.com"
                  required=""
                //   value={usermail}
                //   onChange={(e) => setUsermail(e.target.value)}
                />
              </div>
              <p>{errors.email?.message}</p>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <input
                  {...register("password", {
                    required: "password is required",
                    minLength: {
                      value: 8,
                      message: "password should be more than 8 length",
                    },
                  })}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  required=""
                //   value={password}
                //   onChange={(e) => {
                //     setPassword(e.target.value);
                //   }}
                />
              </div>
              <p>{errors.password?.message}</p>
              <button
                type="submit"
                className="w-full text-white bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Sign in
              </button>
              <p className="text-sm font-light text-gray-500">
                Don't have an account yet?{" "}
                <Link
                  to="/register"
                  className="font-medium text-primary-600 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
