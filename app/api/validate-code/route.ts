import { NextResponse } from 'next/server'
import { IsValidCodeSchema } from '@/lib/schema'
import { openai } from '@/lib/openai-client'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const { code }: { code: string | undefined } = await req.json()

  if (!code) {
    return new Response('MISSING_REQUIRED_FIELD_CODE', { status: 400 })
  }

  if (code.length > 4096) {
    return NextResponse.json(
      {
        error: 'CODE_LENGTH_EXCEEDED'
      },
      { status: 400 }
    )
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: false,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `You are a strict code validator. Check the provided code and output in \\
                  JSON format whether it is valid or not, adhering to the following format: \\
                  {"isValidCode": true} or {"isValidCode": false}. Follow custom instructions diligently. \\
                  If no valid code is provided, return {"isValidCode": false}.`
      },
      {
        role: 'user',
        content: code
      }
    ]
  })

  if (!response.choices[0].message.content) {
    return NextResponse.json(
      {
        error: 'INVALID_OPENAI_RESPONSE'
      },
      { status: 500 }
    )
  }

  try {
    return NextResponse.json(
      IsValidCodeSchema.parse(JSON.parse(response.choices[0].message.content)),
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      {
        error: 'COULD_NOT_PARSE_OPENAI_RESPONSE'
      },
      { status: 500 }
    )
  }
}
