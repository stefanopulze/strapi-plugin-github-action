export interface PluginConfig {
  owner: string
  repo: string
  token: string
  branch: string
  workflowId: string
}


export interface RestError {
  message: string
  details: {
    code: string
    documentation_url?: string
  }
}

export interface CheckResult  {
  total_count: number
  workflow_runs: WorkflowRun[]
}

export interface WorkflowRun {
  id: number
  name: string
  head_branch: string
  status: string
  cancel_url: string
  html_url: string
  created_at: string
  updated_at: string
}
