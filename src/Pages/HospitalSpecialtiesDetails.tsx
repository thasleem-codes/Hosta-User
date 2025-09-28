import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Redux/Store";
import { setHospitalData } from "../Redux/HospitalsData";
import { apiClient } from "../Components/Axios";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../Components/Common";
import { Search, Star, MapPin, X } from "lucide-react";
import LoadingSpinner from "../Components/LoadingSpinner";

// Doctor illustrations (colorful, vibrant icons like specialties)
const doctorIllustrations: { [key: string]: JSX.Element } = {
  Cardiologist: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="#EF4444">
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 
        2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 
        4.5 2.09C13.09 3.81 14.76 3 16.5 3
        19.58 3 22 5.42 22 8.5
        c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
    </svg>
  ),
  Neurologist: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="#8B5CF6">
      <circle cx="12" cy="12" r="10" />
      <path fill="#fff" d="M12 6v6l4 2" />
    </svg>
  ),
  Orthopedic: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="#F59E0B">
      <path
        d="M12 2L15 8l6 1-4.5 4 
        1.5 6-5-3-5 3 1.5-6-4.5-4 
        6-1z"
      />
    </svg>
  ),
  Ophthalmologist: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="#3B82F6">
      <circle cx="12" cy="12" r="3" />
      <path
        d="M1 12s4-7 11-7 11 7 11 7-4 7-11 
        7-11-7-11-7z"
        fill="none"
        stroke="#3B82F6"
        strokeWidth="2"
      />
    </svg>
  ),
  General: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="#10B981">
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
    </svg>
  ),
  Default: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="#047857">
      <path
        d="M12 0L15 8h9l-7 6 
        3 10-8-6-8 6 3-10-7-6h9z"
      />
    </svg>
  ),
};

interface Doctor {
  id: string;
  name: string;
  designation: string;
  rating: number;
  hospitalName: string;
  location: string;
}

const DepartmentDoctorsPage: React.FC = () => {
  const { departmentId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { hospitals = [] } = useSelector(
    (state: RootState) => state.hospitalData
  );

  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  // Fetch hospitals if not already in store
  useEffect(() => {
    const fetchHospitals = async () => {
      
      if (hospitals.length === 0) {
        setLoading(true);
        try {
          const result = await apiClient.get("/api/hospitals");
          console.log(result.data.data,"Fetched Hospitals");
          
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

  // Extract doctors for this department
  useEffect(() => {
    if (!departmentId || hospitals.length === 0) return;

    const allDoctors: Doctor[] = [];
    hospitals.forEach((hospital) => {
      hospital.specialties.forEach((spec: any) => {
        if (spec._id === departmentId) {
          spec.doctors.forEach((doc: any) => {
            allDoctors.push({
              id: doc._id,
              name: doc.name,
              designation: doc.designation,
              rating: doc.rating || 0,
              hospitalName: hospital.name,
              location: hospital.address,
            });
          });
        }
      });
    });

    setDoctors(allDoctors);
    setFilteredDoctors(allDoctors);
  }, [departmentId, hospitals]);

  // Search doctors
  useEffect(() => {
    const filtered = doctors.filter(
      (d) =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.hospitalName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [searchTerm, doctors]);

  return (
    <div className="min-h-screen bg-green-50 p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        <Header onBackClick={() => navigate(-1)} title="Doctors" />

        {/* Search */}
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search doctors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 rounded-xl border border-green-300 
              focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center text-green-700 mt-10">
            No doctors found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl shadow-md p-5 cursor-pointer 
                  hover:shadow-xl flex flex-col items-center text-center gap-3 h-56 
                  transition-transform transform hover:-translate-y-1"
                onClick={() => setSelectedDoctor(doc)}
              >
                {doctorIllustrations[doc.designation] ||
                  doctorIllustrations.Default}
                <h3 className="text-lg font-semibold text-green-800 truncate">
                  {doc.name}
                </h3>
                <p className="text-sm text-green-600 mt-1 line-clamp-2">
                  {doc.designation}
                </p>
                <p className="text-sm text-green-500 truncate">
                  {doc.hospitalName}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedDoctor && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center 
          items-start z-50 overflow-auto py-10 px-4"
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 
            relative animate-slideUp"
          >
            <button
              className="absolute top-4 right-4 text-green-600"
              onClick={() => setSelectedDoctor(null)}
            >
              <X size={24} />
            </button>

            <h2 className="text-xl font-semibold text-green-800 mb-3">
              {selectedDoctor.name}
            </h2>
            <p className="text-green-700 mb-2">{selectedDoctor.designation}</p>
            <div className="flex items-center text-sm text-green-700 mt-1">
              <Star className="h-4 w-4 fill-current text-yellow-400 mr-1" />
              {selectedDoctor.rating.toFixed(1)}
            </div>
            <div className="flex items-center text-sm text-green-700 mt-1 truncate">
              <MapPin className="h-4 w-4 mr-1" />
              {selectedDoctor.hospitalName}, {selectedDoctor.location}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentDoctorsPage;