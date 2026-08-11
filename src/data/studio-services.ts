export interface StudioService {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  duration: string;
  price: string;
  requestLabel: string;
}

export const studioServices: StudioService[] = [
  {
    id: "half-day-no-gear",
    eyebrow: "Bring your own gear",
    title: "Half Day — Studio Only",
    description: "Four hours in the studio with no production gear included. Bring the equipment you plan to use.",
    duration: "4 hours",
    price: "$225",
    requestLabel: "Half Day — Studio Only • Bring Your Own Gear (4 hours) • $225",
  },
  {
    id: "full-day-no-gear",
    eyebrow: "Bring your own gear",
    title: "Full Day — Studio Only",
    description: "Eight hours in the studio with no production gear included. Bring the equipment you plan to use.",
    duration: "8 hours",
    price: "$400",
    requestLabel: "Full Day — Studio Only • Bring Your Own Gear (8 hours) • $400",
  },
  {
    id: "half-day-audio-gear",
    eyebrow: "Our audio gear",
    title: "Half Day — Audio Gear Only",
    description: "Four hours in the studio with access to Water Valley Voice audio recording gear; video gear is not included.",
    duration: "4 hours",
    price: "$350",
    requestLabel: "Half Day — Audio Gear Included (4 hours) • $350",
  },
  {
    id: "full-day-audio-video-gear",
    eyebrow: "Our audio + video gear",
    title: "Full Day — Audio + Video Gear",
    description: "Eight hours in the studio with access to Water Valley Voice audio and video gear.",
    duration: "8 hours",
    price: "$800",
    requestLabel: "Full Day — Audio + Video Gear Included (8 hours) • $800",
  },
  {
    id: "conference-room",
    eyebrow: "Meeting space",
    title: "Conference Room",
    description: "A private, professional room for your next meeting.",
    duration: "2 hours",
    price: "$50",
    requestLabel: "Conference Room for 2 hours • $50",
  },
];

export const studioServiceById = new Map(studioServices.map((service) => [service.id, service]));
