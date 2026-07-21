import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import StartProjectButton from "@/components/StartProjectButton";
import { featuredWorkImages } from "@/lib/images";
import { breadcrumbSchema, jsonLdScript } from "@/lib/schema";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = featuredWorkImages.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The project you're looking for doesn't exist.",
    };
  }

  return {
    title: `${project.title}, ${project.subtitle}`,
    description: project.description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.title}, ${project.subtitle}`,
      description: project.description,
      url: `/work/${project.slug}`,
      images: [{ url: project.image }],
      type: "article",
    },
  };
}

export async function generateStaticParams() {
  return featuredWorkImages.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = featuredWorkImages.find((p) => p.slug === slug);

  if (!project) {
    return (
      <PageShell>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-4xl text-gray-900 mb-4">
              Project Not Found
            </h1>
            <p className="text-gray-500 mb-8">
              The project you're looking for doesn't exist.
            </p>
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              Back to Work <span>→</span>
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  const projectIndex = featuredWorkImages.findIndex((p) => p.slug === slug);
  const nextProject =
    projectIndex < featuredWorkImages.length - 1
      ? featuredWorkImages[projectIndex + 1]
      : featuredWorkImages[0];

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Work", path: "/work" },
            { name: project.title, path: `/work/${project.slug}` },
          ])
        )}
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-8 text-sm"
          >
            <span>←</span> Back to Work
          </Link>

          <div className="mb-12">
            <span className="inline-block text-xs font-semibold tracking-wider text-primary uppercase mb-4">
              {project.category}
            </span>
            <h1 className="font-display text-5xl md:text-6xl text-gray-900 tracking-wide mb-4">
              {project.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl">{project.subtitle}</p>
          </div>

          <figure className="rounded-3xl overflow-hidden aspect-[16/9] border border-gray-100 shadow-lg">
            <Image
              src={project.image}
              alt={`${project.subtitle}, ${project.title}`}
              width={1400}
              height={788}
              className="object-cover w-full h-full"
              priority
            />
          </figure>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div>
              <h3 className="font-display text-sm tracking-wider text-gray-500 uppercase mb-3">
                Category
              </h3>
              <p className="text-lg text-gray-900 font-semibold">
                {project.category}
              </p>
            </div>
            <div>
              <h3 className="font-display text-sm tracking-wider text-gray-500 uppercase mb-3">
                Client
              </h3>
              <p className="text-lg text-gray-900 font-semibold">
                {project.subtitle}
              </p>
            </div>
            <div>
              <h3 className="font-display text-sm tracking-wider text-gray-500 uppercase mb-3">
                Year
              </h3>
              <p className="text-lg text-gray-900 font-semibold">2025</p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none mb-16">
            <h2 className="font-display text-3xl text-gray-900 tracking-wide mb-6">
              Project Overview
            </h2>
            <p className="text-gray-600 leading-relaxed text-base">
              {project.fullDescription}
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <h3 className="font-display text-2xl text-gray-900 tracking-wide mb-4">
              Key Highlights
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">✦</span>
                <span className="text-gray-600">
                  Comprehensive design strategy tailored to client needs
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">✦</span>
                <span className="text-gray-600">
                  User-centered approach with extensive research
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">✦</span>
                <span className="text-gray-600">
                  Responsive design optimized for all devices
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">✦</span>
                <span className="text-gray-600">
                  Delivered on time with exceptional attention to detail
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Next Project */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <p className="text-sm font-semibold tracking-wider text-gray-500 uppercase">
              Next Project
            </p>
          </div>

          <Link href={`/work/${nextProject.slug}`} className="group block">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <figure className="rounded-2xl overflow-hidden aspect-[4/3] border border-gray-100">
                <Image
                  src={nextProject.image}
                  alt={`${nextProject.subtitle}, ${nextProject.title}`}
                  width={600}
                  height={450}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
              </figure>
              <div>
                <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                  {nextProject.category}
                </span>
                <h3 className="font-display text-4xl text-gray-900 tracking-wide mb-2 group-hover:text-primary transition-colors">
                  {nextProject.title}
                </h3>
                <p className="text-gray-600 mb-6">{nextProject.subtitle}</p>
                <span className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                  View Project <span>→</span>
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-background py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl text-gray-900 tracking-wide mb-2">
              READY TO START YOUR PROJECT?
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
