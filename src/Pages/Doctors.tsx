// import React, { useState, useEffect } from "react";
// import { Search, X } from "lucide-react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../Redux/Store";
// import {
//   setHospitalData,
//   Doctor,
//   Hospital,
//   Specialty,
//   ConsultingDay,
// } from "../Redux/HospitalsData";
// import { apiClient } from "../Components/Axios";
// import { Header } from "../Components/Common";
// import LoadingSpinner from "../Components/LoadingSpinner";
// import { convertTo12HourFormat } from "../Components/HospitalDetailesComponents";
// import { successToast } from "../Components/Toastify";

// // Doctor with hospital schedules
// export interface DoctorWithHospitalSchedules extends Doctor {
//   specialty: string;
//   hospitalSchedules: {
//     hospitalId: string;
//     hospitalName: string;
//     address: string;
//     phone: string;
//     consulting: ConsultingDay[]; // 👈 updated here
//   }[];
// }

// const getAllDoctorsWithHospitalSchedules = (
//   hospitals: Hospital[]
// ): DoctorWithHospitalSchedules[] => {
//   const doctorMap = new Map<string, DoctorWithHospitalSchedules>();
//   hospitals.forEach((hospital) => {
//     hospital.specialties.forEach((specialty: Specialty) => {
//       specialty.doctors.forEach((doctor: Doctor) => {
//         const key = `${doctor.name}-${specialty.name}`;
//         if (!doctorMap.has(key)) {
//           doctorMap.set(key, {
//             ...doctor,
//             specialty: specialty.name,
//             hospitalSchedules: [],
//           });
//         }
//         const existingDoctor = doctorMap.get(key)!;
//         existingDoctor.hospitalSchedules.push({
//           hospitalId: hospital._id || "",
//           hospitalName: hospital.name,
//           address: hospital.address,
//           phone: hospital.phone,
//           consulting: doctor.consulting,
//         });
//       });
//     });
//   });
//   return Array.from(doctorMap.values());
// };

// const DoctorsPage: React.FC = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const { hospitals = [] } = useSelector(
//     (state: RootState) => state.hospitalData
//   );

//   const [doctors, setDoctors] = useState<DoctorWithHospitalSchedules[]>([]);
//   const [filteredDoctors, setFilteredDoctors] = useState<
//     DoctorWithHospitalSchedules[]
//   >([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [selectedDoctor, setSelectedDoctor] =
//     useState<DoctorWithHospitalSchedules | null>(null);
//   const [bookingData, setBookingData] = useState({
//     user_name: "",
//     mobile: "",
//     email: "",
//     booking_date: "",
//   });

//   const [bookingLoading, setBookingLoading] = useState(false);

//   // Query params for filtering
//   const hospitalId = searchParams.get("hospitalId");
//   const specialtyId = searchParams.get("specialtyId");

//   useEffect(() => {
//     const fetchHospitals = async () => {
//       if (hospitals.length === 0) {
//         setLoading(true);
//         try {
//           const result = await apiClient.get("/api/hospitals");
//           dispatch(setHospitalData({ data: result.data.data }));
//         } catch (err) {
//           console.error(err);
//         } finally {
//           setLoading(false);
//         }
//       }
//     };
//     fetchHospitals();
//   }, [dispatch, hospitals]);

//   useEffect(() => {
//     if (hospitals.length > 0) {
//       let allDoctors: DoctorWithHospitalSchedules[] = [];

//       if (hospitalId && specialtyId) {
//         // ✅ Filter by hospital and specialty
//         const hospital = hospitals.find((h) => h._id === hospitalId);
//         const specialty = hospital?.specialties.find(
//           (s) => s._id === specialtyId
//         );

//         if (hospital && specialty) {
//           specialty.doctors.forEach((doctor) => {
//             allDoctors.push({
//               ...doctor,
//               specialty: specialty.name,
//               hospitalSchedules: [
//                 {
//                   hospitalId: hospital._id!,
//                   hospitalName: hospital.name,
//                   address: hospital.address,
//                   phone: hospital.phone,
//                   consulting: doctor.consulting,
//                 },
//               ],
//             });
//           });
//         }
//       } else {
//         // ✅ Show all doctors
//         allDoctors = getAllDoctorsWithHospitalSchedules(hospitals);
//       }

