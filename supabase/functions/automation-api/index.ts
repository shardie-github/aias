/**
 * Automation API
 * Comprehensive backend automation and AI-powered workflows
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WorkflowRequest {
  name: string;
  description: string;
  trigger: Record<string, unknown>;
  steps: Array<Record<string, unknown>>;
  category: string;
  tags: string[];
}

interface ExecutionRequest {
  workflowId: string;
  triggerData?: Record<string, unknown>;
}

interface LeadGenerationRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  source: string;
  qualificationData?: Record<string, unknown>;
}

interface AppointmentRequest {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  meetingType?: string;
  location?: string;
  participants?: Array<Record<string, unknown>>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const url = new URL(req.url)
    const path = url.pathname
    const method = req.method

    // Get user from JWT
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Route handling
    switch (true) {
      case path === '/workflows' && method === 'GET':
        return await handleGetWorkflows(req, supabaseClient, user.id)
      
      case path === '/workflows' && method === 'POST':
        return await handleCreateWorkflow(req, supabaseClient, user.id)
      
      case path.startsWith('/workflows/') && method === 'GET':
        return await handleGetWorkflow(req, supabaseClient, user.id, path)
      
      case path.startsWith('/workflows/') && method === 'PUT':
        return await handleUpdateWorkflow(req, supabaseClient, user.id, path)
      
      case path.startsWith('/workflows/') && method === 'DELETE':
        return await handleDeleteWorkflow(req, supabaseClient, user.id, path)
      
      case path.startsWith('/workflows/') && path.endsWith('/execute') && method === 'POST':
        return await handleExecuteWorkflow(req, supabaseClient, user.id, path)
      
      case path === '/executions' && method === 'GET':
        return await handleGetExecutions(req, supabaseClient, user.id)
      
      case path.startsWith('/executions/') && method === 'GET':
        return await handleGetExecution(req, supabaseClient, user.id, path)
      
      case path === '/leads' && method === 'POST':
        return await handleCreateLead(req, supabaseClient, user.id)
      
      case path === '/leads' && method === 'GET':
        return await handleGetLeads(req, supabaseClient, user.id)
      
      case path.startsWith('/leads/') && path.endsWith('/qualify') && method === 'POST':
        return await handleQualifyLead(req, supabaseClient, user.id, path)
      
      case path === '/appointments' && method === 'POST':
        return await handleCreateAppointment(req, supabaseClient, user.id)
      
      case path === '/appointments' && method === 'GET':
        return await handleGetAppointments(req, supabaseClient, user.id)
      
      case path.startsWith('/appointments/') && path.endsWith('/conflicts') && method === 'GET':
        return await handleCheckConflicts(req, supabaseClient, user.id, path)
      
      case path === '/meetings' && method === 'POST':
        return await handleCreateMeeting(req, supabaseClient, user.id)
      
      case path.startsWith('/meetings/') && path.endsWith('/notes') && method === 'POST':
        return await handleCreateMeetingNotes(req, supabaseClient, user.id, path)
      
      case path === '/design-projects' && method === 'POST':
        return await handleCreateDesignProject(req, supabaseClient, user.id)
      
      case path === '/design-projects' && method === 'GET':
        return await handleGetDesignProjects(req, supabaseClient, user.id)
      
      case path.startsWith('/design-projects/') && path.endsWith('/versions') && method === 'POST':
        return await handleCreateDesignVersion(req, supabaseClient, user.id, path)
      
      case path === '/metrics' && method === 'GET':
        return await handleGetMetrics(req, supabaseClient, user.id)
      
      default:
        return new Response(
          JSON.stringify({ error: 'Not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

  } catch (error) {
    console.error('Automation API Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Workflow Management
async function handleGetWorkflows(req: Request, supabase: any, userId: string) {
  const url = new URL(req.url)
  const category = url.searchParams.get('category')
  const status = url.searchParams.get('status')

  let query = supabase
    .from('automation_workflows')
    .select('*')
    .eq('created_by', userId)

  if (category) {
    query = query.eq('category', category)
  }
  if (status) {
    query = query.eq('status', status)
  }

  const { data: workflows, error } = await query.order('updated_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to get workflows: ${error.message}`)
  }

  return new Response(
    JSON.stringify({
      success: true,
      workflows
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleCreateWorkflow(req: Request, supabase: any, userId: string) {
  const { name, description, trigger, steps, category, tags }: WorkflowRequest = await req.json()

  const { data: workflow, error } = await supabase
    .from('automation_workflows')
    .insert({
      name,
      description,
      trigger_config: trigger,
      steps,
      category,
      tags,
      created_by: userId,
      status: 'draft'
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create workflow: ${error.message}`)
  }

  // Log audit event
  await supabase.rpc('log_audit_event', {
    p_action: 'workflow_created',
    p_resource_type: 'automation_workflow',
    p_resource_id: workflow.id,
    p_metadata: { name, category }
  })

  return new Response(
    JSON.stringify({
      success: true,
      workflow
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleGetWorkflow(req: Request, supabase: any, userId: string, path: string) {
  const workflowId = path.split('/')[2]

  const { data: workflow, error } = await supabase
    .from('automation_workflows')
    .select('*')
    .eq('id', workflowId)
    .eq('created_by', userId)
    .single()

  if (error) {
    throw new Error(`Failed to get workflow: ${error.message}`)
  }

  return new Response(
    JSON.stringify({
      success: true,
      workflow
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleUpdateWorkflow(req: Request, supabase: any, userId: string, path: string) {
  const workflowId = path.split('/')[2]
  const updates = await req.json()

  const { data: workflow, error } = await supabase
    .from('automation_workflows')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', workflowId)
    .eq('created_by', userId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update workflow: ${error.message}`)
  }

  return new Response(
    JSON.stringify({
      success: true,
      workflow
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleDeleteWorkflow(req: Request, supabase: any, userId: string, path: string) {
  const workflowId = path.split('/')[2]

  const { error } = await supabase
    .from('automation_workflows')
    .delete()
    .eq('id', workflowId)
    .eq('created_by', userId)

  if (error) {
    throw new Error(`Failed to delete workflow: ${error.message}`)
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Workflow deleted successfully'
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleExecuteWorkflow(req: Request, supabase: any, userId: string, path: string) {
  const workflowId = path.split('/')[2]
  const { triggerData }: ExecutionRequest = await req.json()

  // Get workflow
  const { data: workflow, error: workflowError } = await supabase
    .from('automation_workflows')
    .select('*')
    .eq('id', workflowId)
    .eq('created_by', userId)
    .single()

  if (workflowError) {
    throw new Error(`Failed to get workflow: ${workflowError.message}`)
  }

  // Create execution record
  const { data: execution, error: executionError } = await supabase
    .from('workflow_executions')
    .insert({
      workflow_id: workflowId,
      status: 'running',
      trigger_data: triggerData,
      context: {}
    })
    .select()
    .single()

  if (executionError) {
    throw new Error(`Failed to create execution: ${executionError.message}`)
  }

  // Execute workflow steps (simplified - in production, this would be more sophisticated)
  try {
    for (const step of workflow.steps) {
      const stepResult = await executeStep(step, execution.context, supabase)
      
      // Record step execution
      await supabase
        .from('step_executions')
        .insert({
          execution_id: execution.id,
          step_id: step.id,
          step_type: step.type,
          status: 'completed',
          input_data: execution.context,
          output_data: stepResult,
          end_time: new Date().toISOString()
        })

      execution.context = { ...execution.context, ...stepResult }
    }

    // Update execution as completed
    await supabase
      .from('workflow_executions')
      .update({
        status: 'completed',
        context: execution.context,
        end_time: new Date().toISOString()
      })
      .eq('id', execution.id)

  } catch (error) {
    // Update execution as failed
    await supabase
      .from('workflow_executions')
      .update({
        status: 'failed',
        error_message: error.message,
        end_time: new Date().toISOString()
      })
      .eq('id', execution.id)

    throw error
  }

  return new Response(
    JSON.stringify({
      success: true,
      execution
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

// Lead Generation
async function handleCreateLead(req: Request, supabase: any, userId: string) {
  const { email, firstName, lastName, company, phone, source, qualificationData }: LeadGenerationRequest = await req.json()

  // Calculate lead score
  const { data: score } = await supabase.rpc('calculate_lead_score', {
    p_lead_id: null // Will be calculated after insert
  })

  const { data: lead, error } = await supabase
    .from('leads')
    .insert({
      email,
      first_name: firstName,
      last_name: lastName,
      company,
      phone,
      source,
      qualification_data: qualificationData,
      score: 0 // Will be calculated by trigger
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create lead: ${error.message}`)
  }

  // Trigger lead qualification workflow
  // In production, this would trigger the actual workflow execution

  return new Response(
    JSON.stringify({
      success: true,
      lead
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleGetLeads(req: Request, supabase: any, userId: string) {
  const url = new URL(req.url)
  const status = url.searchParams.get('status')
  const assignedTo = url.searchParams.get('assigned_to')

  let query = supabase
    .from('leads')
    .select('*')
    .or(`assigned_to.eq.${userId},assigned_to.is.null`)

  if (status) {
    query = query.eq('status', status)
  }
  if (assignedTo) {
    query = query.eq('assigned_to', assignedTo)
  }

  const { data: leads, error } = await query.order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to get leads: ${error.message}`)
  }

  return new Response(
    JSON.stringify({
      success: true,
      leads
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleQualifyLead(req: Request, supabase: any, userId: string, path: string) {
  const leadId = path.split('/')[2]
  const { qualificationData } = await req.json()

  // Update lead with qualification data
  const { data: lead, error } = await supabase
    .from('leads')
    .update({
      qualification_data: qualificationData,
      status: 'qualified'
    })
    .eq('id', leadId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to qualify lead: ${error.message}`)
  }

  // Calculate new score
  const { data: score } = await supabase.rpc('calculate_lead_score', {
    p_lead_id: leadId
  })

  return new Response(
    JSON.stringify({
      success: true,
      lead,
      score
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

// Appointment Booking
async function handleCreateAppointment(req: Request, supabase: any, userId: string) {
  const { title, description, startTime, endTime, meetingType, location, participants }: AppointmentRequest = await req.json()

  // Check for conflicts
  const { data: hasConflicts } = await supabase.rpc('check_appointment_conflicts', {
    p_start_time: startTime,
    p_end_time: endTime,
    p_organizer_id: userId
  })

  if (hasConflicts) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Appointment conflicts with existing schedule'
      }),
      { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const { data: appointment, error } = await supabase
    .from('appointments')
    .insert({
      title,
      description,
      start_time: startTime,
      end_time: endTime,
      meeting_type: meetingType,
      location,
      participants,
      organizer_id: userId
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create appointment: ${error.message}`)
  }

  // Create reminders
  const reminders = [
    { timing_hours: 24, reminder_type: 'email' },
    { timing_hours: 1, reminder_type: 'push' }
  ]

  for (const reminder of reminders) {
    await supabase
      .from('appointment_reminders')
      .insert({
        appointment_id: appointment.id,
        reminder_type: reminder.reminder_type,
        timing_hours: reminder.timing_hours
      })
  }

  return new Response(
    JSON.stringify({
      success: true,
      appointment
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleGetAppointments(req: Request, supabase: any, userId: string) {
  const url = new URL(req.url)
  const startDate = url.searchParams.get('start_date')
  const endDate = url.searchParams.get('end_date')

  let query = supabase
    .from('appointments')
    .select('*')
    .eq('organizer_id', userId)

  if (startDate) {
    query = query.gte('start_time', startDate)
  }
  if (endDate) {
    query = query.lte('start_time', endDate)
  }

  const { data: appointments, error } = await query.order('start_time', { ascending: true })

  if (error) {
    throw new Error(`Failed to get appointments: ${error.message}`)
  }

  return new Response(
    JSON.stringify({
      success: true,
      appointments
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleCheckConflicts(req: Request, supabase: any, userId: string, path: string) {
  const appointmentId = path.split('/')[2]
  const url = new URL(req.url)
  const startTime = url.searchParams.get('start_time')
  const endTime = url.searchParams.get('end_time')

  if (!startTime || !endTime) {
    return new Response(
      JSON.stringify({ error: 'start_time and end_time are required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const { data: hasConflicts } = await supabase.rpc('check_appointment_conflicts', {
    p_start_time: startTime,
    p_end_time: endTime,
    p_organizer_id: userId
  })

  return new Response(
    JSON.stringify({
      success: true,
      hasConflicts
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

// Meeting and Note Taking
async function handleCreateMeeting(req: Request, supabase: any, userId: string) {
  const meetingData = await req.json()

  const { data: meeting, error } = await supabase
    .from('meetings')
    .insert({
      ...meetingData,
      organizer_id: userId
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create meeting: ${error.message}`)
  }

  return new Response(
    JSON.stringify({
      success: true,
      meeting
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleCreateMeetingNotes(req: Request, supabase: any, userId: string, path: string) {
  const meetingId = path.split('/')[2]
  const { transcription, summary, actionItems, insights } = await req.json()

  const { data: notes, error } = await supabase
    .from('meeting_notes')
    .insert({
      meeting_id: meetingId,
      transcription,
      summary,
      action_items: actionItems,
      insights,
      ai_enhanced: true
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create meeting notes: ${error.message}`)
  }

  return new Response(
    JSON.stringify({
      success: true,
      notes
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

// Design Projects
async function handleCreateDesignProject(req: Request, supabase: any, userId: string) {
  const projectData = await req.json()

  const { data: project, error } = await supabase
    .from('design_projects')
    .insert({
      ...projectData,
      owner_id: userId
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create design project: ${error.message}`)
  }

  return new Response(
    JSON.stringify({
      success: true,
      project
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleGetDesignProjects(req: Request, supabase: any, userId: string) {
  const { data: projects, error } = await supabase
    .from('design_projects')
    .select('*')
    .eq('owner_id', userId)
    .order('updated_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to get design projects: ${error.message}`)
  }

  return new Response(
    JSON.stringify({
      success: true,
      projects
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleCreateDesignVersion(req: Request, supabase: any, userId: string, path: string) {
  const projectId = path.split('/')[2]
  const { designData, aiEnhanced } = await req.json()

  // Get next version number
  const { data: lastVersion } = await supabase
    .from('design_versions')
    .select('version_number')
    .eq('project_id', projectId)
    .order('version_number', { ascending: false })
    .limit(1)
    .single()

  const versionNumber = (lastVersion?.version_number || 0) + 1

  const { data: version, error } = await supabase
    .from('design_versions')
    .insert({
      project_id: projectId,
      version_number: versionNumber,
      design_data: designData,
      ai_enhanced: aiEnhanced || false,
      created_by: userId
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create design version: ${error.message}`)
  }

  return new Response(
    JSON.stringify({
      success: true,
      version
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

// Metrics
async function handleGetMetrics(req: Request, supabase: any, userId: string) {
  const url = new URL(req.url)
  const period = url.searchParams.get('period') || '30d'

  // Get various metrics
  const [workflowStats, executionStats, leadStats, appointmentStats] = await Promise.all([
    supabase
      .from('automation_workflows')
      .select('status')
      .eq('created_by', userId),
    
    supabase
      .from('workflow_executions')
      .select('status, start_time')
      .gte('start_time', getDateFromPeriod(period)),
    
    supabase
      .from('leads')
      .select('status, created_at')
      .gte('created_at', getDateFromPeriod(period)),
    
    supabase
      .from('appointments')
      .select('status, start_time')
      .eq('organizer_id', userId)
      .gte('start_time', getDateFromPeriod(period))
  ])

  const metrics = {
    workflows: {
      total: workflowStats.data?.length || 0,
      active: workflowStats.data?.filter(w => w.status === 'active').length || 0
    },
    executions: {
      total: executionStats.data?.length || 0,
      successful: executionStats.data?.filter(e => e.status === 'completed').length || 0,
      successRate: executionStats.data?.length ? 
        (executionStats.data.filter(e => e.status === 'completed').length / executionStats.data.length) * 100 : 0
    },
    leads: {
      total: leadStats.data?.length || 0,
      qualified: leadStats.data?.filter(l => l.status === 'qualified').length || 0
    },
    appointments: {
      total: appointmentStats.data?.length || 0,
      upcoming: appointmentStats.data?.filter(a => new Date(a.start_time) > new Date()).length || 0
    }
  }

  return new Response(
    JSON.stringify({
      success: true,
      metrics
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

// Helper functions
async function executeStep(step: any, context: any, supabase: any): Promise<any> {
  // Simplified step execution - in production, this would be much more sophisticated
  switch (step.type) {
    case 'ai_analysis':
      return { analysis: 'AI analysis completed', confidence: 0.95 }
    case 'data_extraction':
      return { extractedData: { field1: 'value1' }, confidence: 0.88 }
    case 'notification':
      return { sent: true, messageId: 'msg_' + Date.now() }
    case 'api_call':
      return { success: true, statusCode: 200, data: { result: 'API call successful' } }
    case 'database_update':
      return { success: true, affectedRows: 1 }
    case 'ai_generation':
      return { generated: true, content: 'AI-generated content' }
    case 'scheduling':
      return { scheduled: true, scheduleId: 'sched_' + Date.now() }
    case 'integration':
      return { integrated: true, service: step.config?.service }
    default:
      return { error: 'Unknown step type' }
  }
}

function getDateFromPeriod(period: string): string {
  const now = new Date()
  switch (period) {
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
    case '90d':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString()
    default:
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
  }
}