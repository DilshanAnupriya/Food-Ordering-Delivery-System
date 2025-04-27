import React from 'react';


interface CategorySearchProps {
    categories: string[];
    selectedCategory: string | null;
    onCategoryChange: (category: string) => void;
    searchText: string;
}

const CategorySearch: React.FC<CategorySearchProps> = ({
                                                                  categories,
                                                                  selectedCategory,
                                                                  onCategoryChange
                                                              }) => {
    return (
        <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between bg-orange-500 items-start md:items-center mb-10">
                <div className="max-w-7xl  xl:ml-20 2xl:ml-78 relative z-0 pt-2">
                    <div className="flex overflow-x-auto pb-2 mb-4 md:mb-0 scrollbar-hide">
                        {categories && categories.map((category) => (
                            <button
                                key={category}
                                className={`px-4 py-2 rounded-full mr-2 whitespace-nowrap ${
                                    selectedCategory === category
                                        ? ' text-white font-bold bg-black'
                                        : 'text-white font-bold hover:bg-black'
                                }`}
                                onClick={() => onCategoryChange(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// const CategoriesSearch = SectionWrapper(CategorySearch);

export default CategorySearch;
