import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { MapPin } from "lucide-react";
import { Hospital } from "../Redux/HospitalsData";
import { getCurrentLocation } from "./getCurrentLocation";

// --- Import marker images for Vite ---
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerIcon2xUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

// --- Set Leaflet default icon ---
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2xUrl,
  iconUrl: markerIconUrl,
  shadowUrl: markerShadowUrl,
});

// --- Custom icons ---
const hospitalIcon = L.icon({
  iconUrl: markerIconUrl,
  iconRetinaUrl: markerIcon2xUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const userIcon = L.icon({
  iconUrl: markerIconUrl,
  iconRetinaUrl: markerIcon2xUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// --- Routing Control Component ---
interface RoutingProps {
  userLocation: [number, number];
  hospitalLocation: [number, number];
}

const Routing: React.FC<RoutingProps> = ({
  userLocation,
  hospitalLocation,
}) => {
  const map = useMap();

  useEffect(() => {
    const fun = () => {
      if (!userLocation || !hospitalLocation) return;

      const routingControl = (L as any).Routing.control({
        waypoints: [L.latLng(userLocation), L.latLng(hospitalLocation)],
        lineOptions: {
          styles: [{ color: "blue", weight: 4 }],
          extendToWaypoints: true,
          missingRouteTolerance: 2,
        },
        routeWhileDragging: true,
        createMarker: (i: number, waypoint: any) => {
          return L.marker(waypoint.latLng, {
            icon: i === 0 ? userIcon : hospitalIcon,
          });
        },
      }).addTo(map);

      // Fix map size if container was hidden initially
      setTimeout(() => map.invalidateSize(), 100);

      return () => map.removeControl(routingControl);
    };
    fun();
  }, [map, userLocation, hospitalLocation]);

  return null;
};

// --- Main Map Component ---
interface MapProps {
  hospital: Hospital;
}

const Map: React.FC<MapProps> = ({ hospital }) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const hospitalLocation: [number, number] = [
    hospital.latitude as number,
    hospital.longitude as number,
  ];

  useEffect(() => {
    const fetchLocation = async () => {
      const [lat, lng] = await getCurrentLocation();
      setUserLocation([lat, lng]);
    };
    fetchLocation();
  }, []);

  const openGoogleMaps = () => {
    if (!userLocation) {
      alert(
        "Unable to get your current location. Please enable location services."
      );
      return;
    }
    const [userLat, userLng] = userLocation;
    const [hospitalLat, hospitalLng] = hospitalLocation;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${hospitalLat},${hospitalLng}&travelmode=driving`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <div className="h-80 sm:h-96 rounded-lg overflow-hidden">
        <MapContainer
          center={hospitalLocation}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={hospitalLocation} icon={hospitalIcon}>
            <Popup>{hospital.name}</Popup>
          </Marker>
          {userLocation && (
            <Marker position={userLocation} icon={userIcon}>
              <Popup>Your Location</Popup>
            </Marker>
          )}
          {userLocation && (
            <Routing
              userLocation={userLocation}
              hospitalLocation={hospitalLocation}
            />
          )}
        </MapContainer>
      </div>

      {/* Google Maps Button */}
      <div className="flex justify-center">
        <button
          onClick={openGoogleMaps}
          className="bg-green-600 text-white px-5 py-3 rounded-md shadow-md hover:bg-green-700 transition-colors duration-200 flex items-center justify-center w-full sm:w-auto"
        >
          <MapPin className="mr-2 h-5 w-5" />
          Open in Google Maps
        </button>
      </div>
    </div>
  );
};

export default Map;
