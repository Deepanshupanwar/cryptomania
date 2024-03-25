import { Link} from "react-router-dom";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";



export default function ForgotPassword() {
  
  const { register, handleSubmit, formState } = useForm();


  const {errors} = formState;
  const onSubmit = async(data) => {
    const response = await fetch(`${process.env.REACT_APP_VERCEL_URL}api/forgotPassword`,{
      method: 'POST',
      body: JSON.stringify(data),
      headers:{'Content-type': 'application/json'},
    });
    if(response.ok){
        toast.success("reset link sent")
    }
    else
    {
      const res= await response.json();
      toast.error(res.error)
    }
  };

  
  
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
              Forgot Password
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
                
                />
              </div>
              <p>{errors.email?.message}</p>
              <button
                type="submit"
                className="w-full text-white bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Send Mail
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
