export type IncidentCategory = 'Vandalism' | 'Theft' | 'Accident' | 'Assault' | 'Other';
export type IncidentSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Incident {
  id: string;
  description: string;
  photoUrl: string;
  photoHint: string;
  location: {
    lat: number;
    lng: number;
  };
  category: IncidentCategory | string; // Allow other strings from AI
  severity: IncidentSeverity | string; // Allow other strings from AI
  timestamp: number;
  requiresHumanReview: boolean;
}
