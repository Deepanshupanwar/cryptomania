import { Notifications } from "@mui/icons-material";
import { useContext, useState } from "react";
import { userContext } from "../../userContext"
import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import DoneOutlineTwoToneIcon from '@mui/icons-material/DoneOutlineTwoTone';
import ClearTwoToneIcon from '@mui/icons-material/ClearTwoTone';

export default function NotificationsBox() {
    const { userInfo, setUserInfo } = useContext(userContext);
    const [openNotify, setOpenNotify] = useState(false);
    const handleAccept = (event, sender_id) => {
        event.stopPropagation();
        fetch(`${process.env.REACT_APP_VERCEL_URL}api/accept`, {
            method: 'PUT',
            headers: { 'Content-type': 'application/json' },
            credentials: "include",
            body: JSON.stringify({ sender_id: sender_id })
        })
            .then(res => res.json())
            .then(data => {
                setUserInfo(data);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const handleReject = (event, sender_id) => {
        event.stopPropagation();

        fetch(`${process.env.REACT_APP_VERCEL_URL}api/reject`, {
            method: 'DELETE',
            headers: { 'Content-type': 'application/json' },
            credentials: "include",
            body: JSON.stringify({ sender_id: sender_id })
        })
            .then(res => res.json())
            .then(data => {
                setUserInfo(data);
            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <div >
            <div className="relative" onClick={() => setOpenNotify(!openNotify)}>
                <Notifications />
                {userInfo.notifications.length > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center">
                        {userInfo.notifications.length}
                    </div>
                )}
            </div>

            < div className="absolute top-14  right-0 bg-white border rounded-md shadow-md overflow-hidden z-20">
                {openNotify && userInfo?.notifications?.map((notify, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-200  rounded-md">
                        <Link to={`/profile/${notify.sender._id}`} className="flex items-center">
                            <Avatar src={notify.sender?.profilePic} className="w-8 h-8 rounded-full mr-2" />
                            <p className="text-black">{notify.sender.firstName} {notify.sender.lastName}</p>
                        </Link>
                        <div className="flex flex-wrap">
                            <ClearTwoToneIcon onClick={(event) => handleReject(event, notify.sender._id)} className="text-black mr-2 hover:cursor-pointer" />
                            <DoneOutlineTwoToneIcon onClick={(event) => handleAccept(event, notify.sender._id)} className="text-black hover:cursor-pointer" />
                        </div>
                    </div>
                ))
                }
            </div>
        </div>
    )
}