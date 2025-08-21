import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai'

// IMPORTANT: These secrets should be set in your Supabase project
// settings at https://supabase.com/dashboard/project/_/settings/functions
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

serve(async (req) => {
  // 1. Check method and content type
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }
  const { message, userId } = await req.json()
  if (!message || !userId) {
    return new Response('Missing message or userId in request body', { status: 400 })
  }

  // 2. Initialize clients
  const supabaseAdmin = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  try {
    // 3. Fetch all cooperados for the user to provide context to the AI
    const { data: cooperados, error: dbError } = await supabaseAdmin
      .from('cooperados')
      .select('name, tier, company_name, sector')
      .eq('user_id', userId);

    if (dbError) {
      console.error('Database Error:', dbError.message);
      throw new Error(`Database error: ${dbError.message}`);
    }

    // 4. Construct a detailed prompt for Gemini
    const cooperadosContext = cooperados && cooperados.length > 0
      ? `Aqui está uma lista dos cooperados do usuário: ${cooperados.map(c => `${c.name} (${c.company_name}, Nível ${c.tier})`).join(', ')}.`
      : "O usuário não possui cooperados cadastrados.";

    const systemInstruction = `Você é "Sofia", uma consultora de IA para a plataforma GestorCoop. Sua função é fornecer insights precisos e acionáveis sobre os dados da cooperativa. Seja concisa e direta. ${cooperadosContext} Responda em português.`;

    const prompt = `${systemInstruction}\n\nUsuário: ${message}`;

    // 5. Call Gemini API
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // 6. Return the AI's response
    return new Response(JSON.stringify({ reply: text }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error calling Gemini API:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
