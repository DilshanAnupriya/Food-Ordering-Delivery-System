
import {textVariant} from "../../util/motion.ts";
import { motion } from 'framer-motion';

interface restaurantProps {
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
    name: string;
    img: string;
}

const RestaurantCard:React.FC<restaurantProps>  = ({name,img}) => {
    return (
        <div className="pt-8 max-w-6xl mx-auto">

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

                    <div className="flex flex-col rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                        <div className=" h-48  flex items-center justify-center ">
                            <img
                                src={img}
                                alt=""
                                className="max-h-full max-w-full object-contain"
                            />
                        </div>
                        <div className="p-3 mt-[-20px] text-center bg-amber-500 text-white font-medium">
                            <h2>{name}</h2>
                        </div>
                    </div>

            </div>
        </div>
    );
};





const Hero1 = () => {
    return (
       <>
           <motion.div variants={textVariant(0.3)} >
               <h2 className="text-black font-black md:text-[30px] sm:text-[50px] xs:text-[40px] text-[18px] pt-10 pl-2">Popular Restaurants</h2>
           </motion.div>
               <RestaurantCard
<<<<<<< Updated upstream
               name="Mac Donoald's"
               img='src/assets/mac.png'/>


       </>
=======
                   name="Mac Donoald's"
                   img='src/assets/mac.png'/>
                </>
>>>>>>> Stashed changes
    );
};

export default Hero1;