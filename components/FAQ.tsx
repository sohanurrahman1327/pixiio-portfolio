"use client";

import { useState } from "react";
import Link from "next/link";
import { faqs } from "@/lib/content";

export default function FAQ({ showTitle = true }: { showTitle?: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-background py-[50px] md:py-[80px] lg:py-30">
      <div className="max-w-7xl mx-auto px-6 flex flex-col gap-[50px] md:gap-[80px]">
        {showTitle && (
          <div className="text-center">
            <p className="text-primary text-sm font-bold tracking-widest uppercase mb-3">
              FAQ
            </p>
            <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-tight tracking-wide text-navy mb-4">
              QUICK HELP
            </h2>
            <p className="text-gray-500 text-base max-w-2xl mx-auto">
              Find quick answers to common questions. Still need help? We're here for you.
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-[40%_60%] gap-12 items-start">
          {/* Left: Contact Section (40%) */}
          <div className="hidden lg:flex flex-col gap-6">
            {/* Main CTA Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-primary/10 dark:to-surface-elevated rounded-3xl p-8 border border-transparent dark:border-border-subtle">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M8 21h8c3 0 5-1 5-4V7c0-3-2-4-5-4H8c-3 0-5 1-5 4v10c0 3 2 4 5 4Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 11v-2M10 9h4" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="font-display text-xl leading-tight text-navy font-bold">
                    STILL HAVE
                  </p>
                  <p className="font-display text-xl leading-tight text-primary font-bold">
                    QUESTIONS?
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-400 leading-relaxed mb-6 font-medium">
                Can't find the answer you're looking for? Let's talk. We're ready to help!
              </p>

              {/* Contact Options */}
              <div className="space-y-3">
                {/* Ask Your Question */}
                <Link
                  href="/contact"
                  className="flex items-center justify-between p-4 bg-surface-elevated rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 14c3.3 0 6-2.7 6-6s-2.7-6-6-6-6 2.7-6 6 2.7 6 6 6Z" stroke="white" strokeWidth="1.2" strokeMiterlimit="10"/>
                        <path d="M8 5v2.5M8 10h.01" stroke="white" strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-navy">Ask Your Question</p>
                      <p className="text-xs text-gray-500">Get a response within 24 hours</p>
                    </div>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-gray-400 group-hover:text-primary transition-colors">
                    <path d="M6.75 13.5L11.25 9L6.75 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>

                {/* Chat on WhatsApp */}
                <Link
                  href="https://wa.me/1234567890"
                  target="_blank"
                  className="flex items-center justify-between p-4 bg-surface-elevated rounded-xl border border-gray-200 hover:border-green-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                        <path d="M13.6 2.3A7.9 7.9 0 0 0 8 0C3.6 0 0 3.6 0 8c0 1.4.4 2.8 1 4L0 16l4.2-1.1c1.2.6 2.5 1 3.8 1h.4c4.3 0 7.9-3.6 7.9-7.9 0-2.1-.8-4.1-2.3-5.7Z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-navy">Chat on WhatsApp</p>
                      <p className="text-xs text-gray-500">Quick support on WhatsApp</p>
                    </div>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-gray-400 group-hover:text-green-500 transition-colors">
                    <path d="M6.75 13.5L11.25 9L6.75 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>

                {/* Prefer email */}
                <Link
                  href="mailto:hello@pixiio.com"
                  className="flex items-center justify-between p-4 bg-surface-elevated rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2.5 3h11c.8 0 1.5.7 1.5 1.5v7c0 .8-.7 1.5-1.5 1.5h-11c-.8 0-1.5-.7-1.5-1.5v-7c0-.8.7-1.5 1.5-1.5Z" stroke="#6366f1" strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M13.5 4.5 8 8.5 2.5 4.5" stroke="#6366f1" strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-navy">Prefer email?</p>
                      <p className="text-xs text-gray-500">Send us an email and we'll get back to you</p>
                    </div>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-gray-400 group-hover:text-primary transition-colors">
                    <path d="M6.75 13.5L11.25 9L6.75 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-primary/10 dark:to-surface-elevated rounded-3xl p-6 border border-transparent dark:border-border-subtle">
              <div className="flex items-start gap-3">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-primary flex-shrink-0 mt-0.5">
                  <path d="M10 1.5L12.5 7.5h6.25L14.375 11.25l2.5 5.833L10 13.333l-6.875 3.75 2.5-5.833L1.25 7.5h6.25L10 1.5Z" fill="currentColor"/>
                </svg>
                <div>
                  <h4 className="font-bold text-sm text-navy mb-1">
                    Trusted by clients worldwide
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    We value your time and privacy. Expect quick and helpful support.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: FAQ Items (60%) */}
          <div className="border border-gray-200 rounded-3xl p-8 bg-surface-elevated">
            <div className="divide-y divide-gray-200">
              {faqs.map((faq, i) => (
                <article key={faq.question}>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full flex items-center justify-between py-6 text-left group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-primary font-bold text-sm min-w-fit">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-base font-bold text-navy group-hover:text-primary transition-colors">
                        {faq.question}
                      </span>
                    </div>
                    <span className="text-primary text-2xl ml-4 flex-shrink-0 transition-transform duration-300 font-light">
                      {openIndex === i ? "−" : "+"}
                    </span>
                  </button>
                  {openIndex === i && (
                    <p className="pb-6 text-sm text-gray-600 leading-relaxed pl-12">
                      {faq.answer}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
