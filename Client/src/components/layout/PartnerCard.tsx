import React from "react";

interface JodCardProps {
    img: string;
    headTxt: string;
    subheadTxt: string;

}

const JobCard: React.FC<JodCardProps> = ({img,headTxt,subheadTxt})=>{
    return (
        <>
            <div className='w-full flex gap-12 h-[400px]   mt-35'>
                <div className=" w-[630px] h-[380px] ">
                    <img
                        src={img}
                         className="bg-cover w-[650px] h-[360px] rounded-xl" />
                    <img
                        src="src/assets/Food Delivery UI Kit Rectangle 9.png"
                        alt=""
                        className="absolute w-[630px] h-[360px] mt-[-360px]"
                        />
                    <div className="absolute mt-[-150px] ml-[60px]">
                        <span className="text-[#FC8A06]">{subheadTxt}</span>
                        <h1 className="text-white font-bold text-[30px]">{headTxt}</h1>
                        <button className="text-white bg-amber-600 px-5 py-2 rounded-2xl mt-2">Get Started</button>
                    </div>
                </div>

            </div>
        </>
    )
}


const PartnerCard = () => {
    return (
        <>
            <div className='flex  gap-5'>
                <JobCard img="https://static.vecteezy.com/system/resources/previews/033/692/644/large_2x/chef-preparing-food-in-the-kitchen-at-the-restaurant-professional-chef-cooking-gourmet-chef-cooking-in-a-commercial-kitchen-ai-generated-free-photo.jpg"
                         subheadTxt="Signup as a business"
                         headTxt="Partner with us"/>
                <JobCard img="https://media.istockphoto.com/id/1296986175/photo/young-man-working-for-a-food-delivery-service-checking-with-road-motorcycle-in-the-city.jpg?s=612x612&w=0&k=20&c=TXsIHrSIyFlkHSpJq_AhX3V0l9X_U79e9cfpdMNH5LQ="
                         subheadTxt="Signup as a rider"
                         headTxt="Ride with us"/>
            </div>

        </>
    )
}

export default PartnerCard;