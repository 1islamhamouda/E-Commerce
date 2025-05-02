import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react';
import axios from 'axios';

export default function CategoriesSlide() {
    const imgesSlider = ()=>{
    axios.get('https://ecommerce.routemisr.com/api/v1/categories')
         .then((res: { data: { data: Array<{ _id: string; image: string; name: string }> }; })=>{
            setCategories(res?.data?.data);
            console.log(res?.data.data);
         })
     .catch((err:any)=>{
        console.log(err);
     })
    };
    const [categories, setCategories] = useState<null | Array<{ _id: string; image: string; name: string }>>(null);
     useEffect(()=>{
      imgesSlider();
     },[]);
     var setting = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 3,
        autoplay: true,
        autoplaySpeed: 3000,
    };
  return (
    <>
     <div className=" w-full mb-4 ">
     <Slider {...setting}>
    {categories?.map((category: { _id: Key | null | undefined; image: string | undefined; name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }) => {
        return (
            <figure key={category?._id}>
                <img src={category?.image} alt="" className='w-full h-36  rounded-2xl ' />
                <figcaption className="font-mono text-gray-500">{category?.name}</figcaption>
            </figure>
        );
    })}
</Slider>
     </div>
    </>
  )
}
