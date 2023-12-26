// OpenCageService.js
import axios from 'axios';

const getGeocode = async (latitude, longitude, apiKey) => {
  try {
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
    );

    if (response.data.results.length > 0) {
      const formattedAddress = response.data.results[0].formatted;
      return formattedAddress;
    } else {
      return 'Address not found';
    }
  } catch (error) {
    console.error('Error fetching geocode:', error);
    return 'Error fetching address';
  }
};

export default getGeocode;
