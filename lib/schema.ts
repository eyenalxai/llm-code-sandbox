import { z } from 'zod'

export const IsValidCodeSchema = z.object({
  isValidCode: z.boolean()
})

export const IsValidCodeResponseSchema = z.union([
  z.object({ isValidCode: z.boolean() }).strict(),
  z.object({ error: z.string() }).strict()
])

export const CodeOutputSchema = z.object({
  output: z.string()
})

export const CodeOutputSchemaResponseSchema = z.union([
  z.object({ output: z.string() }).strict(),
  z.object({ error: z.string() }).strict()
])

export const FormSchema = z.object({
  code: z
    .string()
    .min(8, {
      message: 'CODE MUST BE AT LEAST 8 CHARACTERS'
    })
    .max(4096, {
      message: 'CODE MUST BE LESS THAN 4096 CHARACTERS'
    })
})
