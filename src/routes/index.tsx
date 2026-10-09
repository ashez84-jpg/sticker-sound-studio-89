import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Moon, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import sam from "@/assets/boy-sports-plush.png";
import mia from "@/assets/girl-hearts-plush.png";
import mask from "@/assets/sticker-cpap-mask.png";
import teddy from "@/assets/sticker-teddy.png";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Choose Your Study — Get Ready with Me Sleep Study" },
    { name: "description", content: "Choose Sleep Study or CPAP Study and get ready with Sam and Mia in a playful preparation game." },
    { property: "og:title", content: "Choose Your Study — Get Ready with Me Sleep Study" },
    { property: "og:description", content: "Two gentle ways to get ready: Sleep Study and CPAP Study, with Sam and Mia." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: StartScreen,
});

function StartScreen() {
  const { t } = useLang();
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8 px-5 py-8 sm:py-12">
      <header className="max-w-2xl text-center">
        <span aria-hidden className="mb-3 inline-flex size-14 items-center justify-center rounded-full bg-sunshine"><Moon className="size-7" /></span>
        <h1 className="text-3xl font-extrabold sm:text-5xl">{t("Get Ready with Me Sleep Study")}</h1>
        <p className="mt-4 font-display text-xl font-bold text-muted-foreground">{t("Which study are you getting ready for?")}</p>
      </header>
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
        <Button asChild variant="ghost" className="group relative h-auto flex-col gap-0 overflow-hidden rounded-2xl border-2 border-border bg-card p-0 shadow-[var(--shadow-toy)] transition-transform hover:-translate-y-1 hover:bg-card focus-visible:ring-4">
          <Link to="/sleep-study" aria-label={t("Sleep Study")}>
            <div className="relative h-56 w-full overflow-hidden bg-sky sm:h-72">
              <img src={sam} alt="Sam in sports pajamas" width={1264} height={848} className="absolute inset-0 h-full w-full object-cover" />
              <img src={teddy} alt="" aria-hidden width={1024} height={1024} className="absolute bottom-4 right-4 size-20 object-contain" />
            </div>
            <span className="flex w-full items-center justify-between gap-3 p-5 font-display text-2xl font-extrabold"><span className="flex items-center gap-2"><Moon className="size-5" />{t("Sleep Study")}</span><ArrowRight /></span>
          </Link>
        </Button>
        <Button asChild variant="ghost" className="group relative h-auto flex-col gap-0 overflow-hidden rounded-2xl border-2 border-border bg-card p-0 shadow-[var(--shadow-toy)] transition-transform hover:-translate-y-1 hover:bg-card focus-visible:ring-4">
          <Link to="/cpap-study" aria-label={t("CPAP Study")}>
            <div className="relative h-56 w-full overflow-hidden bg-bubblegum sm:h-72">
              <img src={mia} alt="Mia in heart pajamas" width={1264} height={848} className="absolute inset-0 h-full w-full object-cover" />
              <img src={mask} alt="" aria-hidden width={1024} height={1024} className="absolute bottom-4 right-4 size-24 object-contain" />
            </div>
            <span className="flex w-full items-center justify-between gap-3 p-5 font-display text-2xl font-extrabold"><span className="flex items-center gap-2"><Heart className="size-5" />{t("CPAP Study")}</span><ArrowRight /></span>
          </Link>
        </Button>
      </div>
      <Button asChild variant="link" className="font-bold"><Link to="/parents">{t("🌙 Parent's view")}</Link></Button>
    </main>
  );
}
