
import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Phone, Search, MapPin, ChevronDown } from "lucide-react";
import { RootState } from "../Redux/Store";
import { setBloods } from "../Redux/BloodData";
import { apiClient } from "../Components/Axios";
import Navbar from "../Components/Navbar";
import { Header } from "../Components/Common";
import { useNavigate } from "react-router-dom";

export interface IBloodDonor {
  id: string;
  userId: {
    id: string;
    name: string;
    email: string;
    password: string;
    phone: string;
  };
  phone: string;
  dateOfBirth: string;
  bloodGroup: "O+" | "O-" | "AB+" | "AB-" | "A+" | "A-" | "B+" | "B-";
  address: { 
    place: string; 
    pincode: number; 
    state: string; 
    country: string; 
    district: string;
  };
  lastDonationDate?: string | null;
  profileImage?: string;
}

const bloodGroups: (IBloodDonor["bloodGroup"] | "All")[] = [
  "All", "O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-",
];

// Location hierarchy type
interface LocationHierarchy {
  country: string;
  states: {
    state: string;
    districts: {
      district: string;
      places: string[];
    }[];
  }[];
}

const calculateAge = (dob: string) => {
  const b = new Date(dob);
  const t = new Date();
  let age = t.getFullYear() - b.getFullYear();
  const m = t.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < b.getDate())) age--;
  return age;
};

const getInitial = (name: string) => (name?.trim()?.charAt(0) || "?").toUpperCase();

