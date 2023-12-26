
import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

const Map = ({ location }) => {
  return (
    <MapContainer center={[location.latitude, location.longitude]} zoom={13} style={{ height: '300px', width: '450px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© OpenStreetMap contributors'
      />
      <Marker position={[location.latitude, location.longitude]}>
        {/* You can add a Popup if you want additional informatiosn */}
      </Marker>
    </MapContainer>
  );
};

export default Map;
