import React, { useState } from 'react';
import { Box, Modal, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const ImageViewer = ({ images, open, close }) => {
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current image
  const [imageType, setImageType] = useState(null); // Track image type (desktop/mobile)

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;

    // Determine whether the image is a desktop or mobile screenshot based on aspect ratio
    if (naturalWidth > naturalHeight) {
      setImageType('desktop');
    } else {
      setImageType('mobile');
    }
  };

  // Handle next image
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Handle previous image
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <Modal
      open={open}
      onClose={close}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="cursor-pointer flex items-center justify-center"
    >
      <Box className="relative flex items-center justify-center w-full h-full">
        {/* Previous button */}
        <IconButton
          onClick={handlePrev}
          className="absolute left-4 top-1 transform -translate-y-1/2 text-white bg-black bg-opacity-50 hover:bg-opacity-75"
        >
          <ArrowBackIosIcon className='text-white'/>
        </IconButton>

        {/* Image Container */}
        <Box
          className={`flex items-center justify-center mx-auto my-auto rounded-xl ${
            imageType === 'desktop' ? 'w-[90%] h-[98%]' : 'w-[50%] h-auto'
          } bg-white py-4 rounded`}
          sx={{ overflow: 'hidden' }}
        >
          <img
            src={images[currentIndex]}
            alt={`Screenshot ${currentIndex + 1}`}
            onLoad={handleImageLoad}
            className="w-full h-auto object-cover"
          />
        </Box>

        {/* Next button */}
        <IconButton
          onClick={handleNext}
          className="absolute right-4 top-1 transform -translate-y-1/2 text-white bg-black bg-opacity-50 hover:bg-opacity-75"
        >
          <ArrowForwardIosIcon className='text-white'/>
        </IconButton>
      </Box>
    </Modal>
  );
};

export default ImageViewer;
