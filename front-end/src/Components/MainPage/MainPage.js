import Header from "../Header/Header";
import Prices from "../Prices/Prices";
import Uploader from "../Uploader/Uploader";
import News from "../News/News";
import { useContext, useEffect, useState } from "react";
import { userContext } from "../../userContext";
import '../MainPage/MainPage.css'
import Post from "../Posts/Post";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";

export default function MainPage() {
    const { id } = useParams();
    const {setUserInfo ,userInfo, socket} = useContext(userContext);
    const [posts, setPosts] = useState(null);
    const getpost = async () => {
        fetch(`${process.env.REACT_APP_VERCEL_URL}api/getPost`,{
            method:'GET',
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

    useEffect(() => {
        getpost();
    }, [])
    useEffect(()=>{
        
        socket?.emit('userConnected', {
            userId: userInfo?._id,
            firstName: userInfo?.firstName,
            lastName: userInfo?.lastName,
            profilePic: userInfo?.profilePic || ''
            })
        
    },[socket,userInfo]);

    const handleFriendRequest = (payload) => {
        console.log("1");
        setUserInfo(payload);
    };
// eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(()=>{
        socket?.on('friendRequest', handleFriendRequest);

        return ()=>{
            socket?.off('friendRequest',handleFriendRequest)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[socket])

    return (
        <div className="min-h-screen flex flex-col">
            <Toaster/>
            <Header/>
            <div className="flex flex-wrap justify-center h-full overflow-y-auto no-scrollbar">
                <div className="w-full md:w-1/3 p-2  main-price">
                    <div className="max-h-[87vh] overflow-y-auto no-scrollbar">
                        <Prices coinCount={10}/>
                    </div>
                </div>
                <div className="w-full md:w-1/3 p-2 main-middle">
                    <div className="max-h-[87vh] overflow-y-auto no-scrollbar">
                        <Uploader setPosts={setPosts} />
                        <Post posts={posts} setPosts={setPosts} userid={id}/>
                    </div>
                </div>
                <div className="w-full md:w-1/3 p-2  main-news">
                    <div className="max-h-[87vh] overflow-y-auto no-scrollbar">
                        <News/>
                    </div>
                </div>
            </div>
        </div>
    )
}