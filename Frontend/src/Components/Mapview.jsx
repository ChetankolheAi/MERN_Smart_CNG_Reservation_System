import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

import {
  userIcon,
  openPumpIcon,
  closedPumpIcon,
} from "../utils/leafletIcon";

export default function Mapview({ onSelectPump }) {
  
  const [userLocation, setUserLocation] = useState(null);
  const [pumps, setPumps] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getLocation();
    fetchPumps();
  }, []);

  const getLocation = () => {

    navigator.geolocation.getCurrentPosition(
      (position) => {

        setUserLocation([
          position.coords.latitude,
          position.coords.longitude,
        ]);

      },
      (err) => console.log(err)
    );

  };
  const fetchPumps = async () => {

    try {

      const res = await api.get("/pump/all");

      setPumps(res.data);

    } catch (err) {

      console.log(err);

    }

  };

  if (!userLocation)
    return (
      <div className="h-[600px] flex items-center justify-center">
        Loading Map...
      </div>
    );

  return (
    <MapContainer
      center={userLocation}
      zoom={13}
      className="h-[600px] w-full rounded-2xl"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* User Marker */}

      <Marker
        position={userLocation}
        icon={userIcon}
      >
        <Popup>
          📍 Your Current Location
        </Popup>
      </Marker>

      {/* Pump Markers */}

      {pumps.map((pump) => (

        <Marker
          key={pump._id}
          position={[
            pump.latitude,
            pump.longitude,
          ]}
          icon={
            pump.isOpen
              ? openPumpIcon
              : closedPumpIcon
          }
        >

          <Popup>

            <div className="space-y-2 w-52">

              <h2 className="font-bold">
                {pump.pumpName}
              </h2>

              <p>
                ₹ {pump.cngRate}/kg
              </p>

              <p>
                {pump.isOpen
                  ? "🟢 Open"
                  : "🔴 Closed"}
              </p>

              <button
                className="w-full bg-green-600 text-white py-2 rounded-lg"
               onClick={() => {
                  const isLoggedIn = localStorage.getItem("user"); // Or your auth context/state check

                  if (isLoggedIn) {
                    navigate("/bookingPage", {
                      state: { pump },
                    });
                  } else {
                    // Optionally pass the current route so you can redirect back after login
                    navigate("/login", { state: { from: "/bookingPage", pump } });
                  }
                }}
              >
                Book Now
              </button>

              <button
                className="w-full border py-2 rounded-lg"
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${pump.latitude},${pump.longitude}`
                  )
                }
              >
                Directions
              </button>

            </div>

          </Popup>

        </Marker>

      ))}

    </MapContainer>
  );
}