const reasons = [
  {
    icon: "✦",
    title: "DESIGN-FIRST APPROACH",
    description:
      "Every project starts with design. We believe great design drives business results.",
  },
  {
    icon: "◎",
    title: "EXPERT TEAM",
    description:
      "Our team of seasoned designers and developers deliver world-class work.",
  },
  {
    icon: "◈",
    title: "FAST DELIVERY",
    description:
      "We move quickly without compromising quality. Your timeline is our priority.",
  },
  {
    icon: "◇",
    title: "DEDICATED SUPPORT",
    description:
      "We stay with you beyond launch. Ongoing support and iteration included.",
  },
  {
    icon: "◆",
    title: "PROVEN RESULTS",
    description:
      "Our work speaks for itself. Brands we've helped have seen measurable growth.",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-display text-5xl md:text-6xl text-center text-gray-900 tracking-wide mb-14">
          WHY CHOOSE US
        </h2>

        <div className="grid md:grid-cols-3 gap-5 mb-5">
          {reasons.slice(0, 3).map((reason) => (
            <article
              key={reason.title}
              className="bg-white rounded-3xl p-8 border border-gray-100"
            >
              <span className="text-primary text-2xl mb-4 block">{reason.icon}</span>
              <h3 className="font-display text-2xl text-gray-900 tracking-wide mb-3">
                {reason.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {reason.description}
              </p>
            </article>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {reasons.slice(3).map((reason) => (
            <article
              key={reason.title}
              className="bg-white rounded-3xl p-8 border border-gray-100"
            >
              <span className="text-primary text-2xl mb-4 block">{reason.icon}</span>
              <h3 className="font-display text-2xl text-gray-900 tracking-wide mb-3">
                {reason.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {reason.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
