import { NextResponse } from 'next/server'
import { isValidCodeSchema } from '@/lib/api-schema'
import { openai } from '@/lib/openai-client'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const { code }: { code: string | undefined } = await req.json()

  if (!code) {
    return new Response('Missing required field code', { status: 400 })
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
    return new NextResponse('Invalid response from OpenAI', { status: 500 })
  }

  try {
    return NextResponse.json(
      isValidCodeSchema.parse(JSON.parse(response.choices[0].message.content)),
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return new NextResponse('Could not parse response from OpenAI', {
      status: 500
    })
  }
}
