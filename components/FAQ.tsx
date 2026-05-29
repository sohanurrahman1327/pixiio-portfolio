"use client";

import { useState } from "react";
import { faqs } from "@/lib/content";

export default function FAQ({ showTitle = true }: { showTitle?: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-gray-50 py-20">
      <div className="max-w-3xl mx-auto px-6">
        {showTitle && (
          <h2 className="font-display text-5xl md:text-6xl text-center text-gray-900 tracking-wide mb-14">
            QUICK HELP
          </h2>
        )}

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
