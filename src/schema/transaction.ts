import { z } from 'zod';

export const createTransactionSchema = z.object({
  body: z.object({
    id: z.number(),
    value: z.number(),
    user_id: z.number(),
    transactable_id: z.number().nullable(),
    transactable_type: z.string(),
    created_at: z.string(),
    reason: z.string(),
    user: z.object({
      login: z.string(),
      email: z.string(),
      full_name: z.string(),
      image: z.object({
        link: z.string(),
      }),
      cursus: z.array(z.any())
    }),
    transactable: z.object({
      id: z.number(),
      name: z.string(),
      internal_name: z.string(),
      kind: z.string(),
      teir: z.string(),
      description: z.string(),
      pedago: z.boolean(),
      visible: z.boolean(),
      nbr_of_success: z.number(),
      parent_id: z.number(),
      image: z.object({
        link: z.string(),
      }),
      created_at: z.string(),
      updated_at: z.string(),
      slug: z.string(),
      position: z.number(),
      reward: z.string(),
      title_id: z.number().nullable(),
    }).nullable().or(z.string().nullable()),
  })
})

export type TransactionCreate = z.infer<typeof createTransactionSchema>;