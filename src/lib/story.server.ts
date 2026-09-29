import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

import { createLovableAiGatewayRunIdFetch } from "./run-id.server";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";

export type StoryRequest = {
  name: string;
  gender: "boy" | "girl";
  pajama: string;
  items: string[];
};

export async function generateStory(input: StoryRequest): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured yet.");

  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const provider = createOpenAI({
    baseURL: `${GATEWAY_URL.replace(/\/+$/, "").replace(/\/v1$/, "")}/v1`,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const gear = input.items.length > 0 ? input.items.join(", ") : "no equipment yet";

  const result = streamText({
    model: provider.responses(MODEL),
    providerOptions: {
      openai: {
        store: false,
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        include: ["reasoning.encrypted_content"],
      },
    },
    messages: [
      {
        role: "system",
        content: [
          "You write tiny bedtime stories for children aged 3 to 9 who are about to have an overnight sleep study.",
          "Tone: warm, playful, brave, reassuring. Never scary, never about pain, needles, illness or hospitals being frightening.",
          "Turn the sleep study equipment the child placed into friendly magical helpers (for example belts as hug bands, sensors as dream antennae, a pulse oximeter as a glowing firefly light).",
          "Write 3 short paragraphs, about 120 words total, simple sentences, present tense.",
          "End with the character drifting happily to sleep. Output only the story text, no title and no markdown.",
        ].join(" "),
      },
      {
        role: "user",
        content: `Main character: ${input.name}, a ${input.gender} wearing ${input.pajama} pajamas. Things they put on for the sleep study: ${gear}. Please write their story.`,
      },
    ],
  });

  const text = await result.text;
  const trimmed = text.trim();
  if (!trimmed) throw new Error("The storyteller went quiet. Please try again.");
  return trimmed;
}
