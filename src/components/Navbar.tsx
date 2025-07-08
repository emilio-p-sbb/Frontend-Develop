"use client";

import { useState, useEffect } from "react";
import { Menu, X, Settings } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const sections = ["about", "skills", "experience", "projects", "education", "contact"];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-sm shadow-md py-3" : "bg-transparent py-4"
      }`}
    >
      <div className="container-custom">
        <div className="flex justify-between items-center">
          <h1
            className="text-xl md:text-2xl font-bold cursor-pointer text-portfolio-navy"
            onClick={() => scrollTo("home")}
          >
            BW<span className="text-portfolio-light-blue">.dev</span>
          </h1>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8 items-center">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => scrollTo(section)}
                className="text-portfolio-navy hover:text-portfolio-light-blue capitalize font-medium transition-colors duration-300 nav-link py-1"
              >
                {section}
              </button>
            ))}
            {session && (
              <Link
                href="/admin"
                className="flex items-center space-x-1 text-portfolio-navy hover:text-portfolio-light-blue font-medium transition-colors duration-300 border border-portfolio-navy hover:border-portfolio-light-blue px-3 py-1 rounded-lg"
              >
                <Settings size={16} />
                <span>Admin</span>
              </Link>
            )}
          </nav>

          {/* Mobile Nav Trigger */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-portfolio-navy focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/90 backdrop-blur-sm shadow-lg py-4 animate-fade-in">
          <div className="container-custom">
            <div className="flex flex-col space-y-4">
              {sections.map((section) => (
                <button
                  key={section}
                  onClick={() => scrollTo(section)}
                  className="text-portfolio-navy hover:text-portfolio-light-blue capitalize font-medium py-2 transition-colors duration-300 text-left"
                >
                  {section}
                </button>
              ))}
              {session && (
                <Link
                  href="/admin"
                  className="flex items-center space-x-2 text-portfolio-navy hover:text-portfolio-light-blue font-medium py-2 transition-colors duration-300 border-t border-gray-200 pt-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings size={16} />
                  <span>Admin Panel</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
