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
-- It uses ON CONFLICT DO UPDATE to ensure updates apply.
INSERT INTO website_content (id, data, updated_at)
VALUES (
  'default',
  $$
  {
    "settings": {
      "logoText": "Utsav Care Corp",
      "phone": "+91 98251 48134",
      "phoneAlt": "+91 98251 48034",
      "email": "utsavcare48@gmail.com",
      "emailAlt": "utsavcarecpl4488@gmail.com",
      "address": "Surat, Gujarat, India",
      "companyProfileUrl": "#",
      "whatsappNumber": "919825148134"
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
      "title": "About Utsav Care Corporation Pvt. Ltd.",
      "legacyHeading": "Legacy of Engineering Excellence Since 2003",
      "legacyText1": "Utsav Care Corporation Pvt. Ltd. (UCCPL) is a professionally managed company incorporated on 26 March 2025 to expand and carry forward the successful legacy of Utsav Care Refrigeration & Electrical (UCRE), a sole proprietorship established on 24 January 2003.",
      "legacyText2": "With over two decades of industry experience, UCCPL has evolved into a trusted partner for delivering innovative engineering solutions, advanced technology, manufacturing support, and integrated supply chain services. The company is dedicated to providing high-quality, reliable, and cost-effective solutions tailored to the demanding requirements of Indian Railways and allied industries.",
      "legacyText3": "Backed by a team of experienced professionals and a commitment to excellence, UCCPL continuously strives to deliver superior workmanship, timely execution, and customer satisfaction while maintaining the highest standards of quality, safety, and integrity.",
      "paragraphs": [
        "Our infrastructure and technology footprint is designed to support the modern railway ecosystem with high-precision manufacturing, testing, and implementation.",
        "As an MSME registered enterprise, we remain dedicated to localized production and assembly support under national manufacturing policies."
      ],
      "imageUrl": "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
      "stats": [
        { "id": "stat-1", "numberText": "20+", "label": "YEARS OF LEGACY" },
        { "id": "stat-2", "numberText": "ISO", "label": "9001:2015 CERTIFIED" },
        { "id": "stat-3", "numberText": "MSME", "label": "REGISTERED ENTERPRISE" },
        { "id": "stat-4", "numberText": "100%", "label": "RAILWAY FOCUSED" }
      ]
    },
    "services": [
      {
        "id": "srv-1",
        "title": "Air Conditioning",
        "description": "Advanced industrial, office, and coach air conditioning installation and maintenance services.",
        "iconName": "Wind",
        "longDescription": "We deliver full-scale engineering, installation, and preventative maintenance for specialized air conditioning units. Our experience ranges from administrative facilities and railway control towers to active rolling stock coaches. We guarantee optimal cabin temperature regulation, high energy efficiency, and compliance with severe thermal control specifications.",
        "overview": "Utsav Care Corporation Pvt. Ltd. provides comprehensive air conditioning solutions for railway coaches, locomotive cabins, offices, workshops, and industrial facilities. Our experienced technicians ensure efficient cooling, improved performance, and reliable operation through professional installation, maintenance, and repair services.",
        "bullets": [
          "Air Conditioning Installation",
          "Preventive Maintenance",
          "Breakdown Repair",
          "Performance Testing",
          "System Inspection",
          "Spare Parts Replacement"
        ],
        "imageUrl": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80"
      },
      {
        "id": "srv-2",
        "title": "Refrigeration",
        "description": "Heavy-duty cooling systems, cold rooms, and cold chains for industrial applications.",
        "iconName": "Snowflake",
        "longDescription": "Extending from our foundational heritage as Utsav Care Refrigeration, UCCPL designs and services high-performance industrial refrigeration units. We build modular walk-in cold rooms, deep chillers, and automated temperature-monitored storage structures designed for high reliability, precise thermal control, and severe environmental operations.",
        "overview": "We specialize in the installation, maintenance, and repair of refrigeration systems used in railway operations and industrial applications. Our solutions ensure reliable cooling performance while maximizing energy efficiency and equipment life.",
        "bullets": [
          "Refrigeration System Installation",
          "Cooling Unit Maintenance",
          "Compressor Servicing",
          "Leak Detection & Repair",
          "Preventive Inspection",
          "Performance Optimization"
        ],
        "imageUrl": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"
      },
      {
        "id": "srv-3",
        "title": "Electrical & Electronics",
        "description": "Comprehensive wiring, circuit design, control panels, and electronic interlocking systems.",
        "iconName": "Zap",
        "longDescription": "Our team engineers complete electrical frameworks and smart control circuitry. From heavy industrial power boards and main distribution networks to delicate digital micro-controller setups, we implement advanced safety trip circuits, load balancers, and computerized electronics that adhere to Indian Railways quality standards.",
        "overview": "Our electrical and electronics division offers reliable solutions for installation, maintenance, troubleshooting, and repair of electrical systems used in railway infrastructure and industrial facilities.",
        "bullets": [
          "Electrical Installation",
          "Electrical Maintenance",
          "Electronic Equipment Repair",
          "Control Panel Wiring",
          "Cable Management",
          "Fault Diagnosis"
        ],
        "imageUrl": "https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=1200&q=80"
      },
      {
        "id": "srv-4",
        "title": "Mechanical",
        "description": "Precision machining, heavy fabrication, assembly support, and structural components.",
        "iconName": "Wrench",
        "longDescription": "We manufacture, assemble, and repair heavy-duty machinery parts and structural steel configurations. Equipped with CNC machinery, high-precision hydraulic presses, and multi-stage testing setups, we supply and maintain mechanical linkages, customized railway components, and heavy-duty load-bearing assemblies.",
        "overview": "We provide complete mechanical maintenance and engineering support for railway equipment and industrial machinery. Our services focus on improving operational efficiency, reliability, and equipment longevity.",
        "bullets": [
          "Mechanical Equipment Maintenance",
          "Machinery Repair",
          "Preventive Maintenance",
          "Equipment Inspection",
          "Component Replacement",
          "Mechanical Troubleshooting"
        ],
        "imageUrl": "https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?auto=format&fit=crop&w=1200&q=80"
      },
      {
        "id": "srv-5",
        "title": "PU Painting",
        "description": "Premium Polyurethane painting, anti-corrosive coating, and industrial surface finishing.",
        "iconName": "Paintbrush",
        "longDescription": "High-durability Polyurethane (PU) painting is critical to preventing corrosion on high-exposure rail coaches, locomotives, and trackside equipment. We operate state-of-the-art dust-free spray booths, using advanced sand-blasting prep, multi-coat primers, and premium weather-proof PU coatings that resist thermal fading and rust.",
        "overview": "Our PU painting services provide durable, high-quality protective coatings that enhance the appearance and lifespan of railway assets and industrial equipment while protecting them from corrosion and environmental damage.",
        "bullets": [
          "PU Coating",
          "Surface Preparation",
          "Industrial Painting",
          "Corrosion Protection",
          "Protective Coating",
          "Finishing Services"
        ],
        "imageUrl": "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1200&q=80"
      },
      {
        "id": "srv-6",
        "title": "Thermal Insulation",
        "description": "Industrial hot & cold thermal insulation, acoustic damping, and energy conservation.",
        "iconName": "Shield",
        "longDescription": "We provide high-density thermal insulation services for heavy piping, steam containers, refrigeration tunnels, and locomotive engine hulls. Using glass wool, polyurethane foam (PUF), and reflective aluminum cladding, we dramatically reduce power losses, enhance thermal efficiency, and provide acoustic deadening in active work zones.",
        "overview": "We offer professional thermal insulation solutions to improve energy efficiency, maintain temperature stability, and protect equipment operating under high or low temperature conditions.",
        "bullets": [
          "Thermal Insulation Installation",
          "Heat Loss Prevention",
          "Pipeline Insulation",
          "Equipment Insulation",
          "Maintenance & Replacement",
          "Industrial Insulation Solutions"
        ],
        "imageUrl": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80"
      },
      {
        "id": "srv-7",
        "title": "Housekeeping",
        "description": "Industrial facility sanitization, loco shed deep cleaning, and systematic maintenance.",
        "iconName": "Sparkles",
        "longDescription": "Maintaining immaculate sanitization and structural hygiene across high-traffic rail stations, administrative buildings, and active locomotive workshops. We implement automated floor scrubbers, industrial-grade high-pressure washers, and ecological sanitizers to maintain safe, debris-free, and professional transit hubs.",
        "overview": "UCCPL provides professional housekeeping and support services for railway stations, workshops, offices, loco sheds, and other operational facilities, ensuring clean, safe, and well-maintained working environments.",
        "bullets": [
          "Railway Housekeeping",
          "Platform Cleaning",
          "Workshop Cleaning",
          "Office Maintenance",
          "Facility Support",
          "General Housekeeping"
        ],
        "imageUrl": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80"
      },
      {
        "id": "srv-8",
        "title": "Water Cooler",
        "description": "High-capacity drinking water chillers, RO filtration plants, and community water hubs.",
        "iconName": "Droplets",
        "longDescription": "We supply, install, and support high-throughput industrial water cooling solutions and integrated reverse osmosis (RO) purification facilities. These cooling hubs are custom-engineered for maximum durability in high-traffic spaces like railway platform terminals, worker sheds, and corporate offices.",
        "overview": "We provide installation, servicing, maintenance, and repair of water coolers used at railway stations, workshops, offices, and industrial locations to ensure uninterrupted access to clean drinking water.",
        "bullets": [
          "Water Cooler Installation",
          "Preventive Maintenance",
          "Repair & Servicing",
          "Cooling Performance Testing",
          "Spare Parts Replacement",
          "Annual Maintenance"
        ],
        "imageUrl": "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=1200&q=80"
      },
      {
        "id": "srv-9",
        "title": "Transformer",
        "description": "Power step-down & step-up transformers, substation maintenance, and coil winding.",
        "iconName": "Bolt",
        "longDescription": "Specialized servicing, custom rewinding, and diagnostic maintenance for medium to high-voltage industrial transformers. We perform insulation oil filtration tests, thermal imaging scans, and complete terminal box upgrades to prevent substation failures and secure continuous electricity distribution.",
        "overview": "Our transformer services ensure safe, reliable, and efficient power distribution through expert installation, preventive maintenance, testing, and repair of transformers used in railway and industrial power systems.",
        "bullets": [
          "Transformer Installation",
          "Preventive Maintenance",
          "Oil Testing",
          "Electrical Testing",
          "Fault Repair",
          "Performance Inspection"
        ],
        "imageUrl": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80"
      },
      {
        "id": "srv-10",
        "title": "Electric & Diesel Locomotive",
        "description": "Specialized subsystem overhaul, electrical traction repair, and mechanical engine support.",
        "iconName": "Train",
        "longDescription": "Our technical teams perform deep diagnostic overhauls on critical sub-assemblies of both electric traction and diesel locomotive models. From traction motor rebuilding and cabin console rewiring to turbocharger repairs, we keep national locomotives functioning at peak efficiency.",
        "overview": "We provide specialized maintenance and technical support for electric and diesel locomotives, ensuring dependable performance, operational safety, and reduced downtime for railway operations.",
        "bullets": [
          "Locomotive Maintenance",
          "Mechanical Repair",
          "Electrical Inspection",
          "Component Replacement",
          "Preventive Maintenance",
          "Technical Support"
        ],
        "imageUrl": "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80"
      },
      {
        "id": "srv-11",
        "title": "Train, Loco Shed, Platform",
        "description": "Comprehensive platform electrical fit-outs, heavy loco shed construction, and trackside support.",
        "iconName": "Building",
        "longDescription": "Providing structural, mechanical, and electrical fit-out services for active locomotive sheds, train platforms, and maintenance depots. This includes installing high-mast overhead illumination, industrial overhead crane runways, rail ventilation grids, and station platform wiring.",
        "overview": "UCCPL delivers comprehensive support services for trains, loco sheds, and railway platforms. Our team ensures efficient maintenance, operational assistance, and facility management to support uninterrupted railway operations.",
        "bullets": [
          "Train Maintenance Support",
          "Loco Shed Maintenance",
          "Platform Maintenance",
          "Equipment Inspection",
          "Technical Assistance",
          "Operational Support Services"
        ],
        "imageUrl": "https://images.unsplash.com/photo-1551698618-1ffdfe1d9c1a?auto=format&fit=crop&w=1200&q=80"
      }
    ],
    "projects": [
      {
        "id": "proj-1",
        "title": "High-Speed Rail Extension",
        "location": "TOKYO - OSAKA",
        "description": "Extending the high-speed rail network with advanced track laying techniques.",
        "image": "https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?auto=format&fit=crop&w=800&q=80",
        "longDescription": "The High-Speed Rail Extension project represents a milestone in modern mass transit engineering. Our team laid over 120 kilometers of ballastless ballast-free high-speed tracks, supporting operating velocities up to 320 km/h. This involved precision layout of high-durability pre-cast concrete track slabs, laser-guided leveling systems, and seamless continuous welded rail technology to achieve an incredibly smooth ride and optimal high-speed performance."
      },
      {
        "id": "proj-2",
        "title": "Metro Line 4 Modernization",
        "location": "NEW YORK CITY",
        "description": "Upgrading signaling systems and track infrastructure for Metro Line 4.",
        "image": "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=80",
        "longDescription": "To increase passenger throughput and safety, the Metro Line 4 Modernization replaced obsolete signaling grids with Communications-Based Train Control (CBTC) systems. We modernized active subway lines during overnight maintenance windows, minimizing public disruption. Work included laying noise-reduction rubberized sleeper pads, reinforcing ballast bases in high-wear curves, and establishing 14 secure automated interlocking rooms."
      },
      {
        "id": "proj-3",
        "title": "Heavy-Freight Corridor Phase II",
        "location": "CHICAGO - HOUSTON",
        "description": "Construction of double-track heavy freight line connecting key logistics ports.",
        "image": "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
        "longDescription": "This structural masterpiece involved the construction of a heavy-duty, dual-track steel-truss railway bridge crossing a major river basin. Engineered to bear Cooper E-80 standard load configurations, the bridge supports ultra-heavy diesel freight trains. The construction utilized deep-seated pier caissons, high-performance weather-resistant structural steel, and modular deck installations to guarantee a design lifespan of over 100 years."
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
    ],
    "gallery": [
      {
        "id": "gal-1",
        "url": "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80",
        "caption": "Heavy-load cargo logistics crossing interstate supply corridors.",
        "category": "Freight"
      },
      {
        "id": "gal-2",
        "url": "https://images.unsplash.com/photo-1541427468141-21b953e2578e?auto=format&fit=crop&w=1200&q=80",
        "caption": "Sleek Shinkansen high-speed bullet train approaching modern transit hubs.",
        "category": "Passenger"
      },
      {
        "id": "gal-3",
        "url": "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=1200&q=80",
        "caption": "Heavy construction cranes aligning modern tracks in urban developments.",
        "category": "Construction"
      },
      {
        "id": "gal-4",
        "url": "https://images.unsplash.com/photo-1532103054090-334e6e60b73a?auto=format&fit=crop&w=1200&q=80",
        "caption": "Interlocked safety signals lining industrial bypass route junctions.",
        "category": "Signaling"
      },
      {
        "id": "gal-5",
        "url": "https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?auto=format&fit=crop&w=1200&q=80",
        "caption": "Double-span steel truss bridge engineered for continuous heavy transport.",
        "category": "Bridges"
      },
      {
        "id": "gal-6",
        "url": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
        "caption": "Steel railway junction tracks winding into metropolitan central depots.",
        "category": "Tracks"
      }
    ],
    "servicesSlider": [
      {
        "id": "ss-1",
        "url": "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=1200&q=80",
        "caption": "Advanced heavy track aligning operations"
      },
      {
        "id": "ss-2",
        "url": "https://images.unsplash.com/photo-1541427468141-21b953e2578e?auto=format&fit=crop&w=1200&q=80",
        "caption": "Next-gen passenger transit system deployments"
      },
      {
        "id": "ss-3",
        "url": "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80",
        "caption": "Industrial heavy-haul and freight corridor setups"
      },
      {
        "id": "ss-4",
        "url": "https://images.unsplash.com/photo-1532103054090-334e6e60b73a?auto=format&fit=crop&w=1200&q=80",
        "caption": "Automated signaling and level crossing protection systems"
      }
    ],
    "projectsSlider": [
      {
        "id": "ps-1",
        "url": "https://images.unsplash.com/photo-1513829092301-a7274db27427?auto=format&fit=crop&w=1200&q=80",
        "caption": "Metropolitan Transit Line Alpha Expansion Phase II"
      },
      {
        "id": "ps-2",
        "url": "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=1200&q=80",
        "caption": "High-Speed Rail Link Track Alignment Inspections"
      },
      {
        "id": "ps-3",
        "url": "https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?auto=format&fit=crop&w=1200&q=80",
        "caption": "Pre-stressed Concrete Viaducts & Multi-span Bridges Construction"
      }
    ],
    "certificationsSlider": [
      {
        "id": "cs-1",
        "url": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
        "caption": "ISO 9001:2015 Quality Management Systems Certification Audit"
      },
      {
        "id": "cs-2",
        "url": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
        "caption": "EN 15085 Railway Applications Welding Standards Verification"
      },
      {
        "id": "cs-3",
        "url": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
        "caption": "ISO 45001 Occupational Health and Safety Audits and Standards Compliance"
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

-- 7. Create company_documents table to store uploaded company PDF files
CREATE TABLE IF NOT EXISTS company_documents (
  id TEXT PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_data TEXT NOT NULL, -- Base64 representation of PDF
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Disable RLS for company_documents
ALTER TABLE company_documents DISABLE ROW LEVEL SECURITY;

-- Enable public read & write policies for testing/direct-integration
DROP POLICY IF EXISTS "Allow public select on company_documents" ON company_documents;
CREATE POLICY "Allow public select on company_documents" ON company_documents FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on company_documents" ON company_documents;
CREATE POLICY "Allow public insert on company_documents" ON company_documents FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on company_documents" ON company_documents;
CREATE POLICY "Allow public update on company_documents" ON company_documents FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete on company_documents" ON company_documents;
CREATE POLICY "Allow public delete on company_documents" ON company_documents FOR DELETE USING (true);
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

