import React from 'react';
import { Box, Modal } from '@mui/material';

const ImageViewer = ({ image, open, close }) => {
  return (
    <Modal
      open={open}
      onClose={close}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className='cursor-pointer'
    >
      <Box
        className="flex items-center justify-center mx-auto my-auto w-[90%] h-[90%] bg-white py-4 rounded"
        sx={{ overflow: 'hidden' }} // Ensures the box doesn't overflow
      >
        <img src={image} alt="error screenshot" className="w-full h-auto" />
      </Box>
    </Modal>
  );
};

export default ImageViewer;
