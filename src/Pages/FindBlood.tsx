import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Phone, Search } from "lucide-react";
import { RootState } from "../Redux/Store";
import { setBloods, BloodDonor } from "../Redux/BloodData";

import { apiClient } from "../Components/Axios";
import Navbar from "../Components/Navbar";
import { Header } from "../Components/Common";
import { useNavigate } from "react-router-dom";

const bloodGroups: (BloodDonor["bloodGroup"] | "All")[] = [
  "All",
  "O+",
  "O-",
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
];

const calculateAge = (dob: string) => {
  const b = new Date(dob);
  const t = new Date();
  let age = t.getFullYear() - b.getFullYear();
  const m = t.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < b.getDate())) age--;
  return age;
};

const getInitial = (name: string) =>
  (name?.trim()?.charAt(0) || "?").toUpperCase();

const FindBloodPage: React.FC = () => {
  const dispatch = useDispatch();
  const donors = useSelector(
    (state: RootState) => state.bloodData
  ) as BloodDonor[];
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<
    BloodDonor["bloodGroup"] | "All"
  >("All");
  const [user, setUser] = useState<any>(null);
  const [donor, setDonor] = useState<any>(null);
  const [loading, setLoading] = useState(!donors?.length); // show loading only if Redux is empty

  const donorsWithId: BloodDonor[] = (donors ?? []).map((d, index) => ({
    ...d,
    id: d.id || String(index),
  }));

  // Optimized fetch: parallel fetching of user and donors
  useEffect(() => {
    const _id = localStorage.getItem("userId");

    const fetchAll = async () => {
      if (donors?.length) {
        // Redux already has data, skip fetching donors
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

          // Fetch donor info of current user if exists
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
        d.address?.place?.toLowerCase()?.includes(q);
      const matchesGroup =
        selectedGroup === "All" || d.bloodGroup === selectedGroup;
      return matchesSearch && matchesGroup;
    });
  }, [searchTerm, selectedGroup, donorsWithId]);

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col">
      <Navbar />
      <Header onBackClick={() => navigate("/")} title="Blood Services" />

      <div className="flex items-center bg-white rounded-full mx-4 mt-4 px-4 py-2 mb-5">
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

      <div className="flex overflow-x-auto gap-3 px-4 py-3 mb-3 hide-scrollbar">
        {bloodGroups.map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGroup(g)}
            className={`flex-shrink-0 w-14 h-14 rounded-full border font-bold text-sm
            ${
              selectedGroup === g
                ? "bg-emerald-700 text-white border-emerald-700"
                : "bg-emerald-100 text-emerald-700 border-emerald-500"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center flex-1">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
        </div>
      ) : (
        <div className="flex-1 px-4 pb-6 space-y-4">
          {filteredDonors.length === 0 && (
            <p className="text-center text-gray-600 mt-6">No donors found.</p>
          )}

          {filteredDonors.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-4 shadow flex items-center"
            >
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
                  Location: {item.address.place}
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
      )}

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
