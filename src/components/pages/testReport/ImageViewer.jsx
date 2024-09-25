import React, { useState } from 'react';
import { Box, Modal } from '@mui/material';

const ImageViewer = ({ image, open, close }) => {
  const [imageType, setImageType] = useState(null);

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;

    // Determine whether the image is a desktop or mobile screenshot based on aspect ratio
    if (naturalWidth > naturalHeight) {
      setImageType('desktop');
    } else {
      setImageType('mobile');
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="cursor-pointer"
    >
      <Box
        className={`flex items-center justify-center mx-auto my-auto ${
          imageType === 'desktop' ? 'w-[90%] h-auto' : 'w-[50%] h-auto'
        } bg-white py-4 rounded`}
        sx={{ overflow: 'hidden' }}
      >
        <img
          src={image}
          alt="error screenshot"
          onLoad={handleImageLoad}
          className="w-full h-auto"
        />
      </Box>
    </Modal>
  );
};

export default ImageViewer;
