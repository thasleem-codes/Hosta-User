import React, { useState, useEffect } from "react";
import { Search, Phone, MapPin, Ambulance, X, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/Store";
import { AmbulanceService } from "../Redux/AmbulanceData";
import { Header } from "../Components/Common";
import { getCurrentLocation } from "../Components/getCurrentLocation";

const AmbulanceServicesPage: React.FC = () => {
  const ambulanceServices = useSelector(
    (state: RootState) => state.ambulanceData
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredServices, setFilteredServices] = useState<AmbulanceService[]>(
    []
  );
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedService, setSelectedService] =
    useState<AmbulanceService | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [nearestId, setNearestId] = useState<string | null>(null);

  const navigate = useNavigate();

  // Get user location
  useEffect(() => {
    getCurrentLocation()
      .then(([lat, lon]) => setUserLocation({ latitude: lat, longitude: lon }))
      .catch((err) => console.error(err));
  }, []);

  // Filter and sort services
  useEffect(() => {
    const filtered = ambulanceServices.filter(
      (service) =>
        service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.vehicleType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedFiltered = filtered.sort((a, b) => {
      if (!userLocation) return 0;
      const distanceA = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        Number(a.latitude),
        Number(a.longitude)
      );
      const distanceB = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        Number(b.latitude),
        Number(b.longitude)
      );
      return sortOrder === "asc"
        ? distanceA - distanceB
        : distanceB - distanceA;
    });

    setFilteredServices(sortedFiltered);

    // Highlight nearest ambulance
    if (userLocation && sortedFiltered.length > 0) {
      const nearest = sortedFiltered.reduce((prev, curr) => {
        const prevDist = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          Number(prev.latitude),
          Number(prev.longitude)
        );
        const currDist = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          Number(curr.latitude),
          Number(curr.longitude)
        );
        return currDist < prevDist ? curr : prev;
      });
      setNearestId(nearest._id);
    }
  }, [ambulanceServices, searchTerm, userLocation, sortOrder]);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="min-h-screen bg-green-50 p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        <Header onBackClick={() => navigate("/")} title="Ambulance Services" />

        {/* Search */}
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="Search ambulance services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
        </div>

        {/* Sort Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleSortOrder}
            className={`flex items-center px-4 py-2 rounded-xl transition-shadow shadow-md ${
              sortOrder === "asc"
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            Sort by Distance
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        </div>
        {/* Ambulance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredServices.map((service) => {
            const distance = userLocation
              ? calculateDistance(
                  userLocation.latitude,
                  userLocation.longitude,
                  Number(service.latitude),
                  Number(service.longitude)
                )
              : null;

            const isNearest = nearestId === service._id;

            return (
              <div
                key={service._id}
                className={`bg-white rounded-2xl shadow-md p-5 cursor-pointer hover:shadow-xl flex flex-col items-center text-center gap-3 transition-transform transform hover:-translate-y-1 ${
                  isNearest
                    ? "border-2 border-emerald-500 bg-emerald-50"
                    : "border border-green-100"
                }`}
                onClick={() => setSelectedService(service)}
              >
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xl font-bold">
                  <Ambulance className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-green-800 truncate">
                  {service.serviceName}
                </h3>
                <p className="text-sm text-green-600 truncate">
                  {service.vehicleType}
                </p>
                {distance !== null && (
                  <p className="text-sm text-green-700">
                    {distance.toFixed(2)} km away
                  </p>
                )}

                {/* Call Now Button */}
                <a
                  href={`tel:${service.phone}`}
                  className="mt-auto px-4 py-2 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700 w-full inline-flex justify-center items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Phone className="h-4 w-4 mr-2" /> Call Now
                </a>
              </div>
            );
          })}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center text-green-700 mt-6">
            No ambulance services found.
          </div>
        )}

        {/* Modal for Selected Service */}
        {selectedService && (
          <div className="fixed inset-0 z-50 flex justify-center items-end bg-black bg-opacity-50 p-4">
            <div className="bg-white w-full max-w-md rounded-t-2xl shadow-lg p-6 max-h-[85vh] overflow-y-auto animate-slideUp relative">
              <button
                className="absolute top-4 right-4 text-green-600"
                onClick={() => setSelectedService(null)}
              >
                <X size={24} />
              </button>

              <h2 className="text-xl font-semibold text-green-800 mb-3 truncate">
                {selectedService.serviceName}
              </h2>

              <p className="text-green-600 text-sm mb-1 flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {selectedService.address}
              </p>
              <p className="text-green-600 text-sm mb-1">
                Vehicle: {selectedService.vehicleType}
              </p>
              <p className="text-green-600 text-sm mb-1">
                Email: {selectedService.email}
              </p>
              <p className="text-green-600 text-sm mb-3">
                Phone: {selectedService.phone}
              </p>
              {userLocation && (
                <p className="text-green-700 text-sm mb-3 flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> Distance:{" "}
                  {calculateDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    Number(selectedService.latitude),
                    Number(selectedService.longitude)
                  ).toFixed(2)}{" "}
                  km
                </p>
              )}
              <a
                href={`tel:${selectedService.phone}`}
                className="block w-full py-3 bg-green-600 text-white text-center rounded-xl hover:bg-green-700"
              >
                Call Now
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AmbulanceServicesPage;
