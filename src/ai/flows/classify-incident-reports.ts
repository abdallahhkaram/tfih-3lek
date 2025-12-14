'use server';

/**
 * @fileOverview AI-powered incident classifier.
 *
 * This file defines a Genkit flow that automatically classifies reported incidents
 * based on their description and images using AI, to prioritize and route
 * incidents to the appropriate authorities, while also flagging incidents
 * for human review when appropriate.
 *
 * @exports classifyIncidentReport - The main function to classify incident reports.
 * @exports ClassifyIncidentReportInput - The input type for classifyIncidentReport.
 * @exports ClassifyIncidentReportOutput - The output type for classifyIncidentReport.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyIncidentReportInputSchema = z.object({
  description: z.string().describe('The description of the incident.'),
  photoDataUri: z
    .string()
    .describe(
      'A photo of the incident, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' /* data-uri */
    ),
});
export type ClassifyIncidentReportInput = z.infer<typeof ClassifyIncidentReportInputSchema>;

const ClassifyIncidentReportOutputSchema = z.object({
  category: z.string().describe('The category of the incident.'),
  severity: z.string().describe('The severity of the incident.'),
  requiresHumanReview: z
    .boolean()
    .describe(
      'Whether or not the incident requires human review due to its sensitive nature or potential escalation.'
    ),
});
export type ClassifyIncidentReportOutput = z.infer<typeof ClassifyIncidentReportOutputSchema>;

export async function classifyIncidentReport(
  input: ClassifyIncidentReportInput
): Promise<ClassifyIncidentReportOutput> {
  return classifyIncidentReportFlow(input);
}

const classifyIncidentReportPrompt = ai.definePrompt({
  name: 'classifyIncidentReportPrompt',
  input: {schema: ClassifyIncidentReportInputSchema},
  output: {schema: ClassifyIncidentReportOutputSchema},
  prompt: `You are an AI assistant designed to classify incident reports.

  Based on the description and the image, classify the incident into a category and determine its severity.
  Also, determine if the incident requires human review based on its sensitive nature or potential escalation.

  Description: {{{description}}}
  Photo: {{media url=photoDataUri}}

  Please provide the category, severity, and requiresHumanReview as a JSON object.`,
});

const escalateForHumanReview = ai.defineTool({
  name: 'escalateForHumanReview',
  description: 'This tool should be called to escalate the incident to a human reviewer.',
  inputSchema: z.object({
    reason: z.string().describe('The reason for escalating the incident.'),
  }),
  outputSchema: z.boolean(),
},
async (input) => {
    // TODO: Implement the escalation logic here.
    // This is a placeholder implementation.
    console.log("Incident Escalated. Reason: " + input.reason);
    return true; // Indicate successful escalation.
  }
);

const classifyIncidentReportFlow = ai.defineFlow(
  {
    name: 'classifyIncidentReportFlow',
    inputSchema: ClassifyIncidentReportInputSchema,
    outputSchema: ClassifyIncidentReportOutputSchema,
    tools: [escalateForHumanReview],
  },
  async input => {
    const {output} = await classifyIncidentReportPrompt(input);

    // If the AI determines that human review is required, escalate the incident.
    if (output?.requiresHumanReview) {
      // TODO: Customize the escalation reason based on the incident details.
      await escalateForHumanReview({
        reason: `Incident classified as potentially sensitive and requires human review. Category: ${output.category}, Severity: ${output.severity}`,
      });
    }

    return output!;
  }
);
