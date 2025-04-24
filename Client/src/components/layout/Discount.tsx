
import { textVariant } from "../../util/motion.ts";
import { motion } from 'framer-motion';
import {Link} from "react-router-dom";
import SectionWrapper from "../../hoc/SectionWrapper.tsx";


const Nav = ()=>{
    return(
        <nav className="pl-1  py-10">
            <div className="max-w-7xl mx-auto  items-center ">
                {/* Logo */}

                <h2 className="text-black absolute font-black md:text-[25px] sm:text-[50px] xs:text-[40px] text-[15px] pt-2 ">
                    Exclusive Deals 🎉
                </h2>


                <div className="flex items-center justify-end   w-full">
                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/"
                            className="text-gray-700   rounded-2xl hover:text-white transition-colors text-[14px] mr-10"
                        >
                            vegan
                        </Link>
                        <Link
                            to="/browse-menu"
                            className="text-gray-700 hover:text-orange-500 transition-colors text-[14px] mr-10"
                        >
                            Sushi
                        </Link>
                        <Link
                            to="/contact"
                            className="text-gray-700 hover:text-orange-500 border-2  px-6 py-2 border-[#FC8A06] rounded-2xl transition-colors text-[14px]"
                        >
                            Pizza & Fast food
                        </Link>
                        <Link
                            to="/contact"
                            className="text-gray-700 hover:text-orange-500 transition-colors text-[14px] mr-4"
                        >
                            Others
                        </Link>

                    </div>

                </div>
            </div>
        </nav>
    )
}

const DiscountCard = ()=>{
    return(
        <>

            <div className="relative w-full max-w-sm mx-auto md:max-w-md lg:max-w-lg rounded-xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105">
                <div className="relative">
                    <img
                        src="https://www.foodandwine.com/thmb/XE8ubzwObCIgMw7qJ9CsqUZocNM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/MSG-Smash-Burger-FT-RECIPE0124-d9682401f3554ef683e24311abdf342b.jpg"
                        alt="Restaurant food display"
                        className="w-full h-48 sm:h-56 md:h-64 object-cover"
                    />

                    {/* Discount badge */}
                    <div className="absolute top-0 right-0 bg-black text-white font-bold py-2 px-4 rounded-bl-lg">
                        -10%
                    </div>

                    {/* Content overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-orange-400 font-medium text-sm sm:text-base">Restaurant</p>
                        <h2 className="text-white text-xl sm:text-2xl font-bold">Chef Burgers London</h2>
                    </div>
                </div>


            </div>
        </>
    )
}


const Discount = () => {
    return (
        <>
            <motion.div variants={textVariant(0.3)}>
            <Nav/>
            </motion.div>
            <div className="flex items-center  gap-15 w-full">
                <DiscountCard/>
                <DiscountCard/>
                <DiscountCard/>
            </div>

        </>
    );
};


const DiscountWrapper = SectionWrapper(Discount);

export default DiscountWrapper;
