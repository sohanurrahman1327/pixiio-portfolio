import Image from "next/image";
import type { BlogSection } from "@/lib/blog-types";

type Props = {
  sections: BlogSection[];
};

export default function BlogArticleBody({ sections }: Props) {
  return (
    <div className="blog-content">
      {sections.map((section, i) => {
        switch (section.type) {
          case "paragraph":
            return <p key={i}>{section.text}</p>;

          case "heading":
            if (section.level === 2) {
              return (
                <h2 key={i} id={section.id}>
                  {section.text}
                </h2>
              );
            }
            return (
              <h3 key={i} id={section.id}>
                {section.text}
              </h3>
            );

          case "list":
            if (section.ordered) {
              return (
                <ol key={i}>
                  {section.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ol>
              );
            }
            return (
              <ul key={i}>
                {section.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );

          case "image":
            return (
              <figure key={i} className="my-6 w-full">
                <Image
                  src={section.src}
                  alt={section.alt}
                  width={1200}
                  height={675}
                  className="w-full h-auto object-cover !my-0"
                />
                {section.caption && (
                  <figcaption className="text-xs text-gray-400 mt-2.5 text-center">
                    {section.caption}
                  </figcaption>
                )}
              </figure>
            );

          case "callout":
            return (
              <div key={i} className="blog-callout">
                <h4 className="text-[1.075rem] font-semibold text-navy mb-2">
                  {section.title}
                </h4>
                <p className="!mb-0 text-[15px] leading-relaxed">{section.text}</p>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
