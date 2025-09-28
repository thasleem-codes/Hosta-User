import { useEffect, useState, useMemo } from "react";
import { apiClient } from "../Components/Axios";
import { useDispatch, useSelector } from "react-redux";
import {
  Hospital,
  setHospitalData,
  WorkingHours,
} from "../Redux/HospitalsData";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Clock, Star, Phone } from "lucide-react";
import Navbar from "../Components/Navbar";
import { RootState } from "../Redux/Store";
import { FormInput, Header } from "../Components/Common";
import LoadingSpinner from "../Components/LoadingSpinner";
import { getCurrentLocation } from "../Components/getCurrentLocation";
import { updateUserData } from "../Redux/userData";

const HospitalsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const hospitalType = queryParams.get("type") || "";

  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpenNow, setFilterOpenNow] = useState(false);
  const [sortByDistance, setSortByDistance] = useState(false);
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { hospitals = [] } = useSelector(
    (state: RootState) => state.hospitalData
  );
  const { latitude, longitude } = useSelector(
    (state: RootState) => state.userLogin
  );

  const userData = useSelector((state: RootState) => state.userLogin);

  // Fetch hospitals if not in Redux
  useEffect(() => {
    const fetchHospitals = async () => {
      if (hospitals.length === 0) {
        setLoading(true);
        try {
          const result = await apiClient.get("/api/hospitals");
          dispatch(setHospitalData({ data: result.data.data }));
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchHospitals();
  }, [dispatch, hospitals]);

  // Fetch location if sort by distance is enabled and no location
  useEffect(() => {
    if (sortByDistance && (!latitude || !longitude)) {
      setLocationLoading(true);
      getCurrentLocation()
        .then(([lat, lon]) =>
          dispatch(
            updateUserData({ ...userData, latitude: lat, longitude: lon })
          )
        )
        .catch((err) => console.error("Failed to get location", err))
        .finally(() => setLocationLoading(false));
    }
  }, [sortByDistance, latitude, longitude, dispatch]);

  // Calculate distance in km
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371;
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

  // Check if hospital is open now
  const isOpenNow = (workingHours: WorkingHours[]) => {
    const now = new Date();
    const currentDay = now.toLocaleString("en-US", { weekday: "long" });
    const currentTime = now.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });

    const todayHours = workingHours.find((wh: any) => wh.day === currentDay);
    if (
      !todayHours ||
      todayHours.is_holiday ||
      !todayHours.opening_time ||
      !todayHours.closing_time
    )
      return false;

    return (
      currentTime >= todayHours.opening_time &&
      currentTime <= todayHours.closing_time
    );
  };

  // Filter hospitals
  const filteredHospitals = useMemo(() => {
    return hospitals.filter(
      (hospital: Hospital) =>
        hospital.type?.toLowerCase() === hospitalType.toLowerCase() &&
        (hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hospital.address.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!filterOpenNow || isOpenNow(hospital.working_hours))
    );
  }, [hospitals, hospitalType, searchTerm, filterOpenNow]);

  // Precompute distances
  const hospitalsWithDistance = useMemo(() => {
    if (sortByDistance && latitude && longitude) {
      return filteredHospitals.map((h) => ({
        ...h,
        distance: calculateDistance(
          latitude,
          longitude,
          h.latitude!,
          h.longitude!
        ),
      }));
    }
    return filteredHospitals.map((h) => ({ ...h, distance: 0 }));
  }, [filteredHospitals, sortByDistance, latitude, longitude]);

  // Sort hospitals
  const sortedHospitals = useMemo(() => {
    if (sortByDistance && latitude && longitude) {
      return [...hospitalsWithDistance].sort(
        (a, b) => (a.distance! || 0) - (b.distance! || 0)
      );
    }
    return [...hospitalsWithDistance].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [hospitalsWithDistance, sortByDistance, latitude, longitude]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <Header
          onBackClick={() => navigate("/services/hospitals/types")}
          title="Hospitals"
        />

        {/* Filters */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2">
          <div className="relative flex-grow">
            <FormInput
              type="text"
              placeholder="Search hospitals..."
              className="w-full pl-10"
              value={searchTerm}
              OnChange={(e: any) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-green-400" />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="openNow"
              className="mr-2"
              checked={filterOpenNow}
              onChange={(e) => setFilterOpenNow(e.target.checked)}
            />
            <label htmlFor="openNow" className="text-green-700 font-medium">
              Open Now
            </label>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sortDistance"
                className="mr-2"
                checked={sortByDistance}
                onChange={(e) => setSortByDistance(e.target.checked)}
                disabled={locationLoading || !latitude || !longitude}
              />
              <label
                htmlFor="sortDistance"
                className="text-green-700 font-medium"
              >
                Sort by Nearest
              </label>
            </div>

            {(locationLoading || !latitude || !longitude) && (
              <div className="flex items-center mt-2 p-2 bg-red-100 text-red-700 text-sm rounded-lg shadow-sm animate-pulse max-w-full sm:max-w-xs">
                <svg
                  className="w-4 h-4 mr-2 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Getting your current location...
              </div>
            )}
          </div>
        </div>

        {/* Hospital Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedHospitals.map((hospital: Hospital & { distance?: number }) => (
            <div
              key={hospital._id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg cursor-pointer transition"
              onClick={() => navigate(`/services/hospitals/${hospital._id}`)}
            >
              <img
                src={
                  hospital.image?.imageUrl ||
                  "/placeholder.svg?height=200&width=300"
                }
                alt={hospital.name}
                className="w-full h-36 sm:h-40 object-cover rounded-md mb-3"
              />
              <h2 className="text-lg sm:text-xl font-semibold text-green-800 mb-1">
                {hospital.name}
              </h2>

              <div className="flex items-center text-green-600 mb-1">
                <Star className="h-4 w-4 mr-1" />
                <span>
                  {hospital.reviews?.length
                    ? (
                        hospital.reviews.reduce((sum, r) => sum + r.rating, 0) /
                        hospital.reviews.length
                      ).toFixed(1)
                    : "0"}
                  /5
                </span>
              </div>

              <div className="flex items-center text-green-600 mb-1">
                <Clock className="h-4 w-4 mr-1" />
                <span>
                  {isOpenNow(hospital.working_hours) ? (
                    <em>Open now</em>
                  ) : (
                    "Closed"
                  )}
                </span>
              </div>

              <div className="flex items-center text-green-600 mb-1">
                <Phone className="h-4 w-4 mr-1" />
                <span>
                  <em>{hospital.phone}</em>
                </span>
              </div>

              {sortByDistance && hospital.distance !== undefined && (
                <div className="text-sm text-green-700 mt-1">
                  {hospital.distance.toFixed(2)} km away
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HospitalsPage;
