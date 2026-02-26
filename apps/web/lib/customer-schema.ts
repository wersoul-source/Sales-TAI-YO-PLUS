import { z } from 'zod';

export const customerSchema = z.object({
  customerCode: z.string().min(2).max(50),
  companyName: z.string().min(2).max(200),
  contactName: z.string().min(2).max(150),
  phone: z.string().min(6).max(30),
  email: z.string().email(),
  taxId: z.string().min(6).max(30),
  segment: z.enum(['enterprise', 'sme', 'retail']),
  status: z.enum(['active', 'inactive'])
});

export type CustomerInput = z.infer<typeof customerSchema>;
