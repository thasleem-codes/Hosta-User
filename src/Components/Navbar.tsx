import React, { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../Redux/userData";

type NavItemProps = {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
};

const NavItem: React.FC<NavItemProps> = ({
  to,
  children,
  onClick,
  isActive,
}) => {
  const navigate = useNavigate();
  const handlePress = () => {
    onClick?.();
    navigate(to);
  };

  return (
    <button
      onClick={handlePress}
      className={`w-full text-left px-4 py-3 rounded-xl mb-2 transition
        ${
          isActive
            ? "bg-green-600 text-white font-semibold"
            : "bg-white text-green-700 hover:bg-green-100"
        }
      `}
    >
      {children}
    </button>
  );
};

const MobileMenu = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/40">
      <div className="absolute bottom-0 left-0 w-full bg-green-50 rounded-t-2xl p-6 shadow-xl">
        {/* Close button aligned right */}
        <div className="flex justify-end mb-4">
          <button onClick={onClose}>
            <X size={28} className="text-green-800" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

interface NavbarProps {
  onHeightChange?: (height: number) => void;
}

export default function Navbar({ onHeightChange }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();

  const user = useSelector((state: any) => state.userLogin);

  const navbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (navbarRef.current && onHeightChange) {
      const handleResize = () => {
        onHeightChange(navbarRef.current!.offsetHeight);
      };

      handleResize(); // initial height
      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }
  }, [onHeightChange]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const handleLogout = async () => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      dispatch(logoutUser());
      setIsMobileMenuOpen(false);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const getInitial = (name: string) => name?.charAt(0)?.toUpperCase() || "";

  return (
    <nav
      ref={navbarRef}
      className="bg-green-600 px-4 py-3 flex justify-between items-center sticky top-0 z-40 shadow"
    >
      {/* Logo */}
      <h1
        className="text-white font-bold text-lg cursor-pointer"
        onClick={() => navigate("/")}
      >
        Hosta
      </h1>

      {/* Right side */}
      <div className="flex items-center gap-4 md:hidden">
        {user?._id ? (
          <button
            onClick={() => navigate("/settings")}
            className="w-10 h-10 rounded-full bg-green-300 flex items-center justify-center text-white font-bold"
          >
            {getInitial(user.name)}
          </button>
        ) : null}
        <button onClick={() => setIsMobileMenuOpen(true)}>
          <Menu size={26} className="text-white" />
        </button>
      </div>

      {/* Mobile menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      >
        {user?._id && (
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-full bg-green-400 flex items-center justify-center text-white font-bold text-lg">
              {getInitial(user.name)}
            </div>
            <span className="text-green-800 font-semibold">{user.name}</span>
          </div>
        )}
        {navItems.map((item) => (
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
            <span className="text-red-600 font-semibold">Logout</span>
          </NavItem>
        ) : (
          <NavItem to="/login" onClick={() => setIsMobileMenuOpen(false)}>
            Login
          </NavItem>
        )}
      </MobileMenu>

      {/* Desktop links */}
      <div className="hidden md:flex items-center space-x-4">
        {navItems.map((item) => (
          <NavItem
            key={item.name}
            to={item.path}
            isActive={location.pathname === item.path}
          >
            {item.name}
          </NavItem>
        ))}

        {user?._id ? (
          <>
            <NavItem to="/" onClick={handleLogout}>
              <span className="text-red-600">Logout</span>
            </NavItem>
            <button
              onClick={() => navigate("/settings")}
              className="flex items-center space-x-1 bg-white px-1 py-1 rounded-full justify-center shadow hover:shadow-md transition"
            >
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-green-800 font-semibold">{user.name}</span>
            </button>
          </>
        ) : (
          <NavItem to="/login">Login</NavItem>
        )}
      </div>
    </nav>
  );
}
