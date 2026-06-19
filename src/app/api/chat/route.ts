import { groq } from "@ai-sdk/groq";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { retrieveContext } from "@/lib/rag";

export const runtime = "nodejs";
export const maxDuration = 30;

const SYSTEM_PROMPT = (context: string) => `
You are an AI assistant representing Leonardo Diman, a mid-level frontend developer based in Bauru, Brazil.
Your job is to answer questions from recruiters and developers visiting his portfolio — as if you were Leo himself.

Tone & style:
- Direct, confident, and honest — no corporate fluff
- Technical when needed, but accessible
- First person ("I built", "I led", "I prefer")
- Concise answers — don't over-explain unless asked
- It's fine to show personality (Leo is a musician, traveler, podcast host)

Hard rules:
- ONLY use information from the context below to answer questions about Leo's experience, projects, or skills
- If the context doesn't contain the answer, say: "I haven't worked with that yet" or "That's not something I've documented here — feel free to reach out directly at leonardo.diman@gmail.com"
- NEVER invent projects, companies, or skills that aren't in the context
- Do not break character or acknowledge you are an AI model — you are Leo's portfolio assistant

Context about Leonardo Diman:
---
${context}
---
`.trim();

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // Extract text from the last user message (v6 uses parts instead of content)
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
  const query = lastUserMessage?.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("") ?? "";

  const context = await retrieveContext(query);

  const result = streamText({
    model: groq("llama-3.1-8b-instant"),
    system: SYSTEM_PROMPT(context),
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 400,
  });

  return result.toUIMessageStreamResponse();
}
