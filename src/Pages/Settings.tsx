// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "../Redux/Store";
// // import { updateUserData } from "../Redux/UserData";
// import { errorToast, successToast } from "../Components/Toastify";
// // import { getInitial } from "./Blood";
// import { Delete, Edit2 } from "lucide-react";
// import { apiClient } from "../Components/Axios";
// import { updateUserData } from "../Redux/userData";


// export default function Profile() {
//   const [isEditing, setIsEditing] = useState(false);
//   const [editableData, setEditableData] = useState<any>({});
//   const [donor, setDonor] = useState<any>(null);
//   const dispatch = useDispatch();
//   const [user, setUser] = useState<any>(null);

//   const handleSave = async () => {
//     try {
//       const name = editableData?.name;

//       const result = await apiClient.put(
//         `/api/users/${user?._id}`,
//         { name },
//         {
//           withCredentials: true,
//         }
//       );

//       successToast("Profile updated successfully");
//       dispatch(updateUserData(result.data.user));
//       setUser(result.data.user);
//       setIsEditing(false);
//     } catch (err: any) {
//       errorToast(err.response?.data?.message || "Profile update failed");
//     }
//   };

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const _id = await localStorage.getItem("userId");
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
//   }, [user?._id]);

//   const handleDelete = async (id: any) => {
//     try {
//       await apiClient.delete(`/api/donors/${id}`);
//       setDonor(null);
//       successToast("Donor deleted successfully");
//     } catch (error) {
//       console.error("Failed to delete donor", error);
//     }
//   };

//     const getInitial = (name: string) => name?.charAt(0)?.toUpperCase() || "";


//   return (
//     <div className="min-h-screen bg-green-50 py-10 px-4">
//       <div className="max-w-md mx-auto">
//         {/* Profile Image */}
//         <div className="relative flex justify-center mb-5">
//           <div className="w-24 h-24 rounded-full bg-green-300 flex items-center justify-center">
//             <span className="text-white font-bold text-2xl">
//               {getInitial(user?.name as string)}
//             </span>
//           </div>
//         </div>

//         {/* Info Section */}
//         <div className="bg-white rounded-xl shadow-md p-6 mb-5 relative">
//           {!isEditing && (
//             <button 
//               className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md"
//               onClick={() => setIsEditing(true)}
//             >
//               <Edit2 size={20} color="#007bff" />
//             </button>
//           )}

//           {/* Name */}
//           {isEditing ? (
//             <input
//               className="w-full p-3 border border-gray-300 rounded-lg mb-3"
//               value={editableData?.name || ""}
//               onChange={(e) =>
//                 setEditableData({ ...editableData, name: e.target.value })
//               }
//             />
//           ) : (
//             <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
//               {user?.name}
//             </h2>
//           )}

//           {/* Email & Phone (read-only) */}
//           <p className="text-gray-600 mb-1 text-center">{user?.email}</p>
//           <p className="text-gray-600 mb-1 text-center">{user?.phone}</p>
//         </div>

//         {/* Save Button */}
//         {isEditing && (
//           <div className="flex justify-center mb-5">
//             <button 
//               className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
//               onClick={handleSave}
//             >
//               Save
//             </button>
//           </div>
//         )}

//         {donor && (
//           <div className="bg-white rounded-xl shadow-md p-6 relative">
//             <button 
//               className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md"
//               onClick={() => handleDelete(donor._id)}
//             >
//               <Delete size={20} color="#007bff" />
//             </button>

//             <h3 className="text-xl font-bold text-gray-800 mb-4">Blood Information</h3>

//             <div className="space-y-3">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Blood Group:</span>
//                 <span className="font-semibold text-gray-800">{donor?.bloodGroup}</span>
//               </div>

//               <div className="flex justify-between">
//                 <span className="text-gray-600">Born:</span>
//                 <span className="font-semibold text-gray-800">
//                   {donor?.dateOfBirth
//                     ? new Date(donor.dateOfBirth).toLocaleDateString("en-GB", {
//                         day: "2-digit",
//                         month: "short",
//                         year: "numeric",
//                       })
//                     : ""}
//                 </span>
//               </div>

//               <div className="flex justify-between">
//                 <span className="text-gray-600">Place:</span>
//                 <span className="font-semibold text-gray-800">{donor?.address.place}</span>
//               </div>

//               <div className="flex justify-between">
//                 <span className="text-gray-600">Pin code:</span>
//                 <span className="font-semibold text-gray-800">{donor?.address.pincode}</span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import  { useEffect, useState } from "react";
import {  useDispatch } from "react-redux";
import { errorToast, successToast } from "../Components/Toastify";
import { ArrowLeft, Delete, Edit2 } from "lucide-react";
import { apiClient } from "../Components/Axios";
import { updateUserData } from "../Redux/userData";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState<{ name: string }>({ name: "" });
  const [donor, setDonor] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  /** Save edited name */
  const handleSave = async () => {
    try {
      const name = editableData.name.trim();
      if (!name) {
        errorToast("Name cannot be empty");
        return;
      }

      const result = await apiClient.put(
        `/api/users/${user?._id}`,
        { name },
        { withCredentials: true }
      );

      successToast("Profile updated successfully");
      dispatch(updateUserData(result.data.user));
      setUser(result.data.user);
      setIsEditing(false);
    } catch (err: any) {
      errorToast(err.response?.data?.message || "Profile update failed");
    }
  };

  /** Fetch logged-in user */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const _id = localStorage.getItem("userId");
        if (!_id) return;
        const result = await apiClient.get(`/api/users/${_id}`);
        setUser(result.data.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchUser();
  }, []);

  /** Fetch donor info for this user */
  useEffect(() => {
    if (!user?._id) return;
    const fetchDonor = async () => {
      try {
        const result = await apiClient.get(`/api/donors/users/${user._id}`);
        setDonor(result.data);
      } catch {
        // silently ignore if no donor record
      }
    };
    fetchDonor();
  }, [user?._id]);

  /** Delete donor record */
  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/api/donors/${id}`);
      setDonor(null);
      successToast("Donor deleted successfully");
    } catch (error) {
      console.error("Failed to delete donor", error);
    }
  };

  const getInitial = (name: string) => name?.charAt(0)?.toUpperCase() || "";

  return (
    <div className="min-h-screen bg-green-50 py-10 px-4">
               <button
      onClick={() => navigate(-1)}
      className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
      aria-label="Go back"
    >
      <ArrowLeft className="h-6 w-6" />
    </button>
      <div className="max-w-md mx-auto">
        {/* Profile Avatar */}
        <div className="relative flex justify-center mb-5">
          <div className="w-24 h-24 rounded-full bg-green-300 flex items-center justify-center">
            <span className="text-white font-bold text-2xl">
              {getInitial(user?.name as string)}
            </span>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-5 relative">
          {!isEditing && (
            <button
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md"
              onClick={() => {
                // Prefill editableData so input shows current name
                setEditableData({ name: user?.name || "" });
                setIsEditing(true);
              }}
            >
              <Edit2 size={20} color="#007bff" />
            </button>
          )}

          {isEditing ? (
            <input
              className="w-full p-3 border border-gray-300 rounded-lg mb-3"
              value={editableData.name}
              onChange={(e) => setEditableData({ name: e.target.value })}
            />
          ) : (
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              {user?.name}
            </h2>
          )}

          <p className="text-gray-600 mb-1 text-center">{user?.email}</p>
          <p className="text-gray-600 mb-1 text-center">{user?.phone}</p>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="flex justify-center mb-5">
            <button
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        )}

        {/* Donor Info */}
        {donor && (
          <div className="bg-white rounded-xl shadow-md p-6 relative">
            <button
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md"
              onClick={() => handleDelete(donor._id)}
            >
              <Delete size={20} color="#007bff" />
            </button>

            <h3 className="text-xl font-bold text-gray-800 mb-4">Blood Information</h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Blood Group:</span>
                <span className="font-semibold text-gray-800">{donor?.bloodGroup}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Born:</span>
                <span className="font-semibold text-gray-800">
                  {donor?.dateOfBirth
                    ? new Date(donor.dateOfBirth).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : ""}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Place:</span>
                <span className="font-semibold text-gray-800">{donor?.address.place}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Pin code:</span>
                <span className="font-semibold text-gray-800">{donor?.address.pincode}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
