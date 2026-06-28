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

  // Image Gallery states
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<string>("All");
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

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

  // Derived gallery fields
  const galleryItems = data.gallery || DEFAULT_WEBSITE_DATA.gallery || [];
  const galleryCategories = ["All", ...Array.from(new Set(galleryItems.map((item) => item.category)))];
  const filteredGallery = selectedGalleryCategory === "All"
    ? galleryItems
    : galleryItems.filter((item) => item.category === selectedGalleryCategory);

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

              {/* Image Gallery Section */}
              <div className="py-16 border-t border-gray-100" id="about-image-gallery-section">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-4" id="gallery-header">
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono font-bold text-gold-500 uppercase tracking-widest block">
                      Visual Engineering Portfolio
                    </span>
                    <h2 className="font-serif text-3xl font-bold text-neutral-950">
                      Project & Construction Gallery
                    </h2>
                    <p className="text-xs text-neutral-400 font-sans max-w-xl">
                      Explore our high-performance fleet, advanced track alignments, specialized civil architecture, and active project worksites in real-time.
                    </p>
                  </div>

                  {/* Filter Categories */}
                  <div className="flex flex-wrap gap-2" id="gallery-category-filters">
                    {galleryCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedGalleryCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold tracking-wider transition-all duration-300 ${
                          selectedGalleryCategory === cat
                            ? "bg-neutral-950 text-gold-400 shadow-md border border-neutral-800"
                            : "bg-white text-gray-500 hover:text-neutral-900 border border-gray-100 hover:bg-neutral-50 hover:border-gray-200"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gallery Grid */}
                {filteredGallery.length === 0 ? (
                  <div className="text-center py-16 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200 text-neutral-400 text-xs font-mono">
                    NO PROJECT ASSETS RECORDED IN CATEGORY: {selectedGalleryCategory.toUpperCase()}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="gallery-items-grid">
                    {filteredGallery.map((item) => {
                      const globalIdx = galleryItems.findIndex((g) => g.id === item.id);
                      return (
                        <div
                          key={item.id}
                          onClick={() => setActiveLightboxIndex(globalIdx !== -1 ? globalIdx : 0)}
                          className="group relative cursor-pointer overflow-hidden rounded-xl bg-neutral-100 border border-gray-200/60 shadow-sm hover:shadow-xl hover:border-gold-500/20 transition-all duration-300 aspect-[4/3]"
                          id={`gallery-item-${item.id}`}
                        >
                          <img
                            src={item.url}
                            alt={item.caption}
                            referrerPolicy="no-referrer"
                            className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-500"
                          />
                          {/* Accent line */}
                          <div className="absolute top-0 left-0 w-full h-[3px] bg-gold-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                          
                          {/* Hover Overlay info */}
                          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                            <span className="inline-block self-start text-[9px] font-mono font-bold text-gold-400 bg-neutral-900/90 border border-neutral-800 px-2 py-0.5 rounded mb-2 tracking-widest uppercase">
                              {item.category}
                            </span>
                            <p className="text-white text-xs font-medium leading-relaxed mb-3 line-clamp-2">
                              {item.caption}
                            </p>
                            <span className="text-[10px] font-mono font-bold text-gold-500 flex items-center space-x-1 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                              <span>Enlarge Image Asset</span>
                              <ArrowRight className="h-3 w-3" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Lightbox Modal Overlay */}
              <AnimatePresence>
                {activeLightboxIndex !== null && galleryItems[activeLightboxIndex] && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/95 p-4 sm:p-6 backdrop-blur-md"
                    onClick={() => setActiveLightboxIndex(null)}
                  >
                    {/* Close Trigger */}
                    <button
                      onClick={() => setActiveLightboxIndex(null)}
                      className="absolute top-6 right-6 h-12 w-12 flex items-center justify-center bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-full text-neutral-400 hover:text-white transition-all cursor-pointer z-50 shadow-lg"
                    >
                      <X className="h-6 w-6" />
                    </button>

                    {/* Left Trigger */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveLightboxIndex((prev) => 
                          prev !== null ? (prev - 1 + galleryItems.length) % galleryItems.length : null
                        );
                      }}
                      className="absolute left-4 sm:left-6 h-12 w-12 flex items-center justify-center bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800/50 rounded-full text-white hover:text-gold-400 transition-all cursor-pointer z-40 shadow-lg"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>

                    {/* Right Trigger */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveLightboxIndex((prev) => 
                          prev !== null ? (prev + 1) % galleryItems.length : null
                        );
                      }}
                      className="absolute right-4 sm:right-6 h-12 w-12 flex items-center justify-center bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800/50 rounded-full text-white hover:text-gold-400 transition-all cursor-pointer z-40 shadow-lg"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>

                    {/* Expanded Asset Frame */}
                    <motion.div
                      initial={{ scale: 0.95, y: 15 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.95, y: 15 }}
                      transition={{ type: "spring", damping: 25, stiffness: 300 }}
                      onClick={(e) => e.stopPropagation()}
                      className="max-w-4xl w-full flex flex-col bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl relative"
                    >
                      <div className="relative aspect-[16/10] bg-neutral-950 flex items-center justify-center">
                        <img
                          src={galleryItems[activeLightboxIndex].url}
                          alt={galleryItems[activeLightboxIndex].caption}
                          referrerPolicy="no-referrer"
                          className="object-contain max-h-[70vh] w-full"
                        />
                      </div>
                      <div className="p-6 bg-neutral-900 border-t border-neutral-800 space-y-2 text-left">
                        <div className="flex items-center justify-between">
                          <span className="inline-block text-[10px] font-mono font-bold text-gold-400 bg-neutral-950 px-2.5 py-1 rounded border border-neutral-800 tracking-widest uppercase">
                            {galleryItems[activeLightboxIndex].category}
                          </span>
                          <span className="text-xs text-neutral-500 font-mono">
                            {activeLightboxIndex + 1} / {galleryItems.length}
                          </span>
                        </div>
                        <p className="text-neutral-200 text-sm font-light leading-relaxed">
                          {galleryItems[activeLightboxIndex].caption}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

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
                
                {/* Map column (Left) */}
                <div className="lg:col-span-7 space-y-6" id="contact-map-card-wrapper">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden p-3" id="contact-map-card">
                    <div className="relative rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200" style={{ height: "450px" }} id="map-iframe-container">
                      <iframe
                        title="Office Location Map"
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(data.settings.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full filter grayscale-[10%] contrast-[110%] saturate-[90%]"
                        id="google-map-iframe"
                      ></iframe>
                      
                      {/* Interactive Float Tag */}
                      <div className="absolute top-4 left-4 bg-neutral-900/95 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-mono font-medium shadow-md flex items-center space-x-2 border border-white/10">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                        <span>Interactive Map View</span>
                      </div>
                    </div>
                    
                    <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-neutral-50 rounded-b-xl border-t border-neutral-100" id="map-actions-row">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider block">Office Destination</span>
                        <p className="text-xs text-neutral-500 max-w-md">{data.settings.address}</p>
                      </div>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.settings.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center space-x-2 bg-neutral-950 text-white font-bold text-xs tracking-wider uppercase px-4 py-3 rounded-lg hover:bg-gold-500 transition-colors shrink-0"
                        id="directions-map-link"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>Get Directions</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Client Information card & Compact Form (Right) */}
                <div className="lg:col-span-5 space-y-6" id="contact-info-panel">
                  {/* Client Info Card */}
                  <div className="bg-neutral-900 text-white rounded-2xl p-6 border border-neutral-800 shadow-2xl relative overflow-hidden" id="client-info-card">
                    {/* Background pattern */}
                    <div className="absolute top-0 right-0 h-40 w-40 bg-gold-500/10 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none"></div>
                    
                    <h2 className="font-serif text-2xl font-bold text-white mb-2 relative z-10">
                      Client Support Desk
                    </h2>
                    <p className="text-xs text-neutral-400 leading-relaxed font-sans font-light mb-6 relative z-10">
                      Connect with our engineering planning division. We provide full telemetry, estimation, and safety-cleared consultations.
                    </p>

                    <div className="space-y-4 relative z-10" id="contact-detail-cards">
                      {/* Head Office Address */}
                      <div className="flex items-start space-x-4 p-4 bg-neutral-800/50 border border-neutral-700/50 rounded-xl">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-gold-400">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div className="space-y-1 min-w-0 flex-1">
                          <span className="block text-xs font-bold text-neutral-300 uppercase tracking-widest font-sans">Head Office</span>
                          <p className="text-xs text-neutral-200 leading-relaxed break-words">{data.settings.address}</p>
                        </div>
                      </div>

                      {/* Phone Info */}
                      <div className="flex items-start space-x-4 p-4 bg-neutral-800/50 border border-neutral-700/50 rounded-xl">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-gold-400">
                          <Phone className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <span className="block text-xs font-bold text-neutral-300 uppercase tracking-widest font-sans">Telephone Support</span>
                          <a href={`tel:${data.settings.phone}`} className="block text-sm font-semibold text-white hover:text-gold-400 transition-colors">
                            {data.settings.phone}
                          </a>
                          {data.settings.phoneAlt && (
                            <a href={`tel:${data.settings.phoneAlt}`} className="block text-xs text-neutral-400 hover:text-gold-400 transition-colors">
                              Alternative: {data.settings.phoneAlt}
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Email Info */}
                      <div className="flex items-start space-x-4 p-4 bg-neutral-800/50 border border-neutral-700/50 rounded-xl">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-gold-400">
                          <Mail className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <span className="block text-xs font-bold text-neutral-300 uppercase tracking-widest font-sans">Email Dispatch</span>
                          <a href={`mailto:${data.settings.email}`} className="block text-sm font-semibold text-gold-400 hover:underline">
                            {data.settings.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messaging Form */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xl" id="contact-form-small-card">
                    <h3 className="font-serif text-lg font-bold text-neutral-900 mb-4">
                      Send us a message
                    </h3>

                    {formSubmitted ? (
                      <div className="bg-amber-50 border border-gold-500/20 rounded-xl p-5 text-center space-y-2" id="form-success-banner">
                        <div className="h-10 w-10 bg-gold-500 text-neutral-950 flex items-center justify-center rounded-full mx-auto">
                          <Check className="h-5 w-5 stroke-[3]" />
                        </div>
                        <h4 className="text-sm font-bold text-neutral-950">Message Sent!</h4>
                        <p className="text-[11px] text-gray-500 leading-relaxed max-w-md mx-auto">
                          We will contact you within 24 business hours.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleContactSubmit} className="space-y-3.5" id="visitor-contact-form-small">
                        <div>
                          <input
                            type="text"
                            value={contactForm.fullName}
                            onChange={(e) => setContactForm({ ...contactForm, fullName: e.target.value })}
                            className="w-full rounded-lg border border-gray-200 bg-neutral-50 px-3 py-2.5 text-xs focus:border-gold-500 focus:bg-white focus:outline-none"
                            required
                            placeholder="Full Name"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="email"
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            className="w-full rounded-lg border border-gray-200 bg-neutral-50 px-3 py-2.5 text-xs focus:border-gold-500 focus:bg-white focus:outline-none"
                            required
                            placeholder="Email Address"
                          />
                          <input
                            type="tel"
                            value={contactForm.phone}
                            onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                            className="w-full rounded-lg border border-gray-200 bg-neutral-50 px-3 py-2.5 text-xs focus:border-gold-500 focus:bg-white focus:outline-none"
                            placeholder="Phone (Optional)"
                          />
                        </div>

                        <div>
                          <textarea
                            value={contactForm.message}
                            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                            rows={3}
                            className="w-full rounded-lg border border-gray-200 bg-neutral-50 px-3 py-2.5 text-xs focus:border-gold-500 focus:bg-white focus:outline-none resize-none"
                            required
                            placeholder="Describe your railway scope or service required..."
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-neutral-950 text-white font-bold tracking-wider text-xs uppercase py-3 rounded-lg hover:bg-gold-500 transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-md"
                        >
                          <span>SEND INQUIRY</span>
                          <Send className="h-3 w-3" />
                        </button>
                      </form>
                    )}
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
