import type { Incident } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const graffitiImage = PlaceHolderImages.find(
  (img) => img.id === "graffiti-wall"
);
const potholeImage = PlaceHolderImages.find(
  (img) => img.id === "pothole-street"
);
const brokenLightImage = PlaceHolderImages.find(
  (img) => img.id === "broken-light"
);

export const mockIncidents: Incident[] = [
  {
    id: "1",
    description:
      "Graffiti on the wall of the community center. Needs to be cleaned up.",
    photoUrl: graffitiImage?.imageUrl ?? "https://picsum.photos/seed/1/600/400",
    photoHint: graffitiImage?.imageHint ?? "graffiti wall",
    location: { lat: 33.8707, lng: 35.5624 },
    category: "Vandalism",
    severity: "Low",
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    requiresHumanReview: false,
  },
  {
    id: "2",
    description: "A large pothole on Main St, causing issues for traffic.",
    photoUrl: potholeImage?.imageUrl ?? "https://picsum.photos/seed/2/600/400",
    photoHint: potholeImage?.imageHint ?? "street pothole",
    location: { lat: 34.055, lng: -118.245 },
    category: "Other",
    severity: "Medium",
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    requiresHumanReview: false,
  },
  {
    id: "3",
    description:
      "Streetlight is broken near the park entrance. It is very dark at night.",
    photoUrl:
      brokenLightImage?.imageUrl ?? "https://picsum.photos/seed/3/600/400",
    photoHint: brokenLightImage?.imageHint ?? "broken streetlight",
    location: { lat: 34.05, lng: -118.25 },
    category: "Other",
    severity: "Medium",
    timestamp: Date.now() - 1000 * 60 * 60 * 8, // 8 hours ago
    requiresHumanReview: true,
  },
];
