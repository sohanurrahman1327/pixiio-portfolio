import Link from "next/link";

export default function CTABanner() {
  return (
    <section id="contact" className="bg-primary py-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-white tracking-wide mb-8">
          LET&apos;S BUILD YOUR DESIGN
        </h2>
        <Link
          href="#"
          className="inline-block bg-white text-primary text-xs font-semibold tracking-wider px-10 py-4 rounded-full hover:bg-gray-100 transition-colors"
        >
          JOIN NOW
        </Link>
      </div>
    </section>
  );
}
