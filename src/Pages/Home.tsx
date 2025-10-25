import { useEffect, useState } from "react";
import Slider from "react-slick";
import {
  Ambulance,
  Building2,
  Droplet,
  Hospital,
  Stethoscope,
} from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from "../Components/Navbar";
import { Link } from "react-router-dom";
import { getCurrentLocation } from "../Components/getCurrentLocation";
import { apiClient } from "../Components/Axios";

const features = [
  { name: "Hospitals", icon: Hospital, href: "/services/hospitals/types" },
  { name: "Doctors", icon: Stethoscope, href: "/services/doctors" },
  { name: "Specialties", icon: Building2, href: "/services/specialties" },
  { name: "Ambulance", icon: Ambulance, href: "/services/ambulance" },
  { name: "Blood", icon: Droplet, href: "/services/blood-request" },
];

interface Ad {
  _id: string;
  title: string;
  imageUrl: string;
}

export default function HomePage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  const carouselSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const [lat, lng] = await getCurrentLocation();

        const res = await apiClient.get(
          `/api/ads/nearby?lat=${lat}&lng=${lng}`
        );
        console.log("Fetched ads:", res.data);
        setAds(res.data.data || res.data); // adapt depending on backend response
      } catch (err) {
        console.error("Error fetching ads:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [ads]);

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />

      <main className="px-0 md:px-4 py-6">
        {/* Ads Carousel */}
        <div className="w-full overflow-hidden mb-6 aspect-[16/9]">
          {loading ? (
            <p className="text-center text-green-800">Loading ads...</p>
          ) : ads.length === 0 ? (
            <p className="text-center text-green-800">No ads nearby.</p>
          ) : (
            <Slider {...carouselSettings}>
              {ads.map((ad, index) => (
                <div key={ad._id} className="relative w-full aspect-[16/9]">
                  <img
                    src={ad.imageUrl}
                    alt={ad.title || `Advertisement ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {ad.title && (
                    <div className="absolute bottom-2 left-2 bg-white bg-opacity-75 px-2 py-1 rounded text-sm font-semibold">
                      {ad.title}
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-white bg-opacity-75 px-2 py-1 rounded text-sm">
                    {index + 1} / {ads.length}
                  </div>
                </div>
              ))}
            </Slider>
          )}
        </div>

        {/* Our Services */}
        <h2 className="text-2xl font-bold text-green-800 mt-6 mb-4 px-4 md:px-0">
          Our Services
        </h2>

        <div className="flex flex-wrap justify-between mx-4 md:mx-0">
          {features.map((feature, index) => (
            <Link
              key={feature.name}
              to={feature.href}
              className={`
                bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300
                flex flex-col items-center justify-center mb-4
                ${
                  index === features.length - 1 && features.length % 2 !== 0
                    ? "w-full"
                    : "w-[calc(50%-0.5rem)]"
                }
              `}
            >
              <feature.icon className="h-8 w-8 text-green-600 mb-2" />
              <p className="text-sm font-semibold text-emerald-800 text-center">
                {feature.name}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
