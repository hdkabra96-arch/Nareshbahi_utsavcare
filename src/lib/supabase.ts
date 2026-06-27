/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from "@supabase/supabase-js";
import { WebsiteData, ContactMessage } from "../types";

// Get Supabase credentials from environment variables and clean/sanitize them
const getSanitizedSupabaseUrl = (): string => {
  let rawUrl = "";
  try {
    rawUrl = localStorage.getItem("override_supabase_url") || "";
  } catch {}
  
  if (!rawUrl) {
    rawUrl = ((import.meta as any).env.VITE_SUPABASE_URL || "").trim();
  }
  
  if (!rawUrl) return "";
  
  // Remove trailing slash if present
  if (rawUrl.endsWith("/")) {
    rawUrl = rawUrl.slice(0, -1);
  }
  
  // If user mistakenly appended "/rest/v1" or "/rest/v1/", remove it
  if (rawUrl.endsWith("/rest/v1")) {
    rawUrl = rawUrl.slice(0, -8);
  } else if (rawUrl.endsWith("/rest/v1/")) {
    rawUrl = rawUrl.slice(0, -9);
  }
  
  // Ensure the URL starts with http:// or https://
  if (rawUrl && !rawUrl.startsWith("http://") && !rawUrl.startsWith("https://")) {
    rawUrl = "https://" + rawUrl;
  }
  
  return rawUrl;
};

const getSanitizedSupabaseKey = (): string => {
  let rawKey = "";
  try {
    rawKey = localStorage.getItem("override_supabase_key") || "";
  } catch {}
  
  if (!rawKey) {
    rawKey = ((import.meta as any).env.VITE_SUPABASE_ANON_KEY || "").trim();
  }
  return rawKey.trim();
};

const supabaseUrl = getSanitizedSupabaseUrl();
const supabaseAnonKey = getSanitizedSupabaseKey();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Save custom Supabase credentials override to localStorage.
 */
export function saveSupabaseOverride(url: string, key: string) {
  try {
    if (url.trim() && key.trim()) {
      localStorage.setItem("override_supabase_url", url.trim());
      localStorage.setItem("override_supabase_key", key.trim());
    } else {
      localStorage.removeItem("override_supabase_url");
      localStorage.removeItem("override_supabase_key");
    }
  } catch (err) {
    console.error("Failed to write to localStorage for Supabase overrides:", err);
  }
}

// Initialize Supabase Client
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Clean base URL for displaying in UI
export const getSupabaseProjectUrl = () => {
  if (!supabaseUrl) return "Not Configured";
  try {
    const url = new URL(supabaseUrl);
    return url.origin;
  } catch {
    return supabaseUrl;
  }
};

/**
 * SQL Schema script to set up Supabase database.
 * Users can copy-paste this into Supabase SQL Editor.
 */
