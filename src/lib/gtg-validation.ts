import { z } from "zod";
import { AGE_BANDS, REGISTRATION_SOURCES, WHAT_LANDED, WHAT_NEXT } from "./gtg-config";

const phoneSchema = z.string().trim().min(7).max(24).regex(/^[+0-9() -]+$/, "Enter a valid phone number").refine((value) => (value.match(/\d/g) || []).length >= 7, "Enter a valid phone number");

export const registrationSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80, "Name is too long"),
  phone: phoneSchema,
  ageBand: z.enum(AGE_BANDS, { errorMap: () => ({ message: "Select your age range" }) }),
  source: z.enum(REGISTRATION_SOURCES, { errorMap: () => ({ message: "Select how you heard about the event" }) }),
  returningGuest: z.boolean().default(false),
  supportNeeds: z.string().trim().max(300, "Please keep this under 300 characters").optional().default(""),
  ageConfirmed: z.literal(true, { errorMap: () => ({ message: "Please confirm that you are 20 or older" }) }),
  consent: z.literal(true, { errorMap: () => ({ message: "Please agree before submitting" }) }),
  clientSubmissionId: z.string().min(12).max(100).regex(/^GTG-[A-Za-z0-9-]+$/),
  website: z.string().max(0).optional().default(""),
});
export type RegistrationInput = z.infer<typeof registrationSchema>;

export const feedbackSchema = z.object({
  rating: z.number().int().min(1).max(5),
  whatLanded: z.array(z.enum(WHAT_LANDED)).max(7).default([]),
  whatLandedNote: z.string().trim().max(500).optional().default(""),
  whatNext: z.array(z.enum(WHAT_NEXT)).max(6).default([]),
  whatNextNote: z.string().trim().max(500).optional().default(""),
  clientSubmissionId: z.string().min(12).max(100).regex(/^GTG-[A-Za-z0-9-]+$/),
});
export type FeedbackInput = z.infer<typeof feedbackSchema>;
