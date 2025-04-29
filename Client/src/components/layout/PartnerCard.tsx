import { motion } from "framer-motion";
import SectionWrapper from "../../hoc/SectionWrapper.tsx";

interface JobCardProps {
    img: string;
    headTxt: string;
    subheadTxt: string;
    index: number;
}

const JobCard = ({ img, headTxt, subheadTxt, index }: JobCardProps) => {
    // Animation variants
    const cardVariants = {
        hidden: {
            opacity: 0,
            x: index % 2 === 0 ? -50 : 50
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: index * 0.2
            }
        }
    };

    // Hover effect variants
    const hoverVariants = {
        hover: {
            scale: 1.03,
            transition: { duration: 0.3 }
        }
    };

    // Button animation variants
    const buttonVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { delay: 0.3 + index * 0.2 }
        },
        hover: {
            scale: 1.1,
            backgroundColor: "#F97316", // tailwind orange-500
            transition: { duration: 0.2 }
        }
    };

    // Text animation variants
    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.2 + index * 0.2,
                duration: 0.5
            }
        }
    };

    return (
        <motion.div
            className="relative w-full md:w-1/2 overflow-hidden rounded-xl"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
        >
            <motion.div
                className="relative h-96 overflow-hidden rounded-xl"
                variants={hoverVariants}
            >
                {/* Image */}
                <img
                    src={img || "/api/placeholder/600/400"}
                    alt={headTxt}
                    className="w-full h-full object-cover"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-75"></div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                    <motion.span
                        className="inline-block text-orange-400 font-medium mb-2"
                        variants={textVariants}
                    >
                        {subheadTxt}
                    </motion.span>

                    <motion.h2
                        className="text-white text-3xl font-bold mb-4"
                        variants={textVariants}
                    >
                        {headTxt}
                    </motion.h2>

                    <motion.button
                        className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-500 transition-all shadow-lg"
                        variants={buttonVariants}
                        whileHover="hover"
                    >
                        Get Started
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const PartnerCardSection = () => {
    // Container animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.3,
                duration: 0.5
            }
        }
    };

    // Title animation variants
    const titleVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="mb-12 text-center"
                    variants={titleVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <h2 className="text-3xl font-bold text-gray-900">
                        Join Our Community
                    </h2>
                    <div className="h-1 w-24 bg-orange-500 mx-auto mt-2"></div>
                    <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                        Partner with us to grow your business or start earning as a delivery partner
                    </p>
                </motion.div>

                <motion.div
                    className="flex flex-col md:flex-row gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <JobCard
                        img="https://www.heraldtribune.com/gcdn/authoring/2019/06/26/NSHT/ghows-LK-8c18d1ea-2228-1fe7-e053-0100007f4e92-7ed4c5c4.jpeg?width=1200&disable=upscale&format=pjpg&auto=webp"
                        subheadTxt="Signup as a business"
                        headTxt="Partner with us"
                        index={0}
                    />
                    <JobCard
                        img="https://wearesolomon.com/wp-content/uploads/2019/03/If-your-food-delivery-man-handed-you-the-real-menu-of-their-everyday-lives-the-story-of-Mohammed-1-1.jpg"
                        subheadTxt="Signup as a rider"
                        headTxt="Ride with us"
                        index={1}
                    />
                </motion.div>
            </div>
        </section>
    );
};

const PartnerCardSectionWrapper = SectionWrapper(PartnerCardSection);

export default PartnerCardSectionWrapper;