export const SUPABASE_SQL_SCHEMA = `-- 1. Create website_content table to store dynamic layout configurations
CREATE TABLE IF NOT EXISTS website_content (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create contact_messages table to store visitor contact submissions
CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone TEXT,
  subject TEXT,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Disable Row Level Security (RLS)
ALTER TABLE website_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;

-- 4. Enable public read & write policies for testing/direct-integration
-- Note: In production, secure these with proper authentication rules!
DROP POLICY IF EXISTS "Allow public select on website_content" ON website_content;
CREATE POLICY "Allow public select on website_content" 
  ON website_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on website_content" ON website_content;
CREATE POLICY "Allow public insert on website_content" 
  ON website_content FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on website_content" ON website_content;
CREATE POLICY "Allow public update on website_content" 
  ON website_content FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete on website_content" ON website_content;
CREATE POLICY "Allow public delete on website_content" 
  ON website_content FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow public insert on contact_messages" ON contact_messages;
CREATE POLICY "Allow public insert on contact_messages" 
  ON contact_messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select on contact_messages" ON contact_messages;
CREATE POLICY "Allow public select on contact_messages" 
  ON contact_messages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public delete on contact_messages" ON contact_messages;
CREATE POLICY "Allow public delete on contact_messages" 
  ON contact_messages FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow public update on contact_messages" ON contact_messages;
CREATE POLICY "Allow public update on contact_messages" 
  ON contact_messages FOR UPDATE USING (true) WITH CHECK (true);

-- 5. Seed default website content data
-- This populates the default website configuration so it works out of the box!
-- It uses ON CONFLICT DO NOTHING to preserve any changes you made in the app.
INSERT INTO website_content (id, data, updated_at)
VALUES (
  'default',
  $$
  {
    "settings": {
      "logoText": "RailConstruct",
      "phone": "+1 (555) 123-4567",
      "phoneAlt": "+1 (555) 987-6543",
      "email": "info@railconstruct.com",
      "address": "123 Railway Avenue, Industrial District, City, Country 10001",
      "companyProfileUrl": "#",
      "whatsappNumber": "+15551234567"
    },
    "hero": {
      "ctaProjectsText": "OUR PROJECTS",
      "ctaContactText": "CONTACT US",
      "slides": [
        {
          "id": "slide-1",
          "titlePart1": "Building the Future of ",
          "titleGold": "Railways",
          "subtitle": "World-class infrastructure solutions, track construction, and maintenance services delivered with precision and safety.",
          "bgImage": "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=1600&q=80"
        },
        {
          "id": "slide-2",
          "titlePart1": "Connecting Cities with ",
          "titleGold": "High-Speed Rail",
          "subtitle": "Deploying next-generation passenger rail transit systems to bridge communities with speed and efficiency.",
          "bgImage": "https://images.unsplash.com/photo-1541427468141-21b953e2578e?auto=format&fit=crop&w=1600&q=80"
        },
        {
          "id": "slide-3",
          "titlePart1": "Heavy-Haul & Freight ",
          "titleGold": "Corridors",
          "subtitle": "Designing and constructing heavy-load rail infrastructure capable of supporting critical industrial supply chains.",
          "bgImage": "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1600&q=80"
        },
        {
          "id": "slide-4",
          "titlePart1": "Next-Gen Signaling & ",
          "titleGold": "Safety Systems",
          "subtitle": "Integrating computerized interlocking and level crossing protection systems for secure railway control.",
          "bgImage": "https://images.unsplash.com/photo-1532103054090-334e6e60b73a?auto=format&fit=crop&w=1600&q=80"
        }
      ]
    },
    "about": {
      "title": "About RailConstruct",
      "legacyHeading": "A Legacy of Excellence",
      "legacyText1": "Founded in 1995, RailConstruct has grown from a regional track maintenance company into a global leader in railway infrastructure development.",
      "legacyText2": "Our mission is to connect communities and drive economic growth through the construction of safe, efficient, and sustainable railway networks. We combine decades of hands-on experience with cutting-edge engineering technologies.",
      "legacyText3": "With over 500 successful projects completed across 3 continents, our portfolio speaks to our capability to handle complex logistical and technical engineering challenges.",
      "imageUrl": "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
      "stats": [
        { "id": "stat-1", "numberText": "25+", "label": "YEARS EXPERIENCE" },
        { "id": "stat-2", "numberText": "500+", "label": "PROJECTS COMPLETED" },
        { "id": "stat-3", "numberText": "10k+", "label": "KM OF TRACK LAID" },
        { "id": "stat-4", "numberText": "1500+", "label": "EXPERT EMPLOYEES" }
      ]
    },
    "services": [
      {
        "id": "srv-1",
        "title": "Track Construction",
        "description": "Full-scale railway track construction including ballast, sleepers, and rails.",
        "iconName": "Wrench"
      },
      {
        "id": "srv-2",
        "title": "Signaling Systems",
        "description": "Installation and maintenance of advanced railway signaling and communication systems.",
        "iconName": "Settings"
      },
      {
        "id": "srv-3",
        "title": "Maintenance & Repair",
        "description": "Regular maintenance, emergency repairs, and track upgrading services.",
        "iconName": "Hammer"
      }
    ],
    "projects": [
      {
        "id": "proj-1",
        "title": "High-Speed Rail Extension",
        "location": "TOKYO - OSAKA",
        "description": "Extending the high-speed rail network with advanced track laying techniques.",
        "image": "https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?auto=format&fit=crop&w=800&q=80"
      },
      {
        "id": "proj-2",
        "title": "Metro Line 4 Modernization",
        "location": "NEW YORK CITY",
        "description": "Upgrading signaling systems and track infrastructure for Metro Line 4.",
        "image": "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=80"
      },
      {
        "id": "proj-3",
        "title": "Heavy-Freight Corridor Phase II",
        "location": "CHICAGO - HOUSTON",
        "description": "Construction of double-track heavy freight line connecting key logistics ports.",
        "image": "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80"
      }
    ],
    "certifications": [
      {
        "id": "cert-1",
        "title": "ISO 9001:2015",
        "org": "QUALITY MANAGEMENT STANDARD",
        "desc": "International accreditation for demonstrating consistent quality assurance in complex civil & railway logistics engineering designs."
      },
      {
        "id": "cert-2",
        "title": "ISO 45001:2018",
        "org": "OCCUPATIONAL HEALTH & SAFETY",
        "desc": "Global standard confirming zero-harm safety systems, on-site hazard reductions, and field-work accident preventative measures."
      },
      {
        "id": "cert-3",
        "title": "Class A Railway License",
        "org": "FEDERAL TRANSIT COMMISSION",
        "desc": "Highest tiered certification authorizing high-speed mainlines track constructions and full computerized signaling alignments."
      }
    ]
  }
  $$,
  NOW()
)
ON CONFLICT (id) 
DO UPDATE SET 
  data = EXCLUDED.data,
  updated_at = EXCLUDED.updated_at;

-- 6. Create admin_accounts table to store admin users
CREATE TABLE IF NOT EXISTS admin_accounts (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Disable RLS for admin_accounts
ALTER TABLE admin_accounts DISABLE ROW LEVEL SECURITY;

-- Enable public read policy for credential verification
DROP POLICY IF EXISTS "Allow public select on admin_accounts" ON admin_accounts;
CREATE POLICY "Allow public select on admin_accounts" 
  ON admin_accounts FOR SELECT USING (true);

-- Enable public insert/update policy so users can manage admin credentials
DROP POLICY IF EXISTS "Allow public insert on admin_accounts" ON admin_accounts;
CREATE POLICY "Allow public insert on admin_accounts" 
  ON admin_accounts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on admin_accounts" ON admin_accounts;
CREATE POLICY "Allow public update on admin_accounts" 
  ON admin_accounts FOR UPDATE USING (true) WITH CHECK (true);

-- Seed default administrator account if not exists
INSERT INTO admin_accounts (id, username, password, created_at, updated_at)
VALUES ('admin-default', 'admin', 'admin123', NOW(), NOW())
ON CONFLICT (username) DO NOTHING;
`;

