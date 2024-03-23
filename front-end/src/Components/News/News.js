import { useEffect, useState } from "react"
import { formatISO9075 } from "date-fns";
import toast, { Toaster } from "react-hot-toast";


export default function News(){

    const [news, setNews] = useState();

    const getNews = async ()=>{
        fetch('https://cryptocurrency-news2.p.rapidapi.com/v1/coindesk',{
            method: 'GET',
            headers: {
                'X-RapidAPI-Key':process.env.REACT_APP_X_RapidAPI_Key,
                'X-RapidAPI-Host': process.env.REACT_APP_X_RapidAPI_Host
            }
        })
        .then(res=>res.json())
        .then(news=>{
            setNews(news.data);
        })
        .catch(err=>{
          toast.error("couldn't load latest news!");
        })
        
    }

    useEffect(()=>{
        getNews();
    },[])

    return(
        <>
        <Toaster/>
        {news &&news?.map((data, index)=>(
               <div key={index} className="bg-white shadow-md p-2 my-4 rounded-md">
               <div className="mb-4">
                 <a href={data.url} target="_blank" rel="noopener noreferrer">
                   <img src={data.thumbnail} alt="" className="w-full rounded-md" />
                 </a>
               </div>
               <div>
                 <h2 className="text-xl font-semibold mb-2">
                   <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                     {data.title}
                   </a>
                 </h2>
                 <p className="text-gray-500">
                   <time>{formatISO9075(new Date(data.createdAt))}</time>
                 </p>
                 <p className="text-gray-700">{data.description}</p>
               </div>
             </div>
        ))}
        </>
    )
}