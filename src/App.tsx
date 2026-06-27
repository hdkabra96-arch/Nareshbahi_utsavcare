/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Train,
  ShieldCheck,
  Hammer,
  Clock,
  ArrowRight,
  Send,
  Lock,
  MessageCircle,
  X,
  MapPin,
  Phone,
  Mail,
  Award,
  Settings,
  Wrench,
  Briefcase,
  Check,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminPanel from "./components/AdminPanel";
import AdminLoginPage from "./components/AdminLoginPage";
import { DEFAULT_WEBSITE_DATA } from "./data/defaultData";
import { WebsiteData, ContactMessage, ServiceItem } from "./types";
import { 
  fetchWebsiteDataFromSupabase, 
  fetchMessagesFromSupabase, 
  saveMessageToSupabase,
  saveWebsiteDataToSupabase,
  deleteMessageFromSupabase
} from "./lib/supabase";

export default function App() {
  // Page / Tab routing state
  const [activeTab, setActiveTab] = useState<string>("home");

  // Load custom-edited website layout settings or default values
  const [data, setData] = useState<WebsiteData>(() => {
    const saved = localStorage.getItem("railconstruct_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Seamlessly migrate legacy data to support the hero slider if needed
        if (parsed.hero && (!parsed.hero.slides || parsed.hero.slides.length === 0)) {
          parsed.hero.slides = DEFAULT_WEBSITE_DATA.hero.slides;
        }
        return parsed;
      } catch (err) {
        console.error("Failed to parse saved website data.", err);
      }
    }
    return DEFAULT_WEBSITE_DATA;
  });

  // Current active slide in the Hero Banner Slider
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // Auto-advance hero slides every 6 seconds
  useEffect(() => {
    const slidesCount = data.hero.slides?.length || 0;
    if (slidesCount <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesCount);
    }, 6000);
    return () => clearInterval(interval);
  }, [data.hero.slides]);

  // Save changes to localStorage and Supabase cloud whenever content is updated
  useEffect(() => {
    localStorage.setItem("railconstruct_data", JSON.stringify(data));
    
    // Automatically attempt to sync to Supabase in the background
    const syncToCloud = async () => {
      try {
        await saveWebsiteDataToSupabase(data);
        console.log("Automatically synchronized website data to Supabase cloud.");
      } catch (err) {
        console.warn("Could not auto-sync website data to Supabase:", err);
      }
    };

    // Use a small delay to debounce multiple sequential state updates (like CRUD changes)
    const timeout = setTimeout(() => {
      syncToCloud();
    }, 1500);

    return () => clearTimeout(timeout);
  }, [data]);

  // Contact submissions list
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem("railconstruct_messages");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error("Failed to parse saved contact messages.", err);
      }
    }
    return [];
  });

  // Sync data and messages from Supabase on mount
  useEffect(() => {
    const loadSupabaseData = async () => {
      try {
        const remoteData = await fetchWebsiteDataFromSupabase();
        if (remoteData) {
          setData(remoteData);
          localStorage.setItem("railconstruct_data", JSON.stringify(remoteData));
          console.log("Website content loaded from Supabase successfully.");
        }
      } catch (e) {
        console.warn("Could not load website_content from Supabase:", e);
      }

      try {
        const remoteMessages = await fetchMessagesFromSupabase();
        if (remoteMessages) {
          setContactMessages(remoteMessages);
          localStorage.setItem("railconstruct_messages", JSON.stringify(remoteMessages));
          console.log("Inbox messages loaded from Supabase successfully.");
        }
      } catch (e) {
        console.warn("Could not load contact_messages from Supabase:", e);
      }
    };
    loadSupabaseData();
  }, []);

  useEffect(() => {
    localStorage.setItem("railconstruct_messages", JSON.stringify(contactMessages));
  }, [contactMessages]);

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as any });
  }, [activeTab]);

  // Admin login states
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem("railconstruct_admin") === "true";
  });

  // Visitor contact form input state
  const [contactForm, setContactForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Custom toaster notifications
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const triggerToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Helper to dynamically render a Lucide Icon by name
  const renderServiceIcon = (iconName: string) => {
    switch (iconName) {
      case "Wrench":
        return <Wrench className="h-6 w-6 stroke-[2]" />;
      case "Settings":
        return <Settings className="h-6 w-6 stroke-[2]" />;
      case "Hammer":
        return <Hammer className="h-6 w-6 stroke-[2]" />;
      case "Award":
        return <Award className="h-6 w-6 stroke-[2]" />;
      case "Briefcase":
        return <Briefcase className="h-6 w-6 stroke-[2]" />;
      default:
        return <Wrench className="h-6 w-6 stroke-[2]" />;
    }
  };

  // Handle visitor inquiry form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.fullName || !contactForm.email || !contactForm.message) {
      triggerToast("Please fill in all required fields.", "error");
      return;
    }

    const newMessage: ContactMessage = {
      id: `msg-${Date.now()}`,
      fullName: contactForm.fullName,
      email: contactForm.email,
      phone: contactForm.phone,
      message: contactForm.message,
      timestamp: new Date().toISOString(),
    };

    setContactMessages((prev) => [newMessage, ...prev]);
    setFormSubmitted(true);
    setContactForm({ fullName: "", email: "", phone: "", message: "" });
    triggerToast("Thank you! Your message has been sent successfully.");
    
    // Save to Supabase
    try {
      await saveMessageToSupabase(newMessage);
      console.log("Inquiry message successfully synced to Supabase.");
    } catch (err) {
      console.warn("Offline fallback used. Saved locally.", err);
    }

    setTimeout(() => setFormSubmitted(false), 5000);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem("railconstruct_admin");
    setActiveTab("home");
    triggerToast("Logged out of Admin Mode.");
  };

  const handleResetToDefaults = () => {
    setData(DEFAULT_WEBSITE_DATA);
    setContactMessages([]);
    localStorage.removeItem("railconstruct_data");
    localStorage.removeItem("railconstruct_messages");
    triggerToast("All elements restored to pre-configured defaults!");
  };

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50/50" id="app-wrapper">
      
      {/* Toast Notification Alert Banner */}
      {toast && (
        <div
          className={`fixed top-24 right-5 z-50 flex items-center space-x-3 rounded-xl border px-5 py-4 shadow-2xl transition-all duration-300 ${
            toast.type === "success"
              ? "bg-neutral-900 border-gold-500 text-white"
              : "bg-red-900 border-red-500 text-white"
          }`}
          id="toast-notification-banner"
        >
          <div className={`rounded-full p-1 ${toast.type === "success" ? "bg-amber-500/20 text-gold-500" : "bg-red-500/20 text-red-400"}`}>
            <Check className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Top sticky Navbar */}
      <Navbar
        logoText={data.settings.logoText}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdminLoggedIn={isAdminLoggedIn}
        onAdminClick={() => {
          setActiveTab("admin");
        }}
      />

      {/* Main Content Areas */}
      <main className="flex-grow" id="main-content-flow">

        {/* ----------------- ADMIN DASHBOARD & LOGIN VIEW ----------------- */}
        {activeTab === "admin" && (
          isAdminLoggedIn ? (
            <AdminPanel
              data={data}
              onUpdateData={setData}
              contactMessages={contactMessages}
              onClearMessages={() => setContactMessages([])}
              onDeleteMessage={async (id) => {
                setContactMessages((prev) => prev.filter((m) => m.id !== id));
                try {
                  await deleteMessageFromSupabase(id);
                } catch (err) {
                  console.warn("Could not delete message from Supabase:", err);
                }
              }}
              onLogout={handleAdminLogout}
              onResetToDefaults={handleResetToDefaults}
            />
          ) : (
            <AdminLoginPage
              onLoginSuccess={(username) => {
                setIsAdminLoggedIn(true);
                sessionStorage.setItem("railconstruct_admin", "true");
                setActiveTab("admin");
              }}
              triggerToast={(msg, type) => triggerToast(msg, type || "success")}
            />
          )
        )}

        {/* ----------------- HOME VIEW ----------------- */}
        {activeTab === "home" && (
          <div className="animate-fade-in" id="view-home">
            {/* HERO BANNER SLIDER SECTION */}
            <section
              className="relative min-h-[640px] flex items-center py-24 text-white bg-neutral-950 overflow-hidden"
              id="hero-banner"
            >
              {/* Slide Background Cross-Fade Animation */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `linear-gradient(to right, rgba(15, 15, 15, 0.85), rgba(15, 15, 15, 0.5)), url(${
                      data.hero.slides?.[currentSlide]?.bgImage || ""
                    })`,
                  }}
                />
              </AnimatePresence>

              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full relative z-10">
                {/* Content Fade & Slide Animation */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl space-y-6"
                    id="hero-headlines"
                  >
                    <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight leading-tight">
                      {data.hero.slides?.[currentSlide]?.titlePart1}
                      <span className="text-gold-500 font-serif block sm:inline mt-1 sm:mt-0">
                        {data.hero.slides?.[currentSlide]?.titleGold}
                      </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 font-sans font-light leading-relaxed max-w-2xl">
                      {data.hero.slides?.[currentSlide]?.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4" id="hero-ctas">
                      <button
                        onClick={() => {
                          setActiveTab("projects");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="flex items-center justify-center space-x-2 bg-gold-500 text-neutral-900 font-bold px-8 py-4 tracking-wider text-xs hover:bg-neutral-900 hover:text-white transition-all cursor-pointer shadow-xl duration-300"
                      >
                        <span>{data.hero.ctaProjectsText}</span>
                        <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab("contact");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="flex items-center justify-center bg-transparent text-white font-bold border-2 border-white/80 px-8 py-3.5 text-xs tracking-wider hover:bg-white hover:text-neutral-950 hover:border-white transition-all cursor-pointer duration-300"
                      >
                        <span>{data.hero.ctaContactText}</span>
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Manual Arrow Controls */}
              {data.hero.slides && data.hero.slides.length > 1 && (
                <>
                  <button
                    onClick={() => {
                      setCurrentSlide((prev) => (prev === 0 ? data.hero.slides.length - 1 : prev - 1));
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-black/30 text-white border border-white/10 backdrop-blur-md hover:bg-gold-500 hover:text-neutral-900 transition-all cursor-pointer active:scale-95"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="h-6 w-6 stroke-[2]" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentSlide((prev) => (prev + 1) % data.hero.slides.length);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-black/30 text-white border border-white/10 backdrop-blur-md hover:bg-gold-500 hover:text-neutral-900 transition-all cursor-pointer active:scale-95"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="h-6 w-6 stroke-[2]" />
                  </button>
                </>
              )}

              {/* Slider Indicator Dot Controls */}
              {data.hero.slides && data.hero.slides.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2.5">
                  {data.hero.slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        currentSlide === idx ? "w-8 bg-gold-500" : "w-2.5 bg-white/40 hover:bg-white/70"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* WHY CHOOSE RAILCONSTRUCT SECTION */}
            <section className="bg-white py-24 border-b border-gray-100" id="why-choose-us-section">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16" id="why-choose-heading">
                  <h2 className="font-serif text-4xl font-bold text-neutral-950">
                    Why Choose {data.settings.logoText}?
                  </h2>
                  <div className="h-1 w-20 bg-gold-500 mx-auto mt-4 rounded"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10" id="why-choose-grid">
                  {/* Safety */}
                  <div className="flex flex-col items-center text-center p-8 bg-neutral-50/50 hover:bg-white border border-transparent hover:border-gray-100 rounded-2xl hover:shadow-xl transition-all duration-300" id="reason-safety">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-gold-500/20 bg-amber-50 text-gold-600 mb-6 shadow-sm">
                      <ShieldCheck className="h-8 w-8 stroke-[1.5]" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-neutral-900 mb-3">
                      Uncompromising Safety
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed font-sans font-light">
                      We adhere to the strictest international safety standards in every project we undertake.
                    </p>
                  </div>

                  {/* Engineering */}
                  <div className="flex flex-col items-center text-center p-8 bg-neutral-50/50 hover:bg-white border border-transparent hover:border-gray-100 rounded-2xl hover:shadow-xl transition-all duration-300" id="reason-engineering">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-gold-500/20 bg-amber-50 text-gold-600 mb-6 shadow-sm">
                      <Hammer className="h-7 w-7 stroke-[1.5]" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-neutral-900 mb-3">
                      Expert Engineering
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed font-sans font-light">
                      Our team comprises industry-leading engineers with decades of specialized railway experience.
                    </p>
                  </div>

                  {/* Delivery */}
                  <div className="flex flex-col items-center text-center p-8 bg-neutral-50/50 hover:bg-white border border-transparent hover:border-gray-100 rounded-2xl hover:shadow-xl transition-all duration-300" id="reason-delivery">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-gold-500/20 bg-amber-50 text-gold-600 mb-6 shadow-sm">
                      <Clock className="h-7 w-7 stroke-[1.5]" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-neutral-900 mb-3">
                      Timely Delivery
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed font-sans font-light">
                      We pride ourselves on efficient project management, ensuring on-time completion.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* GET A QUOTE CENTERED CTA BANNER */}
            <section className="bg-neutral-50 py-20 text-center" id="quote-cta-banner">
              <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-neutral-950">
                  Ready to start your next railway project?
                </h2>
                <p className="text-gray-500 font-sans font-light leading-relaxed max-w-2xl mx-auto">
                  Partner with the industry leaders in railway infrastructure.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setActiveTab("contact");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="bg-gold-500 text-neutral-900 font-bold px-8 py-4 text-xs tracking-widest hover:bg-neutral-900 hover:text-white transition-all cursor-pointer shadow-md uppercase duration-300"
                    id="btn-quote-today"
                  >
                    GET A QUOTE TODAY
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ----------------- ABOUT VIEW ----------------- */}
        {activeTab === "about" && (
          <section className="py-24 animate-fade-in" id="view-about">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              
              {/* Header */}
              <div className="text-center max-w-2xl mx-auto mb-16" id="about-heading-box">
                <h1 className="font-serif text-4xl font-bold text-neutral-950">
                  {data.about.title}
                </h1>
                <div className="h-1 w-20 bg-gold-500 mx-auto mt-4 rounded"></div>
              </div>

              {/* Legacy Block */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20" id="about-legacy-grid">
                {/* Image panel */}
                <div className="lg:col-span-5" id="about-image-container">
                  <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-xl relative aspect-[4/3] bg-gray-100">
                    <img
                      src={data.about.imageUrl}
                      alt="Railway Workers"
                      className="object-cover h-full w-full"
                    />
                  </div>
                </div>

                {/* Legacy narrative */}
                <div className="lg:col-span-7 space-y-5" id="about-text-container">
                  <h2 className="font-serif text-3xl font-bold text-neutral-950">
                    {data.about.legacyHeading}
                  </h2>
                  <div className="space-y-4 text-sm text-gray-500 leading-relaxed font-sans font-light">
                    <p>{data.about.legacyText1}</p>
                    <p>{data.about.legacyText2}</p>
                    <p>{data.about.legacyText3}</p>
                  </div>
                </div>
              </div>

              {/* Performance / Stat Achievements counter cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t border-gray-200" id="about-stats-container">
                {data.about.stats.map((stat) => (
                  <div
                    key={stat.id}
                    className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-center space-y-2"
                  >
                    <span className="block font-mono text-3xl lg:text-4xl font-bold text-gold-500">
                      {stat.numberText}
                    </span>
                    <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </section>
        )}

        {/* ----------------- SERVICES VIEW ----------------- */}
        {activeTab === "services" && (
          <section className="py-24 bg-white animate-fade-in" id="view-services">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              
              {/* Header */}
              <div className="text-center max-w-3xl mx-auto mb-16" id="services-heading-box">
                <h1 className="font-serif text-4xl font-bold text-neutral-950">
                  Our Services
                </h1>
                <div className="h-1 w-20 bg-gold-500 mx-auto mt-4 mb-4 rounded"></div>
                <p className="text-gray-500 font-sans font-light text-sm max-w-xl mx-auto leading-relaxed">
                  Comprehensive railway infrastructure solutions tailored to meet the highest industry standards.
                </p>
              </div>

              {/* Services Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="services-cards-grid">
                {data.services.map((srv) => (
                  <div
                    key={srv.id}
                    className="border border-gray-200 p-8 rounded-2xl bg-white hover:border-gold-500 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 flex flex-col items-start"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-50 border border-gold-500/10 text-gold-600 mb-6 shadow-sm">
                      {renderServiceIcon(srv.iconName)}
                    </div>
                    <h3 className="font-serif text-xl font-bold text-neutral-900 mb-3">
                      {srv.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed font-sans font-light">
                      {srv.description}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </section>
        )}

        {/* ----------------- PROJECTS VIEW ----------------- */}
        {activeTab === "projects" && (
          <section className="py-24 animate-fade-in" id="view-projects">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              
              {/* Header */}
              <div className="text-center max-w-3xl mx-auto mb-16" id="projects-heading-box">
                <h1 className="font-serif text-4xl font-bold text-neutral-950">
                  Featured Projects
                </h1>
                <div className="h-1 w-20 bg-gold-500 mx-auto mt-4 mb-4 rounded"></div>
                <p className="text-gray-500 font-sans font-light text-sm max-w-xl mx-auto leading-relaxed">
                  A showcase of our engineering excellence and commitment to building robust railway networks worldwide.
                </p>
              </div>

              {/* Showcase Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="projects-showcase-grid">
                {data.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="group bg-white border border-gray-200 hover:border-gold-500 hover:shadow-2xl overflow-hidden rounded-2xl transition-all duration-300 flex flex-col h-full"
                  >
                    {/* Image box */}
                    <div className="aspect-[4/3] overflow-hidden bg-gray-100 relative">
                      <img
                        src={proj.image}
                        alt={proj.title}
                        className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    {/* Text Details */}
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <span className="block font-sans text-[11px] font-bold text-gold-500 uppercase tracking-widest mb-1.5">
                          {proj.location}
                        </span>
                        <h3 className="font-serif text-xl font-bold text-neutral-900 mb-3 leading-tight group-hover:text-gold-600 transition-colors">
                          {proj.title}
                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed font-sans font-light">
                          {proj.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </section>
        )}

        {/* ----------------- CERTIFICATIONS VIEW ----------------- */}
        {activeTab === "certifications" && (
          <section className="py-24 bg-white animate-fade-in" id="view-certifications">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              
              {/* Header */}
              <div className="text-center max-w-3xl mx-auto mb-16" id="certifications-heading-box">
                <h1 className="font-serif text-4xl font-bold text-neutral-950">
                  Certifications & Awards
                </h1>
                <div className="h-1 w-20 bg-gold-500 mx-auto mt-4 mb-4 rounded"></div>
                <p className="text-gray-500 font-sans font-light text-sm max-w-xl mx-auto leading-relaxed">
                  Our commitment to quality, safety, and environmental standards is recognized globally.
                </p>
              </div>

              {/* Certifications Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="certifications-cards-grid">
                {data.certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="border border-gray-200 hover:border-gold-500 hover:shadow-2xl p-8 rounded-2xl bg-white transition-all duration-300 text-center flex flex-col items-center"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-gold-600 mb-6 shadow-sm border border-gold-500/10">
                      <Award className="h-7 w-7" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-neutral-950 mb-3">
                      {cert.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed font-sans font-light">
                      {cert.description}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </section>
        )}

        {/* ----------------- CONTACT VIEW ----------------- */}
        {activeTab === "contact" && (
          <section className="py-24 animate-fade-in" id="view-contact">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              
              {/* Header */}
              <div className="text-center max-w-3xl mx-auto mb-16" id="contact-heading-box">
                <h1 className="font-serif text-4xl font-bold text-neutral-950">
                  Contact Us
                </h1>
                <div className="h-1 w-20 bg-gold-500 mx-auto mt-4 mb-4 rounded"></div>
                <p className="text-gray-500 font-sans font-light text-sm max-w-xl mx-auto leading-relaxed">
                  Get in touch with our team to discuss your next railway infrastructure project.
                </p>
              </div>

              {/* Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12" id="contact-content-grid">
                
                {/* Contact Form column (Left) */}
                <div className="lg:col-span-7 bg-white rounded-2xl p-8 border border-gray-100 shadow-xl" id="contact-form-card">
                  <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-6">
                    Send us a message
                  </h2>

                  {formSubmitted ? (
                    <div className="bg-amber-50 border border-gold-500/20 rounded-xl p-6 text-center space-y-3" id="form-success-banner">
                      <div className="h-12 w-12 bg-gold-500 text-neutral-950 flex items-center justify-center rounded-full mx-auto">
                        <Check className="h-6 w-6 stroke-[3]" />
                      </div>
                      <h3 className="text-lg font-bold text-neutral-950">Message Sent!</h3>
                      <p className="text-xs text-gray-500 leading-relaxed max-w-md mx-auto">
                        Thank you for your inquiry. Our engineering planning committee will review your message and contact you within 24 business hours.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-5" id="visitor-contact-form">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                          FULL NAME *
                        </label>
                        <input
                          type="text"
                          value={contactForm.fullName}
                          onChange={(e) => setContactForm({ ...contactForm, fullName: e.target.value })}
                          className="w-full rounded-lg border border-gray-300 bg-neutral-50 px-4 py-3 text-sm focus:border-gold-500 focus:bg-white focus:outline-none"
                          required
                          placeholder="Enter your name"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                            EMAIL ADDRESS *
                          </label>
                          <input
                            type="email"
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            className="w-full rounded-lg border border-gray-300 bg-neutral-50 px-4 py-3 text-sm focus:border-gold-500 focus:bg-white focus:outline-none"
                            required
                            placeholder="Enter email address"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                            PHONE NUMBER
                          </label>
                          <input
                            type="tel"
                            value={contactForm.phone}
                            onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                            className="w-full rounded-lg border border-gray-300 bg-neutral-50 px-4 py-3 text-sm focus:border-gold-500 focus:bg-white focus:outline-none"
                            placeholder="Optional"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                          MESSAGE *
                        </label>
                        <textarea
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          rows={5}
                          className="w-full rounded-lg border border-gray-300 bg-neutral-50 px-4 py-3 text-sm focus:border-gold-500 focus:bg-white focus:outline-none"
                          required
                          placeholder="Describe your railway scope or service required..."
                        />
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          className="w-full bg-neutral-950 text-white font-bold tracking-widest uppercase py-4 rounded-lg hover:bg-gold-500 hover:text-white transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-lg"
                        >
                          <span>SEND MESSAGE</span>
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Contact Information card (Right) */}
                <div className="lg:col-span-5 space-y-8" id="contact-info-panel">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-6">
                      Contact Information
                    </h2>
                    <p className="text-sm text-gray-500 leading-relaxed font-sans font-light">
                      Our dedicated team is ready to assist you with any inquiries regarding our services, ongoing projects, or potential partnerships.
                    </p>
                  </div>

                  {/* Cards */}
                  <div className="space-y-5" id="contact-detail-cards">
                    {/* Head Office */}
                    <div className="flex items-start space-x-4 p-5 bg-white border border-gray-100 rounded-xl shadow-sm">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-50 border border-gold-500/10 text-gold-600">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <span className="block text-sm font-bold text-neutral-950 font-serif">Head Office</span>
                        <p className="text-xs text-gray-500 leading-relaxed">{data.settings.address}</p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start space-x-4 p-5 bg-white border border-gray-100 rounded-xl shadow-sm">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-50 border border-gold-500/10 text-gold-600">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <span className="block text-sm font-bold text-neutral-950 font-serif">Phone</span>
                        <a href={`tel:${data.settings.phone}`} className="block text-xs text-gray-500 hover:text-gold-500 transition-colors font-semibold">
                          {data.settings.phone}
                        </a>
                        {data.settings.phoneAlt && (
                          <a href={`tel:${data.settings.phoneAlt}`} className="block text-xs text-gray-500 hover:text-gold-500 transition-colors font-semibold">
                            {data.settings.phoneAlt}
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start space-x-4 p-5 bg-white border border-gray-100 rounded-xl shadow-sm">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-50 border border-gold-500/10 text-gold-600">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <span className="block text-sm font-bold text-neutral-950 font-serif">Email</span>
                        <a href={`mailto:${data.settings.email}`} className="block text-xs text-gold-600 hover:underline font-semibold">
                          {data.settings.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </section>
        )}

      </main>

      {/* Footer Area */}
      <Footer
        settings={data.settings}
        setActiveTab={setActiveTab}
        isAdminLoggedIn={isAdminLoggedIn}
        onAdminClick={() => {
          setActiveTab("admin");
        }}
      />

      {/* ----------------- WHATSAPP FLOATING WIDGET ----------------- */}
      <a
        href={`https://wa.me/${data.settings.whatsappNumber.replace(/[^0-9]/g, "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl hover:bg-[#20ba56] hover:scale-110 active:scale-95 transition-all cursor-pointer border border-[#1ebd50]/30"
        title="Chat with us on WhatsApp"
        id="whatsapp-chat-trigger"
      >
        <MessageCircle className="h-7 w-7 fill-white stroke-[#25D366]" />
      </a>

    </div>
  );
}
