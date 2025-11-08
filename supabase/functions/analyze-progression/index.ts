import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { testResults, userId } = await req.json();
    
    if (!testResults || !userId) {
      throw new Error("Missing required parameters");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Prepare data for AI analysis
    const recentTests = testResults.slice(0, 5);
    const analysisPrompt = `Analyze these recent Parkinson's disease progression test results and provide insights:

${recentTests.map((test: any, i: number) => `
Test ${i + 1} (${new Date(test.test_date).toLocaleDateString()}):
- PD Progression Index: ${test.pd_progression_index}
- Motor Control Score: ${test.motor_control_score}
- Avg Dwell Time: ${test.avg_dwell_time}ms
- Avg Flight Time: ${test.avg_flight_time}ms
- Rhythm Variability: ${test.rhythm_variability}ms
- Detected Symptoms: ${test.detected_symptoms?.join(", ") || "None"}
`).join("\n")}

Based on this data:
1. Summarize the overall trend (improving, stable, or declining)
2. Identify any concerning patterns
3. Provide 3-4 actionable recommendations for the patient
4. Suggest when to consult a doctor

Respond in JSON format:
{
  "status": "stable|mild_change|progressing",
  "summary": "brief summary",
  "concerns": ["concern1", "concern2"],
  "recommendations": ["rec1", "rec2", "rec3"],
  "shouldConsultDoctor": true/false,
  "doctorReason": "reason if true"
}`;

    // Call Lovable AI
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a medical AI assistant specialized in analyzing Parkinson's disease progression data. Provide clear, actionable insights based on test results.",
          },
          {
            role: "user",
            content: analysisPrompt,
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, errorText);
      throw new Error("AI analysis failed");
    }

    const aiData = await aiResponse.json();
    const analysisText = aiData.choices[0].message.content;
    
    // Parse JSON response
    let analysis;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = analysisText.match(/```json\n([\s\S]*?)\n```/) || 
                        analysisText.match(/```\n([\s\S]*?)\n```/) ||
                        [null, analysisText];
      analysis = JSON.parse(jsonMatch[1]);
    } catch (e) {
      console.error("Failed to parse AI response:", analysisText);
      // Fallback to basic analysis
      analysis = {
        status: "mild_change",
        summary: "Unable to fully analyze results. Please consult with your doctor.",
        concerns: ["Data analysis incomplete"],
        recommendations: [
          "Continue regular testing",
          "Monitor any new symptoms",
          "Maintain healthy lifestyle",
        ],
        shouldConsultDoctor: false,
        doctorReason: "",
      };
    }

    // Create alert if needed
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (analysis.shouldConsultDoctor) {
      await supabase.from("alerts").insert({
        user_id: userId,
        alert_type: analysis.status,
        severity: analysis.status === "progressing" ? "critical" : "warning",
        message: analysis.doctorReason || "Please consult your doctor about recent changes.",
      });
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in analyze-progression:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
