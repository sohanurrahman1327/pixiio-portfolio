"use client";

import { useState } from "react";
import WhatsappButton from "@/components/WhatsappButton";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-primary/20 bg-primary/5 p-10 text-center">
        <p className="font-display text-3xl text-gray-900 tracking-wide mb-3">
          MESSAGE SENT!
        </p>
        <p className="text-gray-600 text-sm">
          Thanks for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <label className="block">
          <span className="text-xs font-semibold tracking-wider text-gray-700 mb-2 block">
            YOUR NAME
          </span>
          <input
            type="text"
            name="name"
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
            placeholder="John Doe"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold tracking-wider text-gray-700 mb-2 block">
            EMAIL
          </span>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
            placeholder="you@company.com"
          />
        </label>
      </div>
      <label className="block">
        <span className="text-xs font-semibold tracking-wider text-gray-700 mb-2 block">
          PROJECT TYPE
        </span>
        <select
          name="project"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors bg-white"
        >
          <option>UI / UX Design</option>
          <option>Branding & Logo</option>
          <option>Website Design</option>
          <option>Full Brand + Website</option>
          <option>Marketing Assets</option>
          <option>Other</option>
        </select>
      </label>
      <label className="block">
        <span className="text-xs font-semibold tracking-wider text-gray-700 mb-2 block">
          BUDGET RANGE
        </span>
        <select
          name="budget"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors bg-white"
        >
          <option>Under $200</option>
          <option>$200 – $500</option>
          <option>$500 – $1,000</option>
          <option>$1,000+</option>
          <option>Not sure yet</option>
        </select>
      </label>
      <label className="block">
        <span className="text-xs font-semibold tracking-wider text-gray-700 mb-2 block">
          PROJECT DETAILS
        </span>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
          placeholder="Tell us about your project, goals, and timeline..."
        />
      </label>
      <button
        type="submit"
        className="w-full bg-primary text-white text-xs font-semibold tracking-wider py-4 rounded-full hover:bg-primary-dark transition-colors"
      >
        SEND MESSAGE
      </button>
      <p className="text-center text-xs text-gray-400">or reach us instantly</p>
      <WhatsappButton className="w-full justify-center py-3" />
    </form>
  );
}
