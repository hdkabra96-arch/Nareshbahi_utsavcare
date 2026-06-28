/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Train, Menu, X, Lock } from "lucide-react";
// @ts-ignore
import brandLogo from "../../photo_2026-05-16_14-29-54.png";

interface NavbarProps {
  logoText: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdminLoggedIn: boolean;
  onAdminClick: () => void;
}

export default function Navbar({
  logoText,
  activeTab,
  setActiveTab,
  isAdminLoggedIn,
  onAdminClick,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: "home", label: "HOME" },
    { id: "about", label: "ABOUT" },
    { id: "services", label: "SERVICES" },
    { id: "projects", label: "PROJECTS" },
    { id: "certifications", label: "CERTIFICATIONS" },
    { id: "contact", label: "CONTACT" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white shadow-sm" id="main-header">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <div
          className="flex cursor-pointer items-center"
          onClick={() => {
            setActiveTab("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          id="brand-logo-container"
        >
          <img
            src={brandLogo}
            alt={logoText}
            referrerPolicy="no-referrer"
            className="max-h-16 w-auto object-contain block"
            id="brand-logo-image"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-6 md:flex" id="desktop-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`text-[13px] font-bold tracking-wider transition-colors duration-250 ${
                activeTab === item.id
                  ? "text-gold-500 border-b-2 border-gold-500 pb-1"
                  : "text-gray-500 hover:text-gold-500"
              }`}
              id={`nav-item-${item.id}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Action Button & Admin Quick Access */}
        <div className="hidden items-center space-x-3 md:flex" id="header-actions">
          {isAdminLoggedIn && (
            <button
              onClick={onAdminClick}
              className="flex items-center space-x-1 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-100 transition-all border border-amber-200"
              id="admin-active-badge"
            >
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span>ADMIN ACTIVE</span>
            </button>
          )}
          <a
            href="#company-profile"
            onClick={(e) => {
              e.preventDefault();
              alert("Company Profile PDF download started (simulated). You can customize this link in the Admin Panel.");
            }}
            className="bg-neutral-950 text-white text-[11px] font-bold tracking-widest uppercase px-5 py-2.5 rounded-full hover:bg-gold-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
            id="btn-company-profile"
          >
            COMPANY PROFILE
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center space-x-2 md:hidden" id="mobile-nav-toggle-container">
          {isAdminLoggedIn && (
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse mr-1"></span>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
            aria-expanded="false"
            id="mobile-menu-btn"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-b border-gray-200 bg-white md:hidden" id="mobile-menu-dropdown">
          <div className="space-y-1 px-2 pt-2 pb-4 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-3 py-3 rounded-md text-sm font-bold tracking-wider ${
                  activeTab === item.id
                    ? "bg-amber-50 text-gold-500"
                    : "text-gray-600 hover:bg-gray-50 hover:text-neutral-900"
                }`}
                id={`mobile-nav-item-${item.id}`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-4 border-t border-gray-100 px-3" id="mobile-menu-actions">
              <a
                href="#company-profile"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Company Profile PDF download started (simulated). You can customize this link in the Admin Panel.");
                  setIsOpen(false);
                }}
                className="block w-full text-center bg-neutral-950 text-white text-xs font-bold tracking-widest uppercase py-3 rounded-full hover:bg-gold-500 transition-colors"
                id="mobile-btn-company-profile"
              >
                COMPANY PROFILE
              </a>
              <button
                onClick={() => {
                  onAdminClick();
                  setIsOpen(false);
                }}
                className="mt-3 block w-full text-center bg-amber-50 text-amber-800 text-xs font-bold py-2.5 rounded hover:bg-amber-100 transition-colors border border-amber-200"
                id="mobile-btn-admin"
              >
                {isAdminLoggedIn ? "GO TO ADMIN PANEL" : "ADMIN PORTAL"}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
