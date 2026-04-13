import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )
}

export async function GET() {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('automations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { title, description, prompt, nodes, apps, steps_count } = body

  if (!title || !prompt) {
    return Response.json({ error: 'title and prompt are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('automations')
    .insert({
      user_id: user.id,
      title,
      description: description ?? '',
      prompt,
      nodes: nodes ?? [],
      apps: apps ?? [],
      steps_count: steps_count ?? 0,
      status: 'active',
    })
    .select()
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(data, { status: 201 })
}
