import { z } from 'zod/v4'

const sanitize = (val: string) =>
  val.replace(/[<>]/g, '').trim()

export const contactSchema = z.object({
  voornaam: z.string().min(1, 'Voornaam is verplicht').max(100).transform(sanitize),
  achternaam: z.string().min(1, 'Achternaam is verplicht').max(100).transform(sanitize),
  email: z.email('Ongeldig e-mailadres'),
  telefoon: z.string().max(20).transform(sanitize).optional().default(''),
  interesse: z.string().max(200).transform(sanitize).optional().default(''),
  bericht: z.string().min(1, 'Bericht is verplicht').max(5000).transform(sanitize),
  marketing: z.boolean().optional().default(false),
  privacy: z.boolean().optional(),
  // Honeypot field — must be absent or empty
  website: z
    .string()
    .optional()
    .refine((val) => !val, { message: 'Spam detected' }),
})

export const brochureSchema = z.object({
  naam: z.string().min(1, 'Naam is verplicht').max(100).transform(sanitize),
  email: z.email('Ongeldig e-mailadres'),
  // Honeypot — must be absent or empty
  website: z
    .string()
    .optional()
    .refine((val) => !val, { message: 'Spam detected' }),
})

export type ContactInput = z.input<typeof contactSchema>
export type BrochureInput = z.input<typeof brochureSchema>
