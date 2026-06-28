/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WebsiteData } from "../types";

export const DEFAULT_WEBSITE_DATA: WebsiteData = {
  settings: {
    logoText: "RailConstruct",
    phone: "+1 (555) 123-4567",
    phoneAlt: "+1 (555) 987-6543",
    email: "info@railconstruct.com",
    address: "123 Railway Avenue, Industrial District, City, Country 10001",
    companyProfileUrl: "#",
    whatsappNumber: "+15551234567",
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
    title: "About RailConstruct",
    legacyHeading: "A Legacy of Excellence",
    legacyText1: "Founded in 1995, RailConstruct has grown from a regional track maintenance company into a global leader in railway infrastructure development.",
    legacyText2: "Our mission is to connect communities and drive economic growth through the construction of safe, efficient, and sustainable railway networks. We combine decades of hands-on experience with cutting-edge engineering technologies.",
    legacyText3: "With over 500 successful projects completed across 3 continents, our portfolio speaks to our capability to handle complex logistical and technical engineering challenges.",
    imageUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
    stats: [
      { id: "stat-1", numberText: "25+", label: "YEARS EXPERIENCE" },
      { id: "stat-2", numberText: "500+", label: "PROJECTS COMPLETED" },
      { id: "stat-3", numberText: "10k+", label: "KM OF TRACK LAID" },
      { id: "stat-4", numberText: "1500+", label: "EXPERT EMPLOYEES" },
    ],
  },
  services: [
    {
      id: "srv-1",
      title: "Track Construction",
      description: "Full-scale railway track construction including ballast, sleepers, and rails.",
      iconName: "Wrench",
    },
    {
      id: "srv-2",
      title: "Signaling Systems",
      description: "Installation and maintenance of advanced railway signaling and communication systems.",
      iconName: "Settings",
    },
    {
      id: "srv-3",
      title: "Maintenance & Repair",
      description: "Regular maintenance, emergency repairs, and track upgrading services.",
      iconName: "Hammer",
    },
  ],
  projects: [
    {
      id: "proj-1",
      title: "High-Speed Rail Extension",
      location: "TOKYO - OSAKA",
      description: "Extending the high-speed rail network with advanced track laying techniques.",
      image: "https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?auto=format&fit=crop&w=800&q=80", // Jet formation matching Image 6
    },
    {
      id: "proj-2",
      title: "Metro Line 4 Modernization",
      location: "NEW YORK CITY",
      description: "Upgrading signaling systems and track infrastructure for Metro Line 4.",
      image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=80", // Piano keys matching Image 6
    },
    {
      id: "proj-3",
      title: "Freight Corridor Bridge",
      location: "CHICAGO",
      description: "Construction of a heavy-duty railway bridge for freight transport.",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80", // Forest road matching Image 6
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
};
