import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import PageShell from "@/components/PageShell";
import StartProjectButton from "@/components/StartProjectButton";
import BestUIWork from "@/components/BestUIWork";
import { featuredWorkImages } from "@/lib/images";

export const metadata: Metadata = {
  title: "Featured Work — Pixiio Design Agency",
  description:
    "Explore our portfolio of branding, UI design, and website projects for modern brands.",
};

export default function WorkPage() {
  return (
    <PageShell>
      <PageHero
        label="PORTFOLIO"
        title="FEATURED WORK"
        description="A selection of branding, UI, and web design projects we've crafted for startups, agencies, and growing brands worldwide."
      />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {featuredWorkImages.map((project) => (
              <Link key={project.slug} href={`/work/${project.slug}`}>
                <article className="group cursor-pointer">
                  <figure className="rounded-3xl overflow-hidden mb-5 aspect-[4/3] border border-gray-100 shadow-sm">
                    <Image
                      src={project.image}
                      alt={`${project.subtitle} — ${project.title}`}
                      width={900}
                      height={650}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  </figure>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="font-display text-2xl tracking-wider text-gray-900 block group-hover:text-primary transition-colors">
                        {project.title}
                      </span>
                      <span className="text-sm text-gray-500">{project.subtitle}</span>
                      <p className="text-xs text-gray-400 mt-2 leading-relaxed max-w-sm">
                        {project.description}
                      </p>
                    </div>
                    <span className="text-gray-300 group-hover:text-primary transition-colors text-xl shrink-0">
                      →
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <BestUIWork />

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl text-gray-900 tracking-wide mb-2">
              HAVE A PROJECT IN MIND?
            </h2>
            <p className="text-gray-500 text-sm">
              Let&apos;s create something remarkable together.
            </p>
          </div>
          <StartProjectButton />
        </div>
      </section>
    </PageShell>
  );
}
