/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Save,
  RotateCcw,
  Trash2,
  Plus,
  FileDown,
  FileUp,
  LogOut,
  Building,
  Award,
  Briefcase,
  Wrench,
  Mail,
  Settings as SettingsIcon,
  Check,
  Eye,
  Info,
  Upload,
  Copy,
  Image as ImageIcon,
  Database,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  FileText,
} from "lucide-react";
import {
  WebsiteData,
  CompanySettings,
  HeroData,
  AboutData,
  ServiceItem,
  ProjectItem,
  CertificationItem,
  ContactMessage,
  GalleryItem,
  ServicesSliderItem,
  ProjectsSliderItem,
  CertificationsSliderItem,
} from "../types";
import {
  isSupabaseConfigured,
  getSupabaseProjectUrl,
  SUPABASE_SQL_SCHEMA,
  testSupabaseConnection,
  saveWebsiteDataToSupabase,
  fetchWebsiteDataFromSupabase,
  fetchMessagesFromSupabase,
  saveSupabaseOverride,
  supabase,
} from "../lib/supabase";
import { sanitizeWebsiteData } from "../App";

interface AdminPanelProps {
  data: WebsiteData;
  onUpdateData: (newData: WebsiteData) => void;
  contactMessages: ContactMessage[];
  onClearMessages: () => void;
  onDeleteMessage: (id: string) => void;
  onLogout: () => void;
  onResetToDefaults: () => void;
}

