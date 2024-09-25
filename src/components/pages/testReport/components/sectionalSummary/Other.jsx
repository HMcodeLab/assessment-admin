import React, { useState } from 'react';

const TimeConversionExample = () => {
  const [uploadTime, setUploadTime] = useState('');
  const [localTime, setLocalTime] = useState('');

  // Simulating an upload function that captures the US time (e.g., Eastern Time)
  const handleUpload = () => {
    // Capture the upload time in US Eastern Time (ET)
    const usTime = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
    setUploadTime(usTime);

    // Convert to user's local time
    const localTimeConverted = new Date(usTime).toLocaleString();
    setLocalTime(localTimeConverted);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <button
        onClick={handleUpload}
        className="mb-4 bg-blue-500 text-white py-2 px-4 rounded"
      >
        Simulate Upload
      </button>

      {uploadTime && (
        <div className="text-center">
          <p><strong>US Eastern Time:</strong> {uploadTime}</p>
          <p><strong>Your Local Time:</strong> {localTime}</p>
        </div>
      )}
    </div>
  );
};

export default TimeConversionExample;
