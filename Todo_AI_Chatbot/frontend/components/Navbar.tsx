"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  CreditCard,
  Sparkles,
} from "lucide-react";
import Dropdown from "@/components/ui/dropdown";
import { UrlObject } from "url";
type DropdownItem = {
  name: string;
  href: string | UrlObject;
  icon: React.ElementType;
};

const Navbar = () => {
  // ✅ HYDRATION FIX
  const [mounted, setMounted] = useState(false);

  // UI states
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();

  // ✅ run only on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🚫 prevent server/client mismatch
  if (!mounted) return null;

  type NavLink = {
    name: string;
    href: string;
  };

  const navLinks: NavLink[] = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/tasks" },
    { name: "Profile", href: "/profile" },
  ];

  // ✅ FIXED DROPDOWN LINKS
  const userDropdownItems: DropdownItem[] = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Billing", href: "/billing", icon: CreditCard },
  { name: "Logout", href: "/logout", icon: LogOut },
];


  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "glass backdrop-blur-xl border-b border-yellow-500/30 py-2 bg-gradient-to-r from-black/20 to-black/10"
          : "py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 bg-clip-text text-transparent font-extrabold drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]"
          >
            TaskFlow
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === link.href
                    ? "text-yellow-300 bg-black/20 font-semibold"
                    : "text-white hover:text-yellow-200 hover:bg-black/20"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <Dropdown
              trigger={
                <div className="flex items-center gap-2 cursor-pointer">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 flex items-center justify-center text-black">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <span className="text-white">User</span>
                </div>
              }
            >
              {userDropdownItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-4 py-2 text-sm text-yellow-500 hover:bg-yellow-500/10"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </Dropdown>
          </nav>

          {/* Mobile Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <X className="text-white" /> : <Menu className="text-white" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden glass backdrop-blur-xl border-t border-yellow-500/30 bg-gradient-to-br from-black/30 to-black/10">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === link.href
                      ? "text-yellow-300 bg-black/20 font-semibold"
                      : "text-white hover:text-yellow-200 hover:bg-black/20"
                  }`}
                  onClick={() => setIsOpen(false)} // Close menu when link is clicked
                >
                  {link.name}
                </Link>
              ))}

              {/* User dropdown for mobile */}
              <div className="pt-4 pb-2 border-t border-yellow-500/20">
                <div className="flex items-center px-3 py-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 flex items-center justify-center text-black mr-3">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <span className="text-white font-medium">User</span>
                </div>

                <div className="mt-2 space-y-1">
                  {userDropdownItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center px-5 py-2 text-sm text-yellow-500 hover:text-yellow-200 hover:bg-black/10 rounded-md"
                      onClick={() => setIsOpen(false)} // Close menu when link is clicked
                    >
                      <item.icon className="mr-2 h-4 w-4 text-yellow-500" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
