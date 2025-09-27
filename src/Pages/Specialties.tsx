import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Redux/Store";
import { setHospitalData } from "../Redux/HospitalsData";
import {apiClient} from "../Components/Axios";
import { useNavigate } from "react-router-dom";
import { Header } from "../Components/Common";
import { Search, Star, MapPin, X } from "lucide-react";
import LoadingSpinner from "../Components/LoadingSpinner";

// Tiny SVG illustrations for each specialty
const specialtyIllustrations: { [key: string]: JSX.Element } = {
  Cardiology: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="#EF4444">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 
        3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3
        19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  ),
  Neurology: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="#8B5CF6">
      <circle cx="12" cy="12" r="10" />
      <path fill="#fff" d="M12 6v6l4 2" />
    </svg>
  ),
  Orthopedics: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="#F59E0B">
      <path d="M12 2L15 8l6 1-4.5 4 1.5 6-5-3-5 3 1.5-6-4.5-4 6-1z" />
    </svg>
  ),
  Ophthalmology: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="#3B82F6">
      <circle cx="12" cy="12" r="3" />
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" fill="none" stroke="#3B82F6" strokeWidth="2"/>
    </svg>
  ),
  General: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="#10B981">
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
    </svg>
  ),
  Default: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="#047857">
      <path d="M12 0L15 8h9l-7 6 3 10-8-6-8 6 3-10-7-6h9z" />
    </svg>
  ),
};

interface HospitalDetails {
  id: string;
  name: string;
  rating: number;
  doctorCount: number;
  location: string;
}

interface SpecialtyWithHospitals {
  id?: string;
  name: string;
  description: string;
  hospitals: HospitalDetails[];
}

const calculateAverageRating = (reviews: any[]): number => {
  if (!reviews || reviews.length === 0) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
};

const getAllSpecialtiesWithHospitals = (hospitals: any[]): SpecialtyWithHospitals[] => {
  const map: { [key: string]: SpecialtyWithHospitals } = {};
  hospitals.forEach((hospital) => {
    hospital.specialties.forEach((spec: any) => {
      if (!map[spec.name]) {
        map[spec.name] = {
          id: spec._id,
          name: spec.name,
          description: spec.description || "No description provided.",
          hospitals: [],
        };
      }
      map[spec.name].hospitals.push({
        id: hospital._id ?? "",
        name: hospital.name,
        rating: calculateAverageRating(hospital.reviews),
        doctorCount: spec.doctors.length,
        location: hospital.address,
      });
    });
  });
  return Object.values(map);
};

const SpecialtiesPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { hospitals = [] } = useSelector((state: RootState) => state.hospitalData);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSpecialties, setFilteredSpecialties] = useState<SpecialtyWithHospitals[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<SpecialtyWithHospitals | null>(null);

  // Fetch hospitals
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
      }
    };
    fetchHospitals();
  }, [dispatch, hospitals]);

  // Filter specialties
  useEffect(() => {
    const specialties = getAllSpecialtiesWithHospitals(hospitals);
    const filtered = specialties.filter(
      (s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSpecialties(filtered);
  }, [hospitals, searchTerm]);

  const navigateToHospital = (hospitalId: string) => navigate(`/services/hospitals/${hospitalId}`);

  return (
    <div className="min-h-screen bg-green-50 p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        <Header onBackClick={() => navigate(-1)} title="Medical Specialties" />

        {/* Search */}
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search specialties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 rounded-xl border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
        </div>

        {loading ? (
          // <div className="text-center text-green-700 mt-10">Loading specialties...</div>
          <LoadingSpinner/>
        ) : filteredSpecialties.length === 0 ? (
          <div className="text-center text-green-700 mt-10">No specialties found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredSpecialties.map((spec) => (
              <div
                key={spec.id}
                className="bg-white rounded-2xl shadow-md p-5 cursor-pointer hover:shadow-xl flex flex-col items-center text-center gap-3 h-56 transition-transform transform hover:-translate-y-1"
                onClick={() => setSelectedSpecialty(spec)}
              >
                {specialtyIllustrations[spec.name] || specialtyIllustrations.Default}
                <h3 className="text-lg font-semibold text-green-800 truncate">{spec.name}</h3>
                <p className="text-sm text-green-600 mt-1 line-clamp-3">{spec.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedSpecialty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 overflow-auto py-10 px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 relative animate-slideUp">
            <button
              className="absolute top-4 right-4 text-green-600"
              onClick={() => setSelectedSpecialty(null)}
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-semibold text-green-800 mb-3">{selectedSpecialty.name} Hospitals</h2>

            <div className="space-y-4">
              {selectedSpecialty.hospitals.map((hospital) => (
                <div
                  key={hospital.id}
                  className="border border-green-200 rounded-xl p-4 hover:bg-green-50 cursor-pointer transition-colors"
                  onClick={() => navigateToHospital(hospital.id)}
                >
                  <h4 className="text-md font-medium text-green-800 truncate">{hospital.name}</h4>
                  <div className="flex items-center text-sm text-green-700 mt-1">
                    <Star className="h-4 w-4 fill-current text-yellow-400 mr-1" />
                    {hospital.rating.toFixed(1)}
                  </div>
                  <div className="flex items-center text-sm text-green-700 mt-1 truncate">
                    <MapPin className="h-4 w-4 mr-1" />
                    {hospital.location}
                  </div>
                  <div className="text-sm text-green-700 mt-1">
                    {hospital.doctorCount} doctor{hospital.doctorCount > 1 ? "s" : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialtiesPage;