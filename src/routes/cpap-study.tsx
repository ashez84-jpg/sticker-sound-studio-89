import { createFileRoute } from "@tanstack/react-router";
import { StickerDoctor } from "@/components/game/sticker-doctor";

export const Route = createFileRoute("/cpap-study")({
  head: () => ({ meta: [
    { title: "CPAP Study — Get Ready with Me" },
    { name: "description", content: "Get ready for a CPAP study with a soft nasal mask, sleep sensors, comforting toys and a gentle bedtime dance." },
    { property: "og:title", content: "CPAP Study — Get Ready with Me" },
    { property: "og:description", content: "Get ready for a CPAP study with a soft nasal mask, sleep sensors, comforting toys and a gentle bedtime dance." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: StudyPage,
});

function StudyPage() { return <StickerDoctor study="cpap" />; }
