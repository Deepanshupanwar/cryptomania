import { useContext } from "react"
import { userContext } from "../../userContext"


export default function MainPage(){
    const {userInfo} =useContext(userContext);
    
    return (
        <div>
            hello
        </div>
    )
}