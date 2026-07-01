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
  ChevronDown,
  ExternalLink,
  Users,
  Target,
  Building,
  FileText,
  Bookmark,
  Wind,
  Snowflake,
  Zap,
  Paintbrush,
  Shield,
  Sparkles,
  Droplets,
  Bolt,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminPanel from "./components/AdminPanel";
import AdminLoginPage from "./components/AdminLoginPage";
import { DEFAULT_WEBSITE_DATA } from "./data/defaultData";
import { SERVICES_DETAILS } from "./data/servicesDetails";
import { WebsiteData, ContactMessage, ServiceItem } from "./types";
// @ts-ignore
import nareshbahiWifeImage from "../Nareshbahiwife.jpeg";
// @ts-ignore
import nareshbhaiImage from "../Nareshbhai.jpeg";
import { 
  fetchWebsiteDataFromSupabase, 
  fetchMessagesFromSupabase, 
  saveMessageToSupabase,
  saveWebsiteDataToSupabase,
  deleteMessageFromSupabase
} from "./lib/supabase";

export function sanitizeWebsiteData(parsed: any): WebsiteData {
  if (!parsed) return DEFAULT_WEBSITE_DATA;
  const sanitized: WebsiteData = {
    settings: parsed.settings ? { ...DEFAULT_WEBSITE_DATA.settings, ...parsed.settings } : { ...DEFAULT_WEBSITE_DATA.settings },
    hero: parsed.hero ? { ...DEFAULT_WEBSITE_DATA.hero, ...parsed.hero } : { ...DEFAULT_WEBSITE_DATA.hero },
    about: parsed.about ? { ...DEFAULT_WEBSITE_DATA.about, ...parsed.about } : { ...DEFAULT_WEBSITE_DATA.about },
    services: Array.isArray(parsed.services) ? parsed.services : [...DEFAULT_WEBSITE_DATA.services],
    projects: Array.isArray(parsed.projects) ? parsed.projects : [...DEFAULT_WEBSITE_DATA.projects],
    certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [...DEFAULT_WEBSITE_DATA.certifications],
    gallery: Array.isArray(parsed.gallery) ? parsed.gallery : [...(DEFAULT_WEBSITE_DATA.gallery || [])],
    servicesSlider: Array.isArray(parsed.servicesSlider) ? parsed.servicesSlider : [...(DEFAULT_WEBSITE_DATA.servicesSlider || [])],
    projectsSlider: Array.isArray(parsed.projectsSlider) ? parsed.projectsSlider : [...(DEFAULT_WEBSITE_DATA.projectsSlider || [])],
    certificationsSlider: Array.isArray(parsed.certificationsSlider) ? parsed.certificationsSlider : [...(DEFAULT_WEBSITE_DATA.certificationsSlider || [])],
  };

  if (sanitized.hero && (!sanitized.hero.slides || sanitized.hero.slides.length === 0)) {
    sanitized.hero.slides = DEFAULT_WEBSITE_DATA.hero.slides;
  }
  if (!sanitized.servicesSlider || sanitized.servicesSlider.length === 0) {
    sanitized.servicesSlider = DEFAULT_WEBSITE_DATA.servicesSlider;
  }
  if (!sanitized.projectsSlider || sanitized.projectsSlider.length === 0) {
    sanitized.projectsSlider = DEFAULT_WEBSITE_DATA.projectsSlider;
  }
  if (!sanitized.certificationsSlider || sanitized.certificationsSlider.length === 0) {
    sanitized.certificationsSlider = DEFAULT_WEBSITE_DATA.certificationsSlider;
  }

  return sanitized;
}

