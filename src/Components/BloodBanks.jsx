import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import './BloodBanks.css';

// Custom marker icon configuration for Leaflet
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const BloodBanks = () => {
  const positions = [
    { lat: 18.505095696887548, lng: 73.85763904247267, name: "Jankalyan Blood Centre", contact: "02024449527" },
    { lat: 18.527070354843733, lng: 73.86399051296132, name: "Om Blood Bank", contact: "NA"},
    { lat: 18.507211897859502, lng: 73.82021686499901, name: "Sahiyadari Speciality Hospital Blood Bank", contact: "02025403232" },
    { lat: 18.463886641531754, lng: 73.85663150244973, name: "Emergency Blood Bank", contact: "NA" },
    { lat: 18.513204888924516, lng: 73.84205950244973, name: "Acharya Anandrushiji Blood Bank", contact: "02024537627" },
  ];

  return (<>
  
    <div className='bloodbanks-container'>
    <div className="container mt-4">
      <h3 className="mb-4">Nearest Blood Banks</h3>
      <div className="map-container" style={{ height: '550px', width: '100%' }}>
        <MapContainer
          center={[18.5004, 73.8550]} 
          zoom={13.2}
          scrollWheelZoom={true}
          style={{ height: '85%', width: '100%' }}
        >
          {/* TileLayer to show map tiles */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Add markers for each blood bank */}
          {positions.map((position, index) => (
            <Marker
              key={index}
              position={[position.lat, position.lng]}
              icon={markerIcon}
            >
              <Popup>
                {position.name} <br /> 
                Contact: {position.contact}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
    </div>
    </>
  );
};

export default BloodBanks;