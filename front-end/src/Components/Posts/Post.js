import ThumbUpAltTwoToneIcon from '@mui/icons-material/ThumbUpAltTwoTone'; 
import ThumbDownTwoToneIcon from '@mui/icons-material/ThumbDownTwoTone';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Dialog from '@mui/material/Dialog';
import { formatDistance } from "date-fns";
import { Link } from "react-router-dom";
import { Avatar } from "@mui/material";
import { useContext, useEffect, useRef, useState } from 'react';
import { userContext } from "../../userContext";
import toast, { Toaster } from 'react-hot-toast';
import React from 'react';
import { Close} from '@mui/icons-material';


export default function Post({ posts, setPosts, userid }) {

    const [openEdit, setOpenEdit] = useState(Array(posts?.length).fill(false));
    const { userInfo } = useContext(userContext)
    const [open, setOpen] = useState(false);
    const [scroll, setScroll] = useState('paper');
    const [editIndex, setEditIndex] = useState(-1);
    const [caption, setCaption] = useState("")
    

    const handleEdit = (index) => {
        setOpenEdit((prev) => {
            const newState = [...prev];
            newState[index] = !newState[index];
            return newState;
        });
    }

    const handleDeletePost = (event, id) => {
        event.stopPropagation()
        if(userInfo!==null){
        fetch(`${process.env.REACT_APP_VERCEL_URL}api/deletePost`, {
            method: "DELETE",
            headers: { "Content-type": 'application/json' },
            credentials: "include",
            body: JSON.stringify({ post_id: id })
        })
            .then(res => res.json())
            .then(data => {
                if(userid!==undefined){
                setPosts(data);
                }
                else{
                    setPosts(prevPosts => prevPosts.filter(post => post._id !== id));
                }
                setOpenEdit(Array(posts?.length).fill(false));
                toast.success("post deleted successfully")
            })
            .catch(error => {
                console.log(error);
                toast.error("internal server error!!")
            })
        }

    }

    const handleEditPost = (event) => {
        event.stopPropagation();
        if(userInfo!==null){
        if (caption !== "" && editIndex >= 0 && editIndex < posts.length) {
            fetch(`${process.env.REACT_APP_VERCEL_URL}api/editPost/`+userid, {
                method: "PUT",
                headers: { "Content-type": 'application/json' },
                credentials: "include",
                body: JSON.stringify({ newCaption: caption, post_id: posts[editIndex]?._id })
            })
                .then(res => res.json())
                .then(data => {
                    setPosts(data);
                    setOpenEdit(Array(posts?.length).fill(false));
                    setEditIndex(-1);
                    setOpen(false);
                    toast.success("post updated successfully")
                })
                .catch(error => {
                    console.log(error);
                    toast.error("internal server error!!")
                })
        }
    }

    }

    const handleClickOpen = (scrollType, index) => () => {
        setOpen(true);
        setScroll(scrollType);
        setEditIndex(index);

    };

    const handleClose = () => {
        setOpen(false);

    };

    const handleLikeClick = async (index) => {
        
        if(userInfo!==null){
        fetch(`${process.env.REACT_APP_VERCEL_URL}api/like`,{
            method:'PUT',
            headers:{'Content-type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({post_id: posts[index]._id})
        })
        .then(res=>res.json())
        .then(updatedPostData=>{
            setPosts(prevPosts =>
                prevPosts.map(post =>
                  post._id === updatedPostData?._id ? updatedPostData : post
                )
              );
        })
        if(posts[index].dislikes.includes(userInfo._id))
        {
            handleDislikeClick(index);
        }
    }

    };

    const handleDislikeClick = async (index) => {

        if(userInfo!==null){
            fetch(`${process.env.REACT_APP_VERCEL_URL}api/dislike`,{
                method:'PUT',
                credentials: 'include',
                headers:{'Content-type': 'application/json'},
                body: JSON.stringify({post_id: posts[index]._id})
            })
            .then(res=>res.json())
            .then(updatedPostData=>{
                setPosts(prevPosts =>
                    prevPosts.map(post =>
                      post._id === updatedPostData._id ? updatedPostData : post
                    )
                  );
            })
            if(posts[index].likes.includes(userInfo._id))
            {
                handleLikeClick(index);
            }
        }
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

    return (
        <>
            <Toaster />

            {(posts !== null) &&
                posts?.map((post, index) => (

                    <div key={index} className="bg-gray-200 shadow-md p-4 my-4 rounded-md relative">
                        <Dialog open={open} onClose={handleClose} scroll={scroll}>
                            <div className="modalInit p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h1 className="text-2xl font-bold">Edit Post</h1>
                                    <button className="text-gray-600 hover:text-gray-800" onClick={handleClose}>
                                        <Close className="h-6 w-6" />
                                    </button>
                                </div>
                                <input
                                    onChange={
                                        ev => setCaption(ev.target.value)
                                    }
                                    className="w-full px-3 py-2 font-semibold text-gray-800 placeholder-gray-500 border border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300 mb-4"
                                    type="text"
                                    defaultValue={posts[editIndex]?.caption}
                                    placeholder="Edit Caption"
                                    required
                                />
                                <button
                                    onClick={(event) => handleEditPost(event)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300">
                                    Upload Changes
                                </button>
                            </div>
                        </Dialog>

                        <div className="flex items-center mb-2">
                            <Link to={`/profile/${post.author?._id}`}>
                                <Avatar src={post.author?.profilePic} className="mr-2" />
                            </Link>
                            <div>
                                <span className="font-semibold text-gray-800 text-sm">
                                    <Link to={`/profile/${post?.author?._id}`}>
                                        {post.author?.firstName} {post.author?.lastName}
                                    </Link>
                                </span>
                                <span className="text-gray-500 text-sm ml-2">
                                    {formatDistance(new Date(post.createdAt), new Date(), { addSuffix: true })}
                                </span>
                            </div>
                            <div className="ml-auto">
                                <div className="hover:cursor-pointer relative">
                                    {userInfo?._id === post?.author?._id && <div><MoreHorizIcon onClick={() => { handleEdit(index) }} /></div>}
                                    {openEdit[index] && (
                                        <div className="absolute top-full right-0 bg-white p-2 border rounded-md shadow-md">
                                            <div className="flex flex-col">
                                                <button onClick={handleClickOpen('body', index)} className="mb-2 py-2 px-4 rounded-md text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition duration-300 w-full">
                                                    Edit
                                                </button>
                                                <div className="h-px bg-gray-200"></div>
                                                <button onClick={(event) => handleDeletePost(event, post._id)} className="py-2 px-4 rounded-md text-red-500 hover:bg-gray-200 hover:text-red-700 transition duration-300 w-full">
                                                    Delete
                                                </button>
                                            </div>
                                        </div>


                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <p className="text-gray-700 text-sm">{post.caption}</p>
                        </div>
                        {post.image && (
                            <div>
                                <img src={post.image} alt="post-img" className="w-full rounded-md" />
                            </div>
                        )}
                        <div className="flex items-center mt-4">
                            <span className="mr-2">{post.likes.length}</span>
                            <span className={`mr-1 hover:cursor-pointer ${post.likes.includes(userInfo?._id) ? 'text-blue-500' : 'text-gray-500 '}`} onClick={()=>handleLikeClick(index)}>
                                <ThumbUpAltTwoToneIcon />
                            </span>
                            <span className="ml-2">{post.dislikes.length}</span>
                            <span className={`ml-1 hover:cursor-pointer ${post.dislikes.includes(userInfo?._id) ? 'text-red-500' : 'text-gray-500'}`} onClick={()=>handleDislikeClick(index)}>
                                <ThumbDownTwoToneIcon/>
                            </span>
                        </div>

                    </div>
                ))}
        </>



    )
}