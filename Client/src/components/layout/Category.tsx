import {motion} from "framer-motion";
import {textVariant} from "../../util/motion.ts";


const FoodCard = () => {
    return (
        <>
            <div className="flex flex-col w-[350px] mt-[30px]  rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all ease-in-out transform hover:-translate-y-2 duration-300  bg-white ">

                <div className="h-48 flex items-center justify-center bg-gray-100">
                    <img
                        src="https://s.lightorangebean.com/media/20240914160809/Spicy-Penne-Pasta_-done.png"
                        alt=""
                        className="h-full w-full object-cover"
                    />
                </div>
                <div className=" p-2 bg-amber-50 text-black font-semibold text-lg">
                    <h2>Pizza</h2>
                    <p className="text-[13px]">hello</p>
                </div>
            </div>
        </>
    )
}

const Category = () => {
    return (
        <>
            <motion.div variants={textVariant(0.3)}>
                <h2 className="text-black font-black md:text-[25px] sm:text-[50px] xs:text-[40px] text-[15px] pt-20 ">
                    Popular Categories
                </h2>
            </motion.div>
            <div className="flex items-center  gap-4  w-ful">
                <FoodCard/>
                <FoodCard/>
                <FoodCard/>
                <FoodCard/>
                <FoodCard/>
            </div>

        </>
    )
}

export default Category
