import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'
import { FormSchema } from '@/lib/schema'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fetchAndValidate<T>(
  url: string,
  data: z.infer<typeof FormSchema>,
  schema: z.ZodSchema<T>
): Promise<T | { error: string }> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const jsonData = await response.json()
    return schema.parse(jsonData)
  } catch (error) {
    console.error(error)
    return { error: error instanceof Error ? error.message : 'UNKNOWN ERROR' }
  }
}
