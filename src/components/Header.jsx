// Header.jsx
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { userAuth } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";
import { handleSignOut } from "./SignOut";

const Header = () => {
  const { session } = userAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!session) return null;

  return (
    <header className="shadow-md fixed top-0 left-0 w-full z-50 bg-white dark:bg-[#343434]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div>
          <img
            className="h-[40px] block dark:hidden"
            src="/StarTap wide logo-cropped.svg"
            alt=""
          />
          <img
            className="h-[40px] hidden dark:block"
            src="/startap white logo.svg"
            alt=""
          />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6">
          <a href="/profile" className="hover:text-indigo-600">
            Profile
          </a>
          <a href="/review-request" className="hover:text-indigo-600">
            Request Review
          </a>
          <a
            onClick={() => handleSignOut(navigate)}
            className="cursor-pointer
        hover:text-indigo-600"
          >
            Sign Out
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          id="menuButton"
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} className="dark:stroke-white" />
          )}
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="bg-white dark:bg-[#343434] md:hidden shadow-lg px-4 py-4 space-y-2 text-gray-700">
          <a href="/profile" className="block hover:text-indigo-600">
            Profile
          </a>
          <a href="/review-request" className="block hover:text-indigo-600">
            Request Review
          </a>
          <a
            onClick={() => handleSignOut(navigate)}
            className="cursor-pointer
        hover:text-indigo-600 block"
          >
            Sign Out
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
