// // import React, { useState, useEffect } from "react";
// // import { Search, Droplet, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
// // import BloodGroupSelector, { BloodGroup, Donor } from "../Components/BloodGroupSelector";
// // import DonorCard from "../Components/DonorCard";
// // import Navbar from "../Components/Navbar";
// // import { apiClient } from "../Components/Axios";

// // export interface SearchParams {
// //   bloodGroup: BloodGroup | "";
// //   location: string;
// //   pincode: string
// // }

// // const FindBloodPage: React.FC = () => {
// //   const [searchParams, setSearchParams] = useState<SearchParams>({
// //     bloodGroup: "",
// //     location: "",
// //     pincode: "",
// //   });

// //   const [donors, setDonors] = useState<Donor[]>([]);
// //   const [isSearching, setIsSearching] = useState(false);
// //   const [hasSearched, setHasSearched] = useState(false);
// //   const [page, setPage] = useState(1);
// //   const [totalPages, setTotalPages] = useState(1);

// //   useEffect(() => {
// //     if (hasSearched) {
// //       fetchDonors();
// //     }
// //   }, [page]);

// //   const fetchDonors = async () => {
// //     setIsSearching(true);
// //     try {
// //       const params: any = {
// //         page,
// //         limit: 6, 
// //         bloodGroup: searchParams.bloodGroup || undefined,
// //       };

// //       if (searchParams.location) {
// //         params.place = searchParams.location;
// //       }
// //       if (searchParams.pincode) {
// //         params.pincode = searchParams.pincode;
// //       }

// //       const response = await apiClient.get("/api/donors", { params });
      

// //       setDonors(response.data.donors);
// //       setTotalPages(response.data.totalPages);
// //     } catch (error: any) {
// //       console.error(error);
// //       alert("Failed to fetch donors.");
// //     } finally {
// //       setIsSearching(false);
// //     }
// //   };

// //   const handleSearch = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setPage(1); // reset to first page
// //     setHasSearched(true);
// //     fetchDonors();
// //   };

// //   const handleBloodGroupChange = (value: BloodGroup | "") => {
// //     setSearchParams((prev) => ({ ...prev, bloodGroup: value }));
// //   };

// //   const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     setSearchParams((prev) => ({ ...prev, location: e.target.value }));
// //   };

// //   const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     setSearchParams((prev) => ({ ...prev, pincode: e.target.value }));
// //   };

// //   const handlePrevPage = () => {
// //     if (page > 1) {
// //       setPage((prev) => prev - 1);
// //     }
// //   };

// //   const handleNextPage = () => {
// //     if (page < totalPages) {
// //       setPage((prev) => prev + 1);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-green-50">
// //       <Navbar />
// //       <main className="container mx-auto px-4 py-6">
// //         <div className="max-w-5xl mx-auto">
// //           <div className="flex items-center justify-center mb-6">
// //             <Search className="h-10 w-10 text-green-600 mr-3" />
// //             <h1 className="text-3xl font-bold text-green-800">Find Blood Donors</h1>
// //           </div>

// //           <div className="bg-white rounded-lg shadow-md p-6 mb-8">
// //             <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
// //               {/* Blood Group */}
// //               <div>
// //                 <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-1">
// //                   Blood Group
// //                 </label>
// //                 <BloodGroupSelector
// //                   value={searchParams.bloodGroup}
// //                   onChange={handleBloodGroupChange}
// //                   includeEmpty
// //                 />
// //               </div>

// //               {/* Location */}
// //               <div>
// //                 <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
// //                   City / State
// //                 </label>
// //                 <div className="relative">
// //                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                     <MapPin className="h-5 w-5 text-gray-400" />
// //                   </div>
// //                   <input
// //                     type="text"
// //                     id="location"
// //                     value={searchParams.location}
// //                     onChange={handleLocationChange}
// //                     placeholder="City or State"
// //                     className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
// //                   />
// //                 </div>
// //               </div>

// //               {/* Pincode */}
// //               <div>
// //                 <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
// //                   Pincode
// //                 </label>
// //                 <input
// //                   type="text"
// //                   id="pincode"
// //                   value={searchParams.pincode}
// //                   onChange={handlePincodeChange}
// //                   placeholder="Enter Pincode"
// //                   className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
// //                 />
// //               </div>