//       setDoctors(allDoctors);
//       setFilteredDoctors(allDoctors);
//     }
//   }, [hospitals, hospitalId, specialtyId]);

//   useEffect(() => {
//     if (doctors.length > 0) {
//       const results = doctors.filter(
//         (doctor) =>
//           doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       console.log(results,"filtered results");

//       setFilteredDoctors(results);
//     }
//   }, [searchTerm, doctors]);

//   // Booking handlers
//   const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setBookingData({ ...bookingData, [e.target.name]: e.target.value });
//   };

//   const handleBookingSubmit = async (
//     doctor: DoctorWithHospitalSchedules,
//     hospitalId: string
//   ) => {
//     if (
//       !bookingData.booking_date ||
//       !bookingData.email ||
//       !bookingData.user_name ||
//       !bookingData.mobile
//     ) {
//       alert("Please fill in all the booking fields.");
//       return;
//     }

//     setBookingLoading(true);
//     try {
//       const userId = localStorage.getItem("userId"); // or fetch from auth state if available
//       if (!userId) {
//         navigate("/login");
//         alert("User not logged in.");
//         setBookingLoading(false);
//         return;
//       }

//       await apiClient.post(`/api/bookings/${hospitalId}`, {
//         userId,
//         specialty: doctor.specialty,
//         doctor_name: doctor.name,
//         booking_date: bookingData.booking_date,
//       });

//       successToast("Appointment booked successfully!");
//       setSelectedDoctor(null);
//       setBookingData({
//         user_name: "",
//         mobile: "",
//         email: "",
//         booking_date: "",
//       });
//     } catch (error) {
//       console.error("Booking failed", error);
//       alert("Failed to book appointment. Please try again.");
//     } finally {
//       setBookingLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-green-50 p-4 md:p-6">
//       <div className="max-w-3xl mx-auto">
//         <Header onBackClick={() => navigate(-1)} title="Doctors" />
//         {hospitalId && specialtyId && (
//           <div className="mb-6 bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-xl shadow-sm text-center">
//             Showing doctors in{" "}
//             <span className="font-semibold">
//               {filteredDoctors[0]?.specialty}
//             </span>
//             at{" "}
//             <span className="font-semibold">
//               {hospitals.find((h) => h._id === hospitalId)?.name}
//             </span>
//           </div>
//         )}

//         {/* Search */}
//         <div className="mb-6 relative">
//           <input
//             type="text"
//             placeholder="Search doctors by name or specialty"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full px-4 py-3 pl-10 rounded-xl border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
//           />
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
//         </div>

