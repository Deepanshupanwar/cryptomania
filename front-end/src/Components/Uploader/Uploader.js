import { useForm } from "react-hook-form";


import toast, { Toaster } from "react-hot-toast";

import { AddPhotoAlternate } from "@mui/icons-material";
import { useContext } from "react";
import { userContext } from "../../userContext";

export default function Uploader({setPosts}) {
    const { register, handleSubmit,reset } = useForm();
    const {userInfo} = useContext(userContext);

    const onSubmit = async (data) => {

        const newdata = new FormData();
        newdata.set('caption', data.caption);
        newdata.set('file', data.file[0]);
        if(userInfo!==null){
        fetch(`${process.env.REACT_APP_VERCEL_URL}/api/post`, {
            method: 'POST',
            body: newdata,
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((posts) => {
                setPosts(posts)
                toast.success('Post uploaded successfully');
                
            })
            .catch((error) => {
                console.error('Error during post upload:', error);

                let errorMessage = 'An error occurred, please try again later';

                if (error && error.message) {
                    errorMessage = error.message;
                } else if (error && error.error) {
                    errorMessage = error.error;
                }

                toast.error(errorMessage);
            });
        }
        reset();
    }
    return (
        <>
            <Toaster />
            <div className="max-w-md mx-auto p-4 bg-gray-200 rounded-md shadow-xl">
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <input
                        className="w-full px-3 py-2 font-semibold text-gray-800 placeholder-gray-500 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        {...register("caption")}
                        type="text"
                        placeholder="Share your thoughts"
                        required />

                    <div className="relative mt-3">
                        <input
                            {...register("file")}
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            required />
                        <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                            <span className="text-gray-500"><AddPhotoAlternate /></span>
                            <span className="text-blue-500 cursor-pointer">Browse</span>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300 mt-3">
                        Upload
                    </button>
                </form>
            </div>
        </>

    )
}