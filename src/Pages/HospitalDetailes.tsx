import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/Store";
// import { Hospital } from "../Redux/HospitalsData";
import {
  Info,
  Specialties,
  WorkingHours,
  ReviewComponent,
} from "../Components/HospitalDetailesComponents";
import Map from "../Components/Map";
import { ArrowLeft } from "lucide-react";

const HospitalDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hospitals } = useSelector((state: RootState) => state.hospitalData);

  const [activeTab, setActiveTab] = useState("info");
  const hospital = hospitals.find((h) => h._id === id);

  if (!hospital) {
    return (
      <div className="min-h-screen flex items-center justify-center text-green-600 font-semibold">
        Hospital not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Hospital Image */}
      <div className="relative w-full h-64 sm:h-96">
        <img
          src={hospital.image?.imageUrl || ""}
          alt={hospital.name}
          className="w-full h-full object-contain bg-green-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <h1 className="absolute bottom-4 left-4 text-xl sm:text-3xl md:text-4xl font-bold text-white">
          {hospital.name}
        </h1>
        <button
          onClick={() =>
            navigate(`/services/hospitals?type=${hospital.type}`)
          }
          className="absolute top-4 left-4 bg-white bg-opacity-75 p-2 rounded-full hover:bg-opacity-100 transition-all"
        >
          <ArrowLeft className="h-6 w-6 text-green-600" />
        </button>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="flex overflow-x-auto mb-4 border-b border-green-200">
          {[
            { label: "Information", key: "info" },
            { label: "Specialties", key: "specialties" },
            { label: "Hours", key: "hours" },
            { label: "Location", key: "location" },
            { label: "Reviews", key: "reviews" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap px-4 py-2 font-medium ${
                activeTab === tab.key
                  ? "border-b-2 border-green-600 text-green-800"
                  : "text-green-600 hover:text-green-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === "info" && <Info hospital={hospital} />}
          {activeTab === "specialties" && <Specialties hospital={hospital} />}
          {activeTab === "hours" && <WorkingHours hospital={hospital} />}
          {activeTab === "location" && <Map hospital={hospital} />}
          {activeTab === "reviews" && <ReviewComponent hospital={hospital} />}
        </div>
      </div>
    </div>
  );
};

export default HospitalDetails;
