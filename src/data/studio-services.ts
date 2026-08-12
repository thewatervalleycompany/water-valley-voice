export interface StudioService {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  duration: string;
  price: string;
  requestLabel: string;
  usesStudioEquipment: boolean;
}

export const studioSdCardAddOn = {
  fee: 50,
  price: "$50",
  requestLabel: "Water Valley Voice SD cards (+$50)",
} as const;

export const studioServices: StudioService[] = [
  {
    id: "half-day-no-gear",
    eyebrow: "Bring your own gear",
    title: "Half Day — Studio Only",
    description: "Four hours in the studio with no production gear included. Bring the equipment you plan to use.",
    duration: "4 hours",
    price: "$225",
    requestLabel: "Half Day — Studio Only • Bring Your Own Gear (4 hours) • $225",
    usesStudioEquipment: false,
  },
  {
    id: "full-day-no-gear",
    eyebrow: "Bring your own gear",
    title: "Full Day — Studio Only",
    description: "Eight hours in the studio with no production gear included. Bring the equipment you plan to use.",
    duration: "8 hours",
    price: "$400",
    requestLabel: "Full Day — Studio Only • Bring Your Own Gear (8 hours) • $400",
    usesStudioEquipment: false,
  },
  {
    id: "half-day-audio-gear",
    eyebrow: "Our audio gear",
    title: "Half Day — Audio Gear Only",
    description: "Four hours with a TASCAM FR-AV4 32-bit float recorder and two Shure SM7dB microphones. Bring a compatible SD card or add studio recording media for $50.",
    duration: "4 hours",
    price: "$350",
    requestLabel: "Half Day — Audio Gear Included (4 hours) • $350",
    usesStudioEquipment: true,
  },
  {
    id: "full-day-audio-video-gear",
    eyebrow: "Our audio + video gear",
    title: "Full Day — Audio + Video Gear",
    description: "Eight hours with a Canon EOS C50, Sony α7 IV, TASCAM 32-bit audio rig, two Shure SM7dB microphones, and studio lighting. Bring compatible media or add studio cards for $50.",
    duration: "8 hours",
    price: "$800",
    requestLabel: "Full Day — Audio + Video Gear Included (8 hours) • $800",
    usesStudioEquipment: true,
  },
  {
    id: "conference-room",
    eyebrow: "Meeting space",
    title: "Conference Room",
    description: "A private, professional room for your next meeting.",
    duration: "2 hours",
    price: "$50",
    requestLabel: "Conference Room for 2 hours • $50",
    usesStudioEquipment: false,
  },
];

export const studioServiceById = new Map(studioServices.map((service) => [service.id, service]));
