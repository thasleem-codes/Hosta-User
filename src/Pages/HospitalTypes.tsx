import React from "react";
import { Header } from "../Components/Common";
import { Link, useNavigate } from "react-router-dom";

interface HospitalType {
  title: string;
  image: string;
}

const HospitalTypeCard: React.FC<HospitalType> = ({ title, image }) => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
    <div className="p-3 flex flex-col items-center justify-center">
      <div className="w-20 h-20 sm:w-24 sm:h-24 mb-2">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover rounded-full border border-green-200"
        />
      </div>
      <span className="text-sm sm:text-base font-medium text-green-800 text-center">
        {title}
      </span>
    </div>
  </div>
);

const HospitalTypeCards: React.FC = () => {
  const navigate = useNavigate();

  const hospitalTypes: HospitalType[] = [
    {
      title: "Allopathy",
      image:
        "https://res.cloudinary.com/dupevol0e/image/upload/v1759075523/Allopathy_ybcnoz.jpg",
    },
    {
      title: "Homeopathy",
      image:
        "https://res.cloudinary.com/dupevol0e/image/upload/v1759075524/Homeopathy_iqjctu.jpg",
    },
    {
      title: "Ayurveda",
      image:
        "https://res.cloudinary.com/dupevol0e/image/upload/v1759075523/Ayurveda_wu9ia9.jpg",
    },
    {
      title: "Unani",
      image:
        "https://res.cloudinary.com/dupevol0e/image/upload/v1759075524/Unani_exl5fx.jpg",
    },
    {
      title: "Acupuncture",
      image:
        "https://res.cloudinary.com/dupevol0e/image/upload/v1759075523/Acupunture_ajxuvc.jpg",
    },

    {
      title: "De-addiction",
      image:
        "https://res.cloudinary.com/dupevol0e/image/upload/v1759075523/Deaddiction_iiaqml.jpg",
    },
    {
      title: "Mental Health",
      image:
        "https://res.cloudinary.com/dupevol0e/image/upload/v1759075524/mental_health_cjcvop.jpg",
    },
    {
      title: "Laboratory",
      image:
        "https://res.cloudinary.com/dupevol0e/image/upload/v1759075524/Lab_kuj0ha.jpg",
    },
    {
      title: "Eye Care",
      image:
        "https://res.cloudinary.com/dupevol0e/image/upload/v1759075524/Eye_wyynmz.jpg",
    },
    {
      title: "Physiotherapy",
      image:
        "https://res.cloudinary.com/dupevol0e/image/upload/v1759075524/Physiotherapy_i6ezv8.jpg",
    },
    {
      title: "Other",
      image:
        "https://res.cloudinary.com/dupevol0e/image/upload/v1759075524/Others_wf9afk.jpg",
    },
  ];

  return (
    <div className="bg-green-50 min-h-screen py-4 px-3 sm:py-6 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <Header onBackClick={() => navigate("/")} title="Hospital Types" />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 sm:gap-5 mt-4">
          {hospitalTypes.map((type, index) => (
            <Link
              to={`/services/hospitals?type=${type.title}/id`}
              key={index}
              className="block"
            >
              <HospitalTypeCard title={type.title} image={type.image} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HospitalTypeCards;
