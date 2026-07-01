/**
 * Detailed service content mapping for individual service pages.
 */

export interface ServiceDetail {
  id: string;
  title: string;
  overview: string;
  bullets: string[];
  imageUrl: string;
}

export const SERVICES_DETAILS: Record<string, ServiceDetail> = {
  "srv-1": {
    id: "srv-1",
    title: "Air Conditioning Services",
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
  "srv-2": {
    id: "srv-2",
    title: "Refrigeration Services",
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
  "srv-3": {
    id: "srv-3",
    title: "Electrical & Electronics Services",
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
  "srv-4": {
    id: "srv-4",
    title: "Mechanical Services",
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
  "srv-5": {
    id: "srv-5",
    title: "PU Painting Services",
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
  "srv-6": {
    id: "srv-6",
    title: "Thermal Insulation Services",
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
  "srv-7": {
    id: "srv-7",
    title: "Housekeeping Services",
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
  "srv-8": {
    id: "srv-8",
    title: "Water Cooler Services",
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
  "srv-9": {
    id: "srv-9",
    title: "Transformer Services",
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
  "srv-10": {
    id: "srv-10",
    title: "Electric & Diesel Locomotive Services",
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
  "srv-11": {
    id: "srv-11",
    title: "Train, Loco Shed & Platform Services",
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
};
