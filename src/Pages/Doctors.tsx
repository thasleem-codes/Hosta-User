import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
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

// Doctor with hospital schedules
export interface DoctorWithHospitalSchedules extends Doctor {
  specialty: string;
  hospitalSchedules: {
    hospitalId: string;
    hospitalName: string;
    address: string;
    phone: string;
    consulting: ConsultingDay[]; // 👈 updated here
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
  // const [bookingData, setBookingData] = useState({
  //   user_name: "",
  //   mobile: "",
  //   email: "",
  //   booking_date: "",
  //   booking_time: "",
  // });
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
        // ✅ Filter by hospital and specialty
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
                },
              ],
            });
          });
        }
      } else {
        // ✅ Show all doctors
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

  // Booking handlers
  // const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  // };

  // const handleBookingSubmit = async (
  //   doctor: DoctorWithHospitalSchedules,
  //   hospitalId: string
  // ) => {
  //   setBookingLoading(true);
  //   try {
  //     await apiClient.post("/api/appointments", {
  //       ...bookingData,
  //       doctor_name: doctor.name,
  //       specialty: doctor.specialty,
  //       hospitalId,
  //     });
  //     alert("Appointment booked successfully!");
  //     setSelectedDoctor(null);
  //     setBookingData({
  //       user_name: "",
  //       mobile: "",
  //       email: "",
  //       booking_date: "",
  //       booking_time: "",
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     alert("Failed to book appointment. Try again.");
  //   } finally {
  //     setBookingLoading(false);
  //   }
  // };

  const handleBookingSubmit = async (phone: string) => {
    setBookingLoading(true);
    try {
      // open dialer
      window.location.href = `tel:${phone}`;
    } finally {
      setBookingLoading(false);
    }
  };

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
                className="bg-white rounded-2xl shadow-md p-5 cursor-pointer hover:shadow-xl flex flex-col items-center text-center gap-3 h-56 transition-transform transform hover:-translate-y-1"
                onClick={() => setSelectedDoctor(doctor)}
              >
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xl font-bold">
                  {doctor.name.charAt(0)}
                </div>
                <h3 className="text-lg font-semibold text-green-800 truncate">
                  {doctor.name}
                </h3>
                <p className="text-sm text-green-600">{doctor.specialty}</p>
                <button
                  className="mt-auto px-4 py-2 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDoctor(doctor);
                  }}
                >
                  View & Book
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
          <>
            {(() => {
              console.log(selectedDoctor, "<selectedDoctor>");
            })()}
          </>
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
            </div>

            {selectedDoctor.hospitalSchedules.map((hs, idx) => (
              <div
                key={idx}
                className="border border-green-200 rounded-xl p-4 shadow-sm mb-4"
              >
                <h3
                  className="text-md font-semibold text-green-700 cursor-pointer hover:underline"
                  onClick={() =>
                    navigate(`/services/hospitals/${hs.hospitalId}`)
                  }
                >
                  {hs.hospitalName}
                </h3>
                <p className="text-sm text-green-600">{hs.address}</p>
                <p className="text-sm text-green-600 mb-2">📞 {hs.phone}</p>

                {/* Availability */}
                <div className="overflow-x-auto mb-3">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-green-100 text-green-700">
                        <th className="px-2 py-1 text-left">Day</th>
                        <th className="px-2 py-1 text-left">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hs.consulting.map((slot, i) => (
                        <tr key={i} className="border-b border-green-100">
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

                {/* Booking Form */}
                <form
                  className="space-y-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    // handleBookingSubmit(selectedDoctor, hs.hospitalId);
                    handleBookingSubmit(hs.phone);
                  }}
                >
                  {/* <div className="relative">
                    <User
                      className="absolute left-3 top-3 text-green-500"
                      size={18}
                    />
                    <input
                      type="text"
                      name="user_name"
                      placeholder="Your Name"
                      value={bookingData.user_name}
                      onChange={handleBookingChange}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-green-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="relative">
                    <Phone
                      className="absolute left-3 top-3 text-green-500"
                      size={18}
                    />
                    <input
                      type="tel"
                      name="mobile"
                      placeholder="Mobile Number"
                      value={bookingData.mobile}
                      onChange={handleBookingChange}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-green-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-3 text-green-500"
                      size={18}
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={bookingData.email}
                      onChange={handleBookingChange}
                      className="w-full pl-10 pr-3 py-2 border border-green-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="relative">
                    <Calendar
                      className="absolute left-3 top-3 text-green-500"
                      size={18}
                    />
                    <input
                      type="date"
                      name="booking_date"
                      value={bookingData.booking_date}
                      onChange={handleBookingChange}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-green-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
                  >
                    {bookingLoading ? "Booking..." : "Book Appointment"}
                  </button> */}
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
                  >
                    {bookingLoading ? "Booking..." : "Book Appointment"}
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsPage;
