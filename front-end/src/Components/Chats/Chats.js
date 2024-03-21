import { useContext, useEffect, useState } from "react";
import Header from "../Header/Header";
import ChatList from "./ChatList";
import ChatBox from "./ChatsBox";
import { userContext } from "../../userContext";
import { Navigate } from "react-router-dom";
import '../Chats/Chat.css'

export default function Chats(){
    const [chatSelected, setChatSelected] = useState(null);
    const [mychats, setMyChats] = useState([]);
    const {userInfo} = useContext(userContext);
    
    const getChats = async () => {
        fetch('https://cryptomania-deepanshus-projects-b59175f2.vercel.app/api/chats', {
            method: 'get',
            credentials: 'include'
        })
            .then(res => res.json())
            .then(chats => {
                setMyChats(chats);
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        getChats();
    }, [])

    if(userInfo===null){
        return  <Navigate to={'/'}/>
    }

    return (
        <div>
            <Header/>
        
        <div className="flex max-h-[87vh] pt-2 main-chat">
            <ChatList setChatSelected={setChatSelected} mychats={mychats} setMyChats={setMyChats} chatSelected={chatSelected}/>
            <ChatBox setChatSelected={setChatSelected} chatSelected={chatSelected}  getChats={getChats}/>
        </div>
        </div>
    )
}