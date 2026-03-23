import { z } from "zod";

export const ledgerRoleSchema = z.enum(["owner", "editor", "viewer"]);
export const categoryTypeSchema = z.enum(["expense", "income", "transfer"]);

export const createLedgerSchema = z.object({
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().max(240).optional().nullable(),
  icon: z.string().trim().max(40).optional().nullable(),
  currency: z.string().trim().length(3).default("CNY"),
});

export const updateLedgerSchema = createLedgerSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "At least one field is required",
});

export const createInviteSchema = z.object({
  role: z.enum(["editor", "viewer"]).default("editor"),
  expires_in_days: z.number().int().min(1).max(30).default(7),
});

export const acceptInviteSchema = z.object({
  token: z.string().trim().min(16).max(128),
});

export const createCategorySchema = z.object({
  ledger_id: z.string().uuid(),
  parent_id: z.string().uuid().nullable().optional(),
  name: z.string().trim().min(1).max(50),
  icon: z.string().trim().max(40).optional().nullable(),
  color: z.string().trim().max(20).optional().nullable(),
  type: categoryTypeSchema.default("expense"),
  sort_order: z.number().int().min(0).max(9999).default(0),
});

export const createTransactionSchema = z.object({
  ledger_id: z.string().uuid(),
  category_id: z.string().uuid().nullable().optional(),
  amount: z.coerce.number().finite().positive(),
  type: categoryTypeSchema,
  note: z.string().trim().max(500).optional().nullable(),
  occurred_at: z.string().datetime().optional(),
  tags: z.array(z.string().trim().min(1).max(30)).max(10).default([]),
});

export const updateTransactionSchema = createTransactionSchema
  .omit({ ledger_id: true })
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });
