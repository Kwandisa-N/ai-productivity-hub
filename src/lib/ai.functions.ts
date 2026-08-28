import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MODEL = "google/gemini-3.7-flash";

async function callGateway(system: string, user: string): Promise<string> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured right now. Please try again later.");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    if (res.status === 429) throw new Error("Too many requests right now. Please wait a moment and try again.");
    if (res.status === 402) throw new Error("The AI workspace is out of credits. Please add credits to continue.");
    throw new Error(`The AI service couldn't complete this request. ${detail.slice(0, 200)}`);
  }

  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content ?? "";
  if (!content.trim()) throw new Error("The AI returned an empty response. Please try again.");
  return content;
}

function parseJson<T>(raw: string): T {
  const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end > start) return JSON.parse(cleaned.slice(start, end + 1)) as T;
    throw new Error("The AI response couldn't be read. Please try again.");
  }
}

const ACCURACY =
  "Be accurate and concise. Never invent names, dates, numbers or facts that are not supported by the input. If information is missing, say so plainly instead of guessing. Respond with valid JSON only, no markdown fences.";

/* ---------------- Email ---------------- */

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        recipient: z.string().min(1).max(300),
        purpose: z.string().min(1).max(2000),
        keyPoints: z.string().max(4000).default(""),
        tone: z.enum(["Formal", "Friendly", "Persuasive"]),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const raw = await callGateway(
      `You are a professional workplace communication assistant writing business emails for a corporate context. Write in a ${data.tone.toLowerCase()} tone. ${ACCURACY} JSON shape: {"subject": string, "greeting": string, "body": string, "signOff": string}. The body must be well-structured plain text with short paragraphs separated by blank lines.`,
      `Recipient / audience: ${data.recipient}\nPurpose of the email: ${data.purpose}\nKey points to include:\n${data.keyPoints || "(none provided — keep the email focused on the purpose)"}`,
    );
    const parsed = parseJson<{ subject: string; greeting: string; body: string; signOff: string }>(raw);
    return `Subject: ${parsed.subject}\n\n${parsed.greeting}\n\n${parsed.body}\n\n${parsed.signOff}`;
  });

/* ---------------- Meeting summary ---------------- */

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ notes: z.string().min(20).max(20000) }).parse(input))
  .handler(async ({ data }) => {
    const raw = await callGateway(
      `You are a meeting analyst for a professional workplace. ${ACCURACY} JSON shape: {"summary": string, "decisions": string[], "actionItems": [{"task": string, "owner": string, "deadline": string}], "deadlines": string[]}. Use "Unassigned" or "Not specified" when an owner or deadline is not stated in the notes. Keep every item short and specific.`,
      `Meeting notes:\n${data.notes}`,
    );
    return parseJson<{
      summary: string;
      decisions: string[];
      actionItems: Array<{ task: string; owner: string; deadline: string }>;
      deadlines: string[];
    }>(raw);
  });

/* ---------------- Research ---------------- */

export const runResearch = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ topic: z.string().min(3).max(500), source: z.string().max(20000).default("") }).parse(input),
  )
  .handler(async ({ data }) => {
    const raw = await callGateway(
      `You are a professional research assistant supporting workplace decision-making. ${ACCURACY} JSON shape: {"summary": string, "insights": string[], "recommendations": string[], "considerations": string[]}. Prefer the provided source text when it exists; otherwise rely on well-established general knowledge and flag uncertainty in considerations.`,
      `Research topic or question: ${data.topic}\n\nProvided source text:\n${data.source || "(none provided)"}`,
    );
    return parseJson<{
      summary: string;
      insights: string[];
      recommendations: string[];
      considerations: string[];
    }>(raw);
  });