/**
 * Fetch WebsiteData from Supabase.
 * Falls back to local cache or defaults if table isn't accessible.
 */
export async function fetchWebsiteDataFromSupabase(): Promise<WebsiteData | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("website_content")
      .select("data")
      .eq("id", "default")
      .maybeSingle();

    if (error) {
      console.warn("Supabase website_content fetch failed or table doesn't exist:", error.message);
      return null;
    }

    if (data && data.data) {
      return data.data as WebsiteData;
    }
    return null;
  } catch (err) {
    console.warn("Error fetching from Supabase (soft warning):", err);
    return null;
  }
}

/**
 * Save WebsiteData to Supabase.
 */
export async function saveWebsiteDataToSupabase(data: WebsiteData): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from("website_content")
      .upsert(
        {
          id: "default",
          data: data,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

    if (error) {
      console.warn("Supabase website_content save failed (soft warning):", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Error saving to Supabase (soft warning):", err);
    return false;
  }
}

/**
 * Fetch ContactMessages from Supabase.
 */
export async function fetchMessagesFromSupabase(): Promise<ContactMessage[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase contact_messages fetch failed:", error.message);
      return null;
    }

    if (data) {
      return data.map((item) => ({
        id: item.id,
        fullName: item.name || "",
        email: item.email || "",
        phone: item.phone || "",
        message: item.message || "",
        timestamp: item.created_at || new Date().toISOString(),
      }));
    }
    return [];
  } catch (err) {
    console.warn("Error fetching messages from Supabase (soft warning):", err);
    return null;
  }
}

/**
 * Save single ContactMessage to Supabase.
 */
export async function saveMessageToSupabase(msg: ContactMessage): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from("contact_messages")
      .insert({
        id: msg.id,
        name: msg.fullName,
        email: msg.email,
        phone: msg.phone,
        message: msg.message,
        is_read: false,
        created_at: msg.timestamp,
      });

    if (error) {
      console.warn("Supabase contact_messages insert failed (soft warning):", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Error inserting message to Supabase (soft warning):", err);
    return false;
  }
}

