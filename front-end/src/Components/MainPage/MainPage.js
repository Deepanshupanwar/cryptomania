import { useContext } from "react"
import { userContext } from "../../userContext"


export default function MainPage(){
    const {userinfo} =useContext(userContext);
    console.log(userinfo);
    return (
        <div>
            hello
        </div>
    )
}