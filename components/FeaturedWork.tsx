import Image from "next/image";
import Link from "next/link";
import { featuredWorkImages } from "@/lib/images";

export default function FeaturedWork() {
  return (
    <section id="work" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-display text-5xl md:text-6xl text-gray-900 tracking-wide">
            FEATURED WORK
          </h2>
          <Link
            href="#"
            className="text-xs font-semibold tracking-wider text-gray-900 flex items-center gap-1 hover:gap-2 transition-all"
          >
            VIEW ALL PROJECTS <span>→</span>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {featuredWorkImages.map((project) => (
            <article key={project.title} className="group cursor-pointer">
              <figure className="rounded-3xl overflow-hidden mb-4 aspect-[4/3] border border-gray-100 shadow-sm">
                <Image
                  src={project.image}
                  alt={`${project.subtitle} ${project.title} landing page design`}
                  width={900}
                  height={650}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
              </figure>
              <header className="flex items-center justify-between">
                <div>
                  <span className="font-display text-xl tracking-wider text-gray-900 block">
                    {project.title}
                  </span>
                  <span className="text-xs text-gray-400">{project.subtitle}</span>
                </div>
                <span className="text-gray-400 group-hover:text-gray-900 transition-colors">
                  →
                </span>
              </header>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
