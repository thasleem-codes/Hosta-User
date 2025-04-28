import React from "react";
import { Phone, Mail, MapPin, Calendar, Droplet } from "lucide-react";
import { BloodGroup, Donor } from "./BloodGroupSelector";

interface DonorCardProps {
  donor: Donor;
}

export interface SearchParams {
  bloodGroup: BloodGroup | "";
  location: string;
}

const DonorCard: React.FC<DonorCardProps> = ({ donor }) => {
  const getLastDonationText = () => {
    const lastDonation = new Date(donor.lastDonationDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastDonation.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 90) {
      return "Eligible to donate";
    } else {
      return `Last donated ${diffDays} days ago`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">{donor.name}</h3>
        <div className="flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full">
          <Droplet className="h-4 w-4 mr-1" />
          <span className="font-medium">{donor.bloodGroup}</span>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <Phone className="h-4 w-4 text-green-600 mr-2" />
          <span>{donor.phone}</span>
        </div>

        <div className="flex items-center">
          <Mail className="h-4 w-4 text-green-600 mr-2" />
          <span>{donor.email}</span>
        </div>

        <div className="flex items-start">
          <MapPin className="h-4 w-4 text-green-600 mr-2 mt-1" />
          <span>
             {donor.address.place} {donor.address.pincode}
          </span>
        </div>

        <div className="flex items-center">
          <Calendar className="h-4 w-4 text-green-600 mr-2" />
          <span>{getLastDonationText()}</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100">
        <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-300 flex items-center justify-center">
          <Phone className="h-4 w-4 mr-2" />
          Contact Donor
        </button>
      </div>
    </div>
  );
};

export default DonorCard;
