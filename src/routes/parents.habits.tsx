import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/parents/habits")({
  head: () => ({
    meta: [
      { title: "Good Sleep Habits for Children and Teens | Sticker Doctor" },
      {
        name: "description",
        content:
          "Why sleep matters for growing kids, the healthy bedtime habits to build, what to avoid, and how many hours your child needs at every age.",
      },
      { property: "og:title", content: "Good Sleep Habits for Children and Teens" },
      {
        property: "og:description",
        content: "Healthy bedtime habits, what to avoid, and how much sleep kids need at every age.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SleepHabits,
});

const SHOULD = [
  {
    id: "routine",
    emoji: "📖",
    title: "Keep the same relaxing bedtime routine",
    body: "20 to 30 minutes every night — reading a book or talking about their day works great.",
  },
  {
    id: "schedule",
    emoji: "⏰",
    title: "Go to bed and wake up at the same time",
    body: "Every day — weekdays and weekends alike.",
  },
  {
    id: "bedroom",
    emoji: "🌙",
    title: "Make the bedroom comfortable, quiet, and dark",
    body: "A cool room helps too — kids sleep better when it isn't warm.",
  },
  {
    id: "exercise",
    emoji: "⚽",
    title: "Exercise every day",
    body: "Active days lead to sleepy nights.",
  },
];

const SHOULD_NOT = [
  {
    id: "caffeine",
    emoji: "🥤",
    title: "No caffeine 3 to 4 hours before bedtime",
    body: "Watch out for soda, tea, and chocolate too.",
  },
  {
    id: "tv",
    emoji: "📺",
    title: "No TV in the bedroom",
    body: "Kids can easily develop the bad habit of \"needing\" the TV to fall asleep.",
  },
  {
    id: "screens",
    emoji: "🎮",
    title: "No video games or computer before bed",
    body: "Screens wake the brain up right when it should be winding down.",
  },
  {
    id: "hungry",
    emoji: "🍎",
    title: "Don't send them to bed hungry",
    body: "A light snack before bed is OK.",
  },
  {
    id: "timeout",
    emoji: "🚫",
    title: "Don't use the bedroom for time-out or punishments",
    body: "You want your child to think of their bedroom as a good place, not a bad one.",
  },
];

const SLEEP_NEEDS = [
  { id: "infant", label: "Infants and toddlers", hours: "13 to 14 hours, including naps" },
  { id: "preschool", label: "Ages 3 to 5", hours: "12 to 13 hours, including naps" },
  { id: "school", label: "Ages 6 to 12", hours: "9 to 10 hours, no naps" },
  { id: "teen", label: "Ages 13 to 18", hours: "8 to 10 hours, no naps" },
];

function SleepHabits() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-5 px-4 py-6">
      <header className="text-center">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">For grown-ups</p>
        <h1 className="mt-1 text-3xl font-extrabold text-foreground sm:text-4xl">
          Good Sleep Habits <span aria-hidden>🌟</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Simple habits that help children and teens get the rest they need to grow.
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <Link
            to="/parents"
            className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-[var(--shadow-sticker)] transition-transform active:scale-95"
          >
            ← Parent's view
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-muted px-4 py-2 text-sm font-bold text-muted-foreground transition-transform active:scale-95"
          >
            🧸 Back to the game
          </Link>
        </div>
      </header>

      <section aria-label="Why sleep matters" className="toy-card p-4 sm:p-5">
        <h2 className="text-lg font-bold text-foreground">💙 Why sleep matters</h2>
        <div className="mt-2 flex flex-col gap-2 text-sm font-semibold text-foreground/80">
          <p>
            Sleep is just as important as food and water for a child to have the energy it takes to grow up strong
            and healthy.
          </p>
          <p>
            Not enough sleep increases hormones that make us crave food high in fat, sugar, and salt — which can
            lead to a greater risk of obesity. Kids who don't get enough sleep also have trouble paying attention,
            learning, and coping with stress.
          </p>
        </div>
      </section>

      <section aria-label="Habits your child should have" className="toy-card p-4 sm:p-5">
        <h2 className="text-lg font-bold text-foreground">✅ Good habits to build</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {SHOULD.map((habit) => (
            <li key={habit.id} className="rounded-2xl bg-mint px-3 py-2.5">
              <p className="text-sm font-bold text-foreground">
                <span aria-hidden className="mr-1.5">{habit.emoji}</span>
                {habit.title}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-muted-foreground">{habit.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Habits to avoid" className="toy-card p-4 sm:p-5">
        <h2 className="text-lg font-bold text-foreground">🚫 Habits to avoid</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {SHOULD_NOT.map((habit) => (
            <li key={habit.id} className="rounded-2xl bg-muted px-3 py-2.5">
              <p className="text-sm font-bold text-foreground">
                <span aria-hidden className="mr-1.5">{habit.emoji}</span>
                {habit.title}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-muted-foreground">{habit.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="How much sleep does a child need" className="toy-card p-4 sm:p-5">
        <h2 className="text-lg font-bold text-foreground">⏳ How much sleep does a child need?</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {SLEEP_NEEDS.map((need) => (
            <li
              key={need.id}
              className="flex items-center justify-between gap-3 rounded-2xl bg-muted px-3 py-2.5"
            >
              <span className="text-sm font-bold text-foreground">{need.label}</span>
              <span className="text-right text-xs font-extrabold text-primary">{need.hours}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