export default function App() {
  // Page / Tab routing state
  const [activeTab, setActiveTab] = useState<string>("home");
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  // Load custom-edited website layout settings or default values
  const [data, setData] = useState<WebsiteData>(() => {
    const saved = localStorage.getItem("railconstruct_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return sanitizeWebsiteData(parsed);
      } catch (err) {
        console.error("Failed to parse saved website data.", err);
      }
    }
    return DEFAULT_WEBSITE_DATA;
  });

  // Current active slide in the Hero Banner Slider
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  // Current active slide in the Services Slider
  const [currentServicesSlide, setCurrentServicesSlide] = useState<number>(0);
  // Current active slide in the Projects Slider
  const [currentProjectsSlide, setCurrentProjectsSlide] = useState<number>(0);
  // Current active slide in the Certifications Slider
  const [currentCertificationsSlide, setCurrentCertificationsSlide] = useState<number>(0);
  // Track expanded state for services cards to toggle "Read More"
  const [expandedServices, setExpandedServices] = useState<Record<string, boolean>>({});
  // Track expanded state for projects cards to toggle "Read More"
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});

  // Projects page filter, search and sort states
  const [projectSearchQuery, setProjectSearchQuery] = useState<string>("");
  const [selectedProjectCategory, setSelectedProjectCategory] = useState<string>("All");
  const [selectedProjectState, setSelectedProjectState] = useState<string>("All");
  const [selectedProjectStatus, setSelectedProjectStatus] = useState<string>("All");
  const [projectSortBy, setProjectSortBy] = useState<string>("srNo-asc");

  const toggleServiceExpanded = (id: string) => {
    setExpandedServices(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleProjectExpanded = (id: string) => {
    setExpandedProjects(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Auto-advance hero slides every 6 seconds
  useEffect(() => {
    const slidesCount = data.hero.slides?.length || 0;
    if (slidesCount <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesCount);
    }, 6000);
    return () => clearInterval(interval);
  }, [data.hero.slides]);

  // Auto-advance services slides every 5 seconds
  useEffect(() => {
    const slidesCount = data.servicesSlider?.length || 0;
    if (slidesCount <= 1) return;
    const interval = setInterval(() => {
      setCurrentServicesSlide((prev) => (prev + 1) % slidesCount);
    }, 5000);
    return () => clearInterval(interval);
  }, [data.servicesSlider]);

  // Auto-advance projects slides every 5 seconds
  useEffect(() => {
    const slidesCount = data.projectsSlider?.length || 0;
    if (slidesCount <= 1) return;
    const interval = setInterval(() => {
      setCurrentProjectsSlide((prev) => (prev + 1) % slidesCount);
    }, 5000);
    return () => clearInterval(interval);
  }, [data.projectsSlider]);

  // Auto-advance certifications slides every 5 seconds
  useEffect(() => {
    const slidesCount = data.certificationsSlider?.length || 0;
    if (slidesCount <= 1) return;
    const interval = setInterval(() => {
      setCurrentCertificationsSlide((prev) => (prev + 1) % slidesCount);
    }, 5000);
    return () => clearInterval(interval);
  }, [data.certificationsSlider]);

  // Reset selected service detail page when tab changes
  useEffect(() => {
    if (activeTab !== "services") {
      setSelectedServiceId(null);
    }
  }, [activeTab]);

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
          const sanitized = sanitizeWebsiteData(remoteData);
          setData(sanitized);
          localStorage.setItem("railconstruct_data", JSON.stringify(sanitized));
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
      case "Wind":
        return <Wind className="h-6 w-6 stroke-[2]" />;
      case "Snowflake":
        return <Snowflake className="h-6 w-6 stroke-[2]" />;
      case "Zap":
        return <Zap className="h-6 w-6 stroke-[2]" />;
      case "Paintbrush":
        return <Paintbrush className="h-6 w-6 stroke-[2]" />;
      case "Shield":
        return <Shield className="h-6 w-6 stroke-[2]" />;
      case "Sparkles":
        return <Sparkles className="h-6 w-6 stroke-[2]" />;
      case "Droplets":
        return <Droplets className="h-6 w-6 stroke-[2]" />;
      case "Bolt":
        return <Bolt className="h-6 w-6 stroke-[2]" />;
      case "Train":
        return <Train className="h-6 w-6 stroke-[2]" />;
      case "Building":
        return <Building className="h-6 w-6 stroke-[2]" />;
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
        companyProfileUrl={data.settings.companyProfileUrl}
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
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-24">
              
              {/* Header */}
              <div className="text-center max-w-2xl mx-auto" id="about-heading-box">
                <span className="text-[11px] font-mono font-bold text-gold-500 uppercase tracking-widest block mb-2">
                  ESTABLISHED 2003
                </span>
                <h1 className="font-serif text-4xl font-bold text-neutral-950">
                  {data.about.title}
                </h1>
                <div className="h-1 w-20 bg-gold-500 mx-auto mt-4 rounded"></div>
              </div>

              {/* Legacy Block */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" id="about-legacy-grid">
                {/* Image panel */}
                <div className="lg:col-span-5" id="about-image-container">
                  <div className="rounded-2xl overflow-hidden border border-neutral-200/60 shadow-xl relative aspect-[4/3] bg-neutral-100">
                    <img
                      src={data.about.imageUrl}
                      alt="Utsav Care Corporation Office"
                      className="object-cover h-full w-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 to-transparent"></div>
                    <div className="absolute bottom-5 left-5 text-white">
                      <p className="font-mono text-[10px] text-gold-400 font-bold uppercase tracking-wider">National Railway Partner</p>
                      <h4 className="font-serif text-lg font-bold">Utsav Care Corporation</h4>
                    </div>
                  </div>
                </div>

                {/* Legacy narrative */}
                <div className="lg:col-span-7 space-y-6" id="about-text-container">
                  <span className="inline-block text-[10px] font-mono font-bold text-gold-600 bg-amber-50 border border-gold-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Company Overview
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-950 leading-tight tracking-tight transition-all duration-300">
                    {data.about.legacyHeading}
                  </h2>
                  <div className="space-y-5 text-sm leading-relaxed font-sans">
                    <p className="font-sans text-base text-neutral-800 leading-relaxed border-l-4 border-gold-500 pl-4 py-2 bg-amber-50/20 rounded-r-xl shadow-sm border-t border-r border-b border-neutral-100/50">
                      {data.about.legacyText1.startsWith("Utsav Care Corporation Pvt. Ltd. (UCCPL)") ? (
                        <>
                          <strong className="font-extrabold text-neutral-950 font-serif">Utsav Care Corporation Pvt. Ltd. (UCCPL)</strong>
                          {data.about.legacyText1.slice("Utsav Care Corporation Pvt. Ltd. (UCCPL)".length)}
                        </>
                      ) : (
                        data.about.legacyText1
                      )}
                    </p>
                    <p className="text-neutral-600 font-sans font-light leading-relaxed text-[13px] sm:text-sm">
                      {data.about.legacyText2}
                    </p>
                    <p className="text-neutral-600 font-sans font-light leading-relaxed text-[13px] sm:text-sm">
                      {data.about.legacyText3}
                    </p>
                    {data.about.paragraphs && data.about.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="text-neutral-600 font-sans font-light leading-relaxed text-[13px] sm:text-sm">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mission & Vision Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="about-mission-vision-grid">
                {/* Mission Card */}
                <div className="bg-white border border-gray-200/80 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 h-full w-[4px] bg-gold-500"></div>
                  <div className="flex items-center space-x-4 mb-5">
                    <div className="h-12 w-12 rounded-xl bg-amber-50 border border-gold-500/10 flex items-center justify-center text-gold-600 shadow-sm">
                      <Target className="h-6 w-6 stroke-[1.5]" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-neutral-950">Our Mission</h3>
                  </div>
                  <p className="text-gray-500 font-sans font-light text-sm leading-relaxed">
                    To provide innovative, reliable, and cost-effective engineering and technical solutions that enhance operational efficiency while maintaining the highest standards of quality, safety, and customer satisfaction.
                  </p>
                </div>

                {/* Vision Card */}
                <div className="bg-white border border-gray-200/80 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 h-full w-[4px] bg-neutral-950"></div>
                  <div className="flex items-center space-x-4 mb-5">
                    <div className="h-12 w-12 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-800 shadow-sm">
                      <Bookmark className="h-6 w-6 stroke-[1.5]" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-neutral-950">Our Vision</h3>
                  </div>
                  <p className="text-gray-500 font-sans font-light text-sm leading-relaxed">
                    To become one of India's most trusted engineering and technical service providers by delivering excellence through innovation, skilled workforce, and long-term customer relationships.
                  </p>
                </div>
              </div>

              {/* Corporate Information */}
              <div className="bg-white border border-gray-200/85 rounded-2xl shadow-sm overflow-hidden" id="about-corporate-info-section">
                <div className="bg-neutral-950 p-6 sm:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-800 gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-bold text-gold-400 uppercase tracking-widest block">
                      OFFICIAL DOCUMENTATION
                    </span>
                    <h3 className="font-serif text-xl font-bold text-white">
                      Corporate Information
                    </h3>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 rounded px-3 py-1 text-[11px] text-gray-400 font-mono">
                    CIN: U41002GJ2025PTC160691
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100">
                  {[
                    { key: "Corporate Identification Number (CIN)", val: "U41002GJ2025PTC160691", icon: FileText, isMono: true },
                    { key: "Date of Incorporation", val: "26 March 2025", icon: Clock, isMono: false },
                    { key: "Registration Number", val: "160691", icon: Building, isMono: true },
                    { key: "Company Category", val: "Company Limited by Shares", icon: Users, isMono: false },
                    { key: "Permanent Account Number (PAN)", val: "AADCU7929C", icon: FileText, isMono: true },
                    { key: "Tax Deduction Account Number (TAN)", val: "SRTU02334D", icon: FileText, isMono: true },
                    { key: "Startup India Certificate", val: "DIPP205804", icon: Award, isMono: true },
                    { key: "MSME Registration", val: "UDYAM-GJ-22-0505347", icon: Award, isMono: true },
                    { key: "GST Registration Number", val: "24AADCU7929C1ZD", icon: FileText, isMono: true },
                    { key: "ISO Certification", val: "ISO 9001:2015", icon: ShieldCheck, isMono: false },
                    { key: "ISO Certificate Number", val: "25DQPL55", icon: ShieldCheck, isMono: true },
                    { key: "Official Email", val: "utsavcare48@gmail.com", icon: Mail, isMono: false, isEmail: true },
                    { key: "Alternate Email", val: "utsavcarecpl4488@gmail.com", icon: Mail, isMono: false, isEmail: true }
                  ].map((item, idx) => {
                    const IconComp = item.icon;
                    return (
                      <div key={idx} className="bg-white p-5 sm:p-6 space-y-2 hover:bg-neutral-50/50 transition-all duration-200">
                        <div className="flex items-center space-x-2.5 text-neutral-400">
                          <IconComp className="h-4 w-4 stroke-[1.8]" />
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            {item.key}
                          </span>
                        </div>
                        {item.isEmail ? (
                          <a
                            href={`mailto:${item.val}`}
                            className="block text-sm font-semibold text-gold-600 hover:text-gold-700 hover:underline transition-all"
                          >
                            {item.val}
                          </a>
                        ) : (
                          <p className={`text-sm font-semibold text-neutral-900 ${item.isMono ? "font-mono tracking-wide" : ""}`}>
                            {item.val}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Leadership Team Section */}
              <div className="space-y-8" id="about-leadership-section">
                <div className="text-center space-y-2">
                  <span className="text-[10px] font-mono font-bold text-gold-500 uppercase tracking-widest block">
                    BOARD OF DIRECTORS
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-neutral-950">
                    Corporate Leadership
                  </h3>
                  <div className="h-0.5 w-12 bg-gold-500 mx-auto mt-2 rounded"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {/* Leader 1 */}
                  <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 hover:shadow-md transition-all duration-300">
                    <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-gold-500/20 shadow-md shrink-0 bg-neutral-100 flex items-center justify-center">
                      <img
                        src={nareshbhaiImage}
                        alt="Mr. Nareshbhai Vasantlal Thakkar"
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="space-y-3 text-center sm:text-left">
                      <div>
                        <h4 className="font-serif text-lg font-bold text-neutral-950">Mr. Nareshbhai Vasantlal Thakkar</h4>
                        <p className="text-xs font-mono font-bold text-gold-600 uppercase tracking-wider mt-0.5">Director</p>
                      </div>
                      <div className="space-y-1 text-xs text-gray-500 font-sans">
                        <div className="flex items-center justify-center sm:justify-start space-x-2">
                          <span className="font-bold text-gray-400 w-12">DIN:</span>
                          <span className="font-mono text-neutral-900">11021747</span>
                        </div>
                        <div className="flex items-center justify-center sm:justify-start space-x-2">
                          <span className="font-bold text-gray-400 w-12">Mobile:</span>
                          <a href="tel:+919825148134" className="text-neutral-900 hover:text-gold-600 font-semibold hover:underline transition-all">
                            +91 98251 48134
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Leader 2 */}
                  <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 hover:shadow-md transition-all duration-300">
                    <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-gold-500/20 shadow-md shrink-0 bg-neutral-100 flex items-center justify-center">
                      <img
                        src={nareshbahiWifeImage}
                        alt="Mrs. Rachana Nareshbhai Thakkar"
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="space-y-3 text-center sm:text-left">
                      <div>
                        <h4 className="font-serif text-lg font-bold text-neutral-950">Mrs. Rachana Nareshbhai Thakkar</h4>
                        <p className="text-xs font-mono font-bold text-gold-600 uppercase tracking-wider mt-0.5">Director</p>
                      </div>
                      <div className="space-y-1 text-xs text-gray-500 font-sans">
                        <div className="flex items-center justify-center sm:justify-start space-x-2">
                          <span className="font-bold text-gray-400 w-12">DIN:</span>
                          <span className="font-mono text-neutral-900">11021748</span>
                        </div>
                        <div className="flex items-center justify-center sm:justify-start space-x-2">
                          <span className="font-bold text-gray-400 w-12">Mobile:</span>
                          <a href="tel:+919825148034" className="text-neutral-900 hover:text-gold-600 font-semibold hover:underline transition-all">
                            +91 98251 48034
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why Choose UCCPL Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" id="about-why-choose-section">
                <div className="lg:col-span-5 space-y-4">
                  <span className="text-[10px] font-mono font-bold text-gold-500 uppercase tracking-widest block">
                    THE TRUSTED ADVANTAGE
                  </span>
                  <h3 className="font-serif text-3xl font-bold text-neutral-950 leading-tight">
                    Why Choose UCCPL?
                  </h3>
                  <div className="h-1 w-16 bg-gold-500 rounded"></div>
                  <p className="text-sm text-gray-500 font-sans font-light leading-relaxed">
                    Utsav Care Corporation Pvt. Ltd. remains committed to building long-term partnerships by delivering dependable engineering services, advanced technical expertise, and sustainable solutions that contribute to the growth and modernization of India's railway infrastructure.
                  </p>
                </div>

                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Legacy of engineering excellence since 2003",
                    "Specialized technical services for Indian Railways",
                    "ISO 9001:2015 Certified Organization",
                    "MSME Registered Enterprise",
                    "Startup India Recognized Company",
                    "Experienced leadership and skilled workforce",
                    "Strong commitment to quality, safety, and timely project delivery",
                    "Customer-centric approach with innovative engineering solutions"
                  ].map((point, idx) => (
                    <div key={idx} className="flex items-start space-x-3 p-4 bg-white border border-gray-100 rounded-xl hover:border-gold-500/10 hover:shadow-sm transition-all duration-200">
                      <div className="h-5 w-5 rounded-full bg-amber-50 border border-gold-500/20 flex items-center justify-center text-gold-600 shrink-0 mt-0.5">
                        <Check className="h-3 w-3 stroke-[2.5]" />
                      </div>
                      <span className="text-xs font-semibold text-neutral-800 leading-normal">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image Gallery Section */}
              <div className="py-16 border-t border-gray-100" id="about-image-gallery-section">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-4" id="gallery-header">
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono font-bold text-gold-500 uppercase tracking-widest block">
                      Utsav Care Family.
                    </span>
                    <h2 className="font-serif text-3xl font-bold text-neutral-950">
                      Our Team and Work Force.
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
              
              {selectedServiceId ? (
                // ----------------- DEDICATED SERVICE DETAIL PAGE -----------------
                (() => {
                  const srv = data.services.find(s => s.id === selectedServiceId);
                  const detailFallback = SERVICES_DETAILS[selectedServiceId] || {
                    id: selectedServiceId,
                    title: "Service Details",
                    overview: "Comprehensive solutions engineered to meet severe operational demands.",
                    bullets: ["Professional Setup & Testing", "Preventive Maintenance Audits", "24/7 Breakdown & Field Support"],
                    imageUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80"
                  };
                  const detail = {
                    id: selectedServiceId,
                    title: srv?.title || detailFallback.title,
                    overview: srv?.overview || srv?.longDescription || detailFallback.overview,
                    bullets: srv?.bullets && srv.bullets.length > 0 ? srv.bullets : detailFallback.bullets,
                    imageUrl: srv?.imageUrl || detailFallback.imageUrl
                  };
                  const otherServices = data.services.filter(s => s.id !== selectedServiceId);

                  return (
                    <div className="space-y-12 animate-fade-in" id={`dedicated-service-${selectedServiceId}`}>
                      {/* Back navigation and breadcrumbs */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-6">
                        <button
                          onClick={() => {
                            setSelectedServiceId(null);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="inline-flex items-center text-xs font-mono font-bold text-neutral-500 hover:text-gold-500 transition-colors cursor-pointer group"
                        >
                          <ChevronLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" />
                          <span>BACK TO ALL SERVICES</span>
                        </button>
                        <div className="text-xs text-gray-400 font-mono">
                          SERVICES / <span className="text-gold-600 font-bold uppercase">{srv?.title || "DETAIL"}</span>
                        </div>
                      </div>

                      {/* Header with Title and Big Icon */}
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-amber-50 border border-gold-500/20 text-gold-600 shadow-md">
                          {renderServiceIcon(srv?.iconName || "Wrench")}
                        </div>
                        <div>
                          <h1 className="font-serif text-3xl md:text-4xl font-bold text-neutral-950 tracking-tight">
                            {srv?.title || detail.title}
                          </h1>
                          <p className="text-sm text-gray-500 mt-1 font-sans font-light max-w-3xl">
                            {srv?.description}
                          </p>
                        </div>
                      </div>

                      {/* Side-by-side Columns */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Left column: High-quality Illustration & Detailed Overview */}
                        <div className="lg:col-span-2 space-y-8">
                          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-neutral-150">
                            <img
                              src={detail.imageUrl}
                              alt={srv?.title || detail.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-transparent"></div>
                          </div>

                          <div className="space-y-4">
                            <h2 className="font-serif text-2xl font-bold text-neutral-950 flex items-center gap-2">
                              <span className="h-5 w-1 bg-gold-500 rounded-full inline-block"></span>
                              <span>Service Overview</span>
                            </h2>
                            <p className="text-base text-gray-600 font-sans font-light leading-relaxed whitespace-pre-line">
                              {detail.overview}
                            </p>
                          </div>
                        </div>

                        {/* Right column: Bulleted checklist & Call to Action */}
                        <div className="space-y-8">
                          {/* Bullet Checklist Card */}
                          <div className="bg-neutral-950 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden border border-neutral-900">
                            <div className="absolute -top-12 -right-12 h-36 w-36 bg-gold-500/10 rounded-full blur-3xl"></div>
                            
                            <h3 className="font-serif text-lg font-bold text-white mb-6 border-b border-white/10 pb-4 tracking-wide">
                              Our Services Include
                            </h3>
                            <ul className="space-y-4">
                              {detail.bullets.map((bullet, idx) => (
                                <li key={idx} className="flex items-start space-x-3 text-sm text-gray-300">
                                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-gold-400 mt-0.5">
                                    <Check className="h-3 w-3 stroke-[3]" />
                                  </span>
                                  <span className="font-sans font-light leading-snug">{bullet}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Instant Quote / Contextual contact banner */}
                          <div className="bg-neutral-50 border border-gray-100 p-8 rounded-3xl text-center space-y-4 shadow-sm hover:shadow-md transition-all">
                            <h4 className="font-serif text-lg font-bold text-neutral-950">
                              Have an upcoming project?
                            </h4>
                            <p className="text-xs text-gray-500 font-sans leading-relaxed">
                              Get in touch with our operations desk to receive a technical quote and custom maintenance proposal.
                            </p>
                            <button
                              onClick={() => {
                                setActiveTab("contact");
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className="w-full inline-flex items-center justify-center space-x-2 bg-neutral-950 text-white font-bold py-3.5 px-6 rounded-xl hover:bg-gold-500 hover:text-neutral-900 transition-all text-xs tracking-wider cursor-pointer duration-300"
                            >
                              <span>GET AN INSTANT QUOTE</span>
                              <ArrowRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Footer: Browse other 10 services */}
                      <div className="border-t border-gray-100 pt-12 mt-12 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <h3 className="font-serif text-xl font-bold text-neutral-950">
                            Explore Other Services
                          </h3>
                          <button
                            onClick={() => {
                              setSelectedServiceId(null);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="text-xs font-mono font-bold text-gold-600 hover:text-gold-700 flex items-center gap-1 cursor-pointer"
                          >
                            <span>VIEW ALL SERVICES</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                          {otherServices.map(otherSrv => (
                            <button
                              key={otherSrv.id}
                              onClick={() => {
                                setSelectedServiceId(otherSrv.id);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className="text-left border border-gray-100 p-5 rounded-xl bg-neutral-50/50 hover:bg-white hover:border-gold-500 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full group cursor-pointer"
                            >
                              <div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-gray-100 text-gold-600 mb-3 shadow-xs group-hover:border-gold-500/20 group-hover:bg-amber-50 transition-colors">
                                  {renderServiceIcon(otherSrv.iconName)}
                                </div>
                                <h4 className="font-serif text-sm font-bold text-neutral-900 line-clamp-1 mb-1">
                                  {otherSrv.title}
                                </h4>
                                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed font-sans font-light">
                                  {otherSrv.description}
                                </p>
                              </div>
                              <span className="text-[10px] font-mono font-bold text-gold-600 group-hover:text-gold-700 inline-flex items-center gap-0.5 mt-3">
                                <span>VIEW PAGE</span>
                                <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  );
                })()
              ) : (
                // ----------------- SERVICES GRID VIEW (Original) -----------------
                <>
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

                  {/* Services Image Slider */}
                  {data.servicesSlider && data.servicesSlider.length > 0 && (
                    <div className="mb-16 relative rounded-3xl overflow-hidden shadow-xl aspect-video md:aspect-[21/9] bg-neutral-900 group animate-fade-in" id="services-images-slider">
                      <AnimatePresence mode="wait">
                        {data.servicesSlider.map((slide, sIdx) => {
                          if (sIdx !== currentServicesSlide) return null;
                          return (
                            <motion.div
                              key={slide.id}
                              initial={{ opacity: 0, scale: 1.02 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.98 }}
                              transition={{ duration: 0.6, ease: "easeInOut" }}
                              className="absolute inset-0 w-full h-full"
                            >
                              {/* Image */}
                              <img
                                src={slide.url}
                                alt={slide.caption || "Service Showcase"}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                              {/* Gradient Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-900/30 to-transparent"></div>
                              
                              {/* Text/Caption */}
                              {slide.caption && (
                                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white z-10 text-left">
                                  <span className="text-[10px] font-mono font-bold text-gold-400 uppercase tracking-widest block mb-2">
                                    FIELD OPERATIONS SHOWCASE
                                  </span>
                                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide max-w-2xl">
                                    {slide.caption}
                                  </h3>
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>

                      {/* Left Button */}
                      <button
                        onClick={() => {
                          const total = data.servicesSlider?.length || 0;
                          setCurrentServicesSlide((prev) => (prev - 1 + total) % total);
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-neutral-950/40 text-white border border-white/10 hover:border-gold-500 hover:text-gold-500 flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-300 shadow-md cursor-pointer"
                        aria-label="Previous Slide"
                      >
                        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                      </button>

                      {/* Right Button */}
                      <button
                        onClick={() => {
                          const total = data.servicesSlider?.length || 0;
                          setCurrentServicesSlide((prev) => (prev + 1) % total);
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-neutral-950/40 text-white border border-white/10 hover:border-gold-500 hover:text-gold-500 flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-300 shadow-md cursor-pointer"
                        aria-label="Next Slide"
                      >
                        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                      </button>

                      {/* Navigation dots */}
                      <div className="absolute bottom-4 right-6 sm:right-10 z-20 flex space-x-2">
                        {data.servicesSlider.map((_, dIdx) => (
                          <button
                            key={dIdx}
                            onClick={() => setCurrentServicesSlide(dIdx)}
                            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                              dIdx === currentServicesSlide ? "w-6 bg-gold-500" : "w-2 bg-white/40 hover:bg-white/70"
                            }`}
                            aria-label={`Go to slide ${dIdx + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Services Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="services-cards-grid">
                    {data.services.map((srv) => (
                      <div
                        key={srv.id}
                        className="border border-gray-200 p-8 rounded-2xl bg-white hover:border-gold-500 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 flex flex-col items-start justify-between h-full"
                      >
                        <div className="w-full">
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

                        <div className="mt-6 w-full pt-4 border-t border-gray-100 flex items-center justify-between">
                          <button
                            onClick={() => {
                              setSelectedServiceId(srv.id);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="text-xs font-bold tracking-wider text-neutral-950 hover:text-gold-500 flex items-center gap-1 transition-all cursor-pointer group/btn"
                          >
                            <span>VIEW SERVICE PAGE</span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                          </button>

                          {srv.longDescription && (
                            <button
                              onClick={() => toggleServiceExpanded(srv.id)}
                              className="text-xs font-mono font-bold text-gray-400 hover:text-gold-600 flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <span>{expandedServices[srv.id] ? "LESS" : "MORE"}</span>
                              <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${expandedServices[srv.id] ? "rotate-180" : ""}`} />
                            </button>
                          )}
                        </div>

                        {srv.longDescription && (
                          <div className="w-full">
                            <AnimatePresence initial={false}>
                              {expandedServices[srv.id] && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                  animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                                  exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                  transition={{ duration: 0.3, ease: "easeInOut" }}
                                  className="overflow-hidden w-full"
                                >
                                  <p className="text-xs text-gray-500 leading-relaxed font-sans font-light bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                                    {srv.longDescription}
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}

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

              {/* Projects Image Slider */}
              {data.projectsSlider && data.projectsSlider.length > 0 && (
                <div className="mb-16 relative rounded-3xl overflow-hidden shadow-xl aspect-video md:aspect-[21/9] bg-neutral-900 group animate-fade-in" id="projects-images-slider">
                  <AnimatePresence mode="wait">
                    {data.projectsSlider.map((slide, sIdx) => {
                      if (sIdx !== currentProjectsSlide) return null;
                      return (
                        <motion.div
                          key={slide.id}
                          initial={{ opacity: 0, scale: 1.02 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.6, ease: "easeInOut" }}
                          className="absolute inset-0 w-full h-full"
                        >
                          {/* Image */}
                          <img
                            src={slide.url}
                            alt={slide.caption || "Project Showcase"}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-900/30 to-transparent"></div>
                          
                          {/* Text/Caption */}
                          {slide.caption && (
                            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white z-10 text-left">
                              <span className="text-[10px] font-mono font-bold text-gold-400 uppercase tracking-widest block mb-2">
                                PROJECT SITE SHOWCASE
                              </span>
                              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide max-w-2xl">
                                {slide.caption}
                              </h3>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  {/* Left Button */}
                  <button
                    onClick={() => {
                      const total = data.projectsSlider?.length || 0;
                      setCurrentProjectsSlide((prev) => (prev - 1 + total) % total);
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-neutral-950/40 text-white border border-white/10 hover:border-gold-500 hover:text-gold-500 flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-300 shadow-md cursor-pointer"
                    aria-label="Previous Slide"
                  >
                    <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>

                  {/* Right Button */}
                  <button
                    onClick={() => {
                      const total = data.projectsSlider?.length || 0;
                      setCurrentProjectsSlide((prev) => (prev + 1) % total);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-neutral-950/40 text-white border border-white/10 hover:border-gold-500 hover:text-gold-500 flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-300 shadow-md cursor-pointer"
                    aria-label="Next Slide"
                  >
                    <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>

                  {/* Navigation dots */}
                  <div className="absolute bottom-4 right-6 sm:right-10 z-20 flex space-x-2">
                    {data.projectsSlider.map((_, dIdx) => (
                      <button
                        key={dIdx}
                        onClick={() => setCurrentProjectsSlide(dIdx)}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          dIdx === currentProjectsSlide ? "w-6 bg-gold-500" : "w-2 bg-white/40 hover:bg-white/70"
                        }`}
                        aria-label={`Go to slide ${dIdx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Projects Dashboard - Stats Row */}
              {(() => {
                // Compute stats based on the full list of projects
                const totalCount = data.projects.length;
                const completedCount = data.projects.filter(p => p.status === 'completed').length;
                const ongoingCount = data.projects.filter(p => p.status === 'ongoing').length;
                const statesCount = Array.from(new Set(data.projects.map(p => p.state).filter(Boolean))).length;

                // Extract unique categories and states dynamically
                const categories = Array.from(new Set(data.projects.map((p) => p.category).filter(Boolean))).sort();
                const states = Array.from(new Set(data.projects.map((p) => p.state).filter(Boolean))).sort();

                // Perform filtering and sorting
                const filteredProjects = data.projects.filter((proj) => {
                  const matchesSearch =
                    projectSearchQuery === "" ||
                    proj.title.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
                    (proj.client || "").toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
                    (proj.location || "").toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
                    (proj.description || "").toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
                    (proj.longDescription || "").toLowerCase().includes(projectSearchQuery.toLowerCase());

                  const matchesCategory =
                    selectedProjectCategory === "All" ||
                    proj.category === selectedProjectCategory;

                  const matchesState =
                    selectedProjectState === "All" ||
                    proj.state === selectedProjectState;

                  const matchesStatus =
                    selectedProjectStatus === "All" ||
                    proj.status === selectedProjectStatus;

                  return matchesSearch && matchesCategory && matchesState && matchesStatus;
                }).sort((a, b) => {
                  if (projectSortBy === "srNo-asc") {
                    return (a.srNo || 999) - (b.srNo || 999);
                  } else if (projectSortBy === "srNo-desc") {
                    return (b.srNo || 0) - (a.srNo || 0);
                  } else if (projectSortBy === "title-asc") {
                    return a.title.localeCompare(b.title);
                  }
                  return 0;
                });

                const isFiltered = projectSearchQuery !== "" || selectedProjectCategory !== "All" || selectedProjectState !== "All" || selectedProjectStatus !== "All";

                const handleResetFilters = () => {
                  setProjectSearchQuery("");
                  setSelectedProjectCategory("All");
                  setSelectedProjectState("All");
                  setSelectedProjectStatus("All");
                  setProjectSortBy("srNo-asc");
                };

                return (
                  <div className="space-y-10">
                    {/* Performance Stat achievements counter cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" id="projects-stats-row">
                      <div className="bg-neutral-50/50 p-5 sm:p-6 rounded-2xl border border-gray-150 text-center space-y-1">
                        <span className="block font-mono text-3xl sm:text-4xl font-bold text-neutral-900">
                          {totalCount}
                        </span>
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          TOTAL CONTRACTS EXECUTED
                        </span>
                      </div>
                      <div className="bg-neutral-50/50 p-5 sm:p-6 rounded-2xl border border-gray-150 text-center space-y-1">
                        <span className="block font-mono text-3xl sm:text-4xl font-bold text-emerald-600">
                          {completedCount}
                        </span>
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          COMPLETED TASKS
                        </span>
                      </div>
                      <div className="bg-neutral-50/50 p-5 sm:p-6 rounded-2xl border border-gray-150 text-center space-y-1">
                        <span className="block font-mono text-3xl sm:text-4xl font-bold text-amber-600">
                          {ongoingCount}
                        </span>
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          ONGOING & ACTIVE
                        </span>
                      </div>
                      <div className="bg-neutral-50/50 p-5 sm:p-6 rounded-2xl border border-gray-150 text-center space-y-1">
                        <span className="block font-mono text-3xl sm:text-4xl font-bold text-gold-500">
                          {statesCount}
                        </span>
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          STATES COVERED
                        </span>
                      </div>
                    </div>

                    {/* Controls Bar: Search, Category, State, Status, Sorting */}
                    <div className="bg-neutral-50 border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm" id="projects-controls-panel">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        {/* Search Input */}
                        <div className="lg:col-span-4 relative">
                          <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                            Search Project Data
                          </label>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                              type="text"
                              value={projectSearchQuery}
                              onChange={(e) => setProjectSearchQuery(e.target.value)}
                              placeholder="Search by title, client, city..."
                              className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 py-2.5 text-xs font-medium text-neutral-900 shadow-xs focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all outline-none"
                            />
                            {projectSearchQuery && (
                              <button
                                onClick={() => setProjectSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400 hover:text-neutral-600"
                              >
                                Clear
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Category Dropdown */}
                        <div className="lg:col-span-2">
                          <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                            Work Category
                          </label>
                          <select
                            value={selectedProjectCategory}
                            onChange={(e) => setSelectedProjectCategory(e.target.value)}
                            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-xs font-bold text-neutral-900 shadow-xs focus:border-gold-500 outline-none"
                          >
                            <option value="All">All Categories ({categories.length})</option>
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* State Dropdown */}
                        <div className="lg:col-span-2">
                          <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                            State / Territory
                          </label>
                          <select
                            value={selectedProjectState}
                            onChange={(e) => setSelectedProjectState(e.target.value)}
                            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-xs font-bold text-neutral-900 shadow-xs focus:border-gold-500 outline-none"
                          >
                            <option value="All">All States ({states.length})</option>
                            {states.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Status Dropdown */}
                        <div className="lg:col-span-2">
                          <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                            Contract Status
                          </label>
                          <select
                            value={selectedProjectStatus}
                            onChange={(e) => setSelectedProjectStatus(e.target.value)}
                            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-xs font-bold text-neutral-900 shadow-xs focus:border-gold-500 outline-none"
                          >
                            <option value="All">All Statuses</option>
                            <option value="completed">Completed</option>
                            <option value="ongoing">Ongoing</option>
                          </select>
                        </div>

                        {/* Sort Order */}
                        <div className="lg:col-span-2">
                          <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                            Sort Priority
                          </label>
                          <select
                            value={projectSortBy}
                            onChange={(e) => setProjectSortBy(e.target.value)}
                            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-xs font-bold text-neutral-900 shadow-xs focus:border-gold-500 outline-none"
                          >
                            <option value="srNo-asc">Serial No (Lowest First)</option>
                            <option value="srNo-desc">Serial No (Highest First)</option>
                            <option value="title-asc">Project Title (A-Z)</option>
                          </select>
                        </div>
                      </div>

                      {/* Filter Badges & Clear Button */}
                      {isFiltered && (
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-200">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">
                              Active Filters:
                            </span>
                            {projectSearchQuery && (
                              <span className="inline-flex items-center gap-1 bg-neutral-900 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full">
                                Search: "{projectSearchQuery}"
                                <button onClick={() => setProjectSearchQuery("")} className="ml-1 text-gold-400 hover:text-white">×</button>
                              </span>
                            )}
                            {selectedProjectCategory !== "All" && (
                              <span className="inline-flex items-center gap-1 bg-gold-500 text-neutral-950 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full">
                                Category: {selectedProjectCategory}
                                <button onClick={() => setSelectedProjectCategory("All")} className="ml-1 text-red-700 hover:text-neutral-950">×</button>
                              </span>
                            )}
                            {selectedProjectState !== "All" && (
                              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-amber-200">
                                State: {selectedProjectState}
                                <button onClick={() => setSelectedProjectState("All")} className="ml-1 text-amber-700 hover:text-amber-950">×</button>
                              </span>
                            )}
                            {selectedProjectStatus !== "All" && (
                              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                                Status: {selectedProjectStatus}
                                <button onClick={() => setSelectedProjectStatus("All")} className="ml-1 text-emerald-700 hover:text-emerald-950">×</button>
                              </span>
                            )}
                          </div>
                          <button
                            onClick={handleResetFilters}
                            className="text-xs font-mono font-bold text-red-500 hover:text-red-700 flex items-center gap-1 transition-all"
                          >
                            <span>RESET ALL FILTERS</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Results Count Heading */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <span className="text-xs font-mono font-bold text-gray-400">
                        SHOWING {filteredProjects.length} OF {totalCount} CONTRACT RECORDS
                      </span>
                    </div>

                    {/* Project Cards Grid */}
                    {filteredProjects.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="projects-showcase-grid">
                        {filteredProjects.map((proj) => (
                          <div
                            key={proj.id}
                            className="group bg-white border border-gray-200 hover:border-gold-500 hover:shadow-2xl overflow-hidden rounded-3xl transition-all duration-300 flex flex-col h-full relative"
                          >
                            {/* Sr No Indicator */}
                            {proj.srNo && (
                              <div className="absolute top-4 left-4 z-10 bg-neutral-950/80 backdrop-blur-md text-white border border-white/10 font-mono text-[10px] font-bold px-2.5 py-1 rounded-lg">
                                SR. NO. {proj.srNo}
                              </div>
                            )}

                            {/* Status badge */}
                            <div className="absolute top-4 right-4 z-10">
                              {proj.status === "completed" ? (
                                <span className="bg-emerald-550/90 backdrop-blur-md text-white text-[9px] font-mono font-bold px-2.5 py-1 rounded-md tracking-wider flex items-center gap-1 shadow">
                                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
                                  COMPLETED
                                </span>
                              ) : (
                                <span className="bg-amber-550/90 backdrop-blur-md text-white text-[9px] font-mono font-bold px-2.5 py-1 rounded-md tracking-wider flex items-center gap-1 shadow">
                                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
                                  ONGOING
                                </span>
                              )}
                            </div>

                            {/* Image box */}
                            <div className="aspect-[16/10] overflow-hidden bg-gray-100 relative">
                              <img
                                src={proj.image}
                                alt={proj.title}
                                className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-500"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80";
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/10 via-transparent to-transparent"></div>
                            </div>

                            {/* Card Content Details */}
                            <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                              <div className="space-y-3">
                                {/* Category Badge */}
                                {proj.category && (
                                  <span className="inline-block text-[9px] font-bold bg-gold-500/10 text-gold-700 px-2 py-0.5 rounded uppercase tracking-wider">
                                    {proj.category}
                                  </span>
                                )}

                                <h3 className="font-serif text-lg font-bold text-neutral-900 leading-tight group-hover:text-gold-600 transition-colors">
                                  {proj.title}
                                </h3>

                                {/* Client and Location meta info */}
                                <div className="space-y-1.5 pt-2">
                                  {proj.client && (
                                    <div className="flex items-center text-xs text-gray-500 font-sans font-medium gap-1.5">
                                      <Building className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                                      <span className="line-clamp-1">{proj.client}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center text-xs text-gray-500 font-sans font-medium gap-1.5">
                                    <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                                    <span>{proj.location}{proj.state ? `, ${proj.state}` : ""}</span>
                                  </div>
                                </div>

                                <p className="text-xs text-gray-500 leading-relaxed font-sans font-light pt-2">
                                  {proj.description}
                                </p>
                              </div>

                              {proj.longDescription && (
                                <div className="pt-3 border-t border-gray-100">
                                  <button
                                    onClick={() => toggleProjectExpanded(proj.id)}
                                    className="text-xs font-mono font-bold text-gold-600 hover:text-gold-700 flex items-center gap-1 transition-all cursor-pointer"
                                  >
                                    <span>{expandedProjects[proj.id] ? "READ LESS" : "READ MORE"}</span>
                                    <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${expandedProjects[proj.id] ? "rotate-180" : ""}`} />
                                  </button>

                                  <AnimatePresence initial={false}>
                                    {expandedProjects[proj.id] && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                        animate={{ height: "auto", opacity: 1, marginTop: 10 }}
                                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                        transition={{ duration: 0.2, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                      >
                                        <div className="text-xs text-gray-500 leading-relaxed font-sans font-light bg-neutral-50 p-3 rounded-xl border border-neutral-100 whitespace-pre-line">
                                          {proj.longDescription}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Empty state fallback */
                      <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-3xl bg-neutral-50/50 space-y-4">
                        <Search className="h-10 w-10 text-gray-400 mx-auto stroke-[1.5]" />
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold text-neutral-900">No project records match your filters</h4>
                          <p className="text-xs text-gray-400 max-w-sm mx-auto font-sans font-light">
                            Try shifting or resetting your search term, select category, or state filter to view active contracts.
                          </p>
                        </div>
                        <button
                          onClick={handleResetFilters}
                          className="bg-neutral-950 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-gold-500 hover:text-neutral-950 transition-all cursor-pointer"
                        >
                          Clear All Filters
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
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

              {/* Certifications Image Slider */}
              {data.certificationsSlider && data.certificationsSlider.length > 0 && (
                <div className="mb-16 relative rounded-3xl overflow-hidden shadow-xl aspect-video md:aspect-[21/9] bg-neutral-900 group animate-fade-in" id="certifications-images-slider">
                  <AnimatePresence mode="wait">
                    {data.certificationsSlider.map((slide, sIdx) => {
                      if (sIdx !== currentCertificationsSlide) return null;
                      return (
                        <motion.div
                          key={slide.id}
                          initial={{ opacity: 0, scale: 1.02 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.6, ease: "easeInOut" }}
                          className="absolute inset-0 w-full h-full"
                        >
                          {/* Image */}
                          <img
                            src={slide.url}
                            alt={slide.caption || "Certification Showcase"}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-900/30 to-transparent"></div>
                          
                          {/* Text/Caption */}
                          {slide.caption && (
                            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white z-10 text-left">
                              <span className="text-[10px] font-mono font-bold text-gold-400 uppercase tracking-widest block mb-2">
                                OFFICIAL AUDIT & CERTIFICATE RECORD
                              </span>
                              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide max-w-2xl">
                                {slide.caption}
                              </h3>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  {/* Left Button */}
                  <button
                    onClick={() => {
                      const total = data.certificationsSlider?.length || 0;
                      setCurrentCertificationsSlide((prev) => (prev - 1 + total) % total);
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-neutral-950/40 text-white border border-white/10 hover:border-gold-500 hover:text-gold-500 flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-300 shadow-md cursor-pointer"
                    aria-label="Previous Slide"
                  >
                    <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>

                  {/* Right Button */}
                  <button
                    onClick={() => {
                      const total = data.certificationsSlider?.length || 0;
                      setCurrentCertificationsSlide((prev) => (prev + 1) % total);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-neutral-950/40 text-white border border-white/10 hover:border-gold-500 hover:text-gold-500 flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-300 shadow-md cursor-pointer"
                    aria-label="Next Slide"
                  >
                    <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>

                  {/* Navigation dots */}
                  <div className="absolute bottom-4 right-6 sm:right-10 z-20 flex space-x-2">
                    {data.certificationsSlider.map((_, dIdx) => (
                      <button
                        key={dIdx}
                        onClick={() => setCurrentCertificationsSlide(dIdx)}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          dIdx === currentCertificationsSlide ? "w-6 bg-gold-500" : "w-2 bg-white/40 hover:bg-white/70"
                        }`}
                        aria-label={`Go to slide ${dIdx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}

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
                          {data.settings.emailAlt && (
                            <a href={`mailto:${data.settings.emailAlt}`} className="block text-xs text-neutral-400 hover:text-gold-400 transition-colors">
                              Alternative: {data.settings.emailAlt}
                            </a>
                          )}
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
