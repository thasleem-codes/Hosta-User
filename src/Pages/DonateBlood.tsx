import React, { useState } from "react";
import { Droplet, Check } from "lucide-react";
import BloodGroupSelector, { BloodGroup, Donor } from "../Components/BloodGroupSelector";
import { apiClient } from "../Components/Axios";


const DonateBloodPage: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState<Omit<Donor, "id" | "createdAt">>({
    name: "",
    email: "",
    phone: "",
    bloodGroup: "O+",
    age: undefined,
    address:{
              place: "",
              pincode: ""
           }, 
  lastDonationDate: "",
    isAvailable: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
  
    if (name === "city") {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          place: value,
        },
      }));
    } else if (name === "pincode") {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          pincode: value,
        },
      }));
    } else if (name === "age") {
      setFormData((prev) => ({
        ...prev,
        age: Number(value),
      }));
    } else if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  

  const handleBloodGroupChange = (value: BloodGroup | "") => {
    if (value) {
      setFormData((prev) => ({ ...prev, bloodGroup: value }));
    }
  };

  const handleSubmit =  async (e: React.FormEvent) => {
    e.preventDefault();

    // Create new donor with timestamp
    const newDonor: Donor = {
      ...formData,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await apiClient.post('/api/donors', { newDonor });
    
      alert(`Donor created successfully: ${response.data.message}`);
      
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 409) {
          alert(`Error: ${error.response.data.message}`);
        } else {
          alert(`Error: ${error.response.data.message || "Something went wrong"}`);
        }
      } else {
        alert("Network Error. Please try again.");
      }
    }
    

    // Show success message
    setFormSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        bloodGroup: "O+",
        age: undefined,
        lastDonationDate: "",
        isAvailable: true,
        address:{
          place: "",
          pincode: ""
       }, 
      });
    }, 3000);
  };




  return (
    <div className="min-h-screen bg-green-50">
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Droplet className="h-10 w-10 text-red-600 mr-3" />
            <h1 className="text-3xl font-bold text-green-800">
              Become a Blood Donor
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            {formSubmitted ? (
              <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
                <div className="bg-green-100 rounded-full p-3 mb-4">
                  <Check className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-800 mb-2">
                  Registration Successful!
                </h2>
                <p className="text-gray-600 mb-6">
                  Thank you for registering as a blood donor. Your information
                  has been saved.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition-colors duration-300"
                >
                  Register Another Donor
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-green-50 border-l-4 border-green-600 p-4 mb-6">
                  <p className="text-green-800">
                    By registering as a donor, you are helping save lives. Your
                    information will be visible to those in need of blood
                    donations.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="bloodGroup"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Blood Group
                    </label>
                    <BloodGroupSelector
                      value={formData.bloodGroup}
                      onChange={handleBloodGroupChange}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.address.place}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="zipCode"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Pin Code
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={formData.address.pincode}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      age
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>


                  <div>
                    <label
                      htmlFor="lastDonation"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Last Donation Date (if any)
                    </label>
                    <input
                      type="date"
                      id="lastDonationDate"
                      name="lastDonationDate"
                      value={formData.lastDonationDate}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isAvailable"
                        name="isAvailable"
                        checked={formData.isAvailable}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            isAvailable: e.target.checked,
                          }))
                        }
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="isAvailable"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        I am available to donate blood when needed
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors duration-300 flex items-center justify-center"
                  >
                    <Droplet className="h-5 w-5 mr-2" />
                    Register as Donor
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DonateBloodPage;
