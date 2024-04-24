'use client'

import { Textarea } from '@/components/ui/textarea'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import {
  codeOutputSchemaResponseSchema,
  isValidCodeResponseSchema
} from '@/lib/api-schema'

const FormSchema = z.object({
  code: z
    .string()
    .min(8, {
      message: 'CODE MUST BE AT LEAST 8 CHARACTERS'
    })
    .max(4096, {
      message: 'CODE MUST BE LESS THAN 4096 CHARACTERS'
    })
})

export const Editor = () => {
  const [isValidating, setIsValidating] = useState(false)
  const [codeOutput, setCodeOutput] = useState<string | null>(null)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema)
  })

  const { setError, clearErrors } = form

  const validateCode = async (data: z.infer<typeof FormSchema>) => {
    const codeValidationResponse = await fetch('/api/validate-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const codeValidationJson = await codeValidationResponse.json()

    try {
      const codeValidationResult =
        isValidCodeResponseSchema.parse(codeValidationJson)

      if ('error' in codeValidationResult) {
        return {
          isValidCode: false,
          error: codeValidationResult.error
        }
      }
      if (!codeValidationResult.isValidCode) {
        return {
          isValidCode: false,
          error: 'COMPILER THINKS THAT IS NOT A VALID PROGRAM'
        }
      }

      return {
        isValidCode: codeValidationResult.isValidCode
      }
    } catch (error) {
      console.error(error)
      return {
        isValidCode: false,
        error: JSON.stringify(error)
      }
    }
  }

  const executeCode = async (data: z.infer<typeof FormSchema>) => {
    const codeExecutingResponse = await fetch('/api/execute-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const codeExecutingJson = await codeExecutingResponse.json()

    try {
      const codeExecutionResult =
        codeOutputSchemaResponseSchema.parse(codeExecutingJson)

      if ('error' in codeExecutionResult) {
        return {
          error: codeExecutionResult.error
        }
      }

      return {
        codeOutput: codeExecutionResult.output
      }
    } catch (error) {
      console.error(error)
      return {
        error: JSON.stringify(error)
      }
    }
  }

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsValidating(true)
    setCodeOutput(null)

    const codeValidationResult = await validateCode(data)

    if ('error' in codeValidationResult || !codeValidationResult.isValidCode) {
      setError('code', {
        type: 'manual',
        message: codeValidationResult.error
      })
      setIsValidating(false)
      return
    }

    const codeExecutionResult = await executeCode(data)

    if ('error' in codeExecutionResult) {
      setError('code', {
        type: 'manual',
        message: codeExecutionResult.error
      })
      setIsValidating(false)
      return
    }

    clearErrors('code')
    setCodeOutput(codeExecutionResult.codeOutput)
    setIsValidating(false)
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div
            className={cn(
              'flex',
              'flex-row',
              'space-x-4',
              'items-center',
              'mb-2'
            )}
          >
            <Button disabled={isValidating} type="submit" variant={'outline'}>
              EXECUTE
            </Button>
            {form.formState.errors.code && (
              <div className={cn('text-red-500', 'text-xs')}>
                {form.formState.errors.code.message}
              </div>
            )}
          </div>
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="YOUR CODE"
                    className={cn('min-h-[256px]')}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
      {isValidating && (
        <div className={cn('mt-4')}>
          <h1>...</h1>
        </div>
      )}
      {codeOutput && (
        <div className={cn('mt-4')}>
          <h1>OUTPUT:</h1>
          <pre>{codeOutput}</pre>
        </div>
      )}
    </>
  )
}
