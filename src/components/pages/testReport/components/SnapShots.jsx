import React, { useState } from "react";
import ImageViewer from "./ImageViewer";
import { FaAngleLeft,FaAngleRight } from "react-icons/fa";

const Carousel = ({ userScreenshots }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [imageType, setImageType] = useState();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = userScreenshots;

  // Determine whether the image is a desktop or mobile screenshot based on aspect ratio
  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
// dgjhf
    // Determine whether the image is a desktop or mobile screenshot based on aspect ratio
    if (naturalWidth > naturalHeight) {
      setImageType('desktop');
    } else {
      setImageType('mobile');
    }
  };

  // Navigate to the next slide
  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // Navigate to the previous slide
  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Open modal with the selected image
  const handleView = () => {
    setModalOpen(true);
  };

  return (
    userScreenshots.length > 0 && (
      <div id="default-carousel" className="relative w-full" data-carousel="slide">
        {/* Carousel wrapper */}
        <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
          <h1 className="text-red-500 text-center py-2 font-semibold text-xl">
            ScreenShot
          </h1>
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute block w-full h-full transition-opacity duration-700 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
              data-carousel-item
            >
              <img
                src={slide}
                className={`absolute block -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 ${imageType==="mobile" ? "w-[180px]":"w-[600px]"}  cursor-pointer`}
                onClick={() => handleView(slide)}
                onLoad={handleImageLoad}
                alt={`Slide ${index + 1}`}
              />
            </div>
          ))}
        </div>

        {/* Slider indicators */}
        <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`w-3 h-3 rounded-full ${
                currentSlide === index ? "bg-blue-500" : "bg-gray-300"
              }`}
              aria-current={currentSlide === index}
              aria-label={`Slide ${index + 1}`}
              onClick={() => setCurrentSlide(index)}
            ></button>
          ))}
        </div>

        {/* Slider controls */}
        <button
          type="button"
          className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          onClick={handlePrev}
        >
          <FaAngleLeft className="text-2xl"/>
        </button>
        <button
          type="button"
          className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          onClick={handleNext}
        >
         <FaAngleRight className="text-2xl"/>
        </button>

        {/* ImageViewer Modal */}
        {modalOpen && (
          <ImageViewer
            images={userScreenshots}
            open={() => setModalOpen(true)}
            close={() => setModalOpen(false)}
          />
        )}
      </div>
    )
  );
};

export default Carousel;
