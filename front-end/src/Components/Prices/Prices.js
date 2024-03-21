import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast";

export default function Prices({coinCount}){
    const[coins, setCoins]= useState([]);
    const getcoins =() =>{
         fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${coinCount}&page=1&sparkline=false`)
         .then(res=>res.json())
         .then(data=>{
            setCoins(data);
         })
         .catch(error => {
            toast.error("coudn't load current prices!");
          });
        
    }

    useEffect(()=>{
        getcoins();
    },[]);

    const filteredCoins = coins.filter(coin =>
        coin.name.toLowerCase()
      );
    
    return(

    <>
    <Toaster/>
    {filteredCoins.map((coin, index) => (
        <div key={index} className="coin-row border-b border-gray-300 py-4 grid grid-cols-4 items-center">
          <div className="flex items-center space-x-2 col-span-2">
            <img src={coin.image} alt="coin-logo" className="w-8 h-8 mr-2" />
            <div className="flex flex-col">
              <div>
                <h1>{coin.name + " ("+coin.symbol+")"}</h1>
              </div>
            </div>
          </div>
          <div className="col-span-1 flex flex-col items-end">
            <div>
                {coin.current_price}$
            </div>
            </div>
          <div className="col-span-1 flex flex-col items-end">
            <div className={`coin-percent ${coin.price_change_percentage_24h < 0 ? 'text-red-500' : 'text-green-500'}`}>
              {coin.price_change_percentage_24h.toFixed(2)}%
            </div>
          </div>
        </div>
      ))}        
      </>
    )
}