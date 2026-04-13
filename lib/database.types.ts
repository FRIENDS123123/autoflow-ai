export type Automation = {
  id: string
  user_id: string
  title: string
  description: string
  prompt: string
  nodes: any[]
  apps: string[]
  steps_count: number
  status: 'active' | 'paused'
  created_at: string
}
