"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What services do you offer?",
    answer:
      "We offer UI/UX design, branding, website design, and digital marketing services tailored to help your brand stand out.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Project timelines vary based on scope. A landing page takes 5 days, a full website 10–14 days, and brand identity projects 2–3 weeks.",
  },
  {
    question: "Do you offer revisions?",
    answer:
      "Yes! Basic plans include 2 revisions, Pro plans include unlimited revisions, and Elite plans include dedicated designer support.",
  },
  {
    question: "What is your design process?",
    answer:
      "We follow a three-phase process: Research & Discovery, Design & Prototype, and Delivery & Launch — ensuring quality at every step.",
  },
  {
    question: "How do I get started?",
    answer:
      "Click 'Start a Project' and fill out our brief. We'll schedule a discovery call within 24 hours to discuss your goals.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-gray-50 py-20">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-display text-5xl md:text-6xl text-center text-gray-900 tracking-wide mb-14">
          QUICK HELP
        </h2>

        <div className="divide-y divide-gray-200">
          {faqs.map((faq, i) => (
            <article key={faq.question}>
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left"
              >
                <span className="text-sm font-medium text-gray-900">
                  {faq.question}
                </span>
                <span className="text-gray-400 text-xl ml-4 flex-shrink-0">
                  {openIndex === i ? "−" : "+"}
                </span>
              </button>
              {openIndex === i && (
                <p className="pb-5 text-sm text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