export default function AdminPanel({
  data,
  onUpdateData,
  contactMessages,
  onClearMessages,
  onDeleteMessage,
  onLogout,
  onResetToDefaults,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"general" | "about" | "services" | "projects" | "certifications" | "gallery" | "messages" | "system" | "media" | "supabase">("general");

  // Local editable states for forms to avoid lag
  const [settings, setSettings] = useState<CompanySettings>({ ...(data.settings || {}) } as CompanySettings);
  const [hero, setHero] = useState<HeroData>({ ...(data.hero || {}) } as HeroData);
  const [about, setAbout] = useState<AboutData>({ ...(data.about || {}) } as AboutData);
  const [services, setServices] = useState<ServiceItem[]>([...(data.services || [])]);
  const [projects, setProjects] = useState<ProjectItem[]>([...(data.projects || [])]);
  const [certifications, setCertifications] = useState<CertificationItem[]>([...(data.certifications || [])]);
  const [gallery, setGallery] = useState<GalleryItem[]>(() => data.gallery || []);
  const [servicesSlider, setServicesSlider] = useState<ServicesSliderItem[]>(() => data.servicesSlider || []);
  const [projectsSlider, setProjectsSlider] = useState<ProjectsSliderItem[]>(() => data.projectsSlider || []);
  const [certificationsSlider, setCertificationsSlider] = useState<CertificationsSliderItem[]>(() => data.certificationsSlider || []);

  // Services Slider inputs
  const [newSliderUrl, setNewSliderUrl] = useState<string>("");
  const [newSliderCaption, setNewSliderCaption] = useState<string>("");

  // Projects Slider inputs
  const [newProjectSliderUrl, setNewProjectSliderUrl] = useState<string>("");
  const [newProjectSliderCaption, setNewProjectSliderCaption] = useState<string>("");

  // Certifications Slider inputs
  const [newCertSliderUrl, setNewCertSliderUrl] = useState<string>("");
  const [newCertSliderCaption, setNewCertSliderCaption] = useState<string>("");

  // New gallery item state inputs
  const [newGalleryUrl, setNewGalleryUrl] = useState<string>("");
  const [newGalleryCaption, setNewGalleryCaption] = useState<string>("");
  const [newGalleryCategory, setNewGalleryCategory] = useState<string>("Construction");

  // New About paragraph state input
  const [newAboutParagraphText, setNewAboutParagraphText] = useState<string>("");

  // Supabase Integration States
  const [dbStatus, setDbStatus] = useState<{
    connected: boolean;
    websiteContentTable: boolean;
    contactMessagesTable: boolean;
    adminAccountsTable: boolean;
    checked: boolean;
    error?: string;
  }>({
    connected: false,
    websiteContentTable: false,
    contactMessagesTable: false,
    adminAccountsTable: false,
    checked: false,
  });
  const [testingConnection, setTestingConnection] = useState<boolean>(false);
  const [syncingData, setSyncingData] = useState<boolean>(false);
  const [syncingMessages, setSyncingMessages] = useState<boolean>(false);
  const [copiedSchema, setCopiedSchema] = useState<boolean>(false);

  // Admin credentials states
  const [adminUsernameInput, setAdminUsernameInput] = useState<string>("admin");
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>("");
  const [savingAdminCreds, setSavingAdminCreds] = useState<boolean>(false);

  const handleUpsertAdminCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      triggerToast("Supabase is not configured.");
      return;
    }
    if (!adminUsernameInput.trim() || !adminPasswordInput.trim()) {
      triggerToast("Please enter both username and password.");
      return;
    }

    setSavingAdminCreds(true);
    try {
      const { error } = await supabase
        .from("admin_accounts")
        .upsert({
          id: `admin-${adminUsernameInput.trim().toLowerCase()}`,
          username: adminUsernameInput.trim(),
          password: adminPasswordInput.trim(),
          updated_at: new Date().toISOString()
        }, { onConflict: "username" });

      if (error) {
        throw error;
      }

      triggerToast(`Successfully saved administrator credentials for '${adminUsernameInput.trim()}' to the database!`);
      setAdminPasswordInput("");
    } catch (err: any) {
      console.error(err);
      triggerToast(`Failed to save admin credentials: ${err?.message || String(err)}`);
    } finally {
      setSavingAdminCreds(false);
    }
  };

  // Overrides for Supabase connection details
  const [overrideUrl, setOverrideUrl] = useState<string>(() => {
    try {
      return localStorage.getItem("override_supabase_url") || "";
    } catch {
      return "";
    }
  });
  const [overrideKey, setOverrideKey] = useState<string>(() => {
    try {
      return localStorage.getItem("override_supabase_key") || "";
    } catch {
      return "";
    }
  });

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideUrl.trim() || !overrideKey.trim()) {
      triggerToast("Please enter both URL and Anon Key.");
      return;
    }
    saveSupabaseOverride(overrideUrl, overrideKey);
    triggerToast("Custom credentials saved! Re-initializing application...");
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  const handleClearCredentials = () => {
    saveSupabaseOverride("", "");
    setOverrideUrl("");
    setOverrideKey("");
    triggerToast("Reset to default environment credentials! Re-initializing...");
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  // Test connection function
  const handleTestConnection = async () => {
    setTestingConnection(true);
    try {
      const res = await testSupabaseConnection();
      setDbStatus({
        connected: res.connected,
        websiteContentTable: res.websiteContentTable,
        contactMessagesTable: res.contactMessagesTable,
        adminAccountsTable: res.adminAccountsTable,
        checked: true,
        error: res.error,
      });
    } catch (err: any) {
      setDbStatus({
        connected: false,
        websiteContentTable: false,
        contactMessagesTable: false,
        adminAccountsTable: false,
        checked: true,
        error: err?.message || String(err),
      });
    } finally {
      setTestingConnection(false);
    }
  };

  // Auto test connection when component mounts or tab changes
  useEffect(() => {
    handleTestConnection();
  }, [activeTab]);

  // Push changes to Supabase
  const handlePushData = async () => {
    setSyncingData(true);
    const success = await saveWebsiteDataToSupabase(data);
    setSyncingData(false);
    if (success) {
      triggerToast("Pushed website content to Supabase successfully!");
      handleTestConnection();
    } else {
      triggerToast("Failed to sync. Please ensure SQL Schema tables are initialized.");
    }
  };

  // Pull changes from Supabase
  const handlePullData = async () => {
    setSyncingData(true);
    const remoteData = await fetchWebsiteDataFromSupabase();
    setSyncingData(false);
    if (remoteData) {
      const sanitized = sanitizeWebsiteData(remoteData);
      onUpdateData(sanitized);
      setSettings({ ...sanitized.settings });
      setHero({ ...sanitized.hero });
      setAbout({ ...sanitized.about });
      setServices([...sanitized.services]);
      setProjects([...sanitized.projects]);
      setCertifications([...sanitized.certifications]);
      setGallery([...(sanitized.gallery || [])]);
      setServicesSlider([...(sanitized.servicesSlider || [])]);
      setProjectsSlider([...(sanitized.projectsSlider || [])]);
      setCertificationsSlider([...(sanitized.certificationsSlider || [])]);
      triggerToast("Synced website content from Supabase successfully!");
    } else {
      triggerToast("No remote configuration found on Supabase. Try pushing first.");
    }
  };

  // Sync messages from Supabase
  const handleSyncMessages = async () => {
    setSyncingMessages(true);
    const remoteMessages = await fetchMessagesFromSupabase();
    setSyncingMessages(false);
    if (remoteMessages) {
      triggerToast("Contact inquiries synced from Supabase database!");
      setTimeout(() => window.location.reload(), 1000);
    } else {
      triggerToast("Could not fetch messages. Check if contact_messages table is initialized.");
    }
  };

  // Persistent media uploader list
  const [mediaFiles, setMediaFiles] = useState<{ id: string; name: string; url: string; timestamp: string }[]>(() => {
    const saved = localStorage.getItem("railconstruct_uploaded_media");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error("Failed to parse saved media files", err);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("railconstruct_uploaded_media", JSON.stringify(mediaFiles));
  }, [mediaFiles]);

  // Copy state helper for individual file IDs
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Notifications
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 3000);
  };

  // Save entire section state back to parent
  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateData({
      ...data,
      settings,
      hero,
    });
    triggerToast("General Settings & Hero content saved successfully!");
  };

  const handleSaveAbout = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateData({
      ...data,
      about,
    });
    triggerToast("About page content saved successfully!");
  };

  // Service CRUD helpers
  const handleAddService = () => {
    const newService: ServiceItem = {
      id: `srv-${Date.now()}`,
      title: "New Service",
      description: "Service description goes here.",
      iconName: "Wrench",
    };
    const updated = [...services, newService];
    setServices(updated);
    onUpdateData({ ...data, services: updated });
    triggerToast("New service added!");
  };

  const handleUpdateServiceField = (id: string, field: keyof ServiceItem, value: any) => {
    const updated = services.map((s) => (s.id === id ? { ...s, [field]: value } : s));
    setServices(updated);
    onUpdateData({ ...data, services: updated });
  };

  const handleDeleteService = (id: string) => {
    const updated = services.filter((s) => s.id !== id);
    setServices(updated);
    onUpdateData({ ...data, services: updated });
    triggerToast("Service deleted.");
  };

  // Services Slider CRUD helpers
  const handleAddSliderItem = () => {
    if (!newSliderUrl.trim()) {
      triggerToast("Please provide an image URL.");
      return;
    }
    const newItem: ServicesSliderItem = {
      id: `ss-${Date.now()}`,
      url: newSliderUrl.trim(),
      caption: newSliderCaption.trim(),
    };
    const updated = [...servicesSlider, newItem];
    setServicesSlider(updated);
    onUpdateData({ ...data, servicesSlider: updated });
    setNewSliderUrl("");
    setNewSliderCaption("");
    triggerToast("Slider image added!");
  };

  const handleUpdateSliderField = (id: string, field: keyof ServicesSliderItem, value: string) => {
    const updated = servicesSlider.map((item) => (item.id === id ? { ...item, [field]: value } : item));
    setServicesSlider(updated);
    onUpdateData({ ...data, servicesSlider: updated });
  };

  const handleDeleteSliderItem = (id: string) => {
    const updated = servicesSlider.filter((item) => item.id !== id);
    setServicesSlider(updated);
    onUpdateData({ ...data, servicesSlider: updated });
    triggerToast("Slider image deleted.");
  };

  // Projects Slider CRUD helpers
  const handleAddProjectSliderItem = () => {
    if (!newProjectSliderUrl.trim()) {
      triggerToast("Please provide an image URL.");
      return;
    }
    const newItem: ProjectsSliderItem = {
      id: `ps-${Date.now()}`,
      url: newProjectSliderUrl.trim(),
      caption: newProjectSliderCaption.trim(),
    };
    const updated = [...projectsSlider, newItem];
    setProjectsSlider(updated);
    onUpdateData({ ...data, projectsSlider: updated });
    setNewProjectSliderUrl("");
    setNewProjectSliderCaption("");
    triggerToast("Project slider image added!");
  };

  const handleUpdateProjectSliderField = (id: string, field: keyof ProjectsSliderItem, value: string) => {
    const updated = projectsSlider.map((item) => (item.id === id ? { ...item, [field]: value } : item));
    setProjectsSlider(updated);
    onUpdateData({ ...data, projectsSlider: updated });
  };

  const handleDeleteProjectSliderItem = (id: string) => {
    const updated = projectsSlider.filter((item) => item.id !== id);
    setProjectsSlider(updated);
    onUpdateData({ ...data, projectsSlider: updated });
    triggerToast("Project slider image deleted.");
  };

  // Certifications Slider CRUD helpers
  const handleAddCertSliderItem = () => {
    if (!newCertSliderUrl.trim()) {
      triggerToast("Please provide an image URL.");
      return;
    }
    const newItem: CertificationsSliderItem = {
      id: `cs-${Date.now()}`,
      url: newCertSliderUrl.trim(),
      caption: newCertSliderCaption.trim(),
    };
    const updated = [...certificationsSlider, newItem];
    setCertificationsSlider(updated);
    onUpdateData({ ...data, certificationsSlider: updated });
    setNewCertSliderUrl("");
    setNewCertSliderCaption("");
    triggerToast("Certifications slider image added!");
  };

  const handleUpdateCertSliderField = (id: string, field: keyof CertificationsSliderItem, value: string) => {
    const updated = certificationsSlider.map((item) => (item.id === id ? { ...item, [field]: value } : item));
    setCertificationsSlider(updated);
    onUpdateData({ ...data, certificationsSlider: updated });
  };

  const handleDeleteCertSliderItem = (id: string) => {
    const updated = certificationsSlider.filter((item) => item.id !== id);
    setCertificationsSlider(updated);
    onUpdateData({ ...data, certificationsSlider: updated });
    triggerToast("Certifications slider image deleted.");
  };

  // Project CRUD helpers
  const handleAddProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: "New Railway Project",
      location: "LOCATION - COUNTRY",
      description: "Brief summary of work done for this project.",
      image: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=800&q=80",
    };
    const updated = [...projects, newProj];
    setProjects(updated);
    onUpdateData({ ...data, projects: updated });
    triggerToast("New project added!");
  };

  const handleUpdateProjectField = (id: string, field: keyof ProjectItem, value: any) => {
    const updated = projects.map((p) => (p.id === id ? { ...p, [field]: value } : p));
    setProjects(updated);
    onUpdateData({ ...data, projects: updated });
  };

  const handleDeleteProject = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    onUpdateData({ ...data, projects: updated });
    triggerToast("Project deleted.");
  };

  // Certification CRUD helpers
  const handleAddCertification = () => {
    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      title: "Certification Title",
      description: "Short description of the standard or awarding authority.",
    };
    const updated = [...certifications, newCert];
    setCertifications(updated);
    onUpdateData({ ...data, certifications: updated });
    triggerToast("New certification added!");
  };

  const handleUpdateCertField = (id: string, field: keyof CertificationItem, value: string) => {
    const updated = certifications.map((c) => (c.id === id ? { ...c, [field]: value } : c));
    setCertifications(updated);
    onUpdateData({ ...data, certifications: updated });
  };

  const handleDeleteCertification = (id: string) => {
    const updated = certifications.filter((c) => c.id !== id);
    setCertifications(updated);
    onUpdateData({ ...data, certifications: updated });
    triggerToast("Certification deleted.");
  };

  // Gallery CRUD helpers
  const handleAddGalleryItem = () => {
    if (!newGalleryUrl.trim()) {
      triggerToast("Please provide an image asset URL.");
      return;
    }
    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      url: newGalleryUrl.trim(),
      caption: newGalleryCaption.trim() || "Dynamic railway asset showcase",
      category: newGalleryCategory.trim() || "Construction",
    };
    const updated = [...gallery, newItem];
    setGallery(updated);
    onUpdateData({ ...data, gallery: updated });
    setNewGalleryUrl("");
    setNewGalleryCaption("");
    triggerToast("New image asset added to gallery successfully!");
  };

  const handleUpdateGalleryField = (id: string, field: keyof GalleryItem, value: string) => {
    const updated = gallery.map((item) => (item.id === id ? { ...item, [field]: value } : item));
    setGallery(updated);
    onUpdateData({ ...data, gallery: updated });
  };

  const handleDeleteGalleryItem = (id: string) => {
    const updated = gallery.filter((item) => item.id !== id);
    setGallery(updated);
    onUpdateData({ ...data, gallery: updated });
    triggerToast("Image asset deleted from gallery.");
  };

  // JSON Config Backup
  const handleExportConfig = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify({ websiteData: data, contactMessages }, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", "railconstruct_backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerToast("Backup JSON file exported successfully!");
  };

  const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.websiteData) {
            onUpdateData(parsed.websiteData);
            setSettings({ ...parsed.websiteData.settings });
            setHero({ ...parsed.websiteData.hero });
            setAbout({ ...parsed.websiteData.about });
            setServices([...parsed.websiteData.services]);
            setProjects([...parsed.websiteData.projects]);
            setCertifications([...parsed.websiteData.certifications]);
            setGallery([...(parsed.websiteData.gallery || [])]);
            setServicesSlider([...(parsed.websiteData.servicesSlider || [])]);
            setProjectsSlider([...(parsed.websiteData.projectsSlider || [])]);
            setCertificationsSlider([...(parsed.websiteData.certificationsSlider || [])]);
            triggerToast("Configuration backup imported successfully!");
          } else {
            alert("Invalid backup file. Must contain a 'websiteData' object.");
          }
        } catch (err) {
          alert("Failed to parse JSON file.");
        }
      };
    }
  };

  return (
    <section className="bg-neutral-50 py-12 min-h-screen font-sans border-t border-gray-200" id="admin-panel-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Toast Notification */}
        {toastMsg && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center space-x-2 bg-neutral-900 text-white px-5 py-3 rounded-lg shadow-2xl border border-gold-500 animate-bounce">
            <Check className="h-4 w-4 text-gold-500" />
            <span className="text-sm font-semibold">{toastMsg}</span>
          </div>
        )}

        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-6 mb-8" id="admin-header">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border border-amber-200">
                LIVE MANAGEMENT SYSTEM
              </span>
              {dbStatus.checked && (
                dbStatus.connected && dbStatus.websiteContentTable ? (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border border-emerald-200 flex items-center space-x-1 shadow-xs">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Supabase Cloud Synced</span>
                  </span>
                ) : (
                  <span className="bg-rose-100 text-rose-800 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border border-rose-200 flex items-center space-x-1 shadow-xs">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                    <span>Cloud Offline - Schema Setup Pending</span>
                  </span>
                )
              )}
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-neutral-950 mt-1">
              Admin Control Panel
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Direct access to change, update, and manage all pages, assets, and contact inquiries instantly.
            </p>
          </div>
          <div className="mt-4 flex items-center space-x-3 md:mt-0">
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 rounded-lg bg-white border border-gray-300 text-gray-700 px-4 py-2 text-sm font-bold shadow-sm hover:bg-neutral-100 transition-colors"
              id="admin-logout-btn"
            >
              <LogOut className="h-4 w-4" />
              <span>Exit Admin Mode</span>
            </button>
          </div>
        </div>

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4" id="admin-main-grid">
          
          {/* Navigation Sidebar */}
          <div className="space-y-1.5" id="admin-sidebar">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-3">Sections</p>
              
              <button
                onClick={() => setActiveTab("general")}
                className={`flex w-full items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  activeTab === "general"
                    ? "bg-neutral-950 text-white"
                    : "text-gray-600 hover:bg-neutral-100"
                }`}
              >
                <SettingsIcon className="h-4 w-4 stroke-[2.5]" />
                <span>General & Hero</span>
              </button>

              <button
                onClick={() => setActiveTab("about")}
                className={`flex w-full items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  activeTab === "about"
                    ? "bg-neutral-950 text-white"
                    : "text-gray-600 hover:bg-neutral-100"
                }`}
              >
                <Building className="h-4 w-4 stroke-[2.5]" />
                <span>About Content</span>
              </button>

              <button
                onClick={() => setActiveTab("services")}
                className={`flex w-full items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  activeTab === "services"
                    ? "bg-neutral-950 text-white"
                    : "text-gray-600 hover:bg-neutral-100"
                }`}
              >
                <Wrench className="h-4 w-4 stroke-[2.5]" />
                <span>Services Provided</span>
              </button>

              <button
                onClick={() => setActiveTab("projects")}
                className={`flex w-full items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  activeTab === "projects"
                    ? "bg-neutral-950 text-white"
                    : "text-gray-600 hover:bg-neutral-100"
                }`}
              >
                <Briefcase className="h-4 w-4 stroke-[2.5]" />
                <span>Featured Projects</span>
              </button>

              <button
                onClick={() => setActiveTab("certifications")}
                className={`flex w-full items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  activeTab === "certifications"
                    ? "bg-neutral-950 text-white"
                    : "text-gray-600 hover:bg-neutral-100"
                }`}
              >
                <Award className="h-4 w-4 stroke-[2.5]" />
                <span>Certifications</span>
              </button>

              <button
                onClick={() => setActiveTab("gallery")}
                className={`flex w-full items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  activeTab === "gallery"
                    ? "bg-neutral-950 text-white"
                    : "text-gray-600 hover:bg-neutral-100"
                }`}
              >
                <ImageIcon className="h-4 w-4 stroke-[2.5]" />
                <span>Image Gallery</span>
              </button>

              <button
                onClick={() => setActiveTab("media")}
                className={`flex w-full items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  activeTab === "media"
                    ? "bg-neutral-950 text-white"
                    : "text-gray-600 hover:bg-neutral-100"
                }`}
              >
                <ImageIcon className="h-4 w-4 stroke-[2.5]" />
                <span>Media Upload Center</span>
              </button>

              <div className="border-t border-gray-100 my-4"></div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-3">Visitor Data</p>

              <button
                onClick={() => setActiveTab("messages")}
                className={`flex w-full items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  activeTab === "messages"
                    ? "bg-neutral-950 text-white"
                    : "text-gray-600 hover:bg-neutral-100"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 stroke-[2.5]" />
                  <span>Contact Inquiries</span>
                </div>
                {contactMessages.length > 0 && (
                  <span className="bg-amber-500 text-neutral-950 font-mono text-[11px] font-bold h-5 w-5 rounded-full flex items-center justify-center animate-pulse">
                    {contactMessages.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("system")}
                className={`flex w-full items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  activeTab === "system"
                    ? "bg-neutral-950 text-white"
                    : "text-gray-600 hover:bg-neutral-100"
                }`}
              >
                <RotateCcw className="h-4 w-4 stroke-[2.5]" />
                <span>System Utilities</span>
              </button>

              <button
                onClick={() => setActiveTab("supabase")}
                className={`flex w-full items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  activeTab === "supabase"
                    ? "bg-neutral-950 text-white"
                    : "text-gray-600 hover:bg-neutral-100"
                }`}
              >
                <Database className="h-4 w-4 stroke-[2.5]" />
                <span>Supabase Database</span>
              </button>
            </div>
          </div>

          {/* Active Content Panel */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8" id="admin-detail-panel">
            
            {/* GENERAL & HERO SETTINGS */}
            {activeTab === "general" && (
              <form onSubmit={handleSaveGeneral} className="space-y-8" id="form-general">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-neutral-900 border-b border-gray-100 pb-3">
                    General Information & Hero Header
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">Configure brand elements, contact details and Hero banner assets.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Brand Settings */}
                  <div className="space-y-4">
                    <h3 className="font-serif text-lg font-bold text-neutral-800">Brand Settings</h3>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Company Name / Logo Text</label>
                      <input
                        type="text"
                        value={settings.logoText}
                        onChange={(e) => setSettings({ ...settings, logoText: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium focus:border-gold-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Primary Contact Number</label>
                      <input
                        type="text"
                        value={settings.phone}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium focus:border-gold-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Alternative Contact Number</label>
                      <input
                        type="text"
                        value={settings.phoneAlt}
                        onChange={(e) => setSettings({ ...settings, phoneAlt: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Public Contact Email</label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium focus:border-gold-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Public Contact Email (Alternative)</label>
                      <input
                        type="email"
                        value={settings.emailAlt || ""}
                        onChange={(e) => setSettings({ ...settings, emailAlt: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">WhatsApp Contact Number (No spaces)</label>
                      <input
                        type="text"
                        value={settings.whatsappNumber}
                        onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                        placeholder="e.g., +15551234567"
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium focus:border-gold-500 focus:outline-none"
                        required
                      />
                      <span className="text-[10px] text-gray-400 mt-1 block">Used for the green floating click-to-chat WhatsApp button.</span>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Head Office Address</label>
                      <textarea
                        value={settings.address}
                        onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium focus:border-gold-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Company Profile PDF Document</label>
                      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <FileText className="h-8 w-8 text-neutral-600 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-gray-700 truncate">
                              {settings.companyProfileUrl && settings.companyProfileUrl.startsWith("data:") 
                                ? "Custom Uploaded PDF Document" 
                                : settings.companyProfileUrl || "No PDF uploaded"}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {settings.companyProfileUrl && settings.companyProfileUrl.startsWith("data:") 
                                ? `Embedded Base64 (~${Math.round(settings.companyProfileUrl.length / 1024)} KB)` 
                                : "Default system asset"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="inline-flex items-center space-x-1.5 bg-neutral-950 text-white px-3 py-1.5 rounded-md text-[11px] font-bold tracking-wider hover:bg-gold-500 hover:text-neutral-950 transition-all cursor-pointer shadow-sm">
                            <FileUp className="h-3.5 w-3.5" />
                            <span>UPLOAD NEW PDF</span>
                            <input
                              type="file"
                              accept="application/pdf"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                if (file.type !== "application/pdf") {
                                  alert("Please select a valid PDF file.");
                                  return;
                                }
                                if (file.size > 8 * 1024 * 1024) {
                                  alert("The selected PDF file is too large. Please select a PDF file smaller than 8MB.");
                                  return;
                                }
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  const result = event.target?.result;
                                  if (typeof result === "string") {
                                    setSettings({ ...settings, companyProfileUrl: result });
                                    triggerToast(`Selected "${file.name}" for upload! Remember to save.`);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }}
                            />
                          </label>
                          {settings.companyProfileUrl && settings.companyProfileUrl !== "#" && settings.companyProfileUrl !== "/company.pdf" && (
                            <button
                              type="button"
                              onClick={() => {
                                setSettings({ ...settings, companyProfileUrl: "/company.pdf" });
                                triggerToast("Reset company profile to default system PDF.");
                              }}
                              className="inline-flex items-center space-x-1 border border-gray-300 bg-white text-gray-700 px-3 py-1.5 rounded-md text-[11px] font-bold tracking-wider hover:bg-gray-50 hover:text-gray-900 transition-all cursor-pointer shadow-sm"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                              <span>RESET TO DEFAULT</span>
                            </button>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2">Maximum file size: 8MB. Remember to click "Save Changes" below to apply and sync.</p>
                      </div>
                    </div>
                  </div>

                  {/* Hero Banner Settings */}
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-3">
                      <h3 className="font-serif text-lg font-bold text-neutral-800">Hero Section Slider</h3>
                      <p className="text-xs text-gray-400 mt-1">Configure active slides and primary action buttons. A minimum of 4 slides is recommended for the slider.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">CTA Left Button Text</label>
                        <input
                          type="text"
                          value={hero.ctaProjectsText}
                          onChange={(e) => setHero({ ...hero, ctaProjectsText: e.target.value })}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium focus:border-gold-500 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">CTA Right Button Text</label>
                        <input
                          type="text"
                          value={hero.ctaContactText}
                          onChange={(e) => setHero({ ...hero, ctaContactText: e.target.value })}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium focus:border-gold-500 focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    {/* Slides List */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Configure Slides ({hero.slides?.length || 0})</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newSlide = {
                              id: `slide-${Date.now()}`,
                              titlePart1: "New Railway Service ",
                              titleGold: "Excellence",
                              subtitle: "We build reliable pathways to foster safe transportation and smart industrial engineering.",
                              bgImage: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=1600&q=80",
                            };
                            setHero({
                              ...hero,
                              slides: [...(hero.slides || []), newSlide],
                            });
                          }}
                          className="flex items-center space-x-1.5 bg-neutral-900 text-white px-3.5 py-1.5 text-xs font-bold hover:bg-gold-500 hover:text-neutral-950 transition-all cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>ADD SLIDE</span>
                        </button>
                      </div>

                      <div className="space-y-4">
                        {hero.slides?.map((slide, sIdx) => (
                          <div key={slide.id} className="border border-gray-200 rounded-xl p-5 bg-gray-50/50 hover:bg-white transition-all space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-gold-600 font-mono">SLIDE #{sIdx + 1}</span>
                              <button
                                type="button"
                                disabled={(hero.slides?.length || 0) <= 4}
                                onClick={() => {
                                  const updatedSlides = hero.slides.filter((s) => s.id !== slide.id);
                                  setHero({ ...hero, slides: updatedSlides });
                                }}
                                className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-bold transition-all ${
                                  (hero.slides?.length || 0) <= 4
                                    ? "text-gray-300 cursor-not-allowed opacity-50"
                                    : "text-red-500 hover:text-red-700 hover:bg-red-50"
                                }`}
                                title={(hero.slides?.length || 0) <= 4 ? "A minimum of 4 slides is required." : "Delete this slide"}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Headline (Regular text)</label>
                                <input
                                  type="text"
                                  value={slide.titlePart1}
                                  onChange={(e) => {
                                    const updatedSlides = [...hero.slides];
                                    updatedSlides[sIdx] = { ...updatedSlides[sIdx], titlePart1: e.target.value };
                                    setHero({ ...hero, slides: updatedSlides });
                                  }}
                                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-bold focus:border-gold-500 focus:outline-none"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Headline Accent (Gold colored word)</label>
                                <input
                                  type="text"
                                  value={slide.titleGold}
                                  onChange={(e) => {
                                    const updatedSlides = [...hero.slides];
                                    updatedSlides[sIdx] = { ...updatedSlides[sIdx], titleGold: e.target.value };
                                    setHero({ ...hero, slides: updatedSlides });
                                  }}
                                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-bold focus:border-gold-500 focus:outline-none"
                                  required
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                              <div className="md:col-span-8">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Hero Description</label>
                                <input
                                  type="text"
                                  value={slide.subtitle}
                                  onChange={(e) => {
                                    const updatedSlides = [...hero.slides];
                                    updatedSlides[sIdx] = { ...updatedSlides[sIdx], subtitle: e.target.value };
                                    setHero({ ...hero, slides: updatedSlides });
                                  }}
                                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-medium focus:border-gold-500 focus:outline-none"
                                  required
                                />
                              </div>
                              <div className="md:col-span-4">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Background Image URL</label>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="text"
                                    value={slide.bgImage}
                                    onChange={(e) => {
                                      const updatedSlides = [...hero.slides];
                                      updatedSlides[sIdx] = { ...updatedSlides[sIdx], bgImage: e.target.value };
                                      setHero({ ...hero, slides: updatedSlides });
                                    }}
                                    className="flex-grow rounded border border-gray-300 bg-white px-3 py-2 text-xs font-medium focus:border-gold-500 focus:outline-none"
                                    required
                                  />
                                  <label className="flex h-8 shrink-0 items-center justify-center rounded bg-neutral-900 text-white px-3 text-xs font-bold hover:bg-gold-500 hover:text-neutral-950 transition-all cursor-pointer">
                                    <Upload className="h-3.5 w-3.5 mr-1" />
                                    <span>Upload</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          if (file.size > 5 * 1024 * 1024) {
                                            alert("Image too large. Max size is 5MB.");
                                            return;
                                          }
                                          const r = new FileReader();
                                          r.onload = (ev) => {
                                            const res = ev.target?.result;
                                            if (typeof res === "string") {
                                              const updatedSlides = [...hero.slides];
                                              updatedSlides[sIdx] = { ...updatedSlides[sIdx], bgImage: res };
                                              setHero({ ...hero, slides: updatedSlides });
                                              triggerToast(`Slide #${sIdx + 1} background image uploaded!`);
                                            }
                                          };
                                          r.readAsDataURL(file);
                                        }
                                      }}
                                      className="hidden"
                                    />
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    className="flex items-center space-x-2 bg-neutral-950 text-white px-6 py-3 font-bold hover:bg-gold-500 hover:text-white transition-all cursor-pointer shadow-md"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save General Information</span>
                  </button>
                </div>
              </form>
            )}

            {/* ABOUT US CONTENT */}
            {activeTab === "about" && (
              <form onSubmit={handleSaveAbout} className="space-y-8" id="form-about">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-neutral-900 border-b border-gray-100 pb-3">
                    About Us Content
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">Modify historical milestones, team descriptions, and key achievement statistics.</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Section Header Title</label>
                    <input
                      type="text"
                      value={about.title}
                      onChange={(e) => setAbout({ ...about, title: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium focus:border-gold-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Legacy Banner Heading</label>
                    <input
                      type="text"
                      value={about.legacyHeading}
                      onChange={(e) => setAbout({ ...about, legacyHeading: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium focus:border-gold-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-bold text-neutral-800">Narrative Descriptions</h3>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Paragraph 1 (The Foundation)</label>
                        <textarea
                          value={about.legacyText1}
                          onChange={(e) => setAbout({ ...about, legacyText1: e.target.value })}
                          rows={4}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium focus:border-gold-500 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Paragraph 2 (Mission & Values)</label>
                        <textarea
                          value={about.legacyText2}
                          onChange={(e) => setAbout({ ...about, legacyText2: e.target.value })}
                          rows={4}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium focus:border-gold-500 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Paragraph 3 (Global Scale)</label>
                        <textarea
                          value={about.legacyText3}
                          onChange={(e) => setAbout({ ...about, legacyText3: e.target.value })}
                          rows={4}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium focus:border-gold-500 focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="font-serif text-lg font-bold text-neutral-800">Visuals & Performance Stats</h3>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">About Section Image URL</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={about.imageUrl}
                            onChange={(e) => setAbout({ ...about, imageUrl: e.target.value })}
                            className="flex-grow rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium focus:border-gold-500 focus:outline-none"
                            required
                          />
                          <label className="flex h-10 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-white px-4 text-sm font-bold hover:bg-gold-500 hover:text-neutral-950 transition-all cursor-pointer">
                            <Upload className="h-4 w-4 mr-1.5" />
                            <span>Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (file.size > 5 * 1024 * 1024) {
                                    alert("Image too large. Max size is 5MB.");
                                    return;
                                  }
                                  const r = new FileReader();
                                  r.onload = (ev) => {
                                    const res = ev.target?.result;
                                    if (typeof res === "string") {
                                      setAbout({ ...about, imageUrl: res });
                                      triggerToast("About section image uploaded!");
                                    }
                                  };
                                  r.readAsDataURL(file);
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-xl p-4 space-y-4 bg-gray-50">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Achievements Key Metrics (Exactly 4 Items)</span>
                        <div className="grid grid-cols-2 gap-4">
                          {about.stats.map((stat, sIdx) => (
                            <div key={stat.id} className="bg-white p-3 rounded-lg border border-gray-200">
                              <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Metric value</label>
                                <input
                                  type="text"
                                  value={stat.numberText}
                                  onChange={(e) => {
                                    const updatedStats = [...about.stats];
                                    updatedStats[sIdx].numberText = e.target.value;
                                    setAbout({ ...about, stats: updatedStats });
                                  }}
                                  className="w-full rounded border border-gray-300 px-2 py-1 text-xs font-bold"
                                />
                              </div>
                              <div className="mt-2">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Label</label>
                                <input
                                  type="text"
                                  value={stat.label}
                                  onChange={(e) => {
                                    const updatedStats = [...about.stats];
                                    updatedStats[sIdx].label = e.target.value;
                                    setAbout({ ...about, stats: updatedStats });
                                  }}
                                  className="w-full rounded border border-gray-300 px-2 py-1 text-xs font-medium"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Company Paragraphs */}
                  <div className="border-t border-neutral-100 pt-8 mt-8 space-y-6" id="about-additional-paragraphs">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-neutral-900 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-gold-500" />
                        <span>Additional Company Paragraphs</span>
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        Add and manage supplementary detailed paragraphs about your company on the About us page.
                      </p>
                    </div>

                    {/* Add New Paragraph Input */}
                    <div className="bg-amber-50/20 border border-gold-500/10 p-5 rounded-xl space-y-3">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">New Paragraph Content</label>
                      <textarea
                        rows={3}
                        placeholder="Write a new paragraph describing the company's achievements, vision, operations, or capabilities..."
                        value={newAboutParagraphText}
                        onChange={(e) => setNewAboutParagraphText(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium focus:border-gold-500 focus:outline-none resize-y"
                      />
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            if (!newAboutParagraphText.trim()) {
                              triggerToast("Please enter some text first.");
                              return;
                            }
                            const currentParas = about.paragraphs || [];
                            const updatedParas = [...currentParas, newAboutParagraphText.trim()];
                            setAbout({ ...about, paragraphs: updatedParas });
                            setNewAboutParagraphText("");
                            triggerToast("New paragraph added! Remember to save changes.");
                          }}
                          className="bg-neutral-950 text-white text-xs font-bold px-4 py-2 hover:bg-gold-500 cursor-pointer text-center rounded-md transition-all duration-300"
                        >
                          Add Paragraph
                        </button>
                      </div>
                    </div>

                    {/* List Existing Paragraphs */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Active supplementary Paragraphs ({(about.paragraphs || []).length})
                      </h4>
                      <div className="space-y-3">
                        {(about.paragraphs || []).map((para, pIdx) => (
                          <div key={pIdx} className="bg-white p-4 rounded-xl border border-gray-100 flex gap-4 items-start shadow-xs hover:border-gold-500/20 transition-all">
                            <span className="h-6 w-6 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-mono font-bold text-neutral-500 shrink-0">
                              {pIdx + 1}
                            </span>
                            <div className="flex-grow">
                              <textarea
                                rows={2}
                                value={para}
                                onChange={(e) => {
                                  const currentParas = [...(about.paragraphs || [])];
                                  currentParas[pIdx] = e.target.value;
                                  setAbout({ ...about, paragraphs: currentParas });
                                }}
                                className="w-full rounded border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-light leading-relaxed resize-y focus:border-gold-500 focus:outline-none"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const currentParas = (about.paragraphs || []).filter((_, idx) => idx !== pIdx);
                                setAbout({ ...about, paragraphs: currentParas });
                                triggerToast("Paragraph removed. Remember to save changes.");
                              }}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer shrink-0"
                              title="Delete this paragraph"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}

                        {(about.paragraphs || []).length === 0 && (
                          <div className="text-center py-6 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                            <p className="text-xs text-gray-400">No additional paragraphs added yet. Add one above!</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Integrated About Page Image Gallery */}
                  <div className="border-t border-neutral-100 pt-8 mt-8 space-y-6" id="about-integrated-gallery">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-neutral-900">
                        About Page Image Gallery
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        Manage the visual portfolio assets showcased in the About page gallery. You can add new images, change captions, categories, and delete existing ones in real-time.
                      </p>
                    </div>

                    {/* Add New Gallery Item Sub-Form */}
                    <div className="bg-amber-50/20 border border-gold-500/10 p-5 rounded-xl space-y-4">
                      <h4 className="font-serif text-sm font-bold text-neutral-900 flex items-center space-x-2">
                        <span className="text-gold-500 font-mono text-xs">[+]</span>
                        <span>Add New Image to Gallery</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                            Image URL / Direct Upload
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="url"
                              placeholder="https://images.unsplash.com/..."
                              value={newGalleryUrl}
                              onChange={(e) => setNewGalleryUrl(e.target.value)}
                              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-medium focus:border-gold-500 focus:outline-none"
                            />
                            <label className="flex h-8 shrink-0 items-center justify-center rounded bg-neutral-900 text-white px-3 text-xs font-bold hover:bg-gold-500 hover:text-neutral-950 transition-all cursor-pointer">
                              <Upload className="h-3.5 w-3.5 mr-1" />
                              <span>Upload</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    if (file.size > 5 * 1024 * 1024) {
                                      alert("Image too large. Max size is 5MB.");
                                      return;
                                    }
                                    const r = new FileReader();
                                    r.onload = (ev) => {
                                      const res = ev.target?.result;
                                      if (typeof res === "string") {
                                        setNewGalleryUrl(res);
                                        triggerToast("Gallery image uploaded!");
                                      }
                                    };
                                    r.readAsDataURL(file);
                                  }
                                }}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                            Short Caption / Description
                          </label>
                          <input
                            type="text"
                            placeholder="Brief description of the image"
                            value={newGalleryCaption}
                            onChange={(e) => setNewGalleryCaption(e.target.value)}
                            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-medium focus:border-gold-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                            Category / Filter Group
                          </label>
                          <select
                            value={newGalleryCategory}
                            onChange={(e) => setNewGalleryCategory(e.target.value)}
                            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-800 focus:border-gold-500 focus:outline-none"
                          >
                            <option value="Construction">Construction</option>
                            <option value="Passenger">Passenger</option>
                            <option value="Freight">Freight</option>
                            <option value="Signaling">Signaling</option>
                            <option value="Bridges">Bridges</option>
                            <option value="Tracks">Tracks</option>
                            <option value="Stations">Stations</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={handleAddGalleryItem}
                          className="bg-neutral-950 text-gold-400 hover:text-white border border-neutral-800 hover:bg-neutral-900 text-xs font-bold px-4 py-2 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Add Image to Gallery</span>
                        </button>
                      </div>
                    </div>

                    {/* List of current gallery items */}
                    <div className="space-y-4">
                      <h4 className="font-serif text-sm font-bold text-neutral-900">
                        Current Gallery Images ({gallery.length})
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {gallery.map((item, idx) => (
                          <div
                            key={item.id}
                            className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-all space-y-3 flex flex-col justify-between"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-gold-500 font-mono">IMAGE #{idx + 1}</span>
                              <button
                                type="button"
                                onClick={() => handleDeleteGalleryItem(item.id)}
                                className="flex items-center space-x-1 text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-0.5 rounded text-xs font-bold transition-all cursor-pointer"
                              >
                                <Trash2 className="h-3 w-3" />
                                <span>Remove</span>
                              </button>
                            </div>

                            <div className="flex gap-3 items-start">
                              <div className="h-12 w-12 rounded overflow-hidden border border-gray-100 flex-shrink-0 bg-neutral-100">
                                <img
                                  src={item.url}
                                  alt="Preview"
                                  referrerPolicy="no-referrer"
                                  className="object-cover h-full w-full"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://picsum.photos/seed/error/100/100";
                                  }}
                                />
                              </div>
                              <div className="flex-grow space-y-1">
                                <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider">
                                  Image URL / Direct Upload
                                </label>
                                <div className="flex items-center space-x-1.5">
                                  <input
                                    type="text"
                                    value={item.url}
                                    onChange={(e) => handleUpdateGalleryField(item.id, "url", e.target.value)}
                                    className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs font-mono"
                                  />
                                  <label className="flex h-7 shrink-0 items-center justify-center rounded bg-neutral-900 text-white px-2 text-[10px] font-bold hover:bg-gold-500 hover:text-neutral-950 transition-all cursor-pointer">
                                    <Upload className="h-3 w-3 mr-1" />
                                    <span>Upload</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          if (file.size > 5 * 1024 * 1024) {
                                            alert("Image too large. Max size is 5MB.");
                                            return;
                                          }
                                          const r = new FileReader();
                                          r.onload = (ev) => {
                                            const res = ev.target?.result;
                                            if (typeof res === "string") {
                                              handleUpdateGalleryField(item.id, "url", res);
                                              triggerToast("Gallery image updated!");
                                            }
                                          };
                                          r.readAsDataURL(file);
                                        }
                                      }}
                                      className="hidden"
                                    />
                                  </label>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                                  Category
                                </label>
                                <input
                                  type="text"
                                  value={item.category}
                                  onChange={(e) => handleUpdateGalleryField(item.id, "category", e.target.value)}
                                  className="w-full rounded border border-gray-300 bg-white px-2 py-0.5 text-xs font-bold"
                                />
                              </div>
                              <div>
                                <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                                  Caption
                                </label>
                                <input
                                  type="text"
                                  value={item.caption}
                                  onChange={(e) => handleUpdateGalleryField(item.id, "caption", e.target.value)}
                                  className="w-full rounded border border-gray-300 bg-white px-2 py-0.5 text-xs font-medium"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {gallery.length === 0 && (
                        <div className="text-center py-8 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                          <ImageIcon className="h-6 w-6 text-gray-300 mx-auto" />
                          <p className="text-xs text-gray-400 mt-1">No images in your gallery yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    className="flex items-center space-x-2 bg-neutral-950 text-white px-6 py-3 font-bold hover:bg-gold-500 hover:text-white transition-all cursor-pointer shadow-md"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save About Us Section</span>
                  </button>
                </div>
              </form>
            )}

            {/* SERVICES PROVIDED */}
            {activeTab === "services" && (
              <div className="space-y-8" id="admin-services-panel">
                
                {/* Services Showcase Slider Settings */}
                <div className="border border-gray-200 rounded-xl p-6 bg-amber-50/10 border-amber-500/10 shadow-sm space-y-6">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-neutral-900 flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-gold-500" />
                      <span>Services Page Image Slider</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Add, remove, or modify images and captions displayed in the interactive carousel on the Services page.
                    </p>
                  </div>

                  {/* Add New Slider Image */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white p-4 rounded-xl border border-gray-200">
                    <div className="md:col-span-5">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Image URL</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder="https://images.unsplash.com/..."
                          value={newSliderUrl}
                          onChange={(e) => setNewSliderUrl(e.target.value)}
                          className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-medium"
                        />
                        <label className="flex h-8 shrink-0 items-center justify-center rounded bg-neutral-900 text-white px-3 text-xs font-bold hover:bg-gold-500 hover:text-neutral-950 transition-all cursor-pointer">
                          <Upload className="h-3.5 w-3.5 mr-1" />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 5 * 1024 * 1024) {
                                  alert("Image too large. Max size is 5MB.");
                                  return;
                                }
                                const r = new FileReader();
                                r.onload = (ev) => {
                                  const res = ev.target?.result;
                                  if (typeof res === "string") {
                                    setNewSliderUrl(res);
                                    triggerToast("Slider image uploaded!");
                                  }
                                };
                                r.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    <div className="md:col-span-5">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Slide Caption</label>
                      <input
                        type="text"
                        placeholder="e.g., Advanced Heavy Rail Infrastructure Support"
                        value={newSliderCaption}
                        onChange={(e) => setNewSliderCaption(e.target.value)}
                        className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-medium"
                      />
                    </div>
                    <div className="md:col-span-2 flex items-end">
                      <button
                        type="button"
                        onClick={handleAddSliderItem}
                        className="w-full bg-neutral-950 text-white text-xs font-bold py-2.5 hover:bg-gold-500 cursor-pointer text-center rounded-md transition-all duration-300"
                      >
                        ADD IMAGE
                      </button>
                    </div>
                  </div>

                  {/* Existing Slider Images */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Slider Slides ({servicesSlider.length})</h4>
                    <div className="grid grid-cols-1 gap-4">
                      {servicesSlider.map((item, idx) => (
                        <div key={item.id} className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 hover:shadow-xs transition-all">
                          {/* Image Thumbnail */}
                          <div className="h-16 w-24 rounded-lg overflow-hidden shrink-0 bg-neutral-100 border border-gray-200">
                            <img
                              src={item.url}
                              alt={item.caption || "Slide"}
                              className="h-full w-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow w-full">
                            <div>
                              <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Slide Image URL</label>
                              <input
                                type="text"
                                value={item.url}
                                onChange={(e) => handleUpdateSliderField(item.id, "url", e.target.value)}
                                className="w-full rounded border border-gray-300 bg-white px-2.5 py-1.5 text-[11px] font-mono font-medium"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Slide Caption</label>
                              <input
                                type="text"
                                value={item.caption || ""}
                                onChange={(e) => handleUpdateSliderField(item.id, "caption", e.target.value)}
                                className="w-full rounded border border-gray-300 bg-white px-2.5 py-1.5 text-[11px] font-medium"
                              />
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteSliderItem(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer"
                            title="Delete this image"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}

                      {servicesSlider.length === 0 && (
                        <div className="text-center py-6 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                          <p className="text-xs text-gray-400">No images in your services slider yet. Add some above!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 my-8"></div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-neutral-900">
                      Manage Core Services
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">Configure services offered with custom titles, summaries and branding.</p>
                  </div>
                  <button
                    onClick={handleAddService}
                    className="mt-3 sm:mt-0 flex items-center space-x-1.5 bg-neutral-950 text-white px-4 py-2 text-xs font-bold tracking-wider hover:bg-gold-500 hover:text-white transition-all cursor-pointer shadow"
                  >
                    <Plus className="h-4 w-4" />
                    <span>ADD SERVICE</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {services.map((srv, idx) => (
                    <div key={srv.id} className="border border-gray-200 rounded-xl p-6 bg-gray-50/50 hover:bg-white transition-all shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gold-500 font-mono">SERVICE ITEM #{idx + 1}</span>
                        <button
                          onClick={() => handleDeleteService(srv.id)}
                          className="flex items-center space-x-1 text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded text-xs font-bold transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>

                      <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-500/10 space-y-4">
                        <div className="text-xs font-bold text-neutral-900 border-b border-gray-200 pb-1 uppercase tracking-wider">
                          Primary Card Details
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Service Title</label>
                            <input
                              type="text"
                              value={srv.title}
                              onChange={(e) => handleUpdateServiceField(srv.id, "title", e.target.value)}
                              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-neutral-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Lucide Icon Identifier</label>
                            <select
                              value={srv.iconName}
                              onChange={(e) => handleUpdateServiceField(srv.id, "iconName", e.target.value)}
                              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-neutral-900"
                            >
                              <option value="Wind">Wind (Air Conditioning)</option>
                              <option value="Snowflake">Snowflake (Refrigeration)</option>
                              <option value="Zap">Zap (Electrical & Electronics)</option>
                              <option value="Wrench">Wrench (Mechanical)</option>
                              <option value="Paintbrush">Paintbrush (PU Painting)</option>
                              <option value="Shield">Shield (Thermal Insulation)</option>
                              <option value="Sparkles">Sparkles (Housekeeping)</option>
                              <option value="Droplets">Droplets (Water Cooler)</option>
                              <option value="Bolt">Bolt (Transformer)</option>
                              <option value="Train">Train (Locomotive)</option>
                              <option value="Building">Building (Shed & Platforms)</option>
                              <option value="Settings">Settings (Signaling Systems)</option>
                              <option value="Hammer">Hammer (Maintenance & Repair)</option>
                              <option value="Award">Award (Certificates)</option>
                              <option value="Briefcase">Briefcase (Projects)</option>
                              <option value="ShieldCheck">ShieldCheck (Safety)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Summary / Description</label>
                            <input
                              type="text"
                              value={srv.description}
                              onChange={(e) => handleUpdateServiceField(srv.id, "description", e.target.value)}
                              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-neutral-850"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Detailed Information (Displayed under "Read More")</label>
                          <textarea
                            placeholder="Provide a more detailed explanation of what this service entails..."
                            rows={2}
                            value={srv.longDescription || ""}
                            onChange={(e) => handleUpdateServiceField(srv.id, "longDescription", e.target.value)}
                            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-medium resize-y"
                          />
                        </div>
                      </div>

                      <div className="bg-neutral-50/60 p-4 rounded-xl border border-gray-200/60 space-y-4">
                        <div className="text-xs font-bold text-neutral-900 border-b border-gray-200 pb-1 uppercase tracking-wider">
                          Dedicated Service Page Content (View Service Page details)
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Service Page Header Image URL</label>
                            <input
                              type="text"
                              value={srv.imageUrl || ""}
                              onChange={(e) => handleUpdateServiceField(srv.id, "imageUrl", e.target.value)}
                              placeholder="https://images.unsplash.com/..."
                              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-medium"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Service Page Bullet points (One per line)</label>
                            <textarea
                              placeholder="e.g.&#10;Primary Service 1&#10;Secondary Service 2&#10;Third Task Service"
                              rows={3}
                              value={(srv.bullets || []).join("\n")}
                              onChange={(e) => {
                                const bulletArr = e.target.value.split("\n").filter(line => line.trim() !== "");
                                handleUpdateServiceField(srv.id, "bullets", bulletArr);
                              }}
                              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-mono resize-y"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Detailed Overview text (Displayed in main column of Dedicated Page)</label>
                          <textarea
                            placeholder="Provide comprehensive and professional overview paragraph for the separate service details page..."
                            rows={3}
                            value={srv.overview || ""}
                            onChange={(e) => handleUpdateServiceField(srv.id, "overview", e.target.value)}
                            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-medium resize-y"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {services.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
                      <Wrench className="h-8 w-8 text-gray-400 mx-auto stroke-[1.5]" />
                      <p className="text-sm font-semibold text-gray-500 mt-2">No core services created.</p>
                      <button
                        onClick={handleAddService}
                        className="mt-3 bg-neutral-950 text-white text-xs font-bold px-4 py-2 hover:bg-gold-500"
                      >
                        Create Primary Service
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* FEATURED PROJECTS */}
            {activeTab === "projects" && (
              <div className="space-y-8" id="admin-projects-panel">
                
                {/* Projects Showcase Slider Settings */}
                <div className="border border-gray-200 rounded-xl p-6 bg-amber-50/10 border-amber-500/10 shadow-sm space-y-6">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-neutral-900 flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-gold-500" />
                      <span>Projects Page Image Slider</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Add, remove, or modify images and captions displayed in the interactive carousel on the Projects page.
                    </p>
                  </div>

                  {/* Add New Slider Image */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white p-4 rounded-xl border border-gray-200">
                    <div className="md:col-span-5">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Image URL</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder="https://images.unsplash.com/..."
                          value={newProjectSliderUrl}
                          onChange={(e) => setNewProjectSliderUrl(e.target.value)}
                          className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-medium"
                        />
                        <label className="flex h-8 shrink-0 items-center justify-center rounded bg-neutral-900 text-white px-3 text-xs font-bold hover:bg-gold-500 hover:text-neutral-950 transition-all cursor-pointer">
                          <Upload className="h-3.5 w-3.5 mr-1" />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 5 * 1024 * 1024) {
                                  alert("Image too large. Max size is 5MB.");
                                  return;
                                }
                                const r = new FileReader();
                                r.onload = (ev) => {
                                  const res = ev.target?.result;
                                  if (typeof res === "string") {
                                    setNewProjectSliderUrl(res);
                                    triggerToast("Slider image uploaded!");
                                  }
                                };
                                r.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    <div className="md:col-span-5">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Slide Caption</label>
                      <input
                        type="text"
                        placeholder="e.g., Metropolitan Rail Link Construction"
                        value={newProjectSliderCaption}
                        onChange={(e) => setNewProjectSliderCaption(e.target.value)}
                        className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-medium"
                      />
                    </div>
                    <div className="md:col-span-2 flex items-end">
                      <button
                        type="button"
                        onClick={handleAddProjectSliderItem}
                        className="w-full bg-neutral-950 text-white text-xs font-bold py-2.5 hover:bg-gold-500 cursor-pointer text-center rounded-md transition-all duration-300"
                      >
                        ADD IMAGE
                      </button>
                    </div>
                  </div>

                  {/* Existing Slider Images */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Slider Slides ({projectsSlider.length})</h4>
                    <div className="grid grid-cols-1 gap-4">
                      {projectsSlider.map((item, idx) => (
                        <div key={item.id} className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 hover:shadow-xs transition-all">
                          {/* Image Thumbnail */}
                          <div className="h-16 w-24 rounded-lg overflow-hidden shrink-0 bg-neutral-100 border border-gray-200">
                            <img
                              src={item.url}
                              alt={item.caption || "Slide"}
                              className="h-full w-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow w-full">
                            <div>
                              <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Slide Image URL</label>
                              <input
                                type="text"
                                value={item.url}
                                onChange={(e) => handleUpdateProjectSliderField(item.id, "url", e.target.value)}
                                className="w-full rounded border border-gray-300 bg-white px-2.5 py-1.5 text-[11px] font-mono font-medium"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Slide Caption</label>
                              <input
                                type="text"
                                value={item.caption || ""}
                                onChange={(e) => handleUpdateProjectSliderField(item.id, "caption", e.target.value)}
                                className="w-full rounded border border-gray-300 bg-white px-2.5 py-1.5 text-[11px] font-medium"
                              />
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteProjectSliderItem(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer"
                            title="Delete this image"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}

                      {projectsSlider.length === 0 && (
                        <div className="text-center py-6 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                          <p className="text-xs text-gray-400">No images in your projects slider yet. Add some above!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-3 mt-12">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-neutral-900">
                      Manage Featured Projects
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">Configure visual project listings complete with custom location titles and imagery.</p>
                  </div>
                  <button
                    onClick={handleAddProject}
                    className="mt-3 sm:mt-0 flex items-center space-x-1.5 bg-neutral-950 text-white px-4 py-2 text-xs font-bold tracking-wider hover:bg-gold-500 hover:text-white transition-all cursor-pointer shadow"
                  >
                    <Plus className="h-4 w-4" />
                    <span>ADD PROJECT</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {projects.map((proj, idx) => (
                    <div key={proj.id} className="border border-gray-200 rounded-xl p-6 bg-gray-50/50 hover:bg-white transition-all shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gold-500 font-mono">PROJECT CONTRACT #{idx + 1}</span>
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          className="flex items-center space-x-1 text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded text-xs font-bold transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Left image preview */}
                        <div className="md:col-span-3 space-y-2">
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Preview</label>
                          <div className="aspect-video w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-100 relative">
                            <img src={proj.image} alt={proj.title} className="object-cover h-full w-full" onError={(e)=>{(e.target as HTMLImageElement).src='https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=300&q=80'}} />
                          </div>
                        </div>

                        {/* Text fields */}
                        <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="sm:col-span-2 md:col-span-1">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Project Name</label>
                            <input
                              type="text"
                              value={proj.title}
                              onChange={(e) => handleUpdateProjectField(proj.id, "title", e.target.value)}
                              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-neutral-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Client / Organization</label>
                            <input
                              type="text"
                              value={proj.client || ""}
                              onChange={(e) => handleUpdateProjectField(proj.id, "client", e.target.value)}
                              placeholder="e.g. Western Railway"
                              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-neutral-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Contract Location / City</label>
                            <input
                              type="text"
                              value={proj.location}
                              onChange={(e) => handleUpdateProjectField(proj.id, "location", e.target.value)}
                              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-neutral-900"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">State</label>
                            <input
                              type="text"
                              value={proj.state || ""}
                              onChange={(e) => handleUpdateProjectField(proj.id, "state", e.target.value)}
                              placeholder="e.g. Gujarat"
                              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-neutral-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Project Status</label>
                            <select
                              value={proj.status || "completed"}
                              onChange={(e) => handleUpdateProjectField(proj.id, "status", e.target.value)}
                              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-neutral-900"
                            >
                              <option value="completed">Completed</option>
                              <option value="ongoing">Ongoing</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
                            <select
                              value={proj.category || "Air Conditioning"}
                              onChange={(e) => handleUpdateProjectField(proj.id, "category", e.target.value)}
                              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-neutral-900"
                            >
                              <option value="Air Conditioning">Air Conditioning</option>
                              <option value="Electrical">Electrical / Traction Motors</option>
                              <option value="Mechanical">Mechanical / Bogies</option>
                              <option value="Painting">PU Painting & Coating</option>
                              <option value="Water Cooler">Water Cooler</option>
                              <option value="Housekeeping">Housekeeping & Gardening</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Sr. No (Numeric Order)</label>
                            <input
                              type="number"
                              value={proj.srNo || ""}
                              onChange={(e) => handleUpdateProjectField(proj.id, "srNo", parseInt(e.target.value) || 0)}
                              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-neutral-900"
                            />
                          </div>

                          <div className="sm:col-span-2 md:col-span-2">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Image URL</label>
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={proj.image}
                                onChange={(e) => handleUpdateProjectField(proj.id, "image", e.target.value)}
                                className="flex-grow rounded border border-gray-300 bg-white px-3 py-2 text-xs font-mono"
                              />
                              <label className="flex h-8 shrink-0 items-center justify-center rounded bg-neutral-900 text-white px-3 text-xs font-bold hover:bg-gold-500 hover:text-neutral-950 transition-all cursor-pointer">
                                <Upload className="h-3.5 w-3.5 mr-1" />
                                <span>Upload</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      if (file.size > 5 * 1024 * 1024) {
                                        alert("Image too large. Max size is 5MB.");
                                        return;
                                      }
                                      const r = new FileReader();
                                      r.onload = (ev) => {
                                        const res = ev.target?.result;
                                        if (typeof res === "string") {
                                          handleUpdateProjectField(proj.id, "image", res);
                                          triggerToast(`Project #${idx + 1} image uploaded!`);
                                        }
                                      };
                                      r.readAsDataURL(file);
                                    }
                                  }}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>
                          <div className="sm:col-span-2 md:col-span-3">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Brief Summary</label>
                            <input
                              type="text"
                              value={proj.description}
                              onChange={(e) => handleUpdateProjectField(proj.id, "description", e.target.value)}
                              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-medium"
                            />
                          </div>
                          <div className="sm:col-span-2 md:col-span-3">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Detailed Information (Displayed under "Read More")</label>
                            <textarea
                              placeholder="Provide a more detailed explanation of this project, milestones achieved, materials used, etc..."
                              rows={3}
                              value={proj.longDescription || ""}
                              onChange={(e) => handleUpdateProjectField(proj.id, "longDescription", e.target.value)}
                              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-medium resize-y"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {projects.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
                      <Briefcase className="h-8 w-8 text-gray-400 mx-auto stroke-[1.5]" />
                      <p className="text-sm font-semibold text-gray-500 mt-2">No showcase projects registered.</p>
                      <button
                        onClick={handleAddProject}
                        className="mt-3 bg-neutral-950 text-white text-xs font-bold px-4 py-2 hover:bg-gold-500"
                      >
                        Register Primary Project
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CERTIFICATIONS */}
            {activeTab === "certifications" && (
              <div className="space-y-8" id="admin-certifications-panel">
                
                {/* Certifications Showcase Slider Settings */}
                <div className="border border-gray-200 rounded-xl p-6 bg-amber-50/10 border-amber-500/10 shadow-sm space-y-6">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-neutral-900 flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-gold-500" />
                      <span>Certifications Page Image Slider</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Add, remove, or modify images and captions displayed in the interactive carousel on the Certifications page.
                    </p>
                  </div>

                  {/* Add New Slider Image */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white p-4 rounded-xl border border-gray-200">
                    <div className="md:col-span-5">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Image URL</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder="https://images.unsplash.com/..."
                          value={newCertSliderUrl}
                          onChange={(e) => setNewCertSliderUrl(e.target.value)}
                          className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-medium"
                        />
                        <label className="flex h-8 shrink-0 items-center justify-center rounded bg-neutral-900 text-white px-3 text-xs font-bold hover:bg-gold-500 hover:text-neutral-950 transition-all cursor-pointer">
                          <Upload className="h-3.5 w-3.5 mr-1" />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 5 * 1024 * 1024) {
                                  alert("Image too large. Max size is 5MB.");
                                  return;
                                }
                                const r = new FileReader();
                                r.onload = (ev) => {
                                  const res = ev.target?.result;
                                  if (typeof res === "string") {
                                    setNewCertSliderUrl(res);
                                    triggerToast("Slider image uploaded!");
                                  }
                                };
                                r.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    <div className="md:col-span-5">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Slide Caption</label>
                      <input
                        type="text"
                        placeholder="e.g., ISO 9001:2015 Quality Mark Audit"
                        value={newCertSliderCaption}
                        onChange={(e) => setNewCertSliderCaption(e.target.value)}
                        className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-medium"
                      />
                    </div>
                    <div className="md:col-span-2 flex items-end">
                      <button
                        type="button"
                        onClick={handleAddCertSliderItem}
                        className="w-full bg-neutral-950 text-white text-xs font-bold py-2.5 hover:bg-gold-500 cursor-pointer text-center rounded-md transition-all duration-300"
                      >
                        ADD IMAGE
                      </button>
                    </div>
                  </div>

                  {/* Existing Slider Images */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Slider Slides ({certificationsSlider.length})</h4>
                    <div className="grid grid-cols-1 gap-4">
                      {certificationsSlider.map((item, idx) => (
                        <div key={item.id} className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 hover:shadow-xs transition-all">
                          {/* Image Thumbnail */}
                          <div className="h-16 w-24 rounded-lg overflow-hidden shrink-0 bg-neutral-100 border border-gray-200">
                            <img
                              src={item.url}
                              alt={item.caption || "Slide"}
                              className="h-full w-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow w-full">
                            <div>
                              <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Slide Image URL</label>
                              <input
                                type="text"
                                value={item.url}
                                onChange={(e) => handleUpdateCertSliderField(item.id, "url", e.target.value)}
                                className="w-full rounded border border-gray-300 bg-white px-2.5 py-1.5 text-[11px] font-mono font-medium"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Slide Caption</label>
                              <input
                                type="text"
                                value={item.caption || ""}
                                onChange={(e) => handleUpdateCertSliderField(item.id, "caption", e.target.value)}
                                className="w-full rounded border border-gray-300 bg-white px-2.5 py-1.5 text-[11px] font-medium"
                              />
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteCertSliderItem(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer"
                            title="Delete this image"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}

                      {certificationsSlider.length === 0 && (
                        <div className="text-center py-6 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                          <p className="text-xs text-gray-400">No images in your certifications slider yet. Add some above!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-3 mt-12">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-neutral-900">
                      Manage Certifications & Awards
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">Configure compliance standards, ISO marks and safety accreditations.</p>
                  </div>
                  <button
                    onClick={handleAddCertification}
                    className="mt-3 sm:mt-0 flex items-center space-x-1.5 bg-neutral-950 text-white px-4 py-2 text-xs font-bold tracking-wider hover:bg-gold-500 hover:text-white transition-all cursor-pointer shadow"
                  >
                    <Plus className="h-4 w-4" />
                    <span>ADD CERTIFICATION</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {certifications.map((cert, idx) => (
                    <div key={cert.id} className="border border-gray-200 rounded-xl p-6 bg-gray-50/50 hover:bg-white transition-all shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gold-500 font-mono">ACCREDITATION ITEM #{idx + 1}</span>
                        <button
                          onClick={() => handleDeleteCertification(cert.id)}
                          className="flex items-center space-x-1 text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded text-xs font-bold transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Certification Title</label>
                          <input
                            type="text"
                            value={cert.title}
                            onChange={(e) => handleUpdateCertField(cert.id, "title", e.target.value)}
                            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Brief details / Standard scopes</label>
                          <input
                            type="text"
                            value={cert.description}
                            onChange={(e) => handleUpdateCertField(cert.id, "description", e.target.value)}
                            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {certifications.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
                      <Award className="h-8 w-8 text-gray-400 mx-auto stroke-[1.5]" />
                      <p className="text-sm font-semibold text-gray-500 mt-2">No certifications listed.</p>
                      <button
                        onClick={handleAddCertification}
                        className="mt-3 bg-neutral-950 text-white text-xs font-bold px-4 py-2 hover:bg-gold-500"
                      >
                        Register Primary Certification
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* IMAGE GALLERY MANAGER */}
            {activeTab === "gallery" && (
              <div className="space-y-8 animate-fade-in" id="admin-gallery-panel">
                <div className="border-b border-gray-100 pb-3">
                  <h2 className="font-serif text-2xl font-bold text-neutral-900">
                    Project Image Gallery Manager
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Manage the visual assets shown in the Project & Construction Gallery section of the About view.
                  </p>
                </div>

                {/* Add New Gallery Item Section */}
                <div className="bg-neutral-50 p-6 rounded-xl border border-gray-200/60 space-y-4">
                  <h3 className="font-serif text-lg font-bold text-neutral-900 flex items-center space-x-2">
                    <span className="text-gold-500 font-mono text-sm">[+]</span>
                    <span>Add New Image Asset</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        Image Asset URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={newGalleryUrl}
                        onChange={(e) => setNewGalleryUrl(e.target.value)}
                        className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        Short Caption / Description
                      </label>
                      <input
                        type="text"
                        placeholder="Brief description of the track/engine shown"
                        value={newGalleryCaption}
                        onChange={(e) => setNewGalleryCaption(e.target.value)}
                        className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        Category / Filter Group
                      </label>
                      <select
                        value={newGalleryCategory}
                        onChange={(e) => setNewGalleryCategory(e.target.value)}
                        className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-800"
                      >
                        <option value="Construction">Construction</option>
                        <option value="Passenger">Passenger</option>
                        <option value="Freight">Freight</option>
                        <option value="Signaling">Signaling</option>
                        <option value="Bridges">Bridges</option>
                        <option value="Tracks">Tracks</option>
                        <option value="Stations">Stations</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={handleAddGalleryItem}
                      className="bg-neutral-950 text-gold-400 hover:text-white border border-neutral-800 hover:bg-neutral-900 text-xs font-bold px-5 py-2.5 rounded-lg flex items-center space-x-2 transition-all cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Insert into Portfolio</span>
                    </button>
                  </div>
                </div>

                {/* List of current gallery items */}
                <div className="space-y-6">
                  <h3 className="font-serif text-lg font-bold text-neutral-900">
                    Existing Portfolio Assets ({gallery.length})
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {gallery.map((item, idx) => (
                      <div
                        key={item.id}
                        className="p-5 bg-white border border-gray-200/80 rounded-xl shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gold-500 font-mono">ASSET ITEM #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteGalleryItem(item.id)}
                              className="flex items-center space-x-1 text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded text-xs font-bold transition-all cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>

                          <div className="flex gap-4 items-start">
                            {/* Small thumbnail preview */}
                            <div className="h-16 w-16 rounded overflow-hidden border border-gray-100 flex-shrink-0 bg-neutral-100 animate-fade-in">
                              <img
                                src={item.url}
                                alt="Preview"
                                referrerPolicy="no-referrer"
                                className="object-cover h-full w-full"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://picsum.photos/seed/error/100/100";
                                }}
                              />
                            </div>
                            <div className="flex-grow space-y-2">
                              <div>
                                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                  Image URL
                                </label>
                                <input
                                  type="text"
                                  value={item.url}
                                  onChange={(e) => handleUpdateGalleryField(item.id, "url", e.target.value)}
                                  className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs font-mono font-medium"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                Category Group
                              </label>
                              <input
                                type="text"
                                value={item.category}
                                onChange={(e) => handleUpdateGalleryField(item.id, "category", e.target.value)}
                                className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                Portfolio Caption
                              </label>
                              <input
                                type="text"
                                value={item.caption}
                                onChange={(e) => handleUpdateGalleryField(item.id, "caption", e.target.value)}
                                className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs font-medium"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {gallery.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
                      <ImageIcon className="h-8 w-8 text-gray-400 mx-auto stroke-[1.5]" />
                      <p className="text-sm font-semibold text-gray-500 mt-2">No image assets in your gallery.</p>
                      <p className="text-xs text-gray-400 mt-1">Provide a URL and category above to start building your public engineering portfolio.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CONTACT MESSAGES INBOX */}
            {activeTab === "messages" && (
              <div className="space-y-8" id="admin-messages-panel">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-neutral-900">
                      Contact Inquiries Inbox
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">Review, follow-up, and organize messages sent by potential clients via the Contact page.</p>
                  </div>
                  {contactMessages.length > 0 && (
                    <button
                      onClick={() => {
                        if (confirm("Are you sure you want to clear all messages from your inbox?")) {
                          onClearMessages();
                          triggerToast("Inbox cleared.");
                        }
                      }}
                      className="mt-3 sm:mt-0 flex items-center space-x-1 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded text-xs font-bold transition-all border border-red-100 bg-white"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>CLEAR INBOX</span>
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {contactMessages.map((msg) => (
                    <div key={msg.id} className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:border-gold-500 transition-all space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 pb-3">
                        <div>
                          <span className="text-xs font-bold text-gray-400 font-mono block">DATE: {new Date(msg.timestamp).toLocaleString()}</span>
                          <span className="text-sm font-bold text-neutral-950 mt-1 block">From: {msg.fullName}</span>
                        </div>
                        <button
                          onClick={() => {
                            onDeleteMessage(msg.id);
                            triggerToast("Message deleted from inbox.");
                          }}
                          className="self-start sm:self-center flex items-center space-x-1 text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span className="text-xs font-semibold">Delete Message</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg text-xs leading-relaxed text-gray-600">
                        <div>
                          <span className="font-bold text-gray-500 block">Email Address:</span>
                          <a href={`mailto:${msg.email}`} className="text-gold-600 hover:underline font-semibold mt-1 block">{msg.email}</a>
                        </div>
                        <div>
                          <span className="font-bold text-gray-500 block">Phone Number:</span>
                          <a href={`tel:${msg.phone}`} className="text-neutral-800 hover:underline font-semibold mt-1 block">{msg.phone || "Not specified"}</a>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-xs font-bold text-gray-400 block uppercase">Message:</span>
                        <p className="text-sm leading-relaxed text-neutral-900 bg-neutral-50/50 p-4 rounded-lg border border-gray-100 whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  ))}

                  {contactMessages.length === 0 && (
                    <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                      <Mail className="h-10 w-10 text-gray-300 mx-auto stroke-[1.5]" />
                      <p className="text-sm font-semibold text-gray-500 mt-2">Inbox is currently empty.</p>
                      <p className="text-xs text-gray-400 mt-1">Visitor submissions on the Contact form will appear here in real-time.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MEDIA UPLOAD CENTER */}
            {activeTab === "media" && (
              <div className="space-y-8" id="admin-media-panel">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-neutral-900">
                      Media Upload Center
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                      Upload local images, manage your gallery, and apply assets directly to banner slides, about page visuals, or project contract sections.
                    </p>
                  </div>
                </div>

                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50/50 hover:bg-white transition-all">
                  <Upload className="h-10 w-10 text-gray-400 mx-auto stroke-[1.5] mb-3" />
                  <p className="text-sm font-semibold text-gray-700">Drag & Drop or Choose Image Files</p>
                  <p className="text-xs text-gray-400 mt-1 mb-4">PNG, JPG, JPEG, WEBP or GIF formats supported (Max size: 5MB)</p>
                  <label className="inline-flex items-center space-x-2 bg-neutral-950 text-white px-5 py-2.5 text-xs font-bold tracking-wider hover:bg-gold-500 hover:text-neutral-950 transition-all cursor-pointer shadow">
                    <Plus className="h-4 w-4" />
                    <span>CHOOSE FILE TO UPLOAD</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files;
                        if (!files) return;
                        
                        const newUploadedFiles: { id: string; name: string; url: string; timestamp: string }[] = [];
                        let processedCount = 0;
                        const filesArray = Array.from(files) as File[];

                        filesArray.forEach((file) => {
                          if (file.size > 5 * 1024 * 1024) {
                            alert(`File "${file.name}" is larger than 5MB and was skipped.`);
                            processedCount++;
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const result = event.target?.result;
                            if (typeof result === "string") {
                              newUploadedFiles.push({
                                id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                                name: file.name,
                                url: result,
                                timestamp: new Date().toISOString(),
                              });
                            }
                            processedCount++;
                            if (processedCount === filesArray.length) {
                              setMediaFiles((prev) => [...prev, ...newUploadedFiles]);
                              triggerToast(`Successfully uploaded ${newUploadedFiles.length} image(s)!`);
                            }
                          };
                          reader.readAsDataURL(file);
                        });
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Media Gallery Grid */}
                <div className="space-y-4">
                  <h3 className="font-serif text-lg font-bold text-neutral-800 flex items-center space-x-2">
                    <ImageIcon className="h-5 w-5 text-gold-500" />
                    <span>Uploaded Gallery ({mediaFiles.length})</span>
                  </h3>

                  {mediaFiles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {mediaFiles.map((file) => (
                        <div key={file.id} className="border border-gray-200 rounded-xl p-4 bg-white hover:shadow-md transition-all flex flex-col md:flex-row gap-4">
                          {/* Thumbnail preview */}
                          <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0 relative group">
                            <img src={file.url} alt={file.name} className="object-cover h-full w-full" />
                            <a 
                              href={file.url} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity"
                            >
                              View Full Size
                            </a>
                          </div>

                          {/* Info & controls */}
                          <div className="flex-grow flex flex-col justify-between space-y-3">
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <span className="text-xs font-bold text-neutral-900 truncate max-w-[200px]" title={file.name}>
                                  {file.name}
                                </span>
                                <button
                                  onClick={() => {
                                    setMediaFiles((prev) => prev.filter((item) => item.id !== file.id));
                                    triggerToast("Image deleted from Media Upload Center.");
                                  }}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                                  title="Delete from gallery"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <span className="text-[10px] text-gray-400 font-mono block mt-0.5">
                                Uploaded: {new Date(file.timestamp).toLocaleDateString()}
                              </span>
                            </div>

                            {/* Core actions */}
                            <div className="space-y-2">
                              <button
                                onClick={() => handleCopyUrl(file.url, file.id)}
                                className="flex w-full items-center justify-center space-x-1.5 rounded border border-gray-300 bg-gray-50 hover:bg-gray-100 py-1.5 text-xs font-bold text-gray-700 transition-colors"
                              >
                                <Copy className="h-3 w-3" />
                                <span>{copiedId === file.id ? "COPIED!" : "COPY IMAGE BASE64"}</span>
                              </button>

                              {/* Apply section */}
                              <div className="border-t border-gray-100 pt-2">
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Quick Apply To Site Location:</span>
                                <div className="flex flex-wrap gap-1">
                                  {hero.slides?.map((slide, sIdx) => (
                                    <button
                                      key={slide.id}
                                      onClick={() => {
                                        const updatedSlides = [...hero.slides];
                                        updatedSlides[sIdx] = { ...updatedSlides[sIdx], bgImage: file.url };
                                        setHero({ ...hero, slides: updatedSlides });
                                        onUpdateData({
                                          ...data,
                                          hero: {
                                            ...data.hero,
                                            slides: updatedSlides,
                                          },
                                        });
                                        triggerToast(`Applied to Banner Slide #${sIdx + 1}!`);
                                      }}
                                      className="px-1.5 py-0.5 bg-neutral-100 hover:bg-gold-500 hover:text-neutral-950 rounded text-[9px] font-bold text-neutral-800 transition-all"
                                    >
                                      Slide {sIdx + 1}
                                    </button>
                                  ))}
                                  <button
                                    onClick={() => {
                                      setAbout({ ...about, imageUrl: file.url });
                                      onUpdateData({
                                        ...data,
                                        about: {
                                          ...data.about,
                                          imageUrl: file.url,
                                        },
                                      });
                                      triggerToast("Applied to About Us Section!");
                                    }}
                                    className="px-1.5 py-0.5 bg-neutral-100 hover:bg-gold-500 hover:text-neutral-950 rounded text-[9px] font-bold text-neutral-800 transition-all"
                                  >
                                    About Us
                                  </button>
                                  {projects.map((proj, pIdx) => (
                                    <button
                                      key={proj.id}
                                      onClick={() => {
                                        const updated = projects.map((p) => p.id === proj.id ? { ...p, image: file.url } : p);
                                        setProjects(updated);
                                        onUpdateData({ ...data, projects: updated });
                                        triggerToast(`Applied to Project "${proj.title}"!`);
                                      }}
                                      className="px-1.5 py-0.5 bg-neutral-100 hover:bg-gold-500 hover:text-neutral-950 rounded text-[9px] font-bold text-neutral-800 transition-all max-w-[110px] truncate"
                                      title={`Apply to project: ${proj.title}`}
                                    >
                                      Proj {pIdx + 1}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                      <ImageIcon className="h-10 w-10 text-gray-300 mx-auto stroke-[1.5]" />
                      <p className="text-sm font-semibold text-gray-500 mt-2">No custom media uploaded yet.</p>
                      <p className="text-xs text-gray-400 mt-1">Use the upload tool above to create your image library.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SYSTEM UTILITIES */}
            {activeTab === "system" && (
              <div className="space-y-8" id="admin-system-panel">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-neutral-900 border-b border-gray-100 pb-3">
                    System Utilities & Backup Control
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">Perform data backups, restore settings from backup JSON, or hard reset the application.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Backup and Restore Box */}
                  <div className="border border-gray-200 rounded-xl p-6 space-y-4 bg-white shadow-sm">
                    <h3 className="font-serif text-lg font-bold text-neutral-800 flex items-center space-x-2">
                      <FileDown className="h-5 w-5 text-gold-500" />
                      <span>Configuration Backup</span>
                    </h3>
                    <p className="text-xs leading-relaxed text-gray-500">
                      Save your custom-edited content as a static JSON backup. You can import this file anytime to restore your custom headers, services, and photos safely.
                    </p>
                    <div className="pt-3 flex flex-wrap gap-3">
                      <button
                        onClick={handleExportConfig}
                        className="flex items-center space-x-2 bg-neutral-950 text-white px-4 py-2.5 text-xs font-bold tracking-wider hover:bg-gold-500 transition-colors shadow"
                      >
                        <FileDown className="h-4 w-4" />
                        <span>EXPORT CONFIG BACKUP</span>
                      </button>

                      <label className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 text-xs font-bold tracking-wider hover:bg-gray-100 transition-colors shadow cursor-pointer rounded">
                        <FileUp className="h-4 w-4 text-gray-500" />
                        <span>IMPORT CONFIG JSON</span>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportConfig}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Safety Hard Reset Box */}
                  <div className="border border-red-200 rounded-xl p-6 space-y-4 bg-red-50/20 shadow-sm">
                    <h3 className="font-serif text-lg font-bold text-red-800 flex items-center space-x-2">
                      <RotateCcw className="h-5 w-5 text-red-600 animate-spin" style={{ animationDuration: '6s' }} />
                      <span>Hard System Reset</span>
                    </h3>
                    <p className="text-xs leading-relaxed text-gray-500">
                      Revert all text fields, achievements, showcased projects, certifications, and settings back to the initial factory-curated "RailConstruct" defaults.
                    </p>
                    <div className="pt-3">
                      <button
                        onClick={() => {
                          if (confirm("WARNING: Doing a hard reset will overwrite all custom-saved content and clear all contact inquiries forever. This action is irreversible. Continue?")) {
                            onResetToDefaults();
                            triggerToast("Site data reset back to factory defaults successfully!");
                            // Re-sync local states
                            setTimeout(() => {
                              window.location.reload();
                            }, 500);
                          }
                        }}
                        className="flex items-center space-x-2 bg-red-600 text-white px-5 py-2.5 text-xs font-bold tracking-wider hover:bg-red-700 transition-colors shadow"
                      >
                        <RotateCcw className="h-4 w-4 animate-spin" style={{ animationDuration: '10s' }} />
                        <span>RESET TO FACTORY DEFAULTS</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Developer Instructions info board */}
                <div className="rounded-xl bg-neutral-900 text-neutral-300 p-5 space-y-2 border-l-4 border-gold-500">
                  <h4 className="text-sm font-bold text-white flex items-center space-x-1.5 font-serif">
                    <Info className="h-4 w-4 text-gold-500" />
                    <span>Administrator Guidance</span>
                  </h4>
                  <p className="text-xs leading-relaxed text-neutral-400">
                    Your edits are securely saved in your browser's persistent sandbox (`localStorage`). Visitors to this workspace view your customized parameters in real-time. To deploy permanently or port your content, use the <strong>Export Config Backup</strong> tool above to download your custom layout layout, which can be uploaded directly into any instance!
                  </p>
                </div>
              </div>
            )}

            {/* SUPABASE CLOUD DATABASE INTEGRATION */}
            {activeTab === "supabase" && (
              <div className="space-y-8" id="admin-supabase-panel">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-neutral-900">
                      Supabase Cloud Database
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                      Synchronize your dynamic website content and view contact form message submissions directly in your real-time cloud database.
                    </p>
                  </div>
                </div>

                {/* Connection Status Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 border border-gray-200 rounded-xl p-6 bg-white shadow-sm space-y-4">
                    <h3 className="font-serif text-lg font-bold text-neutral-800 flex items-center space-x-2">
                      <Database className="h-5 w-5 text-gold-500" />
                      <span>Supabase Configuration Details</span>
                    </h3>

                    <div className="space-y-3 text-xs">
                      <div className="grid grid-cols-3 gap-2 border-b border-gray-50 pb-2">
                        <span className="font-bold text-gray-500">Project Endpoint:</span>
                        <span className="col-span-2 text-neutral-800 font-mono select-all truncate" title={getSupabaseProjectUrl()}>
                          {getSupabaseProjectUrl()}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 border-b border-gray-50 pb-2">
                        <span className="font-bold text-gray-500">Anon Client Key:</span>
                        <span className="col-span-2 text-neutral-800 font-mono select-all truncate">
                          {isSupabaseConfigured ? "••••••••••••••••••••" : "Not Configured"}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="font-bold text-gray-500">Configuration Source:</span>
                        <span className="col-span-2 text-amber-600 font-semibold flex items-center space-x-1">
                          <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                          <span>.env environment variables</span>
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex space-x-3">
                      <button
                        onClick={handleTestConnection}
                        disabled={testingConnection}
                        className="flex items-center space-x-1.5 rounded-lg border border-gray-300 bg-white hover:bg-neutral-50 px-4 py-2 text-xs font-bold text-neutral-800 transition-all cursor-pointer shadow-sm"
                      >
                        <RefreshCw className={`h-3.5 w-3.5 text-gray-500 ${testingConnection ? "animate-spin" : ""}`} />
                        <span>{testingConnection ? "TESTING..." : "TEST CONNECTION"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Table Status Card */}
                  <div className="border border-gray-200 rounded-xl p-6 bg-gray-50/50 space-y-4">
                    <h3 className="font-serif text-sm font-bold text-neutral-800">
                      Table Readiness Status
                    </h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-gray-100 shadow-xs">
                        <div className="text-xs">
                          <p className="font-bold text-neutral-800 font-mono">website_content</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Dynamic Layouts</p>
                        </div>
                        {dbStatus.checked ? (
                          dbStatus.websiteContentTable ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                              READY
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                              MISSING
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-500 animate-pulse">
                            UNCHECKED
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-gray-100 shadow-xs">
                        <div className="text-xs">
                          <p className="font-bold text-neutral-800 font-mono">contact_messages</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Form Inquiries</p>
                        </div>
                        {dbStatus.checked ? (
                          dbStatus.contactMessagesTable ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                              READY
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                              MISSING
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-500 animate-pulse">
                            UNCHECKED
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-gray-100 shadow-xs">
                        <div className="text-xs">
                          <p className="font-bold text-neutral-800 font-mono">admin_accounts</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Admin Security</p>
                        </div>
                        {dbStatus.checked ? (
                          dbStatus.adminAccountsTable ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                              READY
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              PENDING
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-500 animate-pulse">
                            UNCHECKED
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Override Supabase Credentials Form */}
                <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                    <h3 className="font-serif text-lg font-bold text-neutral-800 flex items-center space-x-2">
                      <SettingsIcon className="h-5 w-5 text-gold-500" />
                      <span>Update Cloud Connection Settings</span>
                    </h3>
                    {(localStorage.getItem("override_supabase_url") || localStorage.getItem("override_supabase_key")) && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border border-amber-200 flex items-center space-x-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        <span>Custom Connection Active</span>
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-500 leading-relaxed">
                    If the default environment database is offline or not configured, you can specify your own custom Supabase project credentials below. They are saved securely in your browser session and will instantly redirect all database reads, writes, sync tasks, and contact message submissions to your custom project!
                  </p>

                  <form onSubmit={handleSaveCredentials} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block">Supabase Project URL</label>
                        <input
                          type="url"
                          value={overrideUrl}
                          onChange={(e) => setOverrideUrl(e.target.value)}
                          placeholder="e.g., https://your-project-ref.supabase.co"
                          className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs text-neutral-900 placeholder-gray-400 focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block">Supabase Anon Client Key</label>
                        <input
                          type="text"
                          value={overrideKey}
                          onChange={(e) => setOverrideKey(e.target.value)}
                          placeholder="e.g., eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC..."
                          className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs text-neutral-900 placeholder-gray-400 focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 outline-none transition-all font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        type="submit"
                        className="rounded-lg bg-neutral-950 hover:bg-gold-500 hover:text-neutral-950 text-white px-4 py-2 text-xs font-bold transition-all shadow-md cursor-pointer"
                      >
                        SAVE CUSTOM CREDENTIALS
                      </button>
                      {(localStorage.getItem("override_supabase_url") || localStorage.getItem("override_supabase_key")) && (
                        <button
                          type="button"
                          onClick={handleClearCredentials}
                          className="rounded-lg border border-red-300 hover:bg-red-50 text-red-600 px-4 py-2 text-xs font-bold transition-all cursor-pointer"
                        >
                          RESET TO SYSTEM DEFAULT
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Admin Accounts Management Form */}
                <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm space-y-4">
                  <h3 className="font-serif text-lg font-bold text-neutral-800 flex items-center space-x-2">
                    <Lock className="h-5 w-5 text-gold-500" />
                    <span>Manage Database Administrator Credentials</span>
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Create or update credentials inside your Supabase <code className="bg-neutral-100 px-1 py-0.5 rounded text-neutral-900 font-mono">admin_accounts</code> table. These records are queried in real-time when signing in via the Admin Login Portal.
                  </p>

                  <form onSubmit={handleUpsertAdminCredentials} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block">Admin Username</label>
                        <input
                          type="text"
                          value={adminUsernameInput}
                          onChange={(e) => setAdminUsernameInput(e.target.value)}
                          placeholder="e.g. admin"
                          required
                          className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs text-neutral-900 placeholder-gray-400 focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 outline-none transition-all font-mono"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block">Admin Password</label>
                        <input
                          type="text"
                          value={adminPasswordInput}
                          onChange={(e) => setAdminPasswordInput(e.target.value)}
                          placeholder="e.g. admin123"
                          required
                          className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs text-neutral-900 placeholder-gray-400 focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 outline-none transition-all font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={savingAdminCreds || !isSupabaseConfigured || !dbStatus.adminAccountsTable}
                        className="rounded-lg bg-neutral-950 hover:bg-gold-500 hover:text-neutral-950 text-white px-4 py-2 text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                      >
                        {savingAdminCreds ? "UPDATING..." : "UPSERT CREDENTIALS"}
                      </button>
                      
                      {!dbStatus.adminAccountsTable && (
                        <p className="text-[10px] text-amber-600 font-medium">
                          ⚠️ Initialize the SQL Schema table first to activate database admin credentials management.
                        </p>
                      )}
                    </div>
                  </form>
                </div>

                {/* Synchronization Controls Panel */}
                <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm space-y-4">
                  <h3 className="font-serif text-lg font-bold text-neutral-800">
                    Database Synchronization Control
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Instantly sync your custom adjustments to your remote Supabase cloud backend so changes survive browser cache clearances and sync across multiple team terminals!
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <button
                      onClick={handlePushData}
                      disabled={syncingData || !isSupabaseConfigured}
                      className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl bg-gray-50/50 hover:bg-neutral-900 hover:text-white transition-all text-center group disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    >
                      <CheckCircle2 className="h-6 w-6 text-emerald-500 mb-2 group-hover:text-emerald-400 transition-colors" />
                      <span className="text-xs font-bold">PUSH WEBSITE DATA</span>
                      <span className="text-[10px] text-gray-400 mt-1">Uploads local configurations to Supabase</span>
                    </button>

                    <button
                      onClick={handlePullData}
                      disabled={syncingData || !isSupabaseConfigured}
                      className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl bg-gray-50/50 hover:bg-amber-500 hover:text-neutral-950 transition-all text-center group disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    >
                      <RefreshCw className={`h-6 w-6 text-amber-500 mb-2 group-hover:text-neutral-950 transition-colors ${syncingData ? "animate-spin" : ""}`} />
                      <span className="text-xs font-bold">PULL WEBSITE DATA</span>
                      <span className="text-[10px] text-gray-400 mt-1">Syncs local settings with cloud versions</span>
                    </button>

                    <button
                      onClick={handleSyncMessages}
                      disabled={syncingMessages || !isSupabaseConfigured}
                      className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl bg-gray-50/50 hover:bg-neutral-950 hover:text-white transition-all text-center group disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    >
                      <Mail className="h-6 w-6 text-gold-500 mb-2 group-hover:text-gold-400 transition-colors" />
                      <span className="text-xs font-bold">SYNC INBOX MESSAGES</span>
                      <span className="text-[10px] text-gray-400 mt-1">Fetches and updates all inbox inquiries</span>
                    </button>
                  </div>
                </div>

                {/* SQL Schema Generator / Instructions */}
                <div className="border border-neutral-800 rounded-xl p-6 bg-neutral-950 text-neutral-300 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-neutral-800 pb-3">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-white flex items-center space-x-2">
                        <Info className="h-5 w-5 text-gold-500" />
                        <span>Supabase SQL Bootstrap Schema</span>
                      </h3>
                      <p className="text-[10px] text-neutral-400 mt-0.5">
                        Copy and execute this script inside your Supabase SQL Editor to instantly bootstrap the required tables and security rules.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
                        setCopiedSchema(true);
                        triggerToast("SQL Schema script copied to clipboard!");
                        setTimeout(() => setCopiedSchema(false), 2000);
                      }}
                      className="flex items-center space-x-1 bg-white hover:bg-gold-500 hover:text-neutral-950 text-neutral-950 px-3 py-1.5 rounded text-xs font-bold transition-all shrink-0 cursor-pointer shadow"
                    >
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      <span>{copiedSchema ? "COPIED SQL!" : "COPY SQL CODE"}</span>
                    </button>
                  </div>

                  <div className="relative rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900/50">
                    <pre className="p-4 font-mono text-[10px] leading-relaxed text-emerald-400 overflow-x-auto max-h-60 whitespace-pre scrollbar-thin">
                      {SUPABASE_SQL_SCHEMA}
                    </pre>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
