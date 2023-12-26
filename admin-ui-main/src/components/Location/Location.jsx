import React, { useRef, useState, useEffect } from 'react';
import Map from './Map';
import MoonLoader from "react-spinners/MoonLoader";

const Location = ({ onLocationChange }) => {
  const [location, setLocation] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const watchIdRef = useRef(null);

  const TIMEOUT_DURATION = 60000;
  const targetAccuracy = 300;
  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  function setGeolocation() {
    setLoading(true);
    setRetrying(false); // Reset retrying state

    const successCallback = (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      console.log(`Accuracy: ${accuracy} meters`);
  
      if (accuracy <= targetAccuracy) {
        // Handle the obtained location data
        const newLocation = { latitude, longitude, accuracy };
        console.log(newLocation);
        setLocation(newLocation);
        onLocationChange(newLocation);
        setMapVisible(true);
        setLoading(false);
        // Stop watching when the needed accuracy is reached
        window.navigator.geolocation.clearWatch(watchIdRef.current);
      } else {
        // Keep watching for better accuracy
        console.log("Waiting for better accuracy...");
      }
    };
  
    const errorCallback = (error) => {
      console.error('Error getting location:', error.message);
      setLoading(false);
    };
  
    watchIdRef.current = window.navigator.geolocation.watchPosition(
      successCallback,
      errorCallback,
      {
        maximumAge: 250,
        enableHighAccuracy: true,
      }
    );
  
    // Clear the watch after TIMEOUT_DURATION milliseconds
    window.setTimeout(() => {
      window.navigator.geolocation.clearWatch(watchIdRef.current);
      setLoading(false); // Clear loading state if it's still loading after the timeout
      setRetrying(true); // Set retrying state after the timeout
    }, TIMEOUT_DURATION);
  }

  const handleRetry = () => {
    setGeolocation();
  };

  useEffect(() => {
    // Fetch the location when the component mounts
    setGeolocation();

    // Cleanup the watchPosition when the component is unmounted
    return () => {
      window.navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []); // Run once on component mount

  return (
    <div>
      {location && mapVisible && (
        <Map location={location} />
      )}
      {!loading && !mapVisible && (
        <div>
          <p>Failed to fetch location. Please try again.</p>
          <button onClick={handleRetry}>
            Retry
          </button>
        </div>
      )}
      {loading && (
        <MoonLoader 
          loading={loading}
          cssOverride={override}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      )}
    </div>
  );
};

export default Location;



  