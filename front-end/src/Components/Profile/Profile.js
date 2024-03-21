import { Link, useParams } from "react-router-dom"
import Header from "../Header/Header"
import { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import { Avatar } from "@mui/material";
import Post from "../Posts/Post";
import { userContext } from "../../userContext";
import toast, { Toaster } from "react-hot-toast";
import Dialog from '@mui/material/Dialog';
import { Close } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import '../Profile/Profile.css'
export default function Profile() {
    const { id } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [openposts, setOpenposts] = useState(true);
    const [posts, setPosts] = useState(null)
    const { userInfo, setUserInfo, socket } = useContext(userContext);
    const [requested, setRequested] = useState(false);
    const [open, setOpen] = useState(false);
    const [scroll, setScroll] = useState('paper');
    const { register, handleSubmit } = useForm();
    const getProfile = async () => {
        const response = await fetch(`${process.env.REACT_APP_VERCEL_URL}/api/profile/` + id, {
            method: 'GET'
        })
        if (response.status === 200) {
            response.json().then(userinfo => {
                setProfileData(userinfo);
            })
        }
        else {
            response.json().then(err => {
                toast.error(err.error);
            })
            setProfileData(null)
        }
    }
    const addFriend = async (id) => {
        if (userInfo !== null) {
            socket?.emit('addFriend', {
                senderId: userInfo._id,
                receiverId: id
            })
            setRequested(true);
        }
    }


    const removeFriend = async (id) => {
        if (userInfo !== null) {
            fetch(`${process.env.REACT_APP_VERCEL_URL}/api/removefriend`, {
                method: 'DELETE',
                credentials: "include",
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ friend_id: id })
            })
                .then(res => res.json())
                .then(data => {
                    setUserInfo(data)
                    toast.success("friend removed")
                })
                .catch(error => {
                    console.log(error);
                    toast.error("couldn't remove friend!")
                })
        }
    }

    const editProfile = async (data) => {
        const newdata = new FormData();
        newdata.set('firstName', data.firstName);
        newdata.set('lastName', data.lastName);
        newdata.set('file', data.file[0]);
        if (userInfo !== null) {
            fetch(`${process.env.REACT_APP_VERCEL_URL}/api/profileEdit`, {
                method: 'PUT',
                credentials: 'include',
                body: newdata
            })
                .then(res => res.json())
                .then(user_data => {
                    setProfileData(user_data);
                    setUserInfo(user_data);
                    handleClose();
                    toast.success('profile updated successfully')
                })
                .catch(err => {
                    console.log(err);
                    toast.error("error updating changes!!");
                })
        }
    }

    const getposts = async () => {
        fetch(`${process.env.REACT_APP_VERCEL_URL}/api/getPost/` + id, {
            method: 'GET',
        })
            .then(res => res.json())
            .then(post => {
                setPosts(post);

            })
            .catch(error => {
                setPosts(null);
                toast.error(error.error);
            })
    }

    const handleClickOpen = (scrollType) => () => {
        setOpen(true);
        setScroll(scrollType);


    };

    const handleClose = () => {
        setOpen(false);

    };

    const descriptionElementRef = useRef(null);
    useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);
// eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        getposts()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])
// eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        getProfile()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])
// eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        socket?.on('requestsended', async (payload) => {
            toast.success(payload.message);
        })
        return () => { socket?.off('requestsended'); }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <Toaster />
            {profileData && <div className="max-h-[95vh] overflow-y-auto no-scrollbar">
                <Dialog open={open} onClose={handleClose} scroll={scroll}>
                    <div className="modalInit p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-2xl font-bold">Edit Post</h1>
                            <button className="text-gray-600 hover:text-gray-800" onClick={handleClose}>
                                <Close className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit(editProfile)}>
                            <input
                                {...register('firstName')}
                                className="w-full px-3 py-2 font-semibold text-gray-800 placeholder-gray-500 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 mb-4"
                                type="text"
                                defaultValue={profileData.firstName}
                                placeholder="Edit FirstName"
                            />
                            <input
                                {...register('lastName')}
                                className="w-full px-3 py-2 font-semibold text-gray-800 placeholder-gray-500 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 mb-4"
                                type="text"
                                defaultValue={profileData.lastName}
                                placeholder="Edit LastName"

                            />
                            <input
                                {...register('file')}
                                className="w-full px-3 py-2 font-semibold text-gray-800 placeholder-gray-500 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 mb-4"
                                type="file"
                                accept="image/*"
                                placeholder="Edit Profile Pic"
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300">
                                Upload Changes
                            </button>
                        </form>
                    </div>

                </Dialog>
                <Header />
                <div className="container mx-auto mt-8 p-8 bg-white shadow-lg rounded-lg profile-details">
                    <div className="flex flex-col border-b p-4 ">
                        <div className="flex items-center space-x-8 ">
                            <Avatar src={profileData?.profilePic} sx={{ width: 100, height: 100 }} className="rounded-full shadow-md" /> {/* Increased size */}
                            <div className="flex items-center justify-between w-full"> {/* Added flex and w-full */}
                                <div>
                                    <h1 className="font-sans text-2xl font-medium text-gray-800">{profileData?.firstName} {profileData?.lastName}</h1>
                                    <p className="text-base text-gray-600">Friends: {profileData?.friends?.length || 0}</p>
                                </div>
                                {userInfo && (userInfo?._id === profileData?._id ? (<button className="text-blue-500 border border-blue-500 hover:text-blue-700 hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 px-2 py-1 rounded-md"
                                    onClick={handleClickOpen('body')}
                                >
                                    Edit Profile
                                </button>) : requested ? (<p className="text-blue-500 border border-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 px-2 py-1 rounded-md">Requested</p>) : userInfo?.friends &&
                                    Array.isArray(userInfo.friends) &&
                                    userInfo?.friends?.some((friend) => friend._id === profileData?._id) ? (<button className="text-blue-500 border border-blue-500 hover:text-blue-700 hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 px-2 py-1 rounded-md"
                                        onClick={() => removeFriend(profileData._id)}
                                    >
                                        Remove Friend
                                    </button>) : (<button className="text-blue-500 border border-blue-500 hover:text-blue-700 hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 px-2 py-1 rounded-md"
                                        onClick={() => addFriend(profileData._id)}
                                    >
                                        Add Friend
                                    </button>))
                                }
                            </div>
                        </div>
                    </div>


                    <div className="flex justify-center p-4 border-b">
                        <button
                            className={`
          ${openposts ? 'bg-blue-500 text-white' : 'text-blue-500 border border-blue-500 hover:bg-blue-100 hover:text-white'}
          px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        `}
                            onClick={() => setOpenposts(true)}
                        >
                            Posts
                        </button>
                        <button
                            className={`
          ${!openposts ? 'bg-blue-500 text-white' : 'text-blue-500 border border-blue-500 hover:bg-blue-100 hover:text-white'}
          px-4 py-2 rounded-md ml-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        `}
                            onClick={() => setOpenposts(false)}
                        >
                            Friends
                        </button>
                    </div>
                </div>
                <div className="p-4 mx-auto max-w-lg">
                    {openposts ? (
                        <Post posts={posts} setPosts={setPosts} userid={id} className="grid grid-cols-1 md:grid-cols-2 gap-4" />//
                    ) : (
                        <div className="flex flex-col gap-4">
                            {profileData.friends.length > 0 && profileData.friends.map((friend, index) => (
                                <div key={index} className="flex items-center justify-between border-b py-2">
                                    <Link to={`/profile/${friend._id}`} className="flex items-center">

                                        <Avatar src={friend?.profilePic} />

                                        <div className="ml-2">
                                            <p className="text-black mr-2">{friend.firstName + ' ' + friend.lastName}</p>
                                        </div>
                                    </Link>
                                    <div className="flex items-center">
                                        {userInfo?._id === friend._id || userInfo === null ? <></> : userInfo?.friends &&
                                            Array.isArray(userInfo.friends) &&
                                            friend?.notifications?.some((notify) => notify.sender === userInfo?._id) ? (<p className="text-blue-500 border border-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 px-2 py-1 rounded-md">Requested</p>) :
                                            userInfo?.friends?.some((userfriend) => userfriend._id === friend._id) ? (
                                                <button className="text-blue-500 border border-blue-500 hover:text-blue-700 hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 px-2 py-1 rounded-md"
                                                    onClick={() => removeFriend(friend._id)}
                                                >
                                                    Remove Friend
                                                </button>
                                            ) : (
                                                <button className="text-blue-500 border border-blue-500 hover:text-blue-700 hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 px-2 py-1 rounded-md"
                                                    onClick={() => addFriend(friend._id)}
                                                >
                                                    Add Friend
                                                </button>
                                            )
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>

                    )}
                </div>

            </div>}

        </>
    )
}