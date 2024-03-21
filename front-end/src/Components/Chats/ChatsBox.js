import { Avatar, Box } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { userContext } from "../../userContext";
import SendIcon from '@mui/icons-material/Send';
import { formatDistanceStrict } from "date-fns";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

var  selectedChatCompare= null;
export default function ChatBox({ chatSelected ,getChats, setChatSelected }) {
    const { userInfo, socket } = useContext(userContext)
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);


    const getMessages = async () => {
        fetch('http://localhost:4000/api/message/' + chatSelected._id, {
            method: 'GET',
            credentials: 'include'
        })
            .then(res => res.json())
            .then(chats => {
                setMessages(chats);
            })
            .catch(err => {
                console.log(err);
            })

    }

    const handleSubmit = () => {
        if (message !== '') {
                const  receiverId= chatSelected.users[0]._id === userInfo._id ?chatSelected.users[1]._id :chatSelected.users[0]._id;
                socket.emit('newMessage', {
                    content:message,
                    chatId: chatSelected._id,
                    senderId:userInfo._id,
                    receiverId
                })
        }
        setMessage('');
    }

    const handleKeyDown = e=>{
        if(e.key==='Enter')
        {
            handleSubmit()
        }
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(()=>{
        socket.on('getMessage', (payload) => {
            if(selectedChatCompare!==null && payload.chat._id===selectedChatCompare._id){
            setMessages((prevMessages) => [...prevMessages, payload]);
            }
            getChats();
        });
        return ()=>{
            socket.off('getMessage');
        }
    },[socket])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
// eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (chatSelected) {
            selectedChatCompare=chatSelected
            getMessages();
        }
        
    }, [chatSelected])


    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            padding={3}
            backgroundColor="#E8E8E8"
            borderRadius="lg"
            overflowY="auto"
            border="2px solid grey"
            height="83vh"
            width="75vw"
            marginLeft="40px"
            className={`chatbox ${(chatSelected===null)?'show-chatbox':""}`}
        >
            {chatSelected && (
                <>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <ArrowBackIcon onClick={()=>{setChatSelected(null)}} className="back-arrow"/>
                        <Avatar src={chatSelected.users[0]._id === userInfo._id ? (chatSelected.users[1].profilePic) : (chatSelected.users[0].profilePic)} />
                        <p className="text-base font-medium" style={{ marginLeft: '10px', color: '#333', fontWeight: 'bold' }}>{chatSelected.users[0]._id === userInfo._id ? (chatSelected.users[1].firstName + ' ' + chatSelected.users[1].lastName) : (chatSelected.users[0].firstName + ' ' + chatSelected.users[0].lastName)}</p>
                    </div>

                    <div className="mb-10 overflow-y-auto h-96 no-scrollbar">
                        {messages.map((message, index) => (
                            <div key={index} className={`flex ${message.sender._id === userInfo._id ? 'justify-end' : 'justify-start'} mb-2`}>
                                <div className={`p-2 rounded-lg ${message.sender._id === userInfo._id ? 'bg-green-200' : 'bg-gray-200'}`}>
                                    <p className="text-sm">{message.content}</p>
                                    <p className="text-xs text-right text-gray-500">{formatDistanceStrict(new Date(message.createdAt), new Date(), { addSuffix: true })}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <input type="text" placeholder="Type message here..." style={{ flex: 1, padding: '10px', marginRight: '10px', borderRadius: '5px', border: '1px solid #ccc' }} onChange={(e) => { setMessage(e.target.value) }} value={message} onKeyDown={handleKeyDown} />
                        <SendIcon style={{ cursor: 'pointer' }} onClick={handleSubmit} />
                    </div>
                </>
            )}
            {!chatSelected && (
                <span style={{ textAlign: 'center' }}>
                    Select a chat and start messaging
                </span>
            )}
        </Box>
    )
}