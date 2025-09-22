import Slider from "react-slick";
import {
  // UserRound,
  // Search,
    Ambulance,
  Building2,
  Droplet,
  Hospital,
  Stethoscope
} from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from "../Components/Navbar";
import { Link } from "react-router-dom";

const features = [
  { name: "Hospitals", icon: Hospital,  href: "/services/hospitals/types" },
  { name: "Doctors", icon: Stethoscope,  href:  "/services/doctors" },
  { name: "Specialties", icon: Building2,  href:  "/services/specialties"},
  { name: "Ambulance", icon: Ambulance,  href:"/services/ambulance" },
  { name: "Blood", icon: Droplet,  href:  "/services/blood-request" },
];

// const features = [
//   { name: "Hospitals", icon: Hospital, href: "/services/hospitals/types" },
//   { name: "Doctors", icon: UserRound, href: "/services/doctors" },
//   { name: "Specialties", icon: Building2, href: "/services/specialties" },
//   { name: "Ambulance", icon: Ambulance, href: "/services/ambulance" },
//   { name: "Donate Blood", icon: Droplet, href: "/services/blood-donation" },
//   { name: "Find Blood", icon: Search, href: "/services/blood-request" },
// ];


const adImages = [
  "https://img.freepik.com/free-vector/flat-design-medical-facebook-ad_23-2149091913.jpg",
  "https://img.freepik.com/free-vector/flat-design-medical-facebook-ad_23-2149091912.jpg",
  "https://mangalprabhu.com/wp-content/uploads/2024/03/Pregnancy-Offer.jpg",
  "https://dcassetcdn.com/design_img/3242090/43775/43775_17860005_3242090_1b999885_image.jpg",
];

export default function HomePage() {

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6 bg-white rounded-lg shadow-md overflow-hidden">
          <Slider {...carouselSettings}>
            {adImages.map((src, index) => (
              <div key={index} className="relative aspect-[16/9]">
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

        <h2 className="text-2xl font-bold text-green-800 mb-4">Our Services</h2>

        {/* <div className={"grid grid-cols-2 gap-4"}>
          {features.map((feature) => (
            <Link key={feature.name} to={feature.href}>
              <div className={` bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center justify-center h-32`}>
                <feature.icon className="h-8 w-8 text-green-600 mb-2" />
                <h3 className="text-sm font-semibold text-green-800 text-center">
                  {feature.name}
                </h3>
              </div>
            </Link>
          ))}
        </div> */}

           <div className="flex flex-wrap justify-between mx-4">
        {features.map((feature, index) => (
          <Link
            key={feature.name}
            to={feature.href}
            className={`
              bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300
              flex flex-col items-center justify-center mb-4
              ${index === features.length - 1 && features.length % 2 !== 0
                ? "w-full"       // full width for the last card if odd
                : "w-[calc(50%-0.5rem)]"} // half width (gap is ~0.5rem each side)
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


