import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const storyInput = z.object({
  name: z.string().min(1).max(40),
  gender: z.enum(["boy", "girl"]),
  pajama: z.string().min(1).max(40),
  items: z.array(z.string().min(1).max(80)).max(20),
});

export const createStory = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => storyInput.parse(data))
  .handler(async ({ data }) => {
    const { generateStory } = await import("./story.server");
    return { story: await generateStory(data) };
  });
