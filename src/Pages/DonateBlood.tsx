

import { useEffect, useState } from "react";
import { Phone, Calendar, MapPin, Droplet, Hash, Search, X } from "lucide-react";
import { apiClient } from "../Components/Axios";
import { errorToast, successToast } from "../Components/Toastify";
import {  useDispatch } from "react-redux";
import { addBlood } from "../Redux/BloodData";
import { useNavigate } from "react-router-dom";
import countriesData from "world-countries";
import StatesCities from "../dummy/countries+states+cities.json";

// Type definitions
type City = {
  id: number;
  name: string;
  state_code?: string;
};

type State = {
  id: number;
  name: string;
  state_code: string;
  cities: City[];
};

type CountryData = {
  id: number;
  name: string;
  iso3: string;
  states: State[];
};

type BloodGroup = "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-" | "";
interface FormData {
  phone: string;
  dateOfBirth: string;
  bloodGroup: BloodGroup;
  place: string;
  pincode: string;
  lastDonationDate: string;
  country: string;
  state: string;
  district: string;
}

const BLOOD_GROUPS: Exclude<BloodGroup, "">[] = [
  "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-",
];

// Searchable Dropdown Component
const SearchableDropdown = ({
  visible,
  onClose,
  title,
  data,
  onSelect,
  selectedValue,
  searchPlaceholder = "Search...",
}: any) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    if (searchQuery) {
      const filtered = data.filter((item: any) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchQuery, data]);

  const handleSelect = (item: any) => {
    onSelect(item.id);
    onClose();
    setSearchQuery("");
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-emerald-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-emerald-600 hover:text-emerald-800"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="flex items-center p-4 border-b">
          <Search size={18} className="text-emerald-600 mr-2" />
          <input
            type="text"
            className="flex-1 bg-transparent outline-none text-emerald-800"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>

        <div className="max-h-64 overflow-y-auto">
          {filteredData.map((item: any) => (
            <button
              key={item.id}
              className={`w-full text-left p-3 hover:bg-emerald-50 transition-colors ${
                selectedValue === item.id ? "bg-emerald-50 border-r-4 border-emerald-600" : ""
              }`}
              onClick={() => handleSelect(item)}
            >
              <span className="text-emerald-800">
                {item.flag ? `${item.flag} ${item.name}` : item.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const DonateBloodPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState<FormData>({
    phone: "",
    dateOfBirth: "",
    bloodGroup: "",
    place: "",
    pincode: "",
    lastDonationDate: "",
    country: "",
    state: "",
    district: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Modal states
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);
  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [showBloodGroupModal, setShowBloodGroupModal] = useState(false);

  // Country, State, District data
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);

  // Type assertion for StatesCities
  const countriesStatesCities = StatesCities as CountryData[];

  // Blood groups formatted for dropdown
  const bloodGroupOptions = BLOOD_GROUPS.map(bg => ({
    id: bg,
    name: bg
  }));

  useEffect(() => {
    // Initialize countries from world-countries package
    const formattedCountries = countriesData.map((country : any) => ({
      id: country.cca3,
      name: country.name.common,
      flag: country.flag
    }));
    setCountries(formattedCountries);

    const fetchUser = async () => {
      try {
        const _id = localStorage.getItem("userId");
        if (!_id) return;

        const result = await apiClient.get(`/api/users/${_id}`);
        const fetchedUser = result.data.data;
        setUser(fetchedUser);

        setFormData((prev) => ({
          ...prev,
          phone: fetchedUser.phone || "",
        }));
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchUser();
  }, []);

  // Update states when country changes
  useEffect(() => {
    if (formData.country) {
      const selectedCountry = countriesStatesCities.find((country: CountryData) => 
        country.iso3 === formData.country || country.name === formData.country
      );
      
      if (selectedCountry && Array.isArray(selectedCountry.states)) {
        const stateOptions = selectedCountry.states.map((state: State) => ({
          id: state.state_code,
          name: state.name
        }));
        setStates(stateOptions);
      } else {
        setStates([]);
      }
      
      setFormData(prev => ({ ...prev, state: "", district: "" }));
      setDistricts([]);
    }
  }, [formData.country]);

  // Update districts when state changes
  useEffect(() => {
    if (formData.state && formData.country) {
      const selectedCountry = countriesStatesCities.find((country: CountryData) => 
        country.iso3 === formData.country || country.name === formData.country
      );
      
      if (selectedCountry) {
        const selectedState = selectedCountry.states.find((state: State) => 
          state.state_code === formData.state || state.name === formData.state
        );
        
        if (selectedState && Array.isArray(selectedState.cities)) {
          const districtOptions = selectedState.cities.map((city: City) => ({
            id: city.id.toString(),
            name: city.name
          }));
          setDistricts(districtOptions);
        } else {
          setDistricts([]);
        }
      }
      
      setFormData(prev => ({ ...prev, district: "" }));
    }
  }, [formData.state, formData.country]);

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Helper function to get display name for selected values
  const getDisplayName = (data: any, value: any, defaultValue: string) => {
    if (!value) return defaultValue;
    const item = data.find((item: any) => item.id === value);
    return item ? (item.flag ? `${item.flag} ${item.name}` : item.name) : defaultValue;
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.phone) e.phone = "Phone is required";
    else if (!/^\d{10}$/.test(formData.phone))
      e.phone = "Phone must be exactly 10 digits";
    if (!formData.dateOfBirth) e.dateOfBirth = "Date of birth is required";
    if (!formData.bloodGroup) e.bloodGroup = "Blood group is required";
    if (!formData.place) e.place = "Place is required";
    if (!formData.country) e.country = "Country is required";
    if (!formData.pincode) e.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(formData.pincode))
      e.pincode = "Pincode must be exactly 6 digits";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      // Get country name from selected country ID
      const selectedCountry = countries.find(country => country.id === formData.country);
      const countryName = selectedCountry ? selectedCountry.name : formData.country;
      
      // Get state name from selected state ID
      const selectedState = states.find(state => state.id === formData.state);
      const stateName = selectedState ? selectedState.name : formData.state;
      
      // Get district name from selected district ID
      const selectedDistrict = districts.find(district => district.id === formData.district);
      const districtName = selectedDistrict ? selectedDistrict.name : formData.district;

      const payload = {
        phone: formData.phone.startsWith("0")
          ? formData.phone.slice(1)
          : formData.phone,
        dateOfBirth: formData.dateOfBirth,
        bloodGroup: formData.bloodGroup,
        address: { 
          place: formData.place, 
          pincode: Number(formData.pincode),
          country: countryName,
          state: stateName,
          district: districtName
        },
        userId: user?._id,
      };
      const res = await apiClient.post(
        "/api/donors",
        { newDonor: payload },
        { withCredentials: true }
      );
      dispatch(addBlood(res.data.donor));
      successToast("Donor created successfully!");
      navigate(-1);
    } catch (err: any) {
      errorToast(err?.response?.data?.message || "Failed to create donor");
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-emerald-800 mb-6 text-center">
          Register Blood Donor
        </h1>

        {/* Phone */}
        <div className="mb-4">
          <label className="flex items-center border border-emerald-300 rounded bg-emerald-50 px-3 py-2">
            <Phone size={18} className="text-emerald-600 mr-2" />
            <input
              className="flex-1 bg-transparent outline-none text-emerald-800"
              type="text"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              readOnly
            />
          </label>
          {errors.phone && (
            <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div className="mb-4">
          <label className="flex items-center border border-emerald-300 rounded bg-emerald-50 px-3 py-2">
            <Calendar size={18} className="text-emerald-600 mr-2" />
            <input
              className="flex-1 bg-transparent outline-none text-emerald-800"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleChange("dateOfBirth", e.target.value)}
            />
          </label>
          {errors.dateOfBirth && (
            <p className="text-red-600 text-sm mt-1">{errors.dateOfBirth}</p>
          )}
        </div>

        {/* Blood Group - Searchable */}
        <div className="mb-4">
          <button
            className="flex items-center border border-emerald-300 rounded bg-emerald-50 px-3 py-2 w-full"
            onClick={() => setShowBloodGroupModal(true)}
          >
            <Droplet size={18} className="text-emerald-600 mr-2" />
            <span className={`flex-1 text-left ${!formData.bloodGroup ? 'text-emerald-400' : 'text-emerald-800'}`}>
              {formData.bloodGroup || "Select Blood Group"}
            </span>
          </button>
          {errors.bloodGroup && (
            <p className="text-red-600 text-sm mt-1">{errors.bloodGroup}</p>
          )}
        </div>

        {/* Country Selection - Searchable */}
        <div className="mb-4">
          <button
            className="flex items-center border border-emerald-300 rounded bg-emerald-50 px-3 py-2 w-full"
            onClick={() => setShowCountryModal(true)}
          >
            <MapPin size={18} className="text-emerald-600 mr-2" />
            <span className={`flex-1 text-left ${!formData.country ? 'text-emerald-400' : 'text-emerald-800'}`}>
              {getDisplayName(countries, formData.country, "Select Country")}
            </span>
          </button>
          {errors.country && (
            <p className="text-red-600 text-sm mt-1">{errors.country}</p>
          )}
        </div>

        {/* State Selection - Searchable */}
        {formData.country && states.length > 0 && (
          <div className="mb-4">
            <button
              className="flex items-center border border-emerald-300 rounded bg-emerald-50 px-3 py-2 w-full"
              onClick={() => setShowStateModal(true)}
            >
              <MapPin size={18} className="text-emerald-600 mr-2" />
              <span className={`flex-1 text-left ${!formData.state ? 'text-emerald-400' : 'text-emerald-800'}`}>
                {getDisplayName(states, formData.state, "Select State")}
              </span>
            </button>
            {errors.state && (
              <p className="text-red-600 text-sm mt-1">{errors.state}</p>
            )}
          </div>
        )}

        {/* District Selection - Searchable */}
        {formData.state && districts.length > 0 && (
          <div className="mb-4">
            <button
              className="flex items-center border border-emerald-300 rounded bg-emerald-50 px-3 py-2 w-full"
              onClick={() => setShowDistrictModal(true)}
            >
              <MapPin size={18} className="text-emerald-600 mr-2" />
              <span className={`flex-1 text-left ${!formData.district ? 'text-emerald-400' : 'text-emerald-800'}`}>
                {getDisplayName(districts, formData.district, "Select District")}
              </span>
            </button>
            {errors.district && (
              <p className="text-red-600 text-sm mt-1">{errors.district}</p>
            )}
          </div>
        )}

        {/* Place */}
        <div className="mb-4">
          <label className="flex items-center border border-emerald-300 rounded bg-emerald-50 px-3 py-2">
            <MapPin size={18} className="text-emerald-600 mr-2" />
            <input
              className="flex-1 bg-transparent outline-none text-emerald-800"
              placeholder="Place (Area/Locality)"
              value={formData.place}
              onChange={(e) => handleChange("place", e.target.value)}
            />
          </label>
          {errors.place && (
            <p className="text-red-600 text-sm mt-1">{errors.place}</p>
          )}
        </div>

        {/* Pincode */}
        <div className="mb-4">
          <label className="flex items-center border border-emerald-300 rounded bg-emerald-50 px-3 py-2">
            <Hash size={18} className="text-emerald-600 mr-2" />
            <input
              className="flex-1 bg-transparent outline-none text-emerald-800"
              placeholder="Pincode"
              type="number"
              value={formData.pincode}
              onChange={(e) => handleChange("pincode", e.target.value)}
              maxLength={6}
            />
          </label>
          {errors.pincode && (
            <p className="text-red-600 text-sm mt-1">{errors.pincode}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6 space-x-4">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded font-semibold"
          >
            Create
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Searchable Modals */}
      <SearchableDropdown
        visible={showBloodGroupModal}
        onClose={() => setShowBloodGroupModal(false)}
        title="Select Blood Group"
        data={bloodGroupOptions}
        onSelect={(value: any) => handleChange("bloodGroup", value)}
        selectedValue={formData.bloodGroup}
        searchPlaceholder="Search blood group..."
      />

      <SearchableDropdown
        visible={showCountryModal}
        onClose={() => setShowCountryModal(false)}
        title="Select Country"
        data={countries}
        onSelect={(value: any) => handleChange("country", value)}
        selectedValue={formData.country}
        searchPlaceholder="Search country..."
      />

      <SearchableDropdown
        visible={showStateModal}
        onClose={() => setShowStateModal(false)}
        title="Select State"
        data={states}
        onSelect={(value: any) => handleChange("state", value)}
        selectedValue={formData.state}
        searchPlaceholder="Search state..."
      />

      <SearchableDropdown
        visible={showDistrictModal}
        onClose={() => setShowDistrictModal(false)}
        title="Select District"
        data={districts}
        onSelect={(value: any) => handleChange("district", value)}
        selectedValue={formData.district}
        searchPlaceholder="Search district..."
      />
    </div>
  );
};

export default DonateBloodPage;
