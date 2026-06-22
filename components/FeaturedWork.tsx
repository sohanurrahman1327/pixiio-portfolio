import Link from "next/link";
import WorkImageLens from "@/components/WorkImageLens";
import { featuredWorkImages } from "@/lib/images";

export default function FeaturedWork() {
  return (
    <section id="work" className="bg-surface-muted py-[50px] md:py-[80px] lg:py-30">
      <div className="max-w-7xl mx-auto px-6 flex flex-col gap-[30px] lg:gap-[42px]">
        <div className="flex items-center justify-center md:justify-between">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-gray-900 tracking-wide text-center whitespace-nowrap">
            FEATURED WORK
          </h2>
          <Link
            href="/work"
            className="group hidden md:inline-flex items-center gap-3 bg-primary text-white text-[13px] font-bold tracking-[0.12em] uppercase pl-2 pr-7 py-2 rounded-full hover:bg-primary-dark transition-colors overflow-hidden"
          >
            <span className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white shrink-0 overflow-hidden">
              <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:-translate-x-full">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M4 12L12 4M12 4H6M12 4V10" stroke="#5b5fef" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="absolute inset-0 flex items-center justify-center translate-x-full transition-transform duration-300 ease-in-out group-hover:translate-x-0">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M4 12L12 4M12 4H6M12 4V10" stroke="#5b5fef" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </span>
            VIEW ALL PROJECTS
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-x-[30px] gap-y-[50px]">
          {featuredWorkImages.map((project) => (
            <article key={project.title} className="group">
              <Link href={`/work/${project.slug}`} className="block">
                <figure className="rounded-3xl overflow-hidden mb-4 border border-gray-100 shadow-sm">
                  <WorkImageLens
                    src={project.image}
                    alt={`${project.subtitle} ${project.title} landing page design`}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="h-auto object-contain"
                  />
                </figure>
              </Link>
              <header className="flex items-center justify-between">
                <div>
                  <Link href={`/work/${project.slug}`}>
                    <span className="font-display text-3xl md:text-4xl tracking-wider text-gray-900 block hover:text-primary transition-colors">
                      {project.title}
                    </span>
                  </Link>
                  <span className="text-sm md:text-base text-gray-400">{project.subtitle}</span>
                </div>
                <Link
                  href={`/work/${project.slug}`}
                  aria-label={`View ${project.title} project`}
                  className="group/arrow inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors shrink-0"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M4 12L12 4M12 4H6M12 4V10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </header>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
