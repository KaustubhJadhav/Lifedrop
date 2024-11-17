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
    { lat: 18.527070354843733, lng: 73.86399051296132, name: "Om Blood Bank", contact: "NA" },
    { lat: 18.507211897859502, lng: 73.82021686499901, name: "Sahiyadari Speciality Hospital Blood Bank", contact: "02025403232" },
    { lat: 18.463886641531754, lng: 73.85663150244973, name: "Emergency Blood Bank", contact: "NA" },
    { lat: 18.513204888924516, lng: 73.84205950244973, name: "Acharya Anandrushiji Blood Bank", contact: "02024537627" },
    { lat: 18.50981285753866,  lng: 73.79022142087669,  name: "Borse Nursing Home" },
    { lat: 18.50899156275135,  lng: 73.79217013824088,  name: "Capital Hospital" },
    { lat: 18.504024941881998, lng: 73.80775512035657,  name: "Shankarrao Dhondiba Sutar Multi-speciality Hospital" },
    { lat: 18.496873905169586, lng: 73.81249915810088,  name: "Deoyani Multi Speciality Hospital" },
    { lat: 18.495325136536604, lng: 73.81346882750806,  name: "Shashwat Hospital Kothrud" },
    { lat: 18.50282685440805,  lng: 73.83296428644292,  name: "Deenanath Mangeshkar Hospital and Research Center" },
  ];

  return (
    <>
      <div className="bloodbanks-container">
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
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {/* Add markers for each blood bank */}
              {positions.map((position, index) => (
                <Marker
                  key={index}
                  position={[position.lat, position.lng]}
                  icon={markerIcon}
                >
                  <Popup>
                    <div>
                      <strong>{position.name}</strong>
                      <br />
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${position.lat},${position.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none" }}
                      >
                        <button
                          type="button"
                          className="btn btn-danger mt-2"
                          style={{
                            padding: "5px 10px",
                            fontSize: "12px",
                            width: "100px",
                            height: "30px",
                          }}
                        >
                          Get Directions
                        </button>
                      </a>
                    </div>
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
