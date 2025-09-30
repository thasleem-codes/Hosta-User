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

const features = [
  { name: "Hospitals", icon: Hospital, href: "/services/hospitals/types" },
  { name: "Doctors", icon: Stethoscope, href: "/services/doctors" },
  { name: "Specialties", icon: Building2, href: "/services/specialties" },
  { name: "Ambulance", icon: Ambulance, href: "/services/ambulance" },
  { name: "Blood", icon: Droplet, href: "/services/blood-request" },
];

const adImages = [
  "https://res.cloudinary.com/dupevol0e/image/upload/v1759230219/Hosta1_kuzzwl.jpg",
  "https://res.cloudinary.com/dupevol0e/image/upload/v1759230007/alabeer_y1h4wc.jpg",
  "https://res.cloudinary.com/dupevol0e/image/upload/v1759230008/hosta_2_shkdve.png",
];

export default function HomePage() {
  const carouselSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
  };

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />

      <main className="px-0 md:px-4 py-6">
        {/* Full-width Carousel */}
        <div className="w-full overflow-hidden">
          <Slider {...carouselSettings}>
            {adImages.map((src, index) => (
              <div key={index} className="relative w-full aspect-[16/9]">
                <img
                  src={src}
                  alt={`Advertisement ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-white bg-opacity-75 px-2 py-1 rounded text-sm">
                  {index + 1} / {adImages.length}
                </div>
              </div>
            ))}
          </Slider>
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
