import {motion} from "framer-motion";
import {textVariant} from "../../util/motion.ts";
import {useEffect, useState} from "react";

interface Category {
    name: string;
}
interface ApiResponse {
    code: number;
    message: string;
    data: string[];
}
const FoodCard = ({ categoryName }: { categoryName: string }) => {

    const categoryImages: Record<string, string> = {
        "Italian": "https://insanelygoodrecipes.com/wp-content/uploads/2020/12/Homemade-Ground-Beef-Lasagna-800x530.png",
        "fast food": "https://www.hashtagburgersandwaffles.com.au/wp-content/uploads/2024/08/Why-Fast-Foods-Are-So-Successful.jpeg",
        "Desserts": "https://images.immediate.co.uk/production/volatile/sites/2/2022/08/Vegan-sticky-toffee-pudding-header-0b7834c.jpg?quality=90&resize=556,505",
        "Vegan": "https://vancouverwithlove.com/wp-content/uploads/2022/06/how-to-go-vegan-10.jpg",
        "Beverages": "https://www.shutterstock.com/image-photo/soft-drinks-fruit-juice-mixed-600nw-2321374403.jpg",
        // Default image for any other category
        "default": "/api/placeholder/350/192"
    };

    const imageUrl = categoryImages[categoryName] || categoryImages.default;

    return (
        <>
            <div className="flex flex-col  w-59 mt-6 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all ease-in-out transform hover:-translate-y-2 duration-300 bg-white">
                <div className="h-48 flex items-center justify-center bg-gray-100">
                    <img
                        src={imageUrl}
                        alt={`${categoryName} category`}
                        className="h-full w-full object-cover"
                    />
                </div>
                <div className="p-4 bg-amber-50 text-black">
                    <h2 className="font-semibold text-lg">{categoryName}</h2>
                    <p className="text-sm text-gray-600">Explore {categoryName.toLowerCase()} dishes</p>
                </div>
            </div>
        </>
    )
}

const Category = () => {
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <>
            <section className="py-8 ">
                <motion.div variants={textVariant(0.3)}>
                    <h2 className="text-black font-black md:text-[25px] sm:text-[50px] xs:text-[40px] text-[30px] mb-6">
                        Popular Categories
                    </h2>
                </motion.div>

                {loading && (
                    <div className="flex justify-center items-center h-40">
                        <p className="text-gray-600">Loading categories...</p>
                    </div>
                )}

                {error && (
                    <div className="flex justify-center items-center h-40 text-red-500">
                        <p>Error loading categories: {error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                        {categories.map((category, index) => (
                            <FoodCard key={index} categoryName={category} />
                        ))}
                    </div>
                )}
            </section>

        </>
    )
}

export default Category
