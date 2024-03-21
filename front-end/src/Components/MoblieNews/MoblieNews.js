import Header from "../Header/Header";
import News from "../News/News";


export default function MoblieNews() {
    return (
        <>
            <Header />
            <div className="w-full md:w-1/3 p-2">
                <div className="max-h-[87vh] overflow-y-auto no-scrollbar">
                    <News />
                </div>
            </div>
        </>
    )
}