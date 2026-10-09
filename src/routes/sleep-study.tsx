import { createFileRoute } from "@tanstack/react-router";
import { StickerDoctor } from "@/components/game/sticker-doctor";

export const Route = createFileRoute("/sleep-study")({
  head: () => ({ meta: [
    { title: "Sleep Study — Get Ready with Me" },
    { name: "description", content: "Prepare for a sleep study with Sam and Mia, medical stickers, pajamas and a gentle bedtime dance." },
    { property: "og:title", content: "Sleep Study — Get Ready with Me" },
    { property: "og:description", content: "Prepare for a sleep study with Sam and Mia, medical stickers, pajamas and a gentle bedtime dance." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: StudyPage,
});

function StudyPage() { return <StickerDoctor study="sleep" />; }