// Location Modal Component
const LocationModal = ({
  visible,
  onClose,
  title,
  data,
  onSelect,
  selectedValue,
  onBack,
  canGoBack,
}: any) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center">
            {canGoBack && (
              <button
                onClick={onBack}
                className="mr-2 text-emerald-600 hover:text-emerald-800"
              >
                <svg className="w-5 h-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
            <h3 className="text-lg font-semibold text-emerald-800">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-600 hover:text-emerald-800 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        
        <div className="max-h-64 overflow-y-auto">
          {data.map((item: string) => (
            <button
              key={item}
              className={`w-full text-left p-3 hover:bg-emerald-50 transition-colors border-b border-gray-100 ${
                selectedValue === item ? "bg-emerald-50 border-r-4 border-emerald-600" : ""
              }`}
              onClick={() => onSelect(item)}
            >
              <div className="flex justify-between items-center">
                <span className="text-emerald-800">
                  {item}
                </span>
                {item !== "All" && (
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const FindBloodPage: React.FC = () => {
  const dispatch = useDispatch();
  const donors = useSelector((state: RootState) => state.bloodData) as IBloodDonor[];
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<IBloodDonor["bloodGroup"] | "All">("All");
  const [selectedLocation, setSelectedLocation] = useState({
    country: "All",
    state: "All",
    district: "All",
    place: "All"
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [donor, setDonor] = useState<any>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [currentModalLevel, setCurrentModalLevel] = useState<'country' | 'state' | 'district' | 'place'>('country');
  const [locationHierarchy, setLocationHierarchy] = useState<LocationHierarchy[]>([]);

  const donorsWithId: IBloodDonor[] = (donors ?? []).map((d, index) => ({
    ...d,
    id: d.id || String(index),
  }));

  useEffect(() => {
    const _id = localStorage.getItem("userId");

    const fetchAll = async () => {
      if (donors?.length) {
        setLoading(false);
      } else {
        setLoading(true);
        try {
          const [userRes, donorsRes] = await Promise.all([
            _id
              ? apiClient.get(`/api/users/${_id}`)
              : Promise.resolve({ data: { data: null } }),
            apiClient.get("/api/donors", { withCredentials: true }),
          ]);

          setUser(userRes.data?.data ?? null);

          const donorsList = donorsRes?.data?.donors ?? donorsRes?.data ?? [];
          dispatch(setBloods(donorsList));

          if (userRes.data?.data?._id) {
            try {
              const donorRes = await apiClient.get(
                `/api/donors/users/${userRes.data.data._id}`
              );
              setDonor(donorRes.data);
            } catch (err) {
              // ignore error
            }
          }
        } catch (err) {
          console.error("Failed to fetch data", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAll();
  }, [dispatch, donors]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        var _id = localStorage.getItem("userId");
        if (!_id) return;

        const result = await apiClient.get(`/api/users/${_id}`);
        setUser(result.data.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user?._id) return;

    const fetchDonor = async () => {
      try {
        const result = await apiClient.get(`/api/donors/users/${user._id}`);
        setDonor(result.data);
      } catch (err) {
        // console.error("Failed to fetch donor", err);
      }
    };
    fetchDonor();
  }, [user?._id]);

  // Build location hierarchy from donor data
  useEffect(() => {
    if (donors.length > 0) {
      const hierarchy: { [key: string]: any } = {};

      donors.forEach(donor => {
        const { country, state, district, place } = donor.address;
        
        if (!hierarchy[country]) {
          hierarchy[country] = {};
        }
        if (!hierarchy[country][state]) {
          hierarchy[country][state] = {};
        }
        if (!hierarchy[country][state][district]) {
          hierarchy[country][state][district] = new Set();
        }
        hierarchy[country][state][district].add(place);
      });

      // Convert to LocationHierarchy format
      const formattedHierarchy: LocationHierarchy[] = Object.entries(hierarchy).map(([country, states]) => ({
        country,
        states: Object.entries(states).map(([state, districts]) => ({
          state,
          districts: Object.entries(districts as any).map(([district, places]) => ({
            district,
            places: Array.from(places as Set<string>)
          }))
        }))
      }));

      setLocationHierarchy(formattedHierarchy);
    }
  }, [donors]);

  const handleDonate = () => {
    user?._id ? navigate("/services/blood-donation") : navigate("/login");
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const filteredDonors = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return donorsWithId.filter((d) => {
      const matchesSearch =
        q.length === 0 ||
        d.userId?.name?.toLowerCase()?.includes(q) ||
        d.phone?.includes(q) ||
        d.address?.country?.toLowerCase()?.includes(q) ||
        d.address?.state?.toLowerCase()?.includes(q) ||
        d.address?.district?.toLowerCase()?.includes(q) ||
        d.address?.place?.toLowerCase()?.includes(q);

      const matchesGroup = selectedGroup === "All" || d.bloodGroup === selectedGroup;

      const matchesLocation =
        (selectedLocation.country === "All" || d.address.country === selectedLocation.country) &&
        (selectedLocation.state === "All" || d.address.state === selectedLocation.state) &&
        (selectedLocation.district === "All" || d.address.district === selectedLocation.district) &&
        (selectedLocation.place === "All" || d.address.place === selectedLocation.place);

      return matchesSearch && matchesGroup && matchesLocation;
    });
  }, [searchTerm, selectedGroup, selectedLocation, donorsWithId]);

  // Location filtering functions
  const getLocationButtonText = () => {
    const { country, state, district, place } = selectedLocation;
    
    if (place !== "All") return place;
    if (district !== "All") return district;
    if (state !== "All") return state;
    if (country !== "All") return country;
    return "All Locations";
  };

  const handleLocationSelect = (level: 'country' | 'state' | 'district' | 'place', value: string) => {
    const newLocation = { ...selectedLocation };
    
    if (level === 'country') {
      newLocation.country = value;
      newLocation.state = "All";
      newLocation.district = "All";
      newLocation.place = "All";
      if (value === "All") {
        setSelectedLocation(newLocation);
        setShowLocationModal(false);
        return;
      }
      setCurrentModalLevel('state');
    } else if (level === 'state') {
      newLocation.state = value;
      newLocation.district = "All";
      newLocation.place = "All";
      if (value === "All") {
        setSelectedLocation(newLocation);
        setShowLocationModal(false);
        return;
      }
      setCurrentModalLevel('district');
    } else if (level === 'district') {
      newLocation.district = value;
      newLocation.place = "All";
      if (value === "All") {
        setSelectedLocation(newLocation);
        setShowLocationModal(false);
        return;
      }
      setCurrentModalLevel('place');
    } else if (level === 'place') {
      newLocation.place = value;
      setSelectedLocation(newLocation);
      setShowLocationModal(false);
      return;
    }
    
    setSelectedLocation(newLocation);
  };

  const resetLocationFilter = () => {
    setSelectedLocation({
      country: "All",
      state: "All",
      district: "All",
      place: "All"
    });
  };

  const getCurrentLevelData = () => {
    const { country, state, district } = selectedLocation;
    
    if (currentModalLevel === 'country') {
      const countries = ["All", ...locationHierarchy.map(loc => loc.country)];
      return countries;
    } else if (currentModalLevel === 'state' && country !== "All") {
      const countryData = locationHierarchy.find(loc => loc.country === country);
      const states = countryData ? ["All", ...countryData.states.map(s => s.state)] : ["All"];
      return states;
    } else if (currentModalLevel === 'district' && state !== "All") {
      const countryData = locationHierarchy.find(loc => loc.country === country);
      const stateData = countryData?.states.find(s => s.state === state);
      const districts = stateData ? ["All", ...stateData.districts.map(d => d.district)] : ["All"];
      return districts;
    } else if (currentModalLevel === 'place' && district !== "All") {
      const countryData = locationHierarchy.find(loc => loc.country === country);
      const stateData = countryData?.states.find(s => s.state === state);
      const districtData = stateData?.districts.find(d => d.district === district);
      const places = districtData ? ["All", ...districtData.places] : ["All"];
      return places;
    }
    
    return ["All"];
  };

  const getModalTitle = () => {
    const { country, state, district } = selectedLocation;
    const titles = {
      country: "Select Country",
      state: country !== "All" ? `Select State (${country})` : "Select State",
      district: state !== "All" ? `Select District (${state})` : "Select District",
      place: district !== "All" ? `Select Place (${district})` : "Select Place"
    };
    return titles[currentModalLevel];
  };

  const canGoBack = currentModalLevel !== 'country';

  const goBack = () => {
    if (currentModalLevel === 'state') setCurrentModalLevel('country');
    else if (currentModalLevel === 'district') setCurrentModalLevel('state');
    else if (currentModalLevel === 'place') setCurrentModalLevel('district');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col">
      <Navbar />
      <Header onBackClick={() => navigate("/")} title="Blood Services" />

      {/* Search Bar */}
      <div className="flex items-center bg-white rounded-full mx-4 mt-4 px-4 py-2 mb-3">
        <Search className="text-emerald-600 mr-2" />
        <input
          type="text"
          className="flex-1 outline-none bg-transparent placeholder-emerald-400"
          placeholder="Search donors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {!donor?._id && (
          <button
            onClick={handleDonate}
            className="bg-emerald-600 text-white px-4 py-1 rounded-full text-sm font-semibold hover:bg-emerald-700"
          >
            Donate
          </button>
        )}
      </div>

      {/* Location Filter */}
      <div className="flex items-center mx-4 mb-3">
        <button
          onClick={() => {
            setShowLocationModal(true);
            setCurrentModalLevel('country');
          }}
          className="flex items-center bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-emerald-700 flex-1 mr-2"
        >
          <MapPin size={16} className="mr-1" />
          <span className="flex-1 text-center">{getLocationButtonText()}</span>
          <ChevronDown size={14} className="ml-1" />
        </button>
        
        {(selectedLocation.country !== "All" || selectedLocation.state !== "All" || 
          selectedLocation.district !== "All" || selectedLocation.place !== "All") && (
          <button
            onClick={resetLocationFilter}
            className="bg-red-500 text-white px-3 py-2 rounded-full text-sm font-semibold hover:bg-red-600"
          >
            Reset
          </button>
        )}
      </div>

      {/* Blood group chips */}
      <div className="flex overflow-x-auto gap-3 px-4 py-3 mb-3 hide-scrollbar">
        {bloodGroups.map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGroup(g)}
            className={`flex-shrink-0 w-14 h-14 rounded-full border font-bold text-sm
            ${selectedGroup === g
              ? "bg-emerald-700 text-white border-emerald-700"
              : "bg-emerald-100 text-emerald-700 border-emerald-500"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Donor list */}
      <div className="flex-1 px-4 pb-6 space-y-4">
        {filteredDonors.length === 0 && (
          <p className="text-center text-gray-600 mt-6">No donors found.</p>
        )}

        {filteredDonors.map((item) => (
          <div key={item.id} className="bg-white rounded-xl p-4 shadow flex items-center">
            {item.profileImage ? (
              <img
                src={item.profileImage}
                alt="avatar"
                className="w-16 h-16 rounded-full mr-4 object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-emerald-300 flex items-center justify-center text-white text-xl font-bold mr-4">
                {getInitial(item?.userId?.name)}
              </div>
            )}

            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h3 className="text-emerald-700 font-bold text-lg">
                  {item.userId?.name} ({calculateAge(item.dateOfBirth)} yrs)
                </h3>
                <span className="bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm">
                  {item.bloodGroup}
                </span>
              </div>

              <p className="text-gray-600 text-sm mt-1">
                <MapPin size={12} className="inline mr-1" />
                {item.address.place}, {item.address.district}, {item.address.state}, {item.address.country}
              </p>

              <button
                onClick={() => handleCall(item.phone)}
                className="mt-2 inline-flex items-center bg-emerald-600 text-white px-3 py-1 rounded-full text-sm hover:bg-emerald-700"
              >
                <Phone size={16} className="mr-1" />
                Call Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Location Selection Modal */}
      <LocationModal
        visible={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        title={getModalTitle()}
        data={getCurrentLevelData()}
        onSelect={(value: string) => handleLocationSelect(currentModalLevel, value)}
        onBack={goBack}
        canGoBack={canGoBack}
        selectedValue={selectedLocation[currentModalLevel]}
      />

      {/* CSS to hide scrollbar */}
      <style>
        {`
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </div>
  );
};

export default FindBloodPage;