// //               {/* Search Button */}
// //               <div className="flex items-end">
// //                 <button
// //                   type="submit"
// //                   className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-300 flex items-center justify-center"
// //                   disabled={isSearching}
// //                 >
// //                   {isSearching ? (
// //                     <div className="flex items-center">
// //                       <svg
// //                         className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
// //                         xmlns="http://www.w3.org/2000/svg"
// //                         fill="none"
// //                         viewBox="0 0 24 24"
// //                       >
// //                         <circle
// //                           className="opacity-25"
// //                           cx="12"
// //                           cy="12"
// //                           r="10"
// //                           stroke="currentColor"
// //                           strokeWidth="4"
// //                         ></circle>
// //                         <path
// //                           className="opacity-75"
// //                           fill="currentColor"
// //                           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
// //                         ></path>
// //                       </svg>
// //                       Searching...
// //                     </div>
// //                   ) : (
// //                     <>
// //                       <Search className="h-5 w-5 mr-2" />
// //                       Find Donors
// //                     </>
// //                   )}
// //                 </button>
// //               </div>
// //             </form>

// //             {hasSearched && !isSearching && (
// //               <div className="mt-4 pt-4 border-t border-gray-100">
// //                 <p className="text-sm text-gray-600">
// //                   {donors.length === 0
// //                     ? "No donors found matching your criteria."
// //                     : `Found ${donors.length} donor${donors.length === 1 ? "" : "s"}.`}
// //                 </p>
// //               </div>
// //             )}
// //           </div>

// //           {/* Donor Results */}
// //           {hasSearched && !isSearching && donors.length > 0 && (
// //             <>
// //               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //                 {donors.map((donor, index) => (
// //                   <DonorCard key={index} donor={donor} />
// //                 ))}
// //               </div>

// //               {/* Pagination */}
// //               <div className="flex justify-center items-center mt-8 space-x-4">
// //                 <button
// //                   onClick={handlePrevPage}
// //                   disabled={page === 1}
// //                   className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
// //                 >
// //                   <ChevronLeft className="h-5 w-5 mr-1" /> Previous
// //                 </button>
// //                 <span className="text-gray-700 font-medium">{page} / {totalPages}</span>
// //                 <button
// //                   onClick={handleNextPage}
// //                   disabled={page === totalPages}
// //                   className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
// //                 >
// //                   Next <ChevronRight className="h-5 w-5 ml-1" />
// //                 </button>
// //               </div>
// //             </>
// //           )}

// //           {/* No donors found */}
// //           {hasSearched && !isSearching && donors.length === 0 && (
// //             <div className="text-center py-12">
// //               <div className="inline-flex items-center justify-center p-4 bg-red-50 rounded-full mb-4">
// //                 <Droplet className="h-12 w-12 text-red-500" />
// //               </div>
// //               <h2 className="text-xl font-semibold text-gray-800 mb-2">No Donors Found</h2>
// //               <p className="text-gray-600 max-w-md mx-auto">
// //                 Try different blood group, location, or pincode.
// //               </p>
// //             </div>
// //           )}

// //           {/* Initial State */}
// //           {!hasSearched && (
// //             <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
// //               <div className="flex flex-col items-center">
// //                 <Droplet className="h-16 w-16 text-red-500 mb-4" />
// //                 <h2 className="text-xl font-semibold text-green-800 mb-2">Blood Donation Saves Lives</h2>
// //                 <p className="text-gray-700 max-w-2xl mx-auto">
// //                   Use the search form above to find blood donors in your area.
// //                 </p>
// //                 <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
// //                   {["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"].map((group) => (
// //                     <div
// //                       key={group}
// //                       className="bg-white rounded-lg p-3 shadow-sm flex flex-col items-center"
// //                     >
// //                       <span className="text-xl font-bold text-red-600">{group}</span>
// //                       <span className="text-xs text-gray-500">Blood Group</span>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </main>
// //     </div>
// //   );
// // };

// // export default FindBloodPage;


// import React, { useState, useMemo,  useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Phone, Search } from "lucide-react";
// import { RootState } from "../Redux/Store";
// import { setBloods } from "../Redux/BloodData";

// import { apiClient } from "../Components/Axios";
// import Navbar from "../Components/Navbar";
// import { Header } from "../Components/Common";
// import { useNavigate } from "react-router-dom";

