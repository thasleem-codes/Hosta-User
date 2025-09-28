import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/Home";
import HospitalsPage from "./Pages/Hospitals";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import HospitalDetails from "./Pages/HospitalDetailes";
import DoctorsPage from "./Pages/Doctors";
import SpecialtiesPage from "./Pages/Specialties";
import AmbulanceServicesPage from "./Pages/Ambulance-services";
import DepartmentDoctorsPage from "./Pages/HospitalSpecialtiesDetails";
import UserRegistration from "./Pages/Registration";
import UserLogin from "./Pages/Login";
import PasswordReset from "./Pages/PasswordReset";
import { useEffect } from "react";
import { apiClient } from "./Components/Axios";
import { useDispatch } from "react-redux";
// import { setHospitalData } from "./Redux/HospitalsData";
import HospitalTypeCards from "./Pages/HospitalTypes";
import { getCurrentLocation } from "./Components/getCurrentLocation";
import { updateUserData } from "./Redux/userData";
import { setAmbulances } from "./Redux/AmbulanceData";
import NotFound from "./Pages/NotFound";
import DonateBloodPage from "./Pages/DonateBlood";
import FindBloodPage from "./Pages/FindBlood";
import Profile from "./Pages/Settings";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const init = async () => {
      try {
        const [lat, lon] = await getCurrentLocation();
        dispatch(updateUserData({ latitude: lat, longitude: lon }));
      } catch (err) {
        console.error("Failed to get location", err);
      }

      try {
        // Fetch user data if logged in
        const _id = localStorage.getItem("userId");
        if (!_id) return;
        const user = await apiClient.get(`/api/users/${_id}`, {
          withCredentials: true,
        });
        if (user.data?.data) {
          dispatch(updateUserData(user.data.data));
        }
      } catch (err) {
        console.error(err);
      }

      try {
        const ambulances = await apiClient.get("/api/ambulances");
        dispatch(setAmbulances(ambulances.data.data));
      } catch (error) {
        console.error("Failed to fetch ambulances", error);
      }
      // try {
      //   const result = await apiClient.get("/api/hospitals");
      //   dispatch(setHospitalData({ data: result.data.data }));
      // } catch (error) {
      //   console.error("Failed to fetch hospitals", error);
      // }
    };
    init();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/settings" element={<Profile />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/Registration" element={<UserRegistration />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/password" element={<PasswordReset />} />
        <Route path="/services">
          <Route path="hospitals/types" element={<HospitalTypeCards />} />
          <Route path="hospitals" element={<HospitalsPage />} />
          <Route path="hospitals/:id" element={<HospitalDetails />} />
          <Route
            path="hospitals/:id/:departmentId"
            element={<DepartmentDoctorsPage />}
          />
          <Route path="doctors" element={<DoctorsPage />} />
          <Route path="specialties" element={<SpecialtiesPage />} />
          <Route path="ambulance" element={<AmbulanceServicesPage />} />
          <Route path="blood-donation" element={<DonateBloodPage />} />
          <Route path="blood-request" element={<FindBloodPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;