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
    id: "diy-half",
    eyebrow: "DIY",
    title: "Half Production Day",
    description: "Includes Space + Gear.",
    duration: "4 hours",
    price: "$250",
    requestLabel: "DIY Half Production Day • Includes Space + Gear (4 hours) • $250",
  },
  {
    id: "diy-full",
    eyebrow: "DIY",
    title: "Full Production Day",
    description: "Includes Space + Gear.",
    duration: "8 hours",
    price: "$500",
    requestLabel: "DIY Full Production Day • Includes Space + Gear (8 hours) • $500",
  },
  {
    id: "dfy-half",
    eyebrow: "Done-For-You",
    title: "Half Production Day + Editing",
    description: "A fully supported production day with editing for 2 episodes.",
    duration: "4 hours / 2 episodes",
    price: "$795",
    requestLabel: "Done-For-You Half Production Day + Editing (4 hours / 2 episodes) • $795",
  },
  {
    id: "dfy-full",
    eyebrow: "Done-For-You",
    title: "Full Production Day + Editing",
    description: "A fully supported production day with editing for 4 episodes.",
    duration: "8 hours / 4 episodes",
    price: "$1,395",
    requestLabel: "Done-For-You Full Production Day + Editing (8 hours / 4 episodes) • $1,395",
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
