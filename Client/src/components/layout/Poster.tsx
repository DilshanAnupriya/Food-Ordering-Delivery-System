import { useState, useEffect } from "react";
import SectionWrapper from "../../hoc/SectionWrapper.tsx";
import poster from "../../../public/assets/poster.png";
import { motion } from "framer-motion";

const PosterSection = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        // Set in view after component mounts for entrance animation
        const timer = setTimeout(() => {
            setIsInView(true);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    // Poster container animations
    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    // Poster image animations
    const imageVariants = {
        normal: {
            scale: 1,
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)",
            transition: {
                duration: 0.5,
                ease: "easeInOut"
            }
        },
        hover: {
            scale: 1.03,
            boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.25)",
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="flex justify-center items-center  w-full py-20">
            <motion.div
                className="w-full max-w-7xl relative overflow-hidden bg-white rounded-lg"
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={containerVariants}
            >
                {/* Decorative background elements */}
                <motion.div
                    className="absolute -top-12 -left-12 w-24 h-24  bg-white rounded-full opacity-20 blur-xl"
                    animate={{
                        scale: isHovered ? 1.2 : 1,
                        opacity: isHovered ? 0.3 : 0.2,
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                />
                <motion.div
                    className="absolute -bottom-16 -right-16 w-32 h-32 bg-white  rounded-full opacity-20 blur-xl"
                    animate={{
                        scale: isHovered ? 1.2 : 1,
                        opacity: isHovered ? 0.3 : 0.2,
                    }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                />

                {/* Poster image with hover effects */}
                <motion.div
                    className="relative z-10  to-gray-800 p-4 rounded-lg"
                    variants={imageVariants}
                    initial="normal"
                    animate={isHovered ? "hover" : "normal"}
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                >
                    <motion.img
                        src={poster}
                        alt="Featured Poster"
                        className="w-full rounded shadow-lg"
                        whileHover={{
                            filter: "brightness(1.1) contrast(1.05)"
                        }}
                        transition={{ duration: 0.2 }}
                    />

                    {/* Overlay text that appears on hover */}
                    <motion.div
                        className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/70 to-transparent opacity-0 rounded-lg"
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                    >


                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

const Poster = SectionWrapper(PosterSection);

export default Poster;