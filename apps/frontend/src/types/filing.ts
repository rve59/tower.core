// [LSL-GEN] source: MODEL declarations in tower_app_ui_definition.md

export interface Filing {
  id: string
  entity: string
  period: string
  status: 'pending' | 'pass' | 'fail'
  filed_at: string        // ISO datetime string
  has_errors: boolean
}

export interface FilingError {
  rule: string
  severity: 'error' | 'warning'
  message: string
  location?: string
}

export interface Entity {
  id: string
  name: string
}

export type PipelineHealth = 'healthy' | 'degraded' | 'down'
export type ActiveView = 'dashboard' | 'filings' | 'validation' | 'reports'
