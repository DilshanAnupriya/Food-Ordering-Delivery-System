import { motion } from "framer-motion";
import { textVariant } from "../../util/motion.ts";
import { useEffect, useState } from "react";
import SectionWrapper from "../../hoc/SectionWrapper.tsx";

interface ApiResponse {
    code: number;
    message: string;
    data: string[];
}

// Skeleton loader for category cards
const CategoryCardSkeleton = () => {
    return (
        <div className="flex flex-col w-full rounded-2xl overflow-hidden shadow-md bg-white">
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-4 bg-gray-100 animate-pulse">
                <div className="h-6 w-3/4 mx-auto bg-gray-300 rounded"></div>
                <div className="h-4 w-1/2 mx-auto bg-gray-300 rounded mt-2"></div>
            </div>
        </div>
    );
};

const FoodCard = ({ categoryName, index }: { categoryName: string; index: number }) => {
    // Local placeholder images instead of external URLs
    const categoryImages: Record<string, string> = {
        "Italian": "/api/placeholder/350/200",
        "fast food": "/api/placeholder/350/200",
        "Desserts": "/api/placeholder/350/200",
        "Vegan": "/api/placeholder/350/200",
        "Beverages": "/api/placeholder/350/200",
        "default": "/api/placeholder/350/200"
    };

    const imageUrl = categoryImages[categoryName] || categoryImages.default;

    // Animation variants for each card
    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 50
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12,
                delay: index * 0.1
            }
        },
        hover: {
            y: -15,
            boxShadow: "0px 15px 25px rgba(0,0,0,0.1)",
            transition: { duration: 0.3 }
        }
    };

    // Animation for image zoom on hover
    const imageVariants = {
        hover: {
            scale: 1.1,
            transition: { duration: 0.5 }
        }
    };

    return (
        <motion.div
            className="flex flex-col w-full rounded-2xl overflow-hidden shadow-md bg-white"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
        >
            <div className="h-48 overflow-hidden">
                <motion.img
                    src={imageUrl}
                    alt={`${categoryName} category`}
                    className="h-full w-full object-cover"
                    variants={imageVariants}
                    whileHover="hover"
                />
            </div>
            <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100 text-black">
                <h2 className="font-semibold text-lg text-center">{categoryName}</h2>
                <p className="text-sm text-gray-600 text-center mt-1">
                    Explore {categoryName.toLowerCase()} dishes
                </p>
            </div>
        </motion.div>
    );
};

const Category = () => {
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Container animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1,
                delayChildren: 0.3,
                duration: 0.5
            }
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8082/api/v1/foods/categories');

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const data: ApiResponse = await response.json();

                if (data.code === 200 && Array.isArray(data.data)) {
                    setCategories(data.data);
                } else {
                    throw new Error('Invalid data format received from API');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
                console.error('Failed to fetch categories:', err);
            } finally {
                // Add a slight delay to show the skeleton loader
                setTimeout(() => setLoading(false), 600);
            }
        };

        fetchCategories();
    }, []);

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    variants={textVariant(0.3)}
                    initial="hidden"
                    animate="visible"
                    className="mb-10"
                >
                    <h2 className="text-3xl font-bold text-gray-900">
                        Popular Categories
                    </h2>
                    <div className="h-1 w-24 bg-orange-500 mt-2"></div>
                    <p className="mt-4 text-gray-600">
                        Explore our most popular food categories
                    </p>
                </motion.div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {Array(5).fill(0).map((_, index) => (
                            <CategoryCardSkeleton key={index} />
                        ))}
                    </div>
                ) : error ? (
                    <motion.div
                        className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <p className="font-medium">Error loading categories:</p>
                        <p>{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-2 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {categories.map((category, index) => (
                            <FoodCard key={index} categoryName={category} index={index} />
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
};

const CategoryWrapper = SectionWrapper(Category);

export default CategoryWrapper;