import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './slide.css'
import img1 from '../../assets/blog-img-2.jpeg'
import img2 from '../../assets/grocery-banner-2.jpeg'
import img3 from '../../assets/slider-image-2.jpeg' 
import img4 from '../../assets/slider-image-3.jpeg'
import { useState, useEffect } from 'react';

export default function Sliders() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    var settings = {
        dots: true,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        fade: true,
        cssEase: 'linear',
        arrows: !isMobile,
        customPaging: function() {
            return (
                <div className="w-2 h-2 bg-gray-300 rounded-full hover:bg-blue-500 transition-all duration-300" />
            );
        },
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Slider */}
                <div className="w-full lg:w-2/3">
                    <div className="relative group">
                        <Slider {...settings} className="rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                            <div className="relative">
                                <img 
                                    src={img1} 
                                    alt="Featured product" 
                                    className="w-full h-[250px] sm:h-[350px] md:h-[400px] object-cover rounded-3xl transform transition-transform duration-700 group-hover:scale-105" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-3xl" />
                            </div>
                            <div className="relative">
                                <img 
                                    src={img2} 
                                    alt="Special offer" 
                                    className="w-full h-[250px] sm:h-[350px] md:h-[400px] object-cover rounded-3xl transform transition-transform duration-700 group-hover:scale-105" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-3xl" />
                            </div>
                        </Slider>
                    </div>
                </div>

                {/* Side Images */}
                <div className="hidden sm:flex w-full lg:w-1/3 flex-col gap-6">
                    <div className="relative group">
                        <img 
                            src={img3} 
                            alt="Promotion" 
                            className="w-full h-[160px] sm:h-[180px] object-cover rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="relative group">
                        <img 
                            src={img4} 
                            alt="New arrival" 
                            className="w-full h-[160px] sm:h-[180px] object-cover rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                </div>
            </div>
        </div>
    );
}
