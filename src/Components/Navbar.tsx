// import { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { UserCircle, ChevronDown, LogOut, Menu, X } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../Redux/Store";
// import { logoutUser } from "../Redux/userData";
// import { apiClient } from "./Axios";

// // Define types for props where necessary
// type DropdownProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   children: React.ReactNode;
// };

// type MobileMenuProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   children: React.ReactNode;
// };

// type NavItemProps = {
//   to: string;
//   children: React.ReactNode;
//   isActive?: boolean;
//   onClick?: () => void;
// };

// // Dropdown component
// const Dropdown = ({ isOpen, onClose, children }: DropdownProps) => {
//   if (!isOpen) return null;
//   return (
//     <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
//       <div
//         className="py-1"
//         role="menu"
//         aria-orientation="vertical"
//         aria-labelledby="options-menu"
//         onClick={onClose} // Close dropdown when clicking outside
//       >
//         {children}
//       </div>
//     </div>
//   );
// };

// // MobileMenu component
// const MobileMenu = ({ isOpen, onClose, children }: MobileMenuProps) => {
//   if (!isOpen) return null;
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
//       <div className="fixed right-0 top-0 h-fit w-fit bg-green-600 text-white shadow-lg p-4 px-10 rounded-bl-md">
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//         >
//           <X className="h-6 w-6" />
//         </button>
//         <div className="mt-6">{children}</div>
//       </div>
//     </div>
//   );
// };

// // NavItem component
// const NavItem = ({ to, children, isActive, onClick }: NavItemProps) => (
//   <Link
//     to={to}
//     className={`block py-2 hover:text-green-200 transition-colors ${
//       isActive ? "font-bold text-green-950" : ""
//     }`}
//     onClick={onClick}
//   >
//     {children}
//   </Link>
// );

// // Main Navbar component
// export default function Navbar() {
//   const { name, _id } = useSelector((state: RootState) => state.userLogin);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const { pathname } = useLocation();
//   const dispatch = useDispatch();

//   const navItems = [
//     { name: "Home", path: "/" },
//     { name: "About", path: "/about" },
//     { name: "Contact", path: "/contact" },
//   ];

//   const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
//   const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

//   const handleLogout = async () => {
//     try {
//       await apiClient.get("/api/logout", { withCredentials: true });
//       localStorage.removeItem("accessToken");
//       dispatch(logoutUser());
//       setIsDropdownOpen(false);
//       setIsMobileMenuOpen(false);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <nav className="bg-green-600 text-white p-4 shadow-md">
//       <div className="container mx-auto">
//         <div className="flex justify-between items-center">
//           <Link to="/">
//             <h1 className="text-2xl font-bold">Hosta</h1>
//           </Link>
//           <div className="hidden md:flex space-x-4 items-center">
//             {navItems.map((item) => (
//               <NavItem
//                 key={item.name}
//                 to={item.path}
//                 isActive={pathname === item.path}
//               >
//                 {item.name}
//               </NavItem>
//             ))}
//             {_id ? (
//               <div className="relative">
//                 <button
//                   onClick={toggleDropdown}
//                   className="flex items-center space-x-2 hover:text-green-200 focus:outline-none"
//                 >
//                   <UserCircle className="h-5 w-5" />
//                   <span className="truncate max-w-[100px]">{name}</span>
//                   <ChevronDown className="h-4 w-4" />
//                 </button>
//                 <Dropdown
//                   isOpen={isDropdownOpen}
//                   onClose={() => setIsDropdownOpen(false)}
//                 >
//                   <button
//                     onClick={handleLogout}
//                     className="flex items-center w-full px-4 py-2 text-sm text-left text-red-700 hover:bg-red-100 hover:text-red-900"
//                     role="menuitem"
//                   >
//                     <LogOut className="mr-2 h-4 w-4" /> Logout
//                   </button>
//                 </Dropdown>
//               </div>
//             ) : (
//               <NavItem to="/login">Login</NavItem>
//             )}
//           </div>
//           <button
//             className="md:hidden focus:outline-none"
//             onClick={toggleMobileMenu}
//             aria-label="Toggle mobile menu"
//           >
//             <Menu className="h-6 w-6" />
//           </button>
//         </div>
//         <MobileMenu
//           isOpen={isMobileMenuOpen}
//           onClose={() => setIsMobileMenuOpen(false)}
//         >
//           {navItems.map((item) => (
//             <NavItem
//               key={item.name}
//               to={item.path}
//               isActive={pathname === item.path}
//               onClick={() => setIsMobileMenuOpen(false)}
//             >
//               {item.name}
//             </NavItem>
//           ))}
//           {_id ? (
//             <div className="py-2">
//               <div className="flex items-center space-x-2 mb-2">
//                 <UserCircle className="h-5 w-5" />
//                 <span className="truncate max-w-[200px]">{name}</span>
//               </div>
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center text-red-700 hover:text-red-900"
//               >
//                 <LogOut className="mr-2 h-4 w-4" /> Logout
//               </button>
//             </div>
//           ) : (
//             <NavItem to="/login" onClick={() => setIsMobileMenuOpen(false)}>
//               Login
//             </NavItem>
//           )}
//         </MobileMenu>
//       </div>
//     </nav>
//   );
// }


