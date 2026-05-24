import Image from "next/image";
import { serviceImages } from "@/lib/images";

const services = [
  {
    title: "UI DESIGN",
    description:
      "Crafting intuitive, beautiful interfaces that users love. We turn complex ideas into seamless digital experiences.",
    image: serviceImages.uiDesign,
    bg: "bg-gray-50",
  },
  {
    title: "BRANDING",
    description:
      "Building memorable brand identities that stand out. From logos to full brand guidelines, we define who you are.",
    image: serviceImages.branding,
    bg: "bg-white",
  },
  {
    title: "WEBSITE",
    description:
      "Designing and developing stunning websites that convert. Fast, responsive, and built for performance.",
    image: serviceImages.website,
    bg: "bg-white",
  },
  {
    title: "MARKETING",
    description:
      "Creating compelling marketing assets that drive engagement. Social media, ads, and campaigns that perform.",
    image: serviceImages.marketing,
    bg: "bg-gray-50",
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-display text-5xl md:text-6xl text-center text-gray-900 tracking-wide mb-14">
          WE HELP BUILD UP BRANDS
        </h2>

        <div className="grid md:grid-cols-2 gap-5">
          {services.map((service) => (
            <article
              key={service.title}
              className={`${service.bg} rounded-3xl p-8 border border-gray-100 flex flex-col justify-between min-h-[320px] overflow-hidden`}
            >
              <div>
                <h3 className="font-display text-3xl text-gray-900 tracking-wide mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
                  {service.description}
                </p>
              </div>
              <figure className="mt-6 rounded-2xl overflow-hidden h-48 border border-gray-100 shadow-sm">
                <Image
                  src={service.image}
                  alt={`${service.title} landing page UI design`}
                  width={800}
                  height={500}
                  className="object-cover w-full h-full"
                />
              </figure>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
