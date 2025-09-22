// import React, { useState } from "react";
// import { Droplet, Check } from "lucide-react";
// import BloodGroupSelector, { BloodGroup, Donor } from "../Components/BloodGroupSelector";
// import { apiClient } from "../Components/Axios";


// const DonateBloodPage: React.FC = () => {
//   const [formSubmitted, setFormSubmitted] = useState(false);
//   const [formData, setFormData] = useState<Omit<Donor, "id" | "createdAt">>({
//     name: "",
//     email: "",
//     phone: "",
//     bloodGroup: "O+",
//     age: undefined,
//     address:{
//               place: "",
//               pincode: ""
//            }, 
//   lastDonationDate: "",
//     isAvailable: true,
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value, type } = e.target;
  
//     if (name === "city") {
//       setFormData((prev) => ({
//         ...prev,
//         address: {
//           ...prev.address,
//           place: value,
//         },
//       }));
//     } else if (name === "pincode") {
//       setFormData((prev) => ({
//         ...prev,
//         address: {
//           ...prev.address,
//           pincode: value,
//         },
//       }));
//     } else if (name === "age") {
//       setFormData((prev) => ({
//         ...prev,
//         age: Number(value),
//       }));
//     } else if (type === "checkbox") {
//       const checked = (e.target as HTMLInputElement).checked;
//       setFormData((prev) => ({ ...prev, [name]: checked }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };
  

//   const handleBloodGroupChange = (value: BloodGroup | "") => {
//     if (value) {
//       setFormData((prev) => ({ ...prev, bloodGroup: value }));
//     }
//   };

//   const handleSubmit =  async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Create new donor with timestamp
//     const newDonor: Donor = {
//       ...formData,
//       createdAt: new Date().toISOString(),
//     };

//     try {
//       const response = await apiClient.post('/api/donors', { newDonor });
    
//       alert(`Donor created successfully: ${response.data.message}`);
      
//     } catch (error: any) {
//       if (error.response) {
//         if (error.response.status === 409) {
//           alert(`Error: ${error.response.data.message}`);
//         } else {
//           alert(`Error: ${error.response.data.message || "Something went wrong"}`);
//         }
//       } else {
//         alert("Network Error. Please try again.");
//       }
//     }
    

//     // Show success message
//     setFormSubmitted(true);

//     // Reset form after 3 seconds
//     setTimeout(() => {
//       setFormSubmitted(false);
//       setFormData({
//         name: "",
//         email: "",
//         phone: "",
//         bloodGroup: "O+",
//         age: undefined,
//         lastDonationDate: "",
//         isAvailable: true,
//         address:{
//           place: "",
//           pincode: ""
//        }, 
//       });
//     }, 3000);
//   };




//   return (
//     <div className="min-h-screen bg-green-50">
//       <main className="container mx-auto px-4 py-6">
//         <div className="max-w-2xl mx-auto">
//           <div className="flex items-center justify-center mb-6">
//             <Droplet className="h-10 w-10 text-red-600 mr-3" />
//             <h1 className="text-3xl font-bold text-green-800">
//               Become a Blood Donor
//             </h1>
//           </div>

//           <div className="bg-white rounded-lg shadow-md p-6">
//             {formSubmitted ? (
//               <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
//                 <div className="bg-green-100 rounded-full p-3 mb-4">
//                   <Check className="h-10 w-10 text-green-600" />
//                 </div>
//                 <h2 className="text-2xl font-bold text-green-800 mb-2">
//                   Registration Successful!
//                 </h2>
//                 <p className="text-gray-600 mb-6">
//                   Thank you for registering as a blood donor. Your information
//                   has been saved.
//                 </p>
//                 <button
//                   onClick={() => setFormSubmitted(false)}
//                   className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition-colors duration-300"
//                 >
//                   Register Another Donor
//                 </button>
//               </div>
//             ) : (
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="bg-green-50 border-l-4 border-green-600 p-4 mb-6">
//                   <p className="text-green-800">
//                     By registering as a donor, you are helping save lives. Your
//                     information will be visible to those in need of blood
//                     donations.
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label
//                       htmlFor="name"
//                       className="block text-sm font-medium text-gray-700 mb-1"
//                     >
//                       Full Name
//                     </label>
//                     <input
//                       type="text"
//                       id="name"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleChange}
//                       required
//                       className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                     />
//                   </div>

//                   <div>
//                     <label
//                       htmlFor="email"
//                       className="block text-sm font-medium text-gray-700 mb-1"
//                     >
//                       Email Address
//                     </label>
//                     <input
//                       type="email"
//                       id="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       required
//                       className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                     />
//                   </div>

//                   <div>
//                     <label
//                       htmlFor="phone"
//                       className="block text-sm font-medium text-gray-700 mb-1"
//                     >
//                       Phone Number
//                     </label>
//                     <input
//                       type="tel"
//                       id="phone"
//                       name="phone"
//                       value={formData.phone}
//                       onChange={handleChange}
//                       required
//                       className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                     />
//                   </div>

//                   <div>
//                     <label
//                       htmlFor="bloodGroup"
//                       className="block text-sm font-medium text-gray-700 mb-1"
//                     >
//                       Blood Group
//                     </label>
//                     <BloodGroupSelector
//                       value={formData.bloodGroup}
//                       onChange={handleBloodGroupChange}
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label
//                       htmlFor="city"
//                       className="block text-sm font-medium text-gray-700 mb-1"
//                     >
//                       City
//                     </label>
//                     <input
//                       type="text"
//                       id="city"
//                       name="city"
//                       value={formData.address.place}
//                       onChange={handleChange}
//                       required
//                       className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                     />
//                   </div>

