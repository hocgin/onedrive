import { NextRequest, NextResponse } from 'next/server'
import { getAccessToken } from './index'

export const runtime = 'edge'
export default async function handler(req: NextRequest): Promise<Response> {
  let accessCode = req.nextUrl.searchParams.get('access_code')
  try {
    // @ts-ignore
    if (process.env.ACCESS_CODE === accessCode) {
      // Get access token from storage
      const accessToken = await getAccessToken()

      return NextResponse.json({ accessCode, accessToken })
    } else {
      return new Response(JSON.stringify({ error: 'API Access Code Error.' }), { status: 403 })
    }
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.response?.data ?? 'Internal server error.' }), {
      status: error?.response?.code ?? 500
    })
  }
}