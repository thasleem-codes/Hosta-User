import React from "react";

export type BloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";

  export interface Donor {
    name: string;
    email: string;
    phone: string;
    bloodGroup: BloodGroup;
    age: number | undefined;
    address:{
      place: string,
      pincode: string
   }, 
   lastDonationDate: string;
    isAvailable: boolean;
    createdAt: string;
  }
  

interface BloodGroupSelectorProps {
  value: BloodGroup | "";
  onChange: (value: BloodGroup | "") => void;
  required?: boolean;
  className?: string;
  includeEmpty?: boolean;
}

const BloodGroupSelector: React.FC<BloodGroupSelectorProps> = ({
  value,
  onChange,
  required = false,
  className = "",
  includeEmpty = false,
}) => {
  const bloodGroups: BloodGroup[] = [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value as BloodGroup | "";
    onChange(newValue);
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      required={required}
      className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
    >
      {includeEmpty && <option value="">All Blood Groups</option>}
      {bloodGroups.map((group) => (
        <option key={group} value={group}>
          {group}
        </option>
      ))}
    </select>
  );
};

export default BloodGroupSelector;