// export interface IBloodDonor {
//   id: string;
//   userId: {
//     id: string;
//     name: string;
//     email: string;
//     password: string;
//     phone: string;
//   };
//   phone: string;
//   dateOfBirth: string;
//   bloodGroup: "O+" | "O-" | "AB+" | "AB-" | "A+" | "A-" | "B+" | "B-";
//   address: { place: string; pincode: number };
//   lastDonationDate?: string | null;
//   profileImage?: string;
// }

// const bloodGroups: (IBloodDonor["bloodGroup"] | "All")[] = [
//   "All","O+","O-","A+","A-","B+","B-","AB+","AB-",
// ];

// const calculateAge = (dob: string) => {
//   const b = new Date(dob);
//   const t = new Date();
//   let age = t.getFullYear() - b.getFullYear();
//   const m = t.getMonth() - b.getMonth();
//   if (m < 0 || (m === 0 && t.getDate() < b.getDate())) age--;
//   return age;
// };
// const getInitial = (name: string) => (name?.trim()?.charAt(0) || "?").toUpperCase();

// const FindBloodPage: React.FC = () => {
//   const dispatch = useDispatch();
//   const donors = useSelector((state: RootState) => state.bloodData) as IBloodDonor[];
//   const navigate = useNavigate();

//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedGroup, setSelectedGroup] = useState<IBloodDonor["bloodGroup"] | "All">("All");
//   const [loading, setLoading] = useState(true);
//     const [user, setUser] = useState<any>(null);
//   const [donor, setDonor] = useState<any>(null);

//   const donorsWithId: IBloodDonor[] = (donors ?? []).map((d, index) => ({
//     ...d,
//     id: d.id || String(index),
//   }));

//   const fetchDonors = async () => {
//     try {
//       const res = await apiClient.get("/api/donors", { withCredentials: true });
//       const list = res?.data?.donors ?? res?.data ?? [];      
//       dispatch(setBloods(list));
//     } catch (e) {
//       console.error("Failed to fetch donors", e);
//     }
//   };

//     useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         var _id = await localStorage.getItem("userId");
//         if (!_id) return;

//         const result = await apiClient.get(`/api/users/${_id}`);

//         setUser(result.data.data);
//       } catch (err) {
//         console.error("Failed to fetch user", err);
//       }
//     };
//     fetchUser();
//   }, []);

//   useEffect(() => {
//     if (!user?._id) return;

//     const fetchDonor = async () => {
//       try {
//         const result = await apiClient.get(`/api/donors/users/${user._id}`);
//         setDonor(result.data);
//       } catch (err) {
//         // console.error("Failed to fetch donor", err);
//       }
//     };
//     fetchDonor();
//   }, [user?._id], );

//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       await fetchDonors();
//       setLoading(false);
//     })();
//   }, []);

//   const handleDonate = () => {
//      user?._id ? navigate("/services/blood-donation") : navigate("/login");
//   };

//   const handleCall = (phone: string) => {
//     window.open(`tel:${phone}`);
//   };

//   const filteredDonors = useMemo(() => {
//     const q = searchTerm.trim().toLowerCase();
//     return donorsWithId.filter((d) => {
//       const matchesSearch =
//         q.length === 0 ||
//         d.userId?.name?.toLowerCase()?.includes(q) ||
//         d.phone?.includes(q) ||
//         d.address?.place?.toLowerCase()?.includes(q);
//       const matchesGroup = selectedGroup === "All" || d.bloodGroup === selectedGroup;
//       return matchesSearch && matchesGroup;
//     });
//   }, [searchTerm, selectedGroup, donorsWithId]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-emerald-50 flex flex-col">
//       {/* Navbar + Header (replace with your own components if needed) */}
//       <Navbar />
//           <Header onBackClick={() => navigate("/")} title="Blood Services" />
      

//       {/* Search Bar */}
//       <div className="flex items-center bg-white rounded-full mx-4 mt-4 px-4 py-2 mb-5">
//         <Search className="text-emerald-600 mr-2" />
//         <input
//           type="text"
//           className="flex-1 outline-none bg-transparent placeholder-emerald-400"
//           placeholder="Search donors..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//  {!donor?._id && (
//         <button
//           onClick={handleDonate}
//           className="bg-emerald-600 text-white px-4 py-1 rounded-full text-sm font-semibold hover:bg-emerald-700"
//         >
//           Donate
//         </button>
//         )}
//       </div>

