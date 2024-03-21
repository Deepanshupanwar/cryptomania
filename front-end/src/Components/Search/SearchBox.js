import { Close ,Search } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";


export default function SearchBox() {
    const [input, setInput] = useState("");
    const [data, setData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(-1);
    const [redirect, setRedirect] = useState(false);
    const handleclose = () => {
        setData([]);
        setInput("");
        setSelectedItem(-1);
    }

    const handlechange = e => {
        setInput(e.target.value);
    }

    const handleKeyDown = e => {
        if (selectedItem < data.length) {
            if (e.key === "ArrowUp" && selectedItem > 0) {
                setSelectedItem((prev) => prev - 1);
            }
            else if (e.key === "ArrowDown" && selectedItem < data.length - 1) {
                setSelectedItem((prev) => prev + 1);
            }
            else if (e.key === "Enter" && selectedItem >= 0) {
                setRedirect(true);
            }
        }
        else {
            setSelectedItem(-1);
        }
    }



    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        async function fetchData() {
            if (input !== "") {
                try {
                    const response = await fetch(
                        `http://localhost:4000/api/search/${input}`,
                        {
                            method: "GET",
                            signal,
                        }
                    );

                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }

                    const users = await response.json();
                    setData(users);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
            else {
                setData([]);
            }
        }

        fetchData();


        return () => {
            controller.abort();
        };
    }, [input])

    if (redirect) {
        return <Navigate to={'/profile/' + data[selectedItem]._id} />
    }

    return (
        <>
            <div className="relative">
                <input
                    className="w-full pr-3 pl-10 py-1.5 font-semibold placeholder-gray-500 text-black rounded-2xl border-none ring-2 ring-gray-300 focus:ring-gray-500 focus:ring-2 z-10"
                    type="text"
                    placeholder="Search"
                    value={input}
                    onChange={handlechange}
                    onKeyDown={handleKeyDown}
                />
                <button onClick={
                    handleclose} className="absolute inset-y-0 left-0 pl-3 flex items-center  text-gray-500">
                    {input === "" ? <Search /> : <Close/>}
                </button>
               
            </div>
            {input !== "" && (
                <div className="absolute top-14 left-0 right-0 bg-white border rounded-md shadow-md overflow-hidden z-20">
                    {data.map((user, index) => (
                        <Link key={index} to={`/profile/${user._id}`}>
                            <div
                                className={`flex items-center p-2 ${selectedItem === index ? 'bg-blue-200' : 'hover:bg-blue-100'
                                    } transition duration-200`}
                            >
                                <Avatar src={user?.picture} className="w-8 h-8 rounded-full mr-2" />
                                <p className="text-black">{user.firstName + ' ' + user.lastName}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </>

    )
}