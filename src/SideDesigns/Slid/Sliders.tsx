import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './slide.css'
import img1 from '../../assets/blog-img-2.jpeg'
import img2 from '../../assets/grocery-banner-2.jpeg'
import img3 from '../../assets/slider-image-2.jpeg' 
import img4 from '../../assets/slider-image-3.jpeg'

export default function Sliders() {
    var settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
      };
  return (
    <>

<div className="flex flex-row md:flex-row justify-center w-full md:ms-3 ">
  <div className="right w-3/4 md:w-3/4 ">
    <Slider {...settings}>
      <div>
        <img src={img1} alt="" className="w-full h-56 md:h-72" />
      </div>
      <div>
        <img src={img2} alt="" className="w-full h-56 md:h-72" />
      </div>
    </Slider>
  </div>
  <div className="left w-1/4 md:w-1/4 flex flex-col ">
    <div>
      <img src={img3} alt="" className="w-full h-28 md:h-36 block" />
    </div>
    <div>
      <img src={img4} alt="" className="w-full h-28 md:h-36 block" />
    </div>
  </div>
</div>

      
    </>
  )
}
