
import { create } from 'zustand';
import type { Incident } from '@/lib/types';
import { mockIncidents } from '@/data/mock-incidents';

export type SheetMode = 'report' | 'details' | null;

interface AppState {
  incidents: Incident[];
  activeSheet: SheetMode;
  selectedIncident: Incident | null;
  newIncidentLocation: { lat: number; lng: number } | null;

  // Actions
  addIncident: (incident: Incident) => void;
  openReportSheet: () => void;
  openDetailsSheet: (incident: Incident) => void;
  closeSheet: () => void;
  setNewIncidentLocation: (location: { lat: number; lng: number }) => void;
  clearNewIncidentLocation: () => void;
}

export const useStore = create<AppState>((set) => ({
  incidents: mockIncidents,
  activeSheet: null,
  selectedIncident: null,
  newIncidentLocation: null,

  addIncident: (incident) =>
    set((state) => {
      const newIncidents = [incident, ...state.incidents];
      return { incidents: newIncidents, activeSheet: null, newIncidentLocation: null, selectedIncident: null };
    }),

  openReportSheet: () =>
    set({
      activeSheet: 'report',
      selectedIncident: null,
      newIncidentLocation: null,
    }),

  openDetailsSheet: (incident) =>
    set({
      activeSheet: 'details',
      selectedIncident: incident,
    }),

  closeSheet: () =>
    set({
      activeSheet: null,
      selectedIncident: null,
      // Keep newIncidentLocation so the form doesn't lose it if the sheet is temporarily closed
    }),

  setNewIncidentLocation: (location) => set({ newIncidentLocation: location, activeSheet: 'report', selectedIncident: null }),

  clearNewIncidentLocation: () => set({ newIncidentLocation: null }),
}));
