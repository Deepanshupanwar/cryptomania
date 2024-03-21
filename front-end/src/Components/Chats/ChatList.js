import { Search } from "@mui/icons-material"
import { Avatar, Box, Drawer } from "@mui/material"
import { useContext, useState } from "react"

import { userContext } from "../../userContext";
export default function ChatList({setChatSelected, mychats, setMyChats, chatSelected}) {
    
    const { userInfo } = useContext(userContext);
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('');
    const handleDrawer = () => {
        setOpen(!open);
    }

    const handleCreateChat = (friendId) => {
        fetch('https://cryptomania-deepanshus-projects-b59175f2.vercel.app/api/chats', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ userId: friendId })
        })
            .then(res => res.json())
            .then(chats => {
                setMyChats(chats);
                setOpen(false);
            })
            .catch(err => {
                console.log(err);
            })

    }

    const filteredFriends = userInfo?.friends.filter(friend =>
        friend.firstName.toLowerCase().includes(search.toLowerCase()) ||
        friend.lastName.toLowerCase().includes(search.toLowerCase())
    );


    return (

        <div className={`flex ${(chatSelected!=null)? ('show-chatlist'): ""}`}>
            
            <Drawer open={open} onClose={handleDrawer} className="w-full md:w-80">
            <div className="p-4">
                    <input type="text" placeholder="Search friends" onChange={(e) => setSearch(e.target.value)} className="w-full border border-gray-300 rounded p-2 mb-4" />
                    {filteredFriends.map(friend => (
                        <div key={friend._id} onClick={() => handleCreateChat(friend._id)} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-lg p-2">
                            <Avatar src={friend?.profilePic} className="w-10 h-10 rounded-full" />
                            <p className="text-black">{friend.firstName + ' ' + friend.lastName}</p>
                        </div>
                    ))}
                </div>
            </Drawer>

            <Box className="flex flex-col flex-grow h-full w-full border-l border-gray-300 chatlists">
                <Box className="flex items-center justify-between border-b border-gray-300 p-4 bg-white">
                    <span className="text-lg font-semibold">My Chats</span>
                    <Search onClick={handleDrawer} className="cursor-pointer" />
                </Box>
                <Box className="flex flex-col flex-grow overflow-y-auto h-96 no-scrollbar">
                    {mychats.length > 0 ? (
                        mychats.map((chat, index) => (
                            <Box key={index} className="flex items-center py-3 px-4 border-b border-gray-300 hover:bg-gray-100 cursor-pointer" onClick={()=>{setChatSelected(chat)}}>
                                <Avatar src={chat.users[0]._id === userInfo._id ? (chat.users[1].profilePic) : (chat.users[0].profilePic)} className="w-10 h-10 rounded-full" />
                                <Box className="ml-4">
                                    <p className="text-base font-medium">{chat.users[0]._id === userInfo._id ? (chat.users[1].firstName + ' ' + chat.users[1].lastName) : (chat.users[0].firstName + ' ' + chat.users[0].lastName)}</p>
                                    <p className={`text-sm text-gray-600 ${chat.latestMessage.sender._id === userInfo._id? ('text-black'):chat.read? ('text-black') : ('text-blue-400')}`}>{chat.latestMessage && (chat.latestMessage.content.length > 20 ? chat.latestMessage.content.substring(0, 20) + "..." : chat.latestMessage.content)}</p>
                                </Box>
                            </Box>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">No chats available. Make friends and start chatting!</p>
                    )}
                </Box>
            </Box>

        </div>

    )
}