//         {loading ? (
//           <LoadingSpinner />
//         ) : filteredDoctors.length === 0 ? (
//           <div className="text-center text-green-700 mt-10">
//             No doctors found.
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {filteredDoctors.map((doctor) => (
//               <div
//                 key={doctor._id}
//                 className="bg-white rounded-2xl shadow-md p-5 cursor-pointer hover:shadow-xl flex flex-col items-center text-center gap-3 h-56 transition-transform transform hover:-translate-y-1"
//                 onClick={() => setSelectedDoctor(doctor)}
//               >
//                 <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xl font-bold">
//                   {doctor.name.charAt(0)}
//                 </div>
//                 <h3 className="text-lg font-semibold text-green-800 truncate">
//                   {doctor.name}
//                 </h3>
//                 <p className="text-sm text-green-600">{doctor.specialty}</p>
//                 <button
//                   className="mt-auto px-4 py-2 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setSelectedDoctor(doctor);
//                   }}
//                 >
//                   View & Book
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Booking Modal */}
//       {selectedDoctor && (
//         <div
//           className="fixed inset-0 z-50 flex justify-center items-end"
//           onClick={() => setSelectedDoctor(null)}
//         >
//           <div className="absolute inset-0 bg-black bg-opacity-50" />
//           <div
//             className="relative w-full max-w-lg bg-white rounded-t-3xl shadow-lg p-6 max-h-[90vh] overflow-y-auto animate-slideUp z-50"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               className="absolute top-4 right-4 text-green-600"
//               onClick={() => setSelectedDoctor(null)}
//             >
//               <X size={24} />
//             </button>

//             <div className="flex flex-col items-center text-center mb-4">
//               <div className="text-5xl mb-2">👨‍⚕️</div>
//               <h2 className="text-xl font-semibold text-green-800">
//                 {selectedDoctor.name}
//               </h2>
//               <p className="text-green-600">{selectedDoctor.specialty}</p>
//             </div>

//             {selectedDoctor.hospitalSchedules.map((hs, idx) => (
//               <div
//                 key={idx}
//                 className="border border-green-200 rounded-xl p-4 shadow-sm mb-4"
//               >
//                 <h3
//                   className="text-md font-semibold text-green-700 cursor-pointer hover:underline"
//                   onClick={() =>
//                     navigate(`/services/hospitals/${hs.hospitalId}`)
//                   }
//                 >
//                   {hs.hospitalName}
//                 </h3>
//                 <p className="text-sm text-green-600">{hs.address}</p>
//                 <p className="text-sm text-green-600 mb-2">📞 {hs.phone}</p>

//                 {/* Availability */}
//                 <div className="overflow-x-auto mb-3">
//                   <table className="w-full text-sm border-collapse">
//                     <thead>
//                       <tr className="bg-green-100 text-green-700">
//                         <th className="px-2 py-1 text-left">Day</th>
//                         <th className="px-2 py-1 text-left">Time</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {hs.consulting.map((slot, i) => (
//                         <tr key={i} className="border-b border-green-100">
//                           <td className="px-2 py-1">{slot.day}</td>
//                           <td className="px-2 py-1">
//                             {slot.sessions.map((s, idx) => (
//                               <div key={idx}>
//                                 {convertTo12HourFormat(s.start_time)} -{" "}
//                                 {convertTo12HourFormat(s.end_time)}
//                               </div>
//                             ))}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>

//                 {/* Booking Form */}
//                 <form
//                   className="space-y-3"
//                   onSubmit={(e) => {
//                     e.preventDefault();
//                     handleBookingSubmit(selectedDoctor, hs.hospitalId);
//                   }}
//                 >
//                   <div className="relative">
//                     <input
//                       type="text"
//                       name="user_name"
//                       placeholder="Your Name"
//                       value={bookingData.user_name}
//                       onChange={handleBookingChange}
//                       required
//                       className="w-full pl-4 pr-3 py-2 border border-green-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
//                     />
//                   </div>
//                   <div className="relative">
//                     <input
//                       type="tel"
//                       name="mobile"
//                       placeholder="Mobile Number"
//                       value={bookingData.mobile}
//                       onChange={handleBookingChange}
//                       required
//                       className="w-full pl-4 pr-3 py-2 border border-green-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
//                     />
//                   </div>
//                   <div className="relative">
//                     <input
//                       type="email"
//                       name="email"
//                       placeholder="Email"
//                       value={bookingData.email}
//                       onChange={handleBookingChange}
//                       required
//                       className="w-full pl-4 pr-3 py-2 border border-green-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
//                     />
//                   </div>
//                   <div className="relative">
//                     <input
//                       type="date"
//                       name="booking_date"
//                       value={bookingData.booking_date}
//                       onChange={handleBookingChange}
//                       required
//                       className="w-full pl-4 pr-3 py-2 border border-green-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
//                     />
//                   </div>
//                   <button
//                     type="submit"
//                     disabled={bookingLoading}
//                     className="w-full py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
//                   >
//                     {bookingLoading ? "Booking..." : "Book Appointment"}
//                   </button>
//                 </form>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DoctorsPage;

import React, { useState, useEffect } from "react";
import { Search, X, AlertCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/Store";
import {
  setHospitalData,
  Doctor,
  Hospital,
  Specialty,
  ConsultingDay,
} from "../Redux/HospitalsData";
import { apiClient } from "../Components/Axios";
import { Header } from "../Components/Common";
import LoadingSpinner from "../Components/LoadingSpinner";
import { convertTo12HourFormat } from "../Components/HospitalDetailesComponents";
import { successToast, errorToast } from "../Components/Toastify";

// Doctor with hospital schedules
export interface DoctorWithHospitalSchedules extends Doctor {
  specialty: string;
  hospitalSchedules: {
    hospitalId: string;
    hospitalName: string;
    address: string;
    phone: string;
    consulting: ConsultingDay[];
    bookingOpen: boolean;
  }[];
}

const getAllDoctorsWithHospitalSchedules = (
  hospitals: Hospital[]
): DoctorWithHospitalSchedules[] => {
  const doctorMap = new Map<string, DoctorWithHospitalSchedules>();
  hospitals.forEach((hospital) => {
    hospital.specialties.forEach((specialty: Specialty) => {
      specialty.doctors.forEach((doctor: Doctor) => {
        const key = `${doctor.name}-${specialty.name}`;
        if (!doctorMap.has(key)) {
          doctorMap.set(key, {
            ...doctor,
            specialty: specialty.name,
            hospitalSchedules: [],
          });
        }
        const existingDoctor = doctorMap.get(key)!;
        existingDoctor.hospitalSchedules.push({
          hospitalId: hospital._id || "",
          hospitalName: hospital.name,
          address: hospital.address,
          phone: hospital.phone,
          consulting: doctor.consulting,
          bookingOpen: doctor.bookingOpen as boolean,
        });
      });
    });
  });
  return Array.from(doctorMap.values());
};

const DoctorsPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { hospitals = [] } = useSelector(
    (state: RootState) => state.hospitalData
  );

  const [doctors, setDoctors] = useState<DoctorWithHospitalSchedules[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<
    DoctorWithHospitalSchedules[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] =
    useState<DoctorWithHospitalSchedules | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<string>("");
  const [bookingDate, setBookingDate] = useState<string>("");
  const [bookingLoading, setBookingLoading] = useState(false);

  // Query params for filtering
  const hospitalId = searchParams.get("hospitalId");
  const specialtyId = searchParams.get("specialtyId");

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

  useEffect(() => {
    if (hospitals.length > 0) {
      let allDoctors: DoctorWithHospitalSchedules[] = [];

      if (hospitalId && specialtyId) {
        const hospital = hospitals.find((h) => h._id === hospitalId);
        const specialty = hospital?.specialties.find(
          (s) => s._id === specialtyId
        );

        if (hospital && specialty) {
          specialty.doctors.forEach((doctor) => {
            allDoctors.push({
              ...doctor,
              specialty: specialty.name,
              hospitalSchedules: [
                {
                  hospitalId: hospital._id!,
                  hospitalName: hospital.name,
                  address: hospital.address,
                  phone: hospital.phone,
                  consulting: doctor.consulting,
                  bookingOpen: doctor.bookingOpen as boolean,
                },
              ],
            });
          });
        }
      } else {
        allDoctors = getAllDoctorsWithHospitalSchedules(hospitals);
      }

      setDoctors(allDoctors);
      setFilteredDoctors(allDoctors);
    }
  }, [hospitals, hospitalId, specialtyId]);

  useEffect(() => {
    if (doctors.length > 0) {
      const results = doctors.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setFilteredDoctors(results);
    }
  }, [searchTerm, doctors]);

  // Get day name from date string
  const getDayName = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  // Check if doctor is available on selected date
  const checkDoctorAvailability = (
    date: string,
    consulting: ConsultingDay[]
  ): boolean => {
    const dayName = getDayName(date);
    return consulting.some(
      (c) => c.day.toLowerCase() === dayName.toLowerCase()
    );
  };

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setBookingDate(selectedDate);
  };

  // Get tomorrow's date for min date (prevent booking for today)
  const getTomorrowDate = (): string => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  // Get max date (30 days from now)
  const getMaxDate = (): string => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split("T")[0];
  };

  // Handle hospital selection in modal
  const handleHospitalSelect = (hospitalId: string) => {
    setSelectedHospital(hospitalId);
    setBookingDate("");
  };

  const handleBookingSubmit = async (
    doctor: DoctorWithHospitalSchedules,
    hospitalId: string
  ) => {
    if (!bookingDate) {
      errorToast("Please select a booking date");
      return;
    }

    // Check if doctor is available on selected date
    const selectedHospitalData = doctor.hospitalSchedules.find(
      (hs) => hs.hospitalId === hospitalId
    );

    if (
      selectedHospitalData &&
      !checkDoctorAvailability(bookingDate, selectedHospitalData.consulting)
    ) {
      errorToast("Doctor is not available on the selected date");
      return;
    }

    // Check if booking is open for this doctor
    if (!selectedHospitalData?.bookingOpen) {
      errorToast("Booking is currently not available for this doctor");
      return;
    }

    setBookingLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        navigate("/login");
        errorToast("Please login to book an appointment");
        setBookingLoading(false);
        return;
      }

      await apiClient.post(`/api/bookings/${hospitalId}`, {
        userId,
        specialty: doctor.specialty,
        doctor_name: doctor.name,
        booking_date: bookingDate,
      });

      successToast("Appointment booked successfully!");
      setSelectedDoctor(null);
      setSelectedHospital("");
      setBookingDate("");
    } catch (error: any) {
      console.error("Booking failed", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to book appointment. Please try again.";
      errorToast(errorMessage);
    } finally {
      setBookingLoading(false);
    }
  };

  // Reset modal state when doctor selection changes
  useEffect(() => {
    if (selectedDoctor) {
      setSelectedHospital("");
      setBookingDate("");
    }
  }, [selectedDoctor]);

  return (
    <div className="min-h-screen bg-green-50 p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        <Header onBackClick={() => navigate(-1)} title="Doctors" />
        {hospitalId && specialtyId && (
          <div className="mb-6 bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-xl shadow-sm text-center">
            Showing doctors in{" "}
            <span className="font-semibold">
              {filteredDoctors[0]?.specialty}
            </span>
            at{" "}
            <span className="font-semibold">
              {hospitals.find((h) => h._id === hospitalId)?.name}
            </span>
          </div>
        )}

        {/* Search */}
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search doctors by name or specialty"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 rounded-xl border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
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
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor._id}
                className={`bg-white rounded-2xl shadow-md p-5 cursor-pointer hover:shadow-xl flex flex-col items-center text-center gap-3 h-56 transition-transform transform hover:-translate-y-1 ${
                  !doctor.bookingOpen ? "opacity-70" : ""
                }`}
                onClick={() => setSelectedDoctor(doctor)}
              >
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xl font-bold">
                  {doctor.name.charAt(0)}
                </div>
                <h3 className="text-lg font-semibold text-green-800 truncate">
                  {doctor.name}
                </h3>
                <p className="text-sm text-green-600">{doctor.specialty}</p>

                {/* Booking Status Badge */}
                {!doctor.bookingOpen && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                    <AlertCircle size={12} />
                    Bookings Closed
                  </div>
                )}

                <button
                  className={`mt-auto px-4 py-2 rounded-xl text-sm transition-colors ${
                    doctor.bookingOpen
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (doctor.bookingOpen) {
                      setSelectedDoctor(doctor);
                    }
                  }}
                  disabled={!doctor.bookingOpen}
                >
                  {doctor.bookingOpen ? "View & Book" : "Not Available"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedDoctor && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-end"
          onClick={() => setSelectedDoctor(null)}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div
            className="relative w-full max-w-lg bg-white rounded-t-3xl shadow-lg p-6 max-h-[90vh] overflow-y-auto animate-slideUp z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-green-600"
              onClick={() => setSelectedDoctor(null)}
            >
              <X size={24} />
            </button>

            <div className="flex flex-col items-center text-center mb-4">
              <div className="text-5xl mb-2">👨‍⚕️</div>
              <h2 className="text-xl font-semibold text-green-800">
                {selectedDoctor.name}
              </h2>
              <p className="text-green-600">{selectedDoctor.specialty}</p>

              {/* Overall Booking Status */}
              {!selectedDoctor.bookingOpen && (
                <div className="mt-2 flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                  <AlertCircle size={14} />
                  Bookings are currently closed for this doctor
                </div>
              )}
            </div>

            {selectedDoctor.hospitalSchedules.map((hs, idx) => (
              <div
                key={idx}
                className={`border rounded-xl p-4 shadow-sm mb-4 ${
                  hs.bookingOpen
                    ? "border-green-200 bg-green-50"
                    : "border-gray-300 bg-gray-100"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3
                      className={`text-md font-semibold cursor-pointer hover:underline ${
                        hs.bookingOpen ? "text-green-700" : "text-gray-600"
                      }`}
                      onClick={() =>
                        navigate(`/services/hospitals/${hs.hospitalId}`)
                      }
                    >
                      {hs.hospitalName}
                    </h3>
                    <p
                      className={`text-sm ${
                        hs.bookingOpen ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {hs.address}
                    </p>
                    <p
                      className={`text-sm mb-2 ${
                        hs.bookingOpen ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      📞 {hs.phone}
                    </p>
                  </div>

                  {!hs.bookingOpen && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                      <AlertCircle size={12} />
                      Closed
                    </div>
                  )}
                </div>

                {/* Availability */}
                <div className="overflow-x-auto mb-3">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr
                        className={`${
                          hs.bookingOpen
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        <th className="px-2 py-1 text-left">Day</th>
                        <th className="px-2 py-1 text-left">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hs.consulting.map((slot, i) => (
                        <tr
                          key={i}
                          className={`border-b ${
                            hs.bookingOpen
                              ? "border-green-100"
                              : "border-gray-100"
                          }`}
                        >
                          <td className="px-2 py-1">{slot.day}</td>
                          <td className="px-2 py-1">
                            {slot.sessions.map((s, idx) => (
                              <div key={idx}>
                                {convertTo12HourFormat(s.start_time)} -{" "}
                                {convertTo12HourFormat(s.end_time)}
                              </div>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Booking Form - Only show if booking is open */}
                {hs.bookingOpen && (
                  <div>
                    <form
                      className="space-y-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleBookingSubmit(selectedDoctor, hs.hospitalId);
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleHospitalSelect(hs.hospitalId)}
                        className={`w-full py-3 px-4 border-2 rounded-xl text-sm font-medium transition-colors ${
                          selectedHospital === hs.hospitalId
                            ? "bg-green-600 text-white border-green-600"
                            : "bg-white text-green-600 border-green-300 hover:bg-green-50"
                        }`}
                      >
                        {selectedHospital === hs.hospitalId
                          ? "✓ Selected for Booking"
                          : "Book at this Hospital"}
                      </button>

                      {selectedHospital === hs.hospitalId && (
                        <>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-green-700">
                              Select Appointment Date *
                            </label>
                            <div className="relative">
                              <input
                                type="date"
                                value={bookingDate}
                                onChange={handleDateChange}
                                required
                                min={getTomorrowDate()}
                                max={getMaxDate()}
                                className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              />
                            </div>

                            {/* Error message only when date is not available */}
                            {bookingDate &&
                              !checkDoctorAvailability(
                                bookingDate,
                                hs.consulting
                              ) && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
                                  <AlertCircle size={16} />
                                  <span>
                                    Doctor is not available on{" "}
                                    {getDayName(bookingDate)}
                                  </span>
                                </div>
                              )}
                          </div>

                          <button
                            type="submit"
                            disabled={
                              bookingLoading ||
                              !bookingDate ||
                              !checkDoctorAvailability(
                                bookingDate,
                                hs.consulting
                              )
                            }
                            className={`w-full py-4 rounded-xl font-medium transition ${
                              bookingLoading ||
                              !bookingDate ||
                              !checkDoctorAvailability(
                                bookingDate,
                                hs.consulting
                              )
                                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                : "bg-green-600 text-white hover:bg-green-700 shadow-lg"
                            }`}
                          >
                            {bookingLoading ? (
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Booking Appointment...
                              </div>
                            ) : (
                              "Book Appointment"
                            )}
                          </button>

                          {/* Booking Info */}
                          <div className="text-xs text-gray-500 text-center mt-2">
                            Your user account information will be used for the
                            booking
                          </div>
                        </>
                      )}
                    </form>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsPage;