//                   <div>
//                     <label
//                       htmlFor="zipCode"
//                       className="block text-sm font-medium text-gray-700 mb-1"
//                     >
//                       Pin Code
//                     </label>
//                     <input
//                       type="text"
//                       id="pincode"
//                       name="pincode"
//                       value={formData.address.pincode}
//                       onChange={handleChange}
//                       required
//                       className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                     />
//                   </div>
//                   <div>
//                     <label
//                       htmlFor="state"
//                       className="block text-sm font-medium text-gray-700 mb-1"
//                     >
//                       age
//                     </label>
//                     <input
//                       type="number"
//                       id="age"
//                       name="age"
//                       value={formData.age}
//                       onChange={handleChange}
//                       required
//                       className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                     />
//                   </div>


//                   <div>
//                     <label
//                       htmlFor="lastDonation"
//                       className="block text-sm font-medium text-gray-700 mb-1"
//                     >
//                       Last Donation Date (if any)
//                     </label>
//                     <input
//                       type="date"
//                       id="lastDonationDate"
//                       name="lastDonationDate"
//                       value={formData.lastDonationDate}
//                       onChange={handleChange}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                     />
//                   </div>

//                   <div className="md:col-span-2">
//                     <div className="flex items-center">
//                       <input
//                         type="checkbox"
//                         id="isAvailable"
//                         name="isAvailable"
//                         checked={formData.isAvailable}
//                         onChange={(e) =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             isAvailable: e.target.checked,
//                           }))
//                         }
//                         className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
//                       />
//                       <label
//                         htmlFor="isAvailable"
//                         className="ml-2 block text-sm text-gray-700"
//                       >
//                         I am available to donate blood when needed
//                       </label>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="pt-4">
//                   <button
//                     type="submit"
//                     className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors duration-300 flex items-center justify-center"
//                   >
//                     <Droplet className="h-5 w-5 mr-2" />
//                     Register as Donor
//                   </button>
//                 </div>
//               </form>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default DonateBloodPage;


import { useEffect, useState } from "react";
import { Phone, Calendar, MapPin, Droplet, Hash } from "lucide-react";
import { apiClient } from "../Components/Axios";
import { errorToast, successToast } from "../Components/Toastify";
import { useDispatch } from "react-redux";
import { addBlood } from "../Redux/BloodData";
import { useNavigate } from "react-router-dom";

type BloodGroup = "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-" | "";
interface FormData {
  phone: string;
  dateOfBirth: string;
  bloodGroup: BloodGroup;
  place: string;
  pincode: string;
  lastDonationDate: string;
}

const BLOOD_GROUPS: Exclude<BloodGroup, "">[] = [
  "A+","A-","B+","B-","O+","O-","AB+","AB-",
];

const DonateBloodPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [user, setUser] = useState<any>(null);
const [formData, setFormData] = useState<FormData>({
  phone: "",
  dateOfBirth: "",
  bloodGroup: "",
  place: "",
  pincode: "",
  lastDonationDate: "",
});

useEffect(() => {
  const fetchUser = async () => {
    try {
      const _id = localStorage.getItem("userId");
      if (!_id) return;

      const result = await apiClient.get(`/api/users/${_id}`);
      const fetchedUser = result.data.data;
      setUser(fetchedUser);

      // update formData now that we have the user
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

  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.phone) e.phone = "Phone is required";
    else if (!/^\d{10}$/.test(formData.phone))
      e.phone = "Phone must be exactly 10 digits";
    if (!formData.dateOfBirth) e.dateOfBirth = "Date of birth is required";
    if (!formData.bloodGroup) e.bloodGroup = "Blood group is required";
    if (!formData.place) e.place = "Place is required";
    if (!formData.pincode) e.pincode = "Pincode is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      const payload = {
        phone: formData.phone.startsWith("0")
          ? formData.phone.slice(1)
          : formData.phone,
        dateOfBirth: formData.dateOfBirth,
        bloodGroup: formData.bloodGroup,
        address: { place: formData.place, pincode: Number(formData.pincode) },
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

        {/* Blood Group */}
        <div className="mb-4">
          <label className="flex items-center border border-emerald-300 rounded bg-emerald-50 px-3 py-2">
            <Droplet size={18} className="text-emerald-600 mr-2" />
            <select
              className="flex-1 bg-transparent outline-none text-emerald-800"
              value={formData.bloodGroup}
              onChange={(e) => handleChange("bloodGroup", e.target.value as BloodGroup)}
            >
              <option value="">Select Blood Group</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </label>
          {errors.bloodGroup && (
            <p className="text-red-600 text-sm mt-1">{errors.bloodGroup}</p>
          )}
        </div>

        {/* Place */}
        <div className="mb-4">
          <label className="flex items-center border border-emerald-300 rounded bg-emerald-50 px-3 py-2">
            <MapPin size={18} className="text-emerald-600 mr-2" />
            <input
              className="flex-1 bg-transparent outline-none text-emerald-800"
              placeholder="Place"
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
    </div>
  );
};

export default DonateBloodPage;