// src/components/Navbar.tsx

import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiClient } from "../Components/Axios";


type NavItemProps = {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
};

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const NavItem: React.FC<NavItemProps> = ({ to, children, onClick, isActive }) => {
  const navigate = useNavigate();
  const handlePress = () => {
    onClick?.();
    navigate(to);
  };

  return (
    <button
      onClick={handlePress}
      className={`px-4 py-2 rounded-lg m-2 shadow 
        ${isActive ? "bg-green-600 text-white font-bold" : "bg-white text-green-800 font-semibold"}`}
    >
      {children}
    </button>
  );
};

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-green-50 p-4">
      <button className="self-end mb-4" onClick={onClose}>
        <X size={24} color="#2F855A" />
      </button>
      {children}
    </div>
  );
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const handleLogout = async () => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      setUser(null);
      setIsMobileMenuOpen(false);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

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

  const getInitial = (name: string) => name?.charAt(0)?.toUpperCase() || "";

  return (
    <nav className="bg-green-600 p-10 flex justify-between items-center">
      <h1 className="text-white font-bold text-xl">Hosta</h1>
      {/* Desktop links */}
      <div className="hidden md:flex items-center">
        {navItems.map(item => (
          <NavItem
            key={item.name}
            to={item.path}
            isActive={location.pathname === item.path}
          >
            {item.name}
          </NavItem>
        ))}
        {user?._id ? (
          <NavItem to="/home" onClick={handleLogout}>
            <span className="text-red-600">Logout</span>
          </NavItem>
        ) : (
          <NavItem to="/login">Login</NavItem>
        )}
      </div>

      {/* Mobile menu button */}
      <button className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
        <Menu size={24} color="white" />
      </button>

      {/* Mobile slide menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
        {user?._id && (
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              navigate("/settings");
            }}
            className="flex justify-center mb-4"
          >
            <div className="w-24 h-24 rounded-full bg-green-300 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {getInitial(user.name)}
              </span>
            </div>
          </button>
        )}
        {navItems.map(item => (
          <NavItem
            key={item.name}
            to={item.path}
            isActive={location.pathname === item.path}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {item.name}
          </NavItem>
        ))}
        {user?._id ? (
          <NavItem to="/" onClick={handleLogout}>
            <span className="text-red-600">Logout</span>
          </NavItem>
        ) : (
          <NavItem to="/login" onClick={() => setIsMobileMenuOpen(false)}>
            Login
          </NavItem>
        )}
      </MobileMenu>
    </nav>
  );
}
