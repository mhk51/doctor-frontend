import React, { useState } from 'react';

const LocationButton = ({ onLocationChange }) => {
  const [location, setLocation] = useState(null);
  const targetAccuracy = 200;

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      const successCallback = (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        console.log(`Accuracy: ${accuracy} meters`);

        setLocation({ latitude, longitude, accuracy });
        onLocationChange({ latitude, longitude, accuracy });

        if (accuracy <= targetAccuracy) {
          // Stop watching when the needed accuracy is reached
          navigator.geolocation.clearWatch(watchId);
        }
      };

      const errorCallback = (error) => {
        console.error('Error getting location:', error.message);
      };

      const options = { enableHighAccuracy: true, timeout: 5000, maximumAge: 15 * 60 * 1000 };
      const watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, options);
    } else {
      console.error('Geolocation is not supported by your browser');
    }
  };

  return (
    <div>
      <button onClick={getCurrentLocation}>Get Current Location</button>
      {/* Your UI components */}
      {location && (
        <p>
          Latitude: {location.latitude}, Longitude: {location.longitude}, Accuracy: {location.accuracy} meters
        </p>
      )}
    </div>
  );
};

export default LocationButton;
