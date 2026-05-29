import Image from "next/image";
import { testimonialAvatar } from "@/lib/images";

export default function Testimonial() {
  return (
    <section className="bg-gray-900 py-24">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl text-white leading-snug tracking-wide mb-10">
          &ldquo;THEY HAVE TRANSFORMED OUR DIGITAL PRESENCE. THEIR ATTENTION TO
          DETAIL AND DESIGN-LED APPROACH IS TRULY UNMATCHED IN THE INDUSTRY
          TODAY.&rdquo;
        </blockquote>

        <footer className="flex flex-col items-center gap-3">
          <figure className="w-12 h-12 rounded-full overflow-hidden">
            <Image
              src={testimonialAvatar}
              alt="Client"
              width={48}
              height={48}
              className="object-cover w-full h-full"
            />
          </figure>
          <cite className="not-italic">
            <p className="text-white text-sm font-semibold">James Carter</p>
            <p className="text-gray-400 text-xs">CEO, TechFlow Inc.</p>
          </cite>
        </footer>
      </div>
    </section>
  );
}
