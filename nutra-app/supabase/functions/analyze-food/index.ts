import "@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
} as const;

type AnalyzeFoodResult = {
  isFood: boolean;
  confidence?: number;
  total?: {
    kcal?: number;
    protein_g?: number;
    carbs_g?: number;
    fat_g?: number;
  };
  items?: Array<{
    name?: string;
    estimated_grams?: number;
    kcal?: number;
    protein_g?: number;
    carbs_g?: number;
    fat_g?: number;
  }>;
  notes?: string;
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const stripDataUrlPrefix = (base64: string) => {
  const trimmed = (base64 ?? "").trim();
  if (!trimmed) return "";
  const idx = trimmed.indexOf("base64,");
  if (idx === -1) return trimmed;
  return trimmed.slice(idx + "base64,".length).trim();
};

const detectMimeType = (base64: string) => {
  const head = (base64 ?? "").slice(0, 16);
  if (head.startsWith("/9j/")) return "image/jpeg";
  if (head.startsWith("iVBORw0KGgo")) return "image/png";
  if (head.startsWith("R0lGODdh") || head.startsWith("R0lGODlh")) return "image/gif";
  if (head.startsWith("UklGR")) return "image/webp";
  return "image/jpeg";
};

const toFiniteNumber = (v: unknown) => {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : undefined;
};

const normalizeResult = (raw: any): AnalyzeFoodResult => {
  const isFood =
    typeof raw?.isFood === "boolean"
      ? raw.isFood
      : typeof raw?.is_food === "boolean"
        ? raw.is_food
        : true;

  const confidence = toFiniteNumber(raw?.confidence);

  const totalRaw = raw?.total ?? raw?.totals ?? raw?.macros_total ?? raw?.macroTotal ?? null;
  const total =
    totalRaw && typeof totalRaw === "object"
      ? {
          kcal: toFiniteNumber(totalRaw?.kcal ?? totalRaw?.calories ?? totalRaw?.energy_kcal),
          protein_g: toFiniteNumber(totalRaw?.protein_g ?? totalRaw?.protein ?? totalRaw?.proteins_g),
          carbs_g: toFiniteNumber(totalRaw?.carbs_g ?? totalRaw?.carbs ?? totalRaw?.carbohydrates_g),
          fat_g: toFiniteNumber(totalRaw?.fat_g ?? totalRaw?.fat ?? totalRaw?.fats_g),
        }
      : undefined;

  const itemsRaw = Array.isArray(raw?.items)
    ? raw.items
    : Array.isArray(raw?.ingredients)
      ? raw.ingredients
      : Array.isArray(raw?.results)
        ? raw.results
        : undefined;

  const items =
    itemsRaw?.map((it: any) => ({
      name: typeof it?.name === "string" ? it.name : typeof it?.food === "string" ? it.food : undefined,
      estimated_grams: toFiniteNumber(it?.estimated_grams ?? it?.grams ?? it?.weight_g),
      kcal: toFiniteNumber(it?.kcal ?? it?.calories),
      protein_g: toFiniteNumber(it?.protein_g ?? it?.protein),
      carbs_g: toFiniteNumber(it?.carbs_g ?? it?.carbs),
      fat_g: toFiniteNumber(it?.fat_g ?? it?.fat),
    })) ?? undefined;

  const notes = typeof raw?.notes === "string" ? raw.notes : typeof raw?.message === "string" ? raw.message : undefined;

  return {
    isFood,
    confidence,
    total,
    items,
    notes,
  };
};

const safeJsonParse = (text: string) => {
  try {
    return JSON.parse(text);
  } catch {
    const first = text.indexOf("{");
    const last = text.lastIndexOf("}");
    if (first !== -1 && last !== -1 && last > first) {
      try {
        return JSON.parse(text.slice(first, last + 1));
      } catch {}
    }
    return null;
  }
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Método não suportado" }, 405);
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "JSON inválido" }, 400);
  }

  const base64 = stripDataUrlPrefix(payload?.imageBase64 ?? payload?.image_base64 ?? "");
  if (!base64) {
    return json({ error: "imageBase64 é obrigatório" }, 400);
  }

  if (base64.length > 12_000_000) {
    return json({ error: "Imagem muito grande" }, 413);
  }

  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    return json({ error: "Serviço de análise não configurado (OPENAI_API_KEY)" }, 500);
  }

  const model = Deno.env.get("OPENAI_MODEL") ?? "gpt-4o-mini";
  const mime = typeof payload?.imageMime === "string" ? payload.imageMime : detectMimeType(base64);
  const imageUrl = `data:${mime};base64,${base64}`;

  const prompt =
    "Analise a foto e retorne APENAS um JSON válido no seguinte formato:\n" +
    "{\n" +
    '  "isFood": boolean,\n' +
    '  "confidence": number,\n' +
    '  "total": { "kcal": number, "protein_g": number, "carbs_g": number, "fat_g": number },\n' +
    '  "items": [ { "name": string, "estimated_grams": number, "kcal": number } ],\n' +
    '  "notes": string\n' +
    "}\n" +
    "Se não for comida, retorne isFood=false e explique em notes. Se não tiver certeza, estime com cautela.";

  const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      max_tokens: 900,
      messages: [
        { role: "system", content: "Você é um nutricionista. Responda sempre em JSON." },
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
    }),
  });

  if (!openAiRes.ok) {
    const text = await openAiRes.text();
    return json(
      {
        error: "Falha no provedor de IA",
        status: openAiRes.status,
        details: text.slice(0, 1000),
      },
      502,
    );
  }

  const openAiJson: any = await openAiRes.json();
  const content = openAiJson?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    return json({ error: "Resposta vazia do provedor de IA" }, 502);
  }

  const parsed = safeJsonParse(content);
  if (!parsed) {
    return json({ error: "Não foi possível interpretar o retorno da IA" }, 502);
  }

  const normalized = normalizeResult(parsed);
  return json(normalized, 200);
});
