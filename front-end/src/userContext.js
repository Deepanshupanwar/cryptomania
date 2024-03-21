import { createContext, useState } from "react";
//userinfo
export const userContext = createContext({});

export function UserContextProvider({children}){

    const [userInfo,setUserInfo] = useState(null);
    const [socket, setSocket] = useState(null)
    return (
        <userContext.Provider value={{userInfo,setUserInfo, setSocket, socket}}>
            {children}
        </userContext.Provider>
        
    );
}
