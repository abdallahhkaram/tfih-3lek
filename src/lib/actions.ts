
'use server';

import { classifyIncidentReport, ClassifyIncidentReportInput } from '@/ai/flows/classify-incident-reports';
import type { Incident } from '@/lib/types';
import { z } from 'zod';

const actionInputSchema = z.object({
  description: z.string(),
  photoDataUri: z.string().url(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

export async function classifyAndAddIncident(input: z.infer<typeof actionInputSchema>): Promise<{ success: boolean; data?: Incident; error?: string; }> {
  const validatedInput = actionInputSchema.safeParse(input);

  if (!validatedInput.success) {
    return { success: false, error: "Invalid input." };
  }

  const { description, photoDataUri, location } = validatedInput.data;

  try {
    const classification: ClassifyIncidentReportInput = { description, photoDataUri };
    const result = await classifyIncidentReport(classification);

    const newIncident: Incident = {
      id: crypto.randomUUID(),
      description,
      photoUrl: photoDataUri,
      photoHint: '', // No hint available for user uploads
      location,
      category: result.category,
      severity: result.severity,
      requiresHumanReview: result.requiresHumanReview,
      timestamp: Date.now(),
    };

    // In a real application, you would save this to a database.
    // Here we just return it to the client to be added to state.
    return { success: true, data: newIncident };

  } catch (error) {
    console.error("AI classification failed:", error);
    return { success: false, error: "Failed to classify the incident. Please try again." };
  }
}
