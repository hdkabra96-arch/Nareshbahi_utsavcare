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
      title: "Air Conditioning",
      description: "Advanced industrial, office, and coach air conditioning installation and maintenance services.",
      iconName: "Wind",
      longDescription: "We deliver full-scale engineering, installation, and preventative maintenance for specialized air conditioning units. Our experience ranges from administrative facilities and railway control towers to active rolling stock coaches. We guarantee optimal cabin temperature regulation, high energy efficiency, and compliance with severe thermal control specifications.",
      overview: "Utsav Care Corporation Pvt. Ltd. provides comprehensive air conditioning solutions for railway coaches, locomotive cabins, offices, workshops, and industrial facilities. Our experienced technicians ensure efficient cooling, improved performance, and reliable operation through professional installation, maintenance, and repair services.",
      bullets: [
        "Air Conditioning Installation",
        "Preventive Maintenance",
        "Breakdown Repair",
        "Performance Testing",
        "System Inspection",
        "Spare Parts Replacement"
      ],
      imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "srv-2",
      title: "Refrigeration",
      description: "Heavy-duty cooling systems, cold rooms, and cold chains for industrial applications.",
      iconName: "Snowflake",
      longDescription: "Extending from our foundational heritage as Utsav Care Refrigeration, UCCPL designs and services high-performance industrial refrigeration units. We build modular walk-in cold rooms, deep chillers, and automated temperature-monitored storage structures designed for high reliability, precise thermal control, and severe environmental operations.",
      overview: "We specialize in the installation, maintenance, and repair of refrigeration systems used in railway operations and industrial applications. Our solutions ensure reliable cooling performance while maximizing energy efficiency and equipment life.",
      bullets: [
        "Refrigeration System Installation",
        "Cooling Unit Maintenance",
        "Compressor Servicing",
        "Leak Detection & Repair",
        "Preventive Inspection",
        "Performance Optimization"
      ],
      imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "srv-3",
      title: "Electrical & Electronics",
      description: "Comprehensive wiring, circuit design, control panels, and electronic interlocking systems.",
      iconName: "Zap",
      longDescription: "Our team engineers complete electrical frameworks and smart control circuitry. From heavy industrial power boards and main distribution networks to delicate digital micro-controller setups, we implement advanced safety trip circuits, load balancers, and computerized electronics that adhere to Indian Railways quality standards.",
      overview: "Our electrical and electronics division offers reliable solutions for installation, maintenance, troubleshooting, and repair of electrical systems used in railway infrastructure and industrial facilities.",
      bullets: [
        "Electrical Installation",
        "Electrical Maintenance",
        "Electronic Equipment Repair",
        "Control Panel Wiring",
        "Cable Management",
        "Fault Diagnosis"
      ],
      imageUrl: "https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "srv-4",
      title: "Mechanical",
      description: "Precision machining, heavy fabrication, assembly support, and structural components.",
      iconName: "Wrench",
      longDescription: "We manufacture, assemble, and repair heavy-duty machinery parts and structural steel configurations. Equipped with CNC machinery, high-precision hydraulic presses, and multi-stage testing setups, we supply and maintain mechanical linkages, customized railway components, and heavy-duty load-bearing assemblies.",
      overview: "We provide complete mechanical maintenance and engineering support for railway equipment and industrial machinery. Our services focus on improving operational efficiency, reliability, and equipment longevity.",
      bullets: [
        "Mechanical Equipment Maintenance",
        "Machinery Repair",
        "Preventive Maintenance",
        "Equipment Inspection",
        "Component Replacement",
        "Mechanical Troubleshooting"
      ],
      imageUrl: "https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "srv-5",
      title: "PU Painting",
      description: "Premium Polyurethane painting, anti-corrosive coating, and industrial surface finishing.",
      iconName: "Paintbrush",
      longDescription: "High-durability Polyurethane (PU) painting is critical to preventing corrosion on high-exposure rail coaches, locomotives, and trackside equipment. We operate state-of-the-art dust-free spray booths, using advanced sand-blasting prep, multi-coat primers, and premium weather-proof PU coatings that resist thermal fading and rust.",
      overview: "Our PU painting services provide durable, high-quality protective coatings that enhance the appearance and lifespan of railway assets and industrial equipment while protecting them from corrosion and environmental damage.",
      bullets: [
        "PU Coating",
        "Surface Preparation",
        "Industrial Painting",
        "Corrosion Protection",
        "Protective Coating",
        "Finishing Services"
      ],
      imageUrl: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "srv-6",
      title: "Thermal Insulation",
      description: "Industrial hot & cold thermal insulation, acoustic damping, and energy conservation.",
      iconName: "Shield",
      longDescription: "We provide high-density thermal insulation services for heavy piping, steam containers, refrigeration tunnels, and locomotive engine hulls. Using glass wool, polyurethane foam (PUF), and reflective aluminum cladding, we dramatically reduce power losses, enhance thermal efficiency, and provide acoustic deadening in active work zones.",
      overview: "We offer professional thermal insulation solutions to improve energy efficiency, maintain temperature stability, and protect equipment operating under high or low temperature conditions.",
      bullets: [
        "Thermal Insulation Installation",
        "Heat Loss Prevention",
        "Pipeline Insulation",
        "Equipment Insulation",
        "Maintenance & Replacement",
        "Industrial Insulation Solutions"
      ],
      imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "srv-7",
      title: "Housekeeping",
      description: "Industrial facility sanitization, loco shed deep cleaning, and systematic maintenance.",
      iconName: "Sparkles",
      longDescription: "Maintaining immaculate sanitization and structural hygiene across high-traffic rail stations, administrative buildings, and active locomotive workshops. We implement automated floor scrubbers, industrial-grade high-pressure washers, and ecological sanitizers to maintain safe, debris-free, and professional transit hubs.",
      overview: "UCCPL provides professional housekeeping and support services for railway stations, workshops, offices, loco sheds, and other operational facilities, ensuring clean, safe, and well-maintained working environments.",
      bullets: [
        "Railway Housekeeping",
        "Platform Cleaning",
        "Workshop Cleaning",
        "Office Maintenance",
        "Facility Support",
        "General Housekeeping"
      ],
      imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "srv-8",
      title: "Water Cooler",
      description: "High-capacity drinking water chillers, RO filtration plants, and community water hubs.",
      iconName: "Droplets",
      longDescription: "We supply, install, and support high-throughput industrial water cooling solutions and integrated reverse osmosis (RO) purification facilities. These cooling hubs are custom-engineered for maximum durability in high-traffic spaces like railway platform terminals, worker sheds, and corporate offices.",
      overview: "We provide installation, servicing, maintenance, and repair of water coolers used at railway stations, workshops, offices, and industrial locations to ensure uninterrupted access to clean drinking water.",
      bullets: [
        "Water Cooler Installation",
        "Preventive Maintenance",
        "Repair & Servicing",
        "Cooling Performance Testing",
        "Spare Parts Replacement",
        "Annual Maintenance"
      ],
      imageUrl: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "srv-9",
      title: "Transformer",
      description: "Power step-down & step-up transformers, substation maintenance, and coil winding.",
      iconName: "Bolt",
      longDescription: "Specialized servicing, custom rewinding, and diagnostic maintenance for medium to high-voltage industrial transformers. We perform insulation oil filtration tests, thermal imaging scans, and complete terminal box upgrades to prevent substation failures and secure continuous electricity distribution.",
      overview: "Our transformer services ensure safe, reliable, and efficient power distribution through expert installation, preventive maintenance, testing, and repair of transformers used in railway and industrial power systems.",
      bullets: [
        "Transformer Installation",
        "Preventive Maintenance",
        "Oil Testing",
        "Electrical Testing",
        "Fault Repair",
        "Performance Inspection"
      ],
      imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "srv-10",
      title: "Electric & Diesel Locomotive",
      description: "Specialized subsystem overhaul, electrical traction repair, and mechanical engine support.",
      iconName: "Train",
      longDescription: "Our technical teams perform deep diagnostic overhauls on critical sub-assemblies of both electric traction and diesel locomotive models. From traction motor rebuilding and cabin console rewiring to turbocharger repairs, we keep national locomotives functioning at peak efficiency.",
      overview: "We provide specialized maintenance and technical support for electric and diesel locomotives, ensuring dependable performance, operational safety, and reduced downtime for railway operations.",
      bullets: [
        "Locomotive Maintenance",
        "Mechanical Repair",
        "Electrical Inspection",
        "Component Replacement",
        "Preventive Maintenance",
        "Technical Support"
      ],
      imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "srv-11",
      title: "Train, Loco Shed, Platform",
      description: "Comprehensive platform electrical fit-outs, heavy loco shed construction, and trackside support.",
      iconName: "Building",
      longDescription: "Providing structural, mechanical, and electrical fit-out services for active locomotive sheds, train platforms, and maintenance depots. This includes installing high-mast overhead illumination, industrial overhead crane runways, rail ventilation grids, and station platform wiring.",
      overview: "UCCPL delivers comprehensive support services for trains, loco sheds, and railway platforms. Our team ensures efficient maintenance, operational assistance, and facility management to support uninterrupted railway operations.",
      bullets: [
        "Train Maintenance Support",
        "Loco Shed Maintenance",
        "Platform Maintenance",
        "Equipment Inspection",
        "Technical Assistance",
        "Operational Support Services"
      ],
      imageUrl: "https://images.unsplash.com/photo-1551698618-1ffdfe1d9c1a?auto=format&fit=crop&w=1200&q=80"
    }
  ],
  projects: [
    {
      id: "proj-c1",
      title: "Chiller Air Conditioning Plant Operating Work",
      location: "Surat, Gujarat",
      description: "Operating work for Chiller Air Conditioning Plant at Sardar Patel Smrti Bhavan, ensuring seamless comfort and cooling.",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
      longDescription: "Our team successfully managed and operated the high-capacity Chiller Air Conditioning Plant at Sardar Patel Smrti Bhavan in Surat. Responsibilities included routine monitoring, compressor testing, cooling tower fluid control, and immediate emergency response to cooling load changes.",
      client: "Surat Municipal Corporation (SMC)",
      state: "Gujarat",
      status: "completed",
      srNo: 1,
      category: "Air Conditioning"
    },
    {
      id: "proj-c2",
      title: "Comprehensive Maintenance of BTS Site Air Conditioners",
      location: "Valsad & Bharuch, Gujarat",
      description: "Comprehensive Maintenance of WAC, SAC, and HSHF AC at various BSNL GSM BTS locations.",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      longDescription: "To maintain server-room temperature stability across remote BTS network sites in Valsad and Bharuch, we provided round-the-clock maintenance of Window Air Conditioners (WAC), Split Air Conditioners (SAC), and High-Sensible Heat Factor AC (HSHF AC) installations for BSNL.",
      client: "BSNL, Electrical Division Surat",
      state: "Gujarat",
      status: "completed",
      srNo: 2,
      category: "Air Conditioning"
    },
    {
      id: "proj-c3",
      title: "LIC Office Electrical Maintenance Rate Contract",
      location: "Surat & Vadodara, Gujarat",
      description: "Annual Rate Contract for comprehensive electrical maintenance across LIC offices and branches.",
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
      longDescription: "We secured and successfully executed an Annual Rate Contract for LIC branch complexes in Surat and Vadodara, managing main breaker inspections, wire harness diagnostics, LED luminaire replacements, and diesel backup generator synchronization.",
      client: "Life Insurance Corporation of India (LIC)",
      state: "Gujarat",
      status: "completed",
      srNo: 3,
      category: "Electrical"
    },
    {
      id: "proj-c4",
      title: "AC Coach Attendant Services (SGAC trains)",
      location: "Surat & Valsad, Gujarat",
      description: "Dedicated AC coach attendant services on SGAC trains, ensuring passenger comfort and temperature regulation.",
      image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
      longDescription: "We provided professionally trained and customer-oriented coach attendants on passenger trains. Attendants were responsible for temperature regulation, ventilation control, passenger grievance resolution, and immediate trackside troubleshooting of coach alternator grids.",
      client: "Western Railway, Mumbai Division",
      state: "Gujarat",
      status: "completed",
      srNo: 4,
      category: "Air Conditioning"
    },
    {
      id: "proj-c5",
      title: "SITC of Industrial Star-Rated Water Coolers",
      location: "Kevadia Colony, Gujarat",
      description: "Supply, Installation, Testing & Commissioning (SITC) of eco-friendly star-rated water coolers.",
      image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=800&q=80",
      longDescription: "SITC of industrial drinking-water chiller systems at the GSECL thermal station near Kevadia. This involved implementing robust multi-stage sediment filters and automatic thermostatic shut-off controls to minimize electrical consumption.",
      client: "Gujarat State Electricity Corporation Ltd. (GSECL)",
      state: "Gujarat",
      status: "completed",
      srNo: 5,
      category: "Water Cooler"
    },
    {
      id: "proj-c6",
      title: "Supply of Water-Cooled Gas Condenser Sets",
      location: "Kevadia Colony, Gujarat",
      description: "Manufacturing and supplying heavy water-cooled gas condenser sets (11 TR Package AC systems).",
      image: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=800&q=80",
      longDescription: "Custom fabrication and supply of heavy-duty 11 TR water-cooled gas condensers for GSECL operations. Units featured anti-corrosive copper tube designs and high-efficiency shell-and-tube designs to operate seamlessly under extreme thermal ambient thresholds.",
      client: "GSECL",
      state: "Gujarat",
      status: "completed",
      srNo: 6,
      category: "Air Conditioning"
    },
    {
      id: "proj-c7",
      title: "Maintenance of SAC, WAC & Package AC Systems",
      location: "Kevadia Colony, Gujarat",
      description: "Servicing and maintenance of Split AC, Window AC, Water Coolers, and high-capacity Package AC systems.",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      longDescription: "Executed preventative and breakdown maintenance on diverse cooling infrastructure models. We replaced aging condenser fans, calibrated thermostat modules, and performed routine eco-friendly refrigerant top-ups across the administrative grids.",
      client: "GSECL",
      state: "Gujarat",
      status: "completed",
      srNo: 7,
      category: "Air Conditioning"
    },
    {
      id: "proj-c8",
      title: "AMC of Roof Mounted Cabin AC (12 Months)",
      location: "Valsad, Gujarat",
      description: "Annual Maintenance Contract for Roof Mounted Cabin Air Conditioning units in high-powered electric locomotives.",
      image: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=800&q=80",
      longDescription: "Delivered comprehensive support for locomotive cabin AC installations, reducing system failures. We performed regular diagnostic sweeps of high-vibration power brackets, electrical terminals, and blower assemblies.",
      client: "Electric Loco Shed, Western Railway",
      state: "Gujarat",
      status: "completed",
      srNo: 8,
      category: "Air Conditioning"
    },
    {
      id: "proj-c9",
      title: "AMC of Roof Mounted Cabin AC (36 Months)",
      location: "Vadodara, Gujarat",
      description: "Three-year comprehensive maintenance support for locomotive driver cabin HVAC installations.",
      image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
      longDescription: "Awarded a prestigious 3-year AMC covering high-vibration roof-mounted driver cab HVAC units. Services encompassed full coil cleaning, electrical safety wire routing, compressor oil replacements, and insulation assessments.",
      client: "Electric Loco Shed, Western Railway",
      state: "Gujarat",
      status: "completed",
      srNo: 9,
      category: "Air Conditioning"
    },
    {
      id: "proj-c10",
      title: "AMC for 30 TR Chiller AC Plants",
      location: "Vadodara, Gujarat",
      description: "Preventative and breakdown AMC for 30 TR Chiller AC Plants at Sardar Patel Smrti Hall complex.",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
      longDescription: "Under this contract, we managed a dual-compressor 30 TR Chiller Plant. Duties included condenser cleaning, water pump seal repair, electrical current draw analysis, and seasonal startup optimizations.",
      client: "DRM Office, Western Railway",
      state: "Gujarat",
      status: "completed",
      srNo: 10,
      category: "Air Conditioning"
    },
    {
      id: "proj-c11",
      title: "AMC of Remote Control Package AC Units",
      location: "Vadodara, Gujarat",
      description: "AMC of specialized remote-controlled package AC units in administrative blocks.",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      longDescription: "Managed a network of remote-controlled, central-duct package air conditioners. We monitored automated scheduling codes, calibrated microprocessors, and optimized duct airflow balances.",
      client: "DRM Office, Western Railway",
      state: "Gujarat",
      status: "completed",
      srNo: 11,
      category: "Air Conditioning"
    },
    {
      id: "proj-c12",
      title: "Repair & Overhaul of Station Water Coolers",
      location: "Vadodara, Gujarat",
      description: "Rebuilding, part replacement, and scale cleaning of high-throughput drinking water coolers.",
      image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=800&q=80",
      longDescription: "Restored offline station water coolers. This involved replacing worn refrigeration coils, descaling storage tanks, upgrading sanitation filtration matrices, and restoring external sheet-metal panel chassis.",
      client: "DRM Office, Western Railway",
      state: "Gujarat",
      status: "completed",
      srNo: 12,
      category: "Water Cooler"
    },
    {
      id: "proj-c13",
      title: "PU Painting of Diesel Locomotives",
      location: "Vatva, Ahmedabad, Gujarat",
      description: "High-durability Polyurethane (PU) painting of diesel locomotives as per RDSO specifications.",
      image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80",
      longDescription: "Applied multiple coats of premium Polyurethane paint to heavy diesel locomotive hulls. Procedures included sandblasting, rust-inhibitive epoxy-primer application, high-gloss PU spraying, and applying RDSO reflective vinyl safety strips.",
      client: "Diesel Loco Shed, Western Railway",
      state: "Gujarat",
      status: "completed",
      srNo: 13,
      category: "Painting"
    },
    {
      id: "proj-c14",
      title: "Hitachi Traction Motor Overhaul",
      location: "Vadodara, Gujarat",
      description: "Dismantling, deep core cleaning, insulating varnish baking, and mechanical reassembly of Hitachi Traction Motors.",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
      longDescription: "Executed heavy electric mechanical servicing on heavy Hitachi HS15250A traction motors. Core tasks involved armature diagnostics, commutator polishing, bearing replacement, and stator baking.",
      client: "Electric Loco Shed, Western Railway",
      state: "Gujarat",
      status: "completed",
      srNo: 14,
      category: "Electrical"
    },
    {
      id: "proj-c15",
      title: "SITC of Energy Efficient Water Coolers",
      location: "Bhusawal, Maharashtra",
      description: "SITC of energy-saving, eco-certified water coolers to improve platform passenger amenities.",
      image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=800&q=80",
      longDescription: "Installed star-rated stainless-steel drinking water coolers across major platforms of Bhusawal Junction. Systems utilize eco-friendly R-134a refrigerant and are encased in premium 304 food-grade stainless steel.",
      client: "DRM Office, Central Railway",
      state: "Maharashtra",
      status: "completed",
      srNo: 15,
      category: "Water Cooler"
    },
    {
      id: "proj-c16",
      title: "Bogie Frames & Subsystem Deep Cleaning",
      location: "Bhusawal, Maharashtra",
      description: "Deep chemical cleaning, rust scaling removal, and visual cracks audit of heavy electric locomotive bogie structures.",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
      longDescription: "Performed complete grease removal and carbon descaling of locomotive bogies using alkaline cleaners and high-pressure washers, enabling ELS inspectors to perform critical ultrasonic crack tests.",
      client: "Electric Loco Shed, Central Railway",
      state: "Maharashtra",
      status: "completed",
      srNo: 16,
      category: "Mechanical"
    },
    {
      id: "proj-c17",
      title: "AMC of WAP-4/WAG-9 Cab Air Conditioners",
      location: "Bhusawal, Maharashtra",
      description: "AMC of heavy-duty driver cab air conditioning units installed in WAP-4 and WAG-9 class electric locomotives.",
      image: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=800&q=80",
      longDescription: "Managed seasonal maintenance checkups and emergency break-down support for WAP-4 and WAG-9 driver cab ACs. Replaced faulty expansion valves, recharged R-407C gas, and upgraded vibration dampening blocks.",
      client: "Electric Loco Shed, Central Railway",
      state: "Maharashtra",
      status: "completed",
      srNo: 17,
      category: "Air Conditioning"
    },
    {
      id: "proj-c18",
      title: "Locomotive Radiators & Air Filters Descaling",
      location: "Ajni, Nagpur, Maharashtra",
      description: "High-pressure descaling of radiator matrices and replacement of air intake filtration modules in electric locomotives.",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      longDescription: "Improved locomotive cooling loop efficiency at Ajni shed by chemically flushing radiator cores, clearing industrial scale deposits, and installing advanced high-density microscopic particulate air filters.",
      client: "Electric Loco Shed, Central Railway",
      state: "Maharashtra",
      status: "completed",
      srNo: 18,
      category: "Mechanical"
    },
    {
      id: "proj-c19",
      title: "Loco Electrical Component Disconnection",
      location: "Bhusawal, Maharashtra",
      description: "Systematic wire harness disconnects, diagnostic isolation, and preparation of electric locomotives for heavy schedule overhauls.",
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
      longDescription: "Technical support for scheduled engine teardowns. Disconnected heavy high-voltage power conduits, tagged complex signaling lines, and mapped sub-panel connections to facilitate rapid loco overhauling.",
      client: "Electric Loco Shed, Central Railway",
      state: "Maharashtra",
      status: "completed",
      srNo: 19,
      category: "Electrical"
    },
    {
      id: "proj-c20",
      title: "Loco Driver Cab HVAC AMC (2 Years)",
      location: "Vadodara, Gujarat",
      description: "Comprehensive 2-year AMC for roof-mounted driver cabin air conditioning units in electric train engines.",
      image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
      longDescription: "Administered a two-year performance guarantee program for cab HVAC units at ELS Vadodara. The service plan eliminated summer driver heat stress, achieving a 99.8% equipment uptime record across active routes.",
      client: "Electric Loco Shed, Western Railway",
      state: "Gujarat",
      status: "completed",
      srNo: 20,
      category: "Air Conditioning"
    },
    {
      id: "proj-c21",
      title: "Loco Driver Cab HVAC AMC (2 Years) - Valsad",
      location: "Valsad, Gujarat",
      description: "Two-year comprehensive preventive maintenance for locomotive driver cabin HVAC installations.",
      image: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=800&q=80",
      longDescription: "Provided structured preventive checkups, seasonal cleanings, and emergency breakdown repairs for cab AC units at ELS Valsad, using only certified OEM grade spare parts.",
      client: "Electric Loco Shed, Western Railway",
      state: "Gujarat",
      status: "completed",
      srNo: 21,
      category: "Air Conditioning"
    },
    {
      id: "proj-c22",
      title: "Loco Underframe Deep Chemical Spray Painting",
      location: "Bhusawal, Maharashtra",
      description: "High-pressure degreasing, sand scaling removal, and anti-corrosive epoxy paint application on locomotive undercarriages.",
      image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80",
      longDescription: "Shielded locomotive undercarriages from extreme operational impacts. We executed sand scraping, degreasing, and sprayed heavy anti-rust black protective epoxy-esters.",
      client: "Electric Loco Shed, Central Railway",
      state: "Maharashtra",
      status: "completed",
      srNo: 22,
      category: "Painting"
    },
    {
      id: "proj-c23",
      title: "AMC of 98 Locomotive Driver Cab HVAC units",
      location: "Kalyan, Maharashtra",
      description: "AMC covering 98 high-capacity driver cab air conditioner systems across 49 active mainline locomotives.",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
      longDescription: "Managed an extensive fleet service contract covering 98 cab AC systems. Deployed on-site technicians to ELS Kalyan to conduct rapid pre-departure checks and dynamic thermostatic tests.",
      client: "Electric Loco Shed, Central Railway",
      state: "Maharashtra",
      status: "completed",
      srNo: 23,
      category: "Air Conditioning"
    },
    {
      id: "proj-c24",
      title: "ELS Bogie Frame High-Pressure Washing",
      location: "Bhusawal, Maharashtra",
      description: "Mechanized oil descaling and pressure washing of heavy underframe bogie sets.",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
      longDescription: "To prepare locomotive mechanical structures for scheduled major wheel assemblies inspections, we stripped heavy baked grease and ballast dirt using high-temperature bio-wash sprays.",
      client: "Electric Loco Shed, Central Railway",
      state: "Maharashtra",
      status: "completed",
      srNo: 24,
      category: "Mechanical"
    },
    {
      id: "proj-c25",
      title: "Northern Railway Loco Cab HVAC AMC",
      location: "Ludhiana, Punjab",
      description: "Two-year preventative maintenance of roof-mounted cab air conditioning units in northern freight engines.",
      image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
      longDescription: "Expanded our operational footprint into Northern India at ELS Ludhiana. Managed complete thermodynamic audits and electrical panel repairs for high-mileage freight locomotive driver cabs.",
      client: "Electric Loco Shed, Northern Railway",
      state: "Punjab",
      status: "completed",
      srNo: 25,
      category: "Air Conditioning"
    },
    {
      id: "proj-o1",
      title: "Mechanized Housekeeping & Garden Maintenance",
      location: "Vatva, Ahmedabad, Gujarat",
      description: "Mechanized and manual cleaning of loco sheds, administrative facilities, and beautiful landscaping conservation.",
      image: "https://images.unsplash.com/photo-1558904541-efa8c1a68d6f?auto=format&fit=crop&w=800&q=80",
      longDescription: "An ongoing facility management contract. We deploy advanced industrial floor scrubbers, high-pressure cleaners, and organic descalers, alongside professional landscape artists, to keep the campus green and hygienic.",
      client: "Electric Loco Shed, Western Railway",
      state: "Gujarat",
      status: "ongoing",
      srNo: 1,
      category: "Housekeeping"
    },
    {
      id: "proj-o2",
      title: "ELS Kalyan Bogie Cleaning & De-greasing Outsourcing",
      location: "Kalyan, Maharashtra",
      description: "Activity-based outsourcing contract for high-speed degreasing and cleaning of bogie assemblies.",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
      longDescription: "We provide skilled labor and mechanized pressure washers on a per-locomotive turnaround basis, ensuring ELS Kalyan's bogie repair lines operate with optimal efficiency and zero debris.",
      client: "Electric Loco Shed, Central Railway",
      state: "Maharashtra",
      status: "ongoing",
      srNo: 2,
      category: "Mechanical"
    },
    {
      id: "proj-o3",
      title: "Locomotive PU Spray Painting with Reflective Graphics",
      location: "Lucknow, Uttar Pradesh",
      description: "Premium Polyurethane spray painting of electric locomotives and application of high-intensity reflective graphics.",
      image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80",
      longDescription: "A multi-loco coating contract in Lucknow. Our painters utilize advanced airless spray systems to apply high-density polyurethane coatings, followed by exact laser-aligned reflective vinyl sheets for night visibility.",
      client: "Loco Workshop, Northern Railway",
      state: "Uttar Pradesh",
      status: "ongoing",
      srNo: 3,
      category: "Painting"
    },
    {
      id: "proj-o4",
      title: "Repair & Maintenance of 3-Phase Loco Cab ACs",
      location: "Vadodara, Gujarat",
      description: "Specialized servicing and breakdown support for driver cabin AC units on advanced 3-Phase locomotives.",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
      longDescription: "Specialized maintenance of microprocessor-controlled cab air conditioners on modern WAP-7 and WAG-9 locomotives. Work includes troubleshooting advanced variable-frequency compressor systems.",
      client: "Electric Loco Shed, Western Railway",
      state: "Gujarat",
      status: "ongoing",
      srNo: 4,
      category: "Air Conditioning"
    },
    {
      id: "proj-o5",
      title: "HHP Diesel Locomotive Driver Cab HVAC AMC",
      location: "Jodhpur, Rajasthan",
      description: "Ongoing repair, breakdown support, and annual maintenance of HVAC installations on high-horsepower diesel trains.",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      longDescription: "Comprehensive fleet service for Jodhpur's HHP EMD diesel fleet. We maintain cabin heating, ventilation, and cooling modules to operate safely through extreme summer conditions of the Thar desert.",
      client: "Diesel Loco Shed, North Western Railway",
      state: "Rajasthan",
      status: "ongoing",
      srNo: 5,
      category: "Air Conditioning"
    },
    {
      id: "proj-o6",
      title: "ELS Bhusawal Electric Loco Cab AC AMC",
      location: "Bhusawal, Maharashtra",
      description: "Ongoing AMC for driver cabin HVAC units in active mainline cargo and passenger engines.",
      image: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=800&q=80",
      longDescription: "Annual service coverage for WAP-4, WAG-7, and WAG-9 cab ACs. Ensures continuous microclimatic cooling for railway operators across critical Central railway intersections.",
      client: "Electric Loco Shed, Central Railway",
      state: "Maharashtra",
      status: "ongoing",
      srNo: 6,
      category: "Air Conditioning"
    },
    {
      id: "proj-o7",
      title: "AMC of 128 Locomotive Roof-Mounted Cab ACs",
      location: "Kalyan, Maharashtra",
      description: "Fleet maintenance program covering 128 roof-mounted cabin AC units across 64 active locomotives.",
      image: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=800&q=80",
      longDescription: "Managing Kalyan's largest single-contract fleet of locomotive cab AC units. Includes scheduled weekly air filter sweeps, current leak tests, and diagnostic logging of variable thermostatic systems.",
      client: "Electric Loco Shed, Central Railway",
      state: "Maharashtra",
      status: "ongoing",
      srNo: 7,
      category: "Air Conditioning"
    },
    {
      id: "proj-o8",
      title: "NF Railway HHP Diesel Driver Cab AC Maintenance",
      location: "Guwahati, Assam",
      description: "Ongoing maintenance and repair of driver cabin air conditioners for high-horsepower diesel trains in North Frontier.",
      image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
      longDescription: "Extended our services to North Frontier Railway at Guwahati. We maintain high-durability cab AC systems to protect operators from humid sub-tropical operational stress.",
      client: "Diesel Loco Shed, North Frontier Railway",
      state: "Assam",
      status: "ongoing",
      srNo: 8,
      category: "Air Conditioning"
    },
    {
      id: "proj-o9",
      title: "DLS Pune Driver Cab AC Repair (Subros/Lloyd)",
      location: "Pune, Maharashtra",
      description: "Specialized servicing, component replacements, and troubleshooting of Subros and Lloyd cab AC models.",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      longDescription: "Providing expert component-level repairs for Subros and Lloyd brand locomotive air conditioning units. Services include electronic control card rebuilds and high-pressure system checks.",
      client: "Diesel Loco Shed, Central Railway",
      state: "Maharashtra",
      status: "ongoing",
      srNo: 9,
      category: "Air Conditioning"
    },
    {
      id: "proj-o10",
      title: "Northern Railway Loco Cab HVAC AMC (Ludhiana)",
      location: "Ludhiana, Punjab",
      description: "Ongoing comprehensive preventative maintenance for roof-mounted locomotive cab air conditioners.",
      image: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=800&q=80",
      longDescription: "Routine bi-weekly diagnostic audits, condenser flushes, and micro-switch calibrations to maintain driver cab cooling across Northern freight routes.",
      client: "Electric Loco Shed, Northern Railway",
      state: "Punjab",
      status: "ongoing",
      srNo: 10,
      category: "Air Conditioning"
    },
    {
      id: "proj-o11",
      title: "One-Time Overhaul of HHP Driver Cab HVAC Units",
      location: "Kalyan, Maharashtra",
      description: "Dedicated one-time technical overhaul and reconstruction of 38 HHP driver cab HVAC units.",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
      longDescription: "Reconstructing 38 heavily deteriorated driver cab HVAC units. The rebuild includes frame reinforcement, new heavy-duty scroll compressors, copper rewinding of fan motors, and custom vibration dampeners.",
      client: "Diesel Loco Shed, Central Railway",
      state: "Maharashtra",
      status: "ongoing",
      srNo: 11,
      category: "Air Conditioning"
    },
    {
      id: "proj-o12",
      title: "Abu Road Diesel Loco Driver Cab AC Repair & AMC",
      location: "Abu Road, Rajasthan",
      description: "Comprehensive maintenance, spare parts supply, and AMC support for diesel locomotive cab AC units.",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      longDescription: "Providing active field service and spare parts support for EMD locomotive cooling units in Rajasthan. Focuses on maintaining thermodynamic cooling output through heavy desert sandstorms.",
      client: "Diesel Loco Shed, North Western Railway",
      state: "Rajasthan",
      status: "ongoing",
      srNo: 12,
      category: "Air Conditioning"
    }
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
