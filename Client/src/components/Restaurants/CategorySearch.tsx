import React from 'react';
import { motion } from 'framer-motion';

interface CategorySearchProps {
    categories: string[];
    selectedCategory: string | null;
    onCategoryChange: (category: string) => void;
    searchText?: string;
}

const CategorySearch: React.FC<CategorySearchProps> = ({
                                                           categories,
                                                           selectedCategory,
                                                           onCategoryChange
                                                       }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    return (
        <div className="mb-10">
            <motion.div
                className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-orange-400 rounded-2xl shadow-xl"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <pattern id="food-pattern" patternUnits="userSpaceOnUse" width="10" height="10">
                                <circle cx="2" cy="2" r="1" fill="white" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#food-pattern)" />
                    </svg>
                </div>

                <div className="max-w-7xl mx-auto relative z-10 py-6 px-6 md:px-8">
                    <motion.h3
                        className="text-white font-bold text-xl mb-4 pl-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Browse Categories
                    </motion.h3>

                    <motion.div
                        className="flex overflow-x-auto pb-3 scrollbar-hide"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {categories && categories.map((category, index) => (
                            <motion.button
                                key={category}
                                className={`px-6 py-3.5 rounded-full mr-3 whitespace-nowrap transition-all duration-300 ${
                                    selectedCategory === category
                                        ? 'text-orange-500 font-bold bg-white shadow-lg'
                                        : 'text-white font-bold bg-orange-500/30 backdrop-blur-sm hover:bg-white/20'
                                }`}
                                onClick={() => onCategoryChange(category)}
                                whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 0.1 * index,
                                    duration: 0.3,
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 20
                                }}
                            >
                                {selectedCategory === category && (
                                    <motion.div
                                        className="absolute inset-0 rounded-full"
                                        layoutId="categoryBackground"
                                        initial={false}
                                        transition={{ type: "spring", duration: 0.5 }}
                                    />
                                )}
                                {category}
                            </motion.button>
                        ))}
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default CategorySearch;