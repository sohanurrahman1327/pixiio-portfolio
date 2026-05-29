import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PageShell from "@/components/PageShell";
import DesignProcess from "@/components/DesignProcess";
import StartProjectButton from "@/components/StartProjectButton";

const timeline = [
  {
    phase: "Discovery",
    duration: "Day 1–2",
    tasks: [
      "Client brief & goals review",
      "Competitor & inspiration research",
      "Audience & positioning workshop",
    ],
  },
  {
    phase: "Design",
    duration: "Day 3–8",
    tasks: [
      "Logo design in Illustrator",
      "Paper wireframes & user flows",
      "High-fidelity Figma UI design",
    ],
  },
  {
    phase: "Review",
    duration: "Day 9–10",
    tasks: [
      "Client presentation & feedback",
      "Revision rounds per package",
      "Final design sign-off",
    ],
  },
  {
    phase: "Launch",
    duration: "Day 11–14",
    tasks: [
      "WordPress or Framer development",
      "Responsive QA & performance check",
      "Go live + handoff documentation",
    ],
  },
];

export const metadata: Metadata = {
  title: "Design Process — Pixiio Design Agency",
  description:
    "Our 4-step design process from Illustrator logo to live WordPress or Framer website.",
};

export default function ProcessPage() {
  return (
    <PageShell>
      <PageHero
        label="HOW WE WORK"
        title="DESIGN PROCESS"
        description="A transparent, proven workflow — from first sketch on paper to a polished live website your audience will love."
      />

      <DesignProcess />

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display text-4xl text-center text-gray-900 tracking-wide mb-12">
            PROJECT TIMELINE
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {timeline.map((item) => (
              <article
                key={item.phase}
                className="bg-white rounded-3xl p-6 border border-gray-100"
              >
                <p className="text-[10px] font-bold tracking-widest text-primary mb-2">
                  {item.duration}
                </p>
                <h3 className="font-display text-2xl text-gray-900 tracking-wide mb-4">
                  {item.phase.toUpperCase()}
                </h3>
                <ul className="space-y-2">
                  {item.tasks.map((task) => (
                    <li key={task} className="text-xs text-gray-500 flex gap-2">
                      <span className="text-primary shrink-0">•</span>
                      {task}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm mb-6">
            Ready to start your project?
          </p>
          <StartProjectButton />
        </div>
      </section>
    </PageShell>
  );
}
