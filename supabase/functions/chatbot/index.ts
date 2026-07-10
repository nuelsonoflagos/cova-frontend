import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, history, userProfile } = await req.json()

    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!anthropicApiKey) {
      throw new Error('Anthropic API key is not configured in Edge Function secrets')
    }

    // Format history for Claude (roles must be 'user' or 'assistant')
    const claudeMessages = history.map((msg: any) => ({
      role: msg.role === 'bot' ? 'assistant' : msg.role,
      content: msg.content
    }))

    // System prompt to guide Claude's behavior
    const systemPrompt = `You are Cova's AI Insurance Assistant. You help users find the right insurance.
    Keep responses concise, friendly, and helpful. 
    Current user profile state: ${JSON.stringify(userProfile)}
    
    Your goal is to figure out:
    1. Do they need personal or business insurance?
    2. What do they want to protect? (devices, car, health, life, travel, property, fire, burglary, liability)
    3. What is their budget?
    
    If they ask for recommendations, give them straightforward advice based on Cova's offerings.`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 500,
        system: systemPrompt,
        messages: claudeMessages
      })
    })

    const claudeData = await response.json()

    if (claudeData.error) {
      console.error('Claude API Error:', claudeData.error)
      throw new Error(claudeData.error.message)
    }

    const aiResponseText = claudeData.content[0].text

    return new Response(
      JSON.stringify({ 
        response: aiResponseText 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Edge Function Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})