//       {/* Blood group chips */}
//       <div className="flex overflow-x-auto gap-3 px-4 py-3 mb-3">
//         {bloodGroups.map((g) => (
//           <button
//             key={g}
//             onClick={() => setSelectedGroup(g)}
//             className={`flex-shrink-0 w-14 h-14 rounded-full border font-bold text-sm
//             ${selectedGroup === g
//               ? "bg-emerald-700 text-white border-emerald-700"
//               : "bg-emerald-100 text-emerald-700 border-emerald-500"
//             }`}
//           >
//             {g}
//           </button>
//         ))}
//       </div>

//       {/* Donor list */}
//       <div className="flex-1 px-4 pb-6 space-y-4">
//         {filteredDonors.length === 0 && (
//           <p className="text-center text-gray-600 mt-6">No donors found.</p>
//         )}

//         {filteredDonors.map((item) => (
//           <div key={item.id} className="bg-white rounded-xl p-4 shadow flex items-center">
//             {item.profileImage ? (
//               <img
//                 src={item.profileImage}
//                 alt="avatar"
//                 className="w-16 h-16 rounded-full mr-4 object-cover"
//               />
//             ) : (
//               <div className="w-16 h-16 rounded-full bg-emerald-300 flex items-center justify-center text-white text-xl font-bold mr-4">
//                 {getInitial(item?.userId?.name)}
//               </div>
//             )}

//             <div className="flex-1">
//               <div className="flex justify-between items-center">
//                 <h3 className="text-emerald-700 font-bold text-lg">
//                   {item.userId?.name} ({calculateAge(item.dateOfBirth)} yrs)
//                 </h3>
//                 <span className="bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm">
//                   {item.bloodGroup}
//                 </span>
//               </div>

//               <p className="text-gray-600 text-sm mt-1">
//                 Location: {item.address.place}
//               </p>

//               <button
//                 onClick={() => handleCall(item.phone)}
//                 className="mt-2 inline-flex items-center bg-emerald-600 text-white px-3 py-1 rounded-full text-sm hover:bg-emerald-700"
//               >
//                 <Phone size={16} className="mr-1" />
//                 Call Now
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FindBloodPage;


import React, { useState, useMemo,  useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Phone, Search } from "lucide-react";
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
  address: { place: string; pincode: number };
  lastDonationDate?: string | null;
  profileImage?: string;
}

const bloodGroups: (IBloodDonor["bloodGroup"] | "All")[] = [
  "All","O+","O-","A+","A-","B+","B-","AB+","AB-",
];

const calculateAge = (dob: string) => {
  const b = new Date(dob);
  const t = new Date();
  let age = t.getFullYear() - b.getFullYear();
  const m = t.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < b.getDate())) age--;
  return age;
};
const getInitial = (name: string) => (name?.trim()?.charAt(0) || "?").toUpperCase();

const FindBloodPage: React.FC = () => {
  const dispatch = useDispatch();
  const donors = useSelector((state: RootState) => state.bloodData) as IBloodDonor[];
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<IBloodDonor["bloodGroup"] | "All">("All");
  const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
  const [donor, setDonor] = useState<any>(null);

  const donorsWithId: IBloodDonor[] = (donors ?? []).map((d, index) => ({
    ...d,
    id: d.id || String(index),
  }));

  const fetchDonors = async () => {
    try {
      const res = await apiClient.get("/api/donors", { withCredentials: true });
      const list = res?.data?.donors ?? res?.data ?? [];      
      dispatch(setBloods(list));
    } catch (e) {
      console.error("Failed to fetch donors", e);
    }
  };

    useEffect(() => {
    const fetchUser = async () => {
      try {
        var _id = await localStorage.getItem("userId");
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
  }, [user?._id], );

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchDonors();
      setLoading(false);
    })();
  }, []);

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
      const matchesGroup = selectedGroup === "All" || d.bloodGroup === selectedGroup;
      return matchesSearch && matchesGroup;
    });
  }, [searchTerm, selectedGroup, donorsWithId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col">
      {/* Navbar + Header (replace with your own components if needed) */}
      <Navbar />
          <Header onBackClick={() => navigate("/")} title="Blood Services" />
      

      {/* Search Bar */}
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

      {/* Blood group chips - Hide scrollbar but keep functionality */}
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

      {/* CSS to hide scrollbar */}
      <style>
        {`
          .hide-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;  /* Chrome, Safari and Opera */
          }
        `}
      </style>
    </div>
  );
};

export default FindBloodPage;
