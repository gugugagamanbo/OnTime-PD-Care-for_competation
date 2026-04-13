import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash";

const SYSTEM_PROMPTS: Record<string, string> = {
  "scan-prescription": `你是一位专业的帕金森用药助手。用户会提供处方文本或药盒信息。请提取每种药物的以下字段，返回 JSON 数组：
[{
  "name": "药物通用名",
  "strength": "规格如125mg",
  "dose": "每次剂量如1片",
  "times": ["07:00","11:00"],
  "instruction": "服药说明如餐前30分钟",
  "confidence": "高 或 中"
}]
只返回 JSON，不要多余解释。如果无法确定某个字段，用空字符串。confidence 为"中"表示不确定。`,

  "generate-report": `你是帕金森照护报告生成助手。根据用户提供的用药记录、症状记录和设备数据，生成一份简洁的近期照护报告。报告应包含：
1. 用药依从性总结（按时率、漏服、延迟）
2. 症状变化趋势
3. 设备数据摘要（如有）
4. 照护者状态
5. 医生沟通建议
用中文、分段输出，语气专业但易懂。`,

  "visit-summary": `你是帕金森就诊准备助手。根据用户提供的药物清单、近期服药记录、症状记录和设备数据，生成一份就诊摘要，帮助患者和家属在复诊时与医生沟通。
包含：当前用药方案、依从性、近期症状变化、需要讨论的问题。
用中文输出，格式清晰。`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { action, content, medications, symptoms, logs, deviceData } = await req.json();

    if (!action || !SYSTEM_PROMPTS[action]) {
      return new Response(
        JSON.stringify({ error: "Invalid action. Use: scan-prescription, generate-report, visit-summary" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build user message based on action
    let userMessage = "";
    if (action === "scan-prescription") {
      if (!content) {
        return new Response(
          JSON.stringify({ error: "Missing 'content' field for prescription scan" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      userMessage = `以下是处方/药盒信息：\n${content}`;
    } else {
      const parts: string[] = [];
      if (medications?.length) {
        parts.push(`当前药物清单：\n${JSON.stringify(medications, null, 2)}`);
      }
      if (logs?.length) {
        parts.push(`近期服药记录：\n${JSON.stringify(logs, null, 2)}`);
      }
      if (symptoms?.length) {
        parts.push(`近期症状记录：\n${JSON.stringify(symptoms, null, 2)}`);
      }
      if (deviceData) {
        parts.push(`设备数据摘要：\n${JSON.stringify(deviceData, null, 2)}`);
      }
      userMessage = parts.join("\n\n") || "暂无数据，请基于通用帕金森照护知识生成示例报告。";
    }

    const response = await fetch(AI_GATEWAY, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPTS[action] },
          { role: "user", content: userMessage },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "AI 请求过于频繁，请稍后再试" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI 额度不足，请联系管理员" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI 服务暂时不可用" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || "";

    // For prescription scan, try to parse as JSON
    if (action === "scan-prescription") {
      try {
        const jsonMatch = result.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return new Response(
            JSON.stringify({ medications: parsed }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      } catch {
        // Return raw text if JSON parsing fails
      }
    }

    return new Response(
      JSON.stringify({ result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("ai-care error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
