import Image from "next/image";
import type { BlogSection } from "@/lib/blog-types";

type Props = {
  sections: BlogSection[];
};

export default function BlogArticleBody({ sections }: Props) {
  return (
    <div className="space-y-5">
      {sections.map((section, i) => {
        switch (section.type) {
          case "paragraph":
            return (
              <p
                key={i}
                className="text-[#334155] text-[17px] leading-[1.85]"
              >
                {section.text}
              </p>
            );

          case "heading":
            if (section.level === 2) {
              return (
                <h2
                  key={i}
                  id={section.id}
                  className="text-2xl md:text-[1.75rem] font-bold text-navy leading-tight pt-10 pb-2 scroll-mt-28 border-b border-gray-100"
                >
                  {section.text}
                </h2>
              );
            }
            return (
              <h3
                key={i}
                id={section.id}
                className="text-lg md:text-xl font-bold text-navy leading-snug pt-6 scroll-mt-28"
              >
                {section.text}
              </h3>
            );

          case "list":
            if (section.ordered) {
              return (
                <ol
                  key={i}
                  className="list-decimal list-outside ml-5 space-y-2.5 text-[#334155] text-[17px] leading-[1.75]"
                >
                  {section.items.map((item, j) => (
                    <li key={j} className="pl-1">
                      {item}
                    </li>
                  ))}
                </ol>
              );
            }
            return (
              <ul
                key={i}
                className="space-y-2.5 text-[#334155] text-[17px] leading-[1.75]"
              >
                {section.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <span className="text-primary mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );

          case "image":
            return (
              <figure key={i} className="my-8 w-full">
                <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm">
                  <Image
                    src={section.src}
                    alt={section.alt}
                    width={1200}
                    height={675}
                    className="w-full h-auto object-cover"
                  />
                </div>
                {section.caption && (
                  <figcaption className="text-xs text-gray-400 mt-2.5 text-center">
                    {section.caption}
                  </figcaption>
                )}
              </figure>
            );

          case "callout":
            return (
              <div
                key={i}
                className="rounded-xl bg-[#f8f9ff] border border-[#e8ebfa] p-6 md:p-8 my-6"
              >
                <h4 className="text-lg font-bold text-navy mb-2">
                  {section.title}
                </h4>
                <p className="text-[#334155] text-[15px] leading-relaxed">
                  {section.text}
                </p>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
