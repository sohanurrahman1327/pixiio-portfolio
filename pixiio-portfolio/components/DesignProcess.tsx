import Image from "next/image";
import { designProcessSteps } from "@/lib/images";

export default function DesignProcess() {
  return (
    <section id="process" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-6">
          <p className="text-[10px] font-bold tracking-[0.25em] text-primary mb-3">
            FROM SKETCH TO LIVE
          </p>
          <h2 className="font-display text-5xl md:text-6xl text-gray-900 tracking-wide mb-4">
            DESIGN PROCESS
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            A proven 4-step workflow — from logo creation in Illustrator to a
            fully live website on WordPress or Framer.
          </p>
        </div>

        <div className="hidden lg:block relative mb-8">
          <div className="absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gray-200" />
          <div className="grid grid-cols-4 gap-0">
            {designProcessSteps.map((step) => (
              <div key={step.step} className="flex justify-center">
                <span className="relative z-10 w-16 h-16 rounded-full bg-primary text-white font-display text-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                  {step.step}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {designProcessSteps.map((step) => (
            <article
              key={step.step}
              className="group rounded-3xl overflow-hidden border border-gray-100 bg-gray-50 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              <figure className="relative overflow-hidden aspect-[4/3]">
                <Image
                  src={step.image}
                  alt={step.alt}
                  width={800}
                  height={600}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 lg:hidden w-10 h-10 rounded-full bg-primary text-white font-display text-lg flex items-center justify-center">
                  {step.step}
                </span>
              </figure>
              <div className="p-6">
                <h3 className="font-display text-xl text-gray-900 tracking-wide mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {step.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
