import { Link } from "react-router-dom";
import Home from "@mui/icons-material/Home"
import { Chat } from "@mui/icons-material";
import { Avatar, Drawer } from "@mui/material";
import { userContext } from "../../userContext";
import { useContext, useState } from "react";
import SearchBox from "../Search/SearchBox";
import NotificationsBox from "../NotificationBox/NotificationBox";
import TableRowsIcon from '@mui/icons-material/TableRows';
import '../Header/Header.css'



export default function Header() {
    const { userInfo, setUserInfo, socket, setSocket } = useContext(userContext)
    const [open, setOpen] = useState(false)
    
    const handleDrawer = () => {
        setOpen(!open);
    }

    function logout(ev) {
        ev.preventDefault();
        fetch('https://cryptomania-deepanshus-projects-b59175f2.vercel.app/api/logout', {
            credentials: 'include',
            method: 'POST',
        });
        setUserInfo(null);
        socket?.disconnect();
        setSocket(null);
    }



    return (
        <div className="flex bg-gray-800 text-white  top-0 z-50 header">
            <Drawer anchor="right" open={open} onClose={handleDrawer} className="">
                <div className="p-4">
                    {userInfo ? (<><Link to={`/profile/${userInfo._id}`} className="flex items-center space-x-10 py-2 px-3 rounded-md hover:bg-gray-100">
                        <Avatar src={userInfo.profilePic} className="w-6 h-6" />
                        <span className="text-sm font-medium">Profile</span>
                    </Link>
                        <Link to={'/chats'} className="flex items-center space-x-10 py-2 px-3 rounded-md hover:bg-gray-100">
                            <span className="w-6 h-6"><Chat /></span>
                            <span className="text-sm font-medium">Chats</span>
                        </Link>
                        <div className="flex items-center space-x-10 py-2 px-3 rounded-md hover:bg-gray-100 relative">
                            <span className="w-6 h-6"><NotificationsBox /></span>
                            <span className="text-sm font-medium">Notifications</span>
                        </div>
                        <div className="flex items-center space-x-10 py-2 px-3 rounded-md hover:bg-gray-100" onClick={logout}>
                            <span className="w-6 h-6">🚪</span>
                            <span className="text-sm font-medium">Logout</span>
                        </div>
                        <Link to={'/prices'} className="flex items-center space-x-10 py-2 px-3 rounded-md hover:bg-gray-100">
                            <span className="w-6 h-6">💲</span>
                            <span className="text-sm font-medium">Prices</span>
                        </Link>
                        <Link to={'/news'} className="flex items-center space-x-10 py-2 px-3 rounded-md hover:bg-gray-100">
                            <span className="w-6 h-6">📰</span>
                            <span className="text-sm font-medium">News</span>
                        </Link></>) : (
                        <>
                            <Link to="/login" className="flex items-center space-x-10 py-2 px-3 rounded-md hover:bg-gray-100">
                                <span className="text-sm font-medium">Login</span>
                            </Link>
                            <Link to="/register" className="flex items-center space-x-10 py-2 px-3 rounded-md hover:bg-gray-100">
                                <span className="text-sm font-medium">Register</span>
                            </Link>
                        </>
                    )}
                </div>
            </Drawer>

            <div className="flex w-1/3 ml-2 header-left-main">
                <div className="flex h-12 items-center">
                    <img
                        className="w-8 mr-2 header-left-image"
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/800px-Bitcoin.svg.png"
                        alt="logo"
                        width={100}
                    />
                    <Link to="/" className="header-left-name">
                        <h2 className="app_name font-bold text-lg">CryptoMania</h2>
                    </Link>
                </div>
            </div>

            <div className="flex items-center w-1/3 mr-2 space-x-2 header-center-main">
                <div className="mr-2">
                    <Link to="/">
                        <Home />
                    </Link>
                </div>
                <div className="flex-grow relative">
                    <SearchBox />
                </div>
            </div>

            <div className="flex w-1/3 flex-col-reverse items-center justify-center relative header-right-main">
            <TableRowsIcon className="header-right-icon self-end"  onClick={handleDrawer} />
                <div className="flex space-x-4 items-center justify-center self-end mr-2 header-right">
                    {userInfo ? (
                        <div className="flex space-x-4 items-center justify-center self-end mr-2 ">
                            <Link to={`/profile/${userInfo._id}`}>
                                <Avatar sx={{ width: 30, height: 30 }} src={userInfo.profilePic} />
                            </Link>
                            <Link to={'/chats'}><Chat /></Link>
                            <NotificationsBox />
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={logout}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login">
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Login</button>
                            </Link>
                            <Link to="/register">
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Register</button>
                            </Link>
                        </>
                    )}
                </div>

            </div>
        </div>


    )
}