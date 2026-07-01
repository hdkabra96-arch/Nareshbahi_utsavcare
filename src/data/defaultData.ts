/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WebsiteData } from "../types";

export const DEFAULT_WEBSITE_DATA: WebsiteData = {
  settings: {
    logoText: "Utsav Care Corp",
    phone: "+91 98251 48134",
    phoneAlt: "+91 98251 48034",
    email: "utsavcare48@gmail.com",
    emailAlt: "utsavcarecpl4488@gmail.com",
    address: "Surat, Gujarat, India",
    companyProfileUrl: "#",
    whatsappNumber: "919825148134",
  },
  hero: {
    ctaProjectsText: "OUR PROJECTS",
    ctaContactText: "CONTACT US",
    slides: [
      {
        id: "slide-1",
        titlePart1: "Building the Future of ",
        titleGold: "Railways",
        subtitle: "World-class infrastructure solutions, track construction, and maintenance services delivered with precision and safety.",
        bgImage: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=1600&q=80",
      },
      {
        id: "slide-2",
        titlePart1: "Connecting Cities with ",
        titleGold: "High-Speed Rail",
        subtitle: "Deploying next-generation passenger rail transit systems to bridge communities with speed and efficiency.",
        bgImage: "https://images.unsplash.com/photo-1541427468141-21b953e2578e?auto=format&fit=crop&w=1600&q=80",
      },
      {
        id: "slide-3",
        titlePart1: "Heavy-Haul & Freight ",
        titleGold: "Corridors",
        subtitle: "Designing and constructing heavy-load rail infrastructure capable of supporting critical industrial supply chains.",
        bgImage: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1600&q=80",
      },
      {
        id: "slide-4",
        titlePart1: "Next-Gen Signaling & ",
        titleGold: "Safety Systems",
        subtitle: "Integrating computerized interlocking and level crossing protection systems for secure railway control.",
        bgImage: "https://images.unsplash.com/photo-1532103054090-334e6e60b73a?auto=format&fit=crop&w=1600&q=80",
      },
    ],
  },
  about: {
    title: "About Utsav Care Corporation Pvt. Ltd.",
    legacyHeading: "Legacy of Engineering Excellence Since 2003",
    legacyText1: "Utsav Care Corporation Pvt. Ltd. (UCCPL) is a professionally managed company incorporated on 26 March 2025 to expand and carry forward the successful legacy of Utsav Care Refrigeration & Electrical (UCRE), a sole proprietorship established on 24 January 2003.",
    legacyText2: "With over two decades of industry experience, UCCPL has evolved into a trusted partner for delivering innovative engineering solutions, advanced technology, manufacturing support, and integrated supply chain services. The company is dedicated to providing high-quality, reliable, and cost-effective solutions tailored to the demanding requirements of Indian Railways and allied industries.",
    legacyText3: "Backed by a team of experienced professionals and a commitment to excellence, UCCPL continuously strives to deliver superior workmanship, timely execution, and customer satisfaction while maintaining the highest standards of quality, safety, and integrity.",
    paragraphs: [
      "Our infrastructure and technology footprint is designed to support the modern railway ecosystem with high-precision manufacturing, testing, and implementation.",
      "As an MSME registered enterprise, we remain dedicated to localized production and assembly support under national manufacturing policies."
    ],
    imageUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
    stats: [
      { id: "stat-1", numberText: "20+", label: "YEARS OF LEGACY" },
      { id: "stat-2", numberText: "ISO", label: "9001:2015 CERTIFIED" },
      { id: "stat-3", numberText: "MSME", label: "REGISTERED ENTERPRISE" },
      { id: "stat-4", numberText: "100%", label: "RAILWAY FOCUSED" },
    ],
  },
  services: [
    {
      id: "srv-1",
      title: "Track Construction",
      description: "Full-scale railway track construction including ballast, sleepers, and rails.",
      iconName: "Wrench",
      longDescription: "Our Track Construction division specializes in laying down the physical backbone of railway lines. We carry out complete alignment design, subgrade preparation, ballasting, sleeper laydown, and rail anchoring. Utilizing heavy-duty automatic tamping machines, flash-butt welding systems, and geometric track analysis, we guarantee absolute alignment precision and long-term durability conforming strictly to national rail safety regulations.",
    },
    {
      id: "srv-2",
      title: "Signaling Systems",
      description: "Installation and maintenance of advanced railway signaling and communication systems.",
      iconName: "Settings",
      longDescription: "Deploying high-reliability, fail-safe signaling systems is critical to safe railway routing. We handle the complete engineering, procurement, installation, and commissioning of computerized Electronic Interlocking (EI), Track Circuits, Axle Counters, and automated Level Crossing protection systems. Our communication solutions ensure seamless train-to-track data feeds and absolute traffic safety coordination.",
    },
    {
      id: "srv-3",
      title: "Maintenance & Repair",
      description: "Regular maintenance, emergency repairs, and track upgrading services.",
      iconName: "Hammer",
      longDescription: "We provide comprehensive maintenance and emergency repair services to sustain continuous rail availability. Our services include ultrasonic flaw detection (USFD) to identify internal rail micro-cracks before they fail, automated grinding to restore optimal rail-head profiles, sleeper replacements, ballasting maintenance, and rapid-response emergency derailment repair and track reconstruction.",
    },
  ],
  projects: [
    {
      id: "proj-1",
      title: "High-Speed Rail Extension",
      location: "TOKYO - OSAKA",
      description: "Extending the high-speed rail network with advanced track laying techniques.",
      image: "https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?auto=format&fit=crop&w=800&q=80", // Jet formation matching Image 6
      longDescription: "The High-Speed Rail Extension project represents a milestone in modern mass transit engineering. Our team laid over 120 kilometers of ballastless ballast-free high-speed tracks, supporting operating velocities up to 320 km/h. This involved precision layout of high-durability pre-cast concrete track slabs, laser-guided leveling systems, and seamless continuous welded rail technology to achieve an incredibly smooth ride and optimal high-speed performance.",
    },
    {
      id: "proj-2",
      title: "Metro Line 4 Modernization",
      location: "NEW YORK CITY",
      description: "Upgrading signaling systems and track infrastructure for Metro Line 4.",
      image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=80", // Piano keys matching Image 6
      longDescription: "To increase passenger throughput and safety, the Metro Line 4 Modernization replaced obsolete signaling grids with Communications-Based Train Control (CBTC) systems. We modernized active subway lines during overnight maintenance windows, minimizing public disruption. Work included laying noise-reduction rubberized sleeper pads, reinforcing ballast bases in high-wear curves, and establishing 14 secure automated interlocking rooms.",
    },
    {
      id: "proj-3",
      title: "Freight Corridor Bridge",
      location: "CHICAGO",
      description: "Construction of a heavy-duty railway bridge for freight transport.",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80", // Forest road matching Image 6
      longDescription: "This structural masterpiece involved the construction of a heavy-duty, dual-track steel-truss railway bridge crossing a major river basin. Engineered to bear Cooper E-80 standard load configurations, the bridge supports ultra-heavy diesel freight trains. The construction utilized deep-seated pier caissons, high-performance weather-resistant structural steel, and modular deck installations to guarantee a design lifespan of over 100 years.",
    },
  ],
  certifications: [
    {
      id: "cert-1",
      title: "ISO 9001:2015",
      description: "Quality Management Systems certification for railway construction.",
    },
    {
      id: "cert-2",
      title: "OHSAS 18001",
      description: "Occupational Health and Safety Management certification.",
    },
    {
      id: "cert-3",
      title: "National Railway Safety Authority",
      description: "Certified contractor for national railway projects.",
    },
  ],
  gallery: [
    {
      id: "gal-1",
      url: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80",
      caption: "Heavy-load cargo logistics crossing interstate supply corridors.",
      category: "Freight",
    },
    {
      id: "gal-2",
      url: "https://images.unsplash.com/photo-1541427468141-21b953e2578e?auto=format&fit=crop&w=1200&q=80",
      caption: "Sleek Shinkansen high-speed bullet train approaching modern transit hubs.",
      category: "Passenger",
    },
    {
      id: "gal-3",
      url: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=1200&q=80",
      caption: "Heavy construction cranes aligning modern tracks in urban developments.",
      category: "Construction",
    },
    {
      id: "gal-4",
      url: "https://images.unsplash.com/photo-1532103054090-334e6e60b73a?auto=format&fit=crop&w=1200&q=80",
      caption: "Interlocked safety signals lining industrial bypass route junctions.",
      category: "Signaling",
    },
    {
      id: "gal-5",
      url: "https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?auto=format&fit=crop&w=1200&q=80",
      caption: "Double-span steel truss bridge engineered for continuous heavy transport.",
      category: "Bridges",
    },
    {
      id: "gal-6",
      url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
      caption: "Steel railway junction tracks winding into metropolitan central depots.",
      category: "Tracks",
    },
  ],
  servicesSlider: [
    {
      id: "ss-1",
      url: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=1200&q=80",
      caption: "Advanced heavy track aligning operations"
    },
    {
      id: "ss-2",
      url: "https://images.unsplash.com/photo-1541427468141-21b953e2578e?auto=format&fit=crop&w=1200&q=80",
      caption: "Next-gen passenger transit system deployments"
    },
    {
      id: "ss-3",
      url: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80",
      caption: "Industrial heavy-haul and freight corridor setups"
    },
    {
      id: "ss-4",
      url: "https://images.unsplash.com/photo-1532103054090-334e6e60b73a?auto=format&fit=crop&w=1200&q=80",
      caption: "Automated signaling and level crossing protection systems"
    }
  ],
  projectsSlider: [
    {
      id: "ps-1",
      url: "https://images.unsplash.com/photo-1513829092301-a7274db27427?auto=format&fit=crop&w=1200&q=80",
      caption: "Metropolitan Transit Line Alpha Expansion Phase II"
    },
    {
      id: "ps-2",
      url: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=1200&q=80",
      caption: "High-Speed Rail Link Track Alignment Inspections"
    },
    {
      id: "ps-3",
      url: "https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?auto=format&fit=crop&w=1200&q=80",
      caption: "Pre-stressed Concrete Viaducts & Multi-span Bridges Construction"
    }
  ],
  certificationsSlider: [
    {
      id: "cs-1",
      url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
      caption: "ISO 9001:2015 Quality Management Systems Certification Audit"
    },
    {
      id: "cs-2",
      url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
      caption: "EN 15085 Railway Applications Welding Standards Verification"
    },
    {
      id: "cs-3",
      url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
      caption: "ISO 45001 Occupational Health and Safety Audits and Standards Compliance"
    }
  ],
};
