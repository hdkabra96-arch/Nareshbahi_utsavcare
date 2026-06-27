/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Train, MapPin, Phone, Mail, Lock, LayoutDashboard } from "lucide-react";
import { CompanySettings } from "../types";

interface FooterProps {
  settings: CompanySettings;
  setActiveTab: (tab: string) => void;
  isAdminLoggedIn: boolean;
  onAdminClick: () => void;
}

export default function Footer({
  settings,
  setActiveTab,
  isAdminLoggedIn,
  onAdminClick,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 text-gray-400 font-sans" id="main-footer">
      {/* Top Footer Sections */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" id="footer-container">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-4" id="footer-grid">
          {/* Company Brief */}
          <div className="space-y-4" id="footer-about">
            <div className="flex items-center space-x-3 text-white" id="footer-logo">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-gold-500 text-neutral-950">
                <Train className="h-5 w-5 stroke-[2]" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight">
                {settings.logoText}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Leading railway contractor providing world-class infrastructure solutions, track construction, and maintenance services globally.
            </p>
          </div>

          {/* Quick Links */}
          <div id="footer-quick-links">
            <h3 className="font-serif text-sm font-bold tracking-widest text-white uppercase mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <button
                  onClick={() => {
                    setActiveTab("about");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-gold-500 transition-colors text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab("services");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-gold-500 transition-colors text-left"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab("projects");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-gold-500 transition-colors text-left"
                >
                  Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab("certifications");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-gold-500 transition-colors text-left"
                >
                  Certifications
                </button>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div id="footer-services">
            <h3 className="font-serif text-sm font-bold tracking-widest text-white uppercase mb-5">
              Services
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <button
                  onClick={() => {
                    setActiveTab("services");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-gold-500 transition-colors text-left"
                >
                  Track Construction
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab("services");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-gold-500 transition-colors text-left"
                >
                  Signaling Systems
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab("services");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-gold-500 transition-colors text-left"
                >
                  Maintenance & Repair
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab("services");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-gold-500 transition-colors text-left"
                >
                  Bridge Construction
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info Column */}
          <div className="space-y-4" id="footer-contact">
            <h3 className="font-serif text-sm font-bold tracking-widest text-white uppercase mb-5">
              Contact Us
            </h3>
            <ul className="space-y-3.5 text-sm leading-relaxed text-gray-400">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gold-500 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gold-500 shrink-0" />
                <div className="flex flex-col">
                  <span>{settings.phone}</span>
                  {settings.phoneAlt && <span>{settings.phoneAlt}</span>}
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gold-500 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-gold-500 transition-colors">
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer Row */}
      <div className="border-t border-neutral-900 bg-neutral-950 px-4 py-6 sm:px-6 lg:px-8" id="footer-bottom">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row text-xs">
          <p className="text-gray-500" id="copyright-text">
            © {currentYear} {settings.logoText}. All rights reserved.
          </p>
          <div className="flex items-center space-x-6" id="footer-meta-links">
            <button
              onClick={onAdminClick}
              className="flex items-center space-x-2 text-gray-500 hover:text-gold-500 transition-colors"
              id="admin-login-footer-trigger"
            >
              {isAdminLoggedIn ? (
                <>
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span>Admin Panel</span>
                </>
              ) : (
                <>
                  <Lock className="h-3.5 w-3.5" />
                  <span>Admin Login</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
