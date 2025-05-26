import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function CategoriesSlide() {
    const [categories, setCategories] = useState<null | Array<{ _id: string; image: string; name: string }>>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('https://ecommerce.routemisr.com/api/v1/categories');
            setCategories(response.data.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load categories 😕', {
                duration: 2000,
                position: 'top-center',
                style: {
                    background: '#f44336',
                    color: '#fff',
                    padding: '16px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                },
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 3,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 2,
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 2,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ],
        customPaging: function() {
            return (
                <div className="w-2 h-2 bg-gray-300 rounded-full hover:bg-blue-500 transition-all duration-300" />
            );
        },
    };

    if (isLoading) {
        return (
            <div className="w-full h-48 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Shop by Category</h2>
            <div className="relative group">
                <Slider {...settings} className="category-slider">
                    {categories?.map((category) => (
                        <div key={category._id} className="px-2">
                            <div className="relative group cursor-pointer">
                                <div className="overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500">
                                    <img 
                                        src={category.image} 
                                        alt={category.name} 
                                        className="w-full h-40 sm:h-48 object-cover transform transition-transform duration-700 group-hover:scale-110" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                                </div>
                                <div className="mt-3 text-center">
                                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                                        {category.name}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
}