/**
 * Delete a ContactMessage from Supabase.
 */
export async function deleteMessageFromSupabase(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (error) {
      console.warn("Supabase contact_messages delete failed (soft warning):", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Error deleting message from Supabase (soft warning):", err);
    return false;
  }
}

/**
 * Update message read state in Supabase.
 */
export async function updateMessageReadStateInSupabase(id: string, isRead: boolean): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from("contact_messages")
      .update({ is_read: isRead })
      .eq("id", id);

    if (error) {
      console.warn("Supabase contact_messages read-state update failed (soft warning):", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Error updating message read state in Supabase (soft warning):", err);
    return false;
  }
}

/**
 * Verify whether connection to Supabase works and test table existence.
 */
export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  websiteContentTable: boolean;
  contactMessagesTable: boolean;
  adminAccountsTable: boolean;
  error?: string;
}> {
  if (!supabase) {
    return { connected: false, websiteContentTable: false, contactMessagesTable: false, adminAccountsTable: false, error: "Supabase client not initialized" };
  }

  const result = {
    connected: false,
    websiteContentTable: false,
    contactMessagesTable: false,
    adminAccountsTable: false,
    error: undefined as string | undefined,
  };

  try {
    // 1. Test website_content table
    const { error: webError } = await supabase
      .from("website_content")
      .select("id")
      .limit(1);

    result.connected = true;

    if (!webError || webError.code === "PGRST116") {
      result.websiteContentTable = true;
    }

    // 2. Test contact_messages table
    const { error: msgError } = await supabase
      .from("contact_messages")
      .select("id")
      .limit(1);

    if (!msgError || msgError.code === "PGRST116") {
      result.contactMessagesTable = true;
    }

    // 3. Test admin_accounts table
    const { error: accError } = await supabase
      .from("admin_accounts")
      .select("id")
      .limit(1);

    if (!accError || accError.code === "PGRST116") {
      result.adminAccountsTable = true;
    }

    return result;
  } catch (err: any) {
    return {
      ...result,
      error: err?.message || String(err),
    };
  }
}

/**
 * Verify administrator credentials against the database.
 * If the connection isn't configured, or the table doesn't exist yet, we can
 * gracefully fall back to the pre-configured default 'admin' / 'admin123' so
 * the admin is never locked out during migrations.
 */
export async function verifyAdminCredentials(username: string, passcode: string): Promise<{
  success: boolean;
  message: string;
  source: "database" | "fallback";
}> {
  if (!supabase) {
    // If Supabase is not configured, fall back to standard passcode
    if (username.toLowerCase() === "admin" && (passcode === "admin" || passcode === "admin123")) {
      return { success: true, message: "Welcome back (Local Fallback Mode)!", source: "fallback" };
    }
    return { success: false, message: "Invalid credentials (Local Fallback).", source: "fallback" };
  }

  try {
    const { data, error } = await supabase
      .from("admin_accounts")
      .select("*")
      .eq("username", username)
      .eq("password", passcode); // check password directly for simple demo

    if (error) {
      console.warn("Supabase admin_accounts verification failed, falling back to local credentials:", error.message);
      // Fallback
      if (username.toLowerCase() === "admin" && (passcode === "admin" || passcode === "admin123")) {
        return { success: true, message: "Welcome back! Verified using fallback local credentials.", source: "fallback" };
      }
      return { success: false, message: "Verification failed. Table admin_accounts might not be initialized.", source: "fallback" };
    }

    if (data && data.length > 0) {
      return { success: true, message: "Welcome! Authenticated via Supabase database.", source: "database" };
    } else {
      // In case they used the fallback credentials and nothing was found in DB, let's check fallback
      if (username.toLowerCase() === "admin" && (passcode === "admin" || passcode === "admin123")) {
        return { success: true, message: "Welcome back! Verified using fallback local credentials.", source: "fallback" };
      }
      return { success: false, message: "Invalid username or passcode.", source: "database" };
    }
  } catch (err) {
    console.warn("Error verifying credentials via Supabase, using local fallback:", err);
    if (username.toLowerCase() === "admin" && (passcode === "admin" || passcode === "admin123")) {
      return { success: true, message: "Welcome back! Verified using fallback local credentials.", source: "fallback" };
    }
    return { success: false, message: "Invalid credentials.", source: "fallback" };
  }
}

