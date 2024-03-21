import Header from "../Header/Header";
import Prices from "../Prices/Prices";

export default function MobliePrice() {
    return (
        <>
            <Header />
            <div className="w-full md:w-1/3 p-2">
                <div className="max-h-[87vh] overflow-y-auto no-scrollbar">
                    <Prices coinCount={50}/>
                </div>
            </div>
        </>
    )
}