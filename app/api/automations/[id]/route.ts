import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'

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

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const { error } = await supabase
    .from('automations')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return new Response(null, { status: 204 })
}
