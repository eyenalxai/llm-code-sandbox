import { z } from 'zod'

export const isValidCodeSchema = z.object({
  isValidCode: z.boolean()
})

export const isValidCodeResponseSchema = z.union([
  z.object({ isValidCode: z.boolean() }).strict(),
  z.object({ error: z.string() }).strict()
])

export const codeOutputSchema = z.object({
  output: z.string()
})

export const codeOutputSchemaResponseSchema = z.union([
  z.object({ output: z.string() }).strict(),
  z.object({ error: z.string() }).strict()
])
