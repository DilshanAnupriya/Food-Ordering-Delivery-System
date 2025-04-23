import  {JSX} from "react";

import { useState } from 'react';

interface CardContent {
    title: string;
    description: string;
    icon: JSX.Element;
}

interface TabData {
    question: string;
    cards: CardContent[];
}

export default function FAQContent() {
    const [activeTabIndex, setActiveTabIndex] = useState<number>(0);

    const tabsData: TabData[] = [
        {
            question: "How does Order.LK work?",
            cards: [
                {
                    title: "Place an Order!",
                    description: "Place order through our website or Mobile app",
                    icon: (
                        <div className="bg-yellow-300 w-16 h-16 rounded-full flex items-center justify-center relative mb-2">
                            <div className="absolute -top-2 -right-2 bg-green-400 w-8 h-8 rounded-full flex items-center justify-center text-white text-xl">+</div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24" fill="orange">
                                <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
                            </svg>
                        </div>
                    ),
                },
                {
                    title: "Track Progress",
                    description: "Your can track your order status with delivery time",
                    icon: (
                        <div className="flex items-center justify-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" viewBox="0 0 24 24" fill="orange">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                            </svg>
                        </div>
                    ),
                },
                {
                    title: "Get your Order!",
                    description: "Receive your order at a lighting fast speed!",
                    icon: (
                        <div className="flex items-center justify-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" viewBox="0 0 24 24" fill="#ff6e40">
                                <path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 18H7V5h10v14z" />
                                <path d="M12 17h2v2h-2z" />
                            </svg>
                        </div>
                    ),
                }
            ],
        },
        {
            question: "What payment methods are accepted?",
            cards: [
                {
                    title: "Credit Cards",
                    description: "We accept all major credit cards including Visa, Mastercard, and American Express",
                    icon: (
                        <div className="flex items-center justify-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" viewBox="0 0 24 24" fill="#3f51b5">
                                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                            </svg>
                        </div>
                    ),
                },
                {
                    title: "Digital Wallets",
                    description: "Apple Pay, Google Pay, and PayPal are all supported",
                    icon: (
                        <div className="flex items-center justify-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" viewBox="0 0 24 24" fill="#4caf50">
                                <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                            </svg>
                        </div>
                    ),
                },
                {
                    title: "Cash on Delivery",
                    description: "Pay with cash when your order arrives",
                    icon: (
                        <div className="flex items-center justify-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" viewBox="0 0 24 24" fill="#ff9800">
                                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm-7 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
                            </svg>
                        </div>
                    ),
                }
            ],
        },
        {
            question: "Can I track my order in real-time?",
            cards: [
                {
                    title: "Live Tracking",
                    description: "Track your delivery in real-time with our interactive map",
                    icon: (
                        <div className="flex items-center justify-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" viewBox="0 0 24 24" fill="#e91e63">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                        </div>
                    ),
                },
                {
                    title: "Status Updates",
                    description: "Receive notifications at each stage of the delivery process",
                    icon: (
                        <div className="flex items-center justify-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" viewBox="0 0 24 24" fill="#9c27b0">
                                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
                            </svg>
                        </div>
                    ),
                },
                {
                    title: "Delivery Estimates",
                    description: "Know exactly when your food will arrive",
                    icon: (
                        <div className="flex items-center justify-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" viewBox="0 0 24 24" fill="#2196f3">
                                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                                <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                            </svg>
                        </div>
                    ),
                }
            ],
        },
        {
            question: "Are there any special discounts or promotions available?",
            cards: [
                {
                    title: "Daily Deals",
                    description: "Check our app daily for exclusive discounts",
                    icon: (
                        <div className="flex items-center justify-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" viewBox="0 0 24 24" fill="#f44336">
                                <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" />
                            </svg>
                        </div>
                    ),
                },
                {
                    title: "Loyalty Program",
                    description: "Earn points with every order and redeem them for free meals",
                    icon: (
                        <div className="flex items-center justify-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" viewBox="0 0 24 24" fill="#ffeb3b">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                        </div>
                    ),
                },
                {
                    title: "Referral Bonuses",
                    description: "Invite friends and both of you get discount codes",
                    icon: (
                        <div className="flex items-center justify-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" viewBox="0 0 24 24" fill="#4caf50">
                                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                            </svg>
                        </div>
                    ),
                }
            ],
        },
        {
            question: "Is Order.UK available in my area?",
            cards: [
                {
                    title: "Coverage Map",
                    description: "Check our interactive map to see if we deliver in your area",
                    icon: (
                        <div className="flex items-center justify-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" viewBox="0 0 24 24" fill="#00bcd4">
                                <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />
                            </svg>
                        </div>
                    ),
                },
                {
                    title: "Expanding Service",
                    description: "We're constantly adding new delivery areas",
                    icon: (
                        <div className="flex items-center justify-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" viewBox="0 0 24 24" fill="#ff5722">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                        </div>
                    ),
                },
                {
                    title: "Postal Code Check",
                    description: "Enter your postal code on our website to instantly verify delivery availability",
                    icon: (
                        <div className="flex items-center justify-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" viewBox="0 0 24 24" fill="#8bc34a">
                                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                            </svg>
                        </div>
                    ),
                }
            ],
        }
    ];

    return (
        <div className="bg-gray-100 h-[600px] rounded-2xl p-8 mt-15 mb-15">
            <div className="max-w-6xl mx-auto">
                <div className="mb-14">
                    <h1 className="text-3xl font-bold mb-6">Know more about us!</h1>

                    {/*<div className="flex flex-wrap gap-4 mb-6">*/}
                    {/*    <button className="px-6 py-3 rounded-full border border-orange-400 text-black font-medium bg-white hover:bg-orange-50 transition-colors">*/}
                    {/*        Frequent Questions*/}
                    {/*    </button>*/}
                    {/*    <button className="px-6 py-3 rounded-full text-black font-medium hover:bg-gray-200 transition-colors">*/}
                    {/*        Who we are?*/}
                    {/*    </button>*/}
                    {/*    <button className="px-6 py-3 rounded-full text-black font-medium hover:bg-gray-200 transition-colors">*/}
                    {/*        Partner Program*/}
                    {/*    </button>*/}
                    {/*    <button className="px-6 py-3 rounded-full text-black font-medium hover:bg-gray-200 transition-colors">*/}
                    {/*        Help & Support*/}
                    {/*    </button>*/}
                    {/*</div>*/}
                </div>

                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Left side - Questions */}
                        <div className="w-full md:w-1/3">
                            {tabsData.map((tab, idx) => (
                                <div
                                    key={idx}
                                    className={`mb-4 ${idx === 0 ? 'mb-6' : ''}`}
                                >
                                    {idx === 0 ? (
                                        <button
                                            onClick={() => setActiveTabIndex(idx)}
                                            className={`w-full text-left px-6 py-3 rounded-full font-medium ${
                                                activeTabIndex === idx
                                                    ? 'bg-orange-400 text-white'
                                                    : ' text-black hover:text-orange-400'
                                            } transition-colors`}
                                        >
                                            {tab.question}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setActiveTabIndex(idx)}
                                            className={`w-full text-left px-6 py-3 rounded-full font-medium ${
                                                activeTabIndex === idx ? 'bg-orange-400 text-white' : 'text-black hover:text-orange-400'
                                            } transition-colors`}
                                        >
                                            {tab.question}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Right side - Card Content */}
                        <div className="w-full md:w-2/3">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {tabsData[activeTabIndex].cards.map((card, idx) => (
                                    <div key={idx} className="bg-gray-200 rounded-lg p-6 flex flex-col items-center text-center">
                                        {card.icon}
                                        <h3 className="text-lg font-bold mb-2">{card.title}</h3>
                                        <p>{card.description}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 text-center">
                                <p className="text-gray-700">
                                    Order.LK simplifies the food ordering process. Browse through our diverse menu,
                                    select your favorite dishes, and proceed to checkout. Your delicious meal will be
                                    on its way to your doorstep in no time!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
