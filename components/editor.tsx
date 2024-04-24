'use client'

import { Textarea } from '@/components/ui/textarea'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { cn, fetchAndValidate } from '@/lib/utils'
import { useState } from 'react'
import {
  CodeOutputSchemaResponseSchema,
  FormSchema,
  IsValidCodeResponseSchema
} from '@/lib/schema'

export const Editor = () => {
  const [isValidating, setIsValidating] = useState(false)
  const [codeOutput, setCodeOutput] = useState<string | null>(null)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema)
  })

  const { setError, clearErrors } = form

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsValidating(true)
    setCodeOutput(null)

    const codeValidationResult = await fetchAndValidate(
      '/api/validate-code',
      data,
      IsValidCodeResponseSchema
    )

    if ('error' in codeValidationResult) {
      setError('code', {
        type: 'manual',
        message: codeValidationResult.error
      })
      setIsValidating(false)
      return
    }

    if (!codeValidationResult.isValidCode) {
      setError('code', {
        type: 'manual',
        message: 'COMPILER THINKS YOUR CODE IS NOT A VALID PROGRAM'
      })
      setIsValidating(false)
      return
    }

    const codeExecutionResult = await fetchAndValidate(
      '/api/execute-code',
      data,
      CodeOutputSchemaResponseSchema
    )

    if ('error' in codeExecutionResult) {
      setError('code', {
        type: 'manual',
        message: codeExecutionResult.error
      })
      setIsValidating(false)
      return
    }

    clearErrors('code')
    setCodeOutput(codeExecutionResult.output) // Assuming 'output' exists in the execution result schema
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
          <p className={cn('text-3xl')}>...</p>
        </div>
      )}
      {codeOutput && (
        <div className={cn('mt-4')}>
          <p className={cn('text-xl')}>OUTPUT:</p>
          <p>{codeOutput}</p>
        </div>
      )}
    </>
  )
}
