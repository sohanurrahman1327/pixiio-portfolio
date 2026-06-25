"use client";

import { useState } from "react";
import WhatsappButton from "@/components/WhatsappButton";
import { mailtoContactInquiry } from "@/lib/mailto";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "mailto" | "error">("idle");
  const [emailError, setEmailError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const emailInput = form.elements.namedItem("email") as HTMLInputElement;
    if (!emailInput.value.toLowerCase().endsWith("@gmail.com")) {
      setEmailError("Only @gmail.com addresses are accepted.");
      return;
    }
    setEmailError("");

    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const project = (form.elements.namedItem("project") as HTMLSelectElement).value;
    const budget = (form.elements.namedItem("budget") as HTMLSelectElement).value;
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;

    const payload = { name, email: emailInput.value, project, budget, message };
    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        return;
      }
      if (data.fallback === "mailto") {
        window.location.href = mailtoContactInquiry(payload);
        setStatus("mailto");
        return;
      }
      setStatus("error");
      setSubmitError(data.error || "Could not send message. Please try again.");
    } catch {
      window.location.href = mailtoContactInquiry(payload);
      setStatus("mailto");
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "success") {
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

  if (status === "mailto") {
    return (
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-10 text-center">
        <p className="font-display text-2xl text-gray-900 tracking-wide mb-3">
          OPEN YOUR EMAIL APP
        </p>
        <p className="text-gray-600 text-sm">
          Your message is ready — click <strong>Send</strong> in your email app to deliver it to us.
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
            onChange={() => setEmailError("")}
            className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors ${emailError ? "border-red-400" : "border-gray-200"}`}
            placeholder="you@gmail.com"
          />
          {emailError && (
            <p className="text-red-500 text-xs mt-1">{emailError}</p>
          )}
        </label>
      </div>
      <label className="block">
        <span className="text-xs font-semibold tracking-wider text-gray-700 mb-2 block">
          PROJECT TYPE
        </span>
        <select
          name="project"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors bg-surface-elevated text-gray-900"
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
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors bg-surface-elevated text-gray-900"
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
      {submitError && (
        <p className="text-red-500 text-xs text-center">{submitError}</p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-primary text-white text-xs font-semibold tracking-wider py-4 rounded-full hover:bg-primary-dark transition-colors disabled:opacity-60"
      >
        {submitting ? "SENDING…" : "SEND MESSAGE"}
      </button>
      <p className="text-center text-xs text-gray-400">or reach us instantly</p>
      <WhatsappButton className="w-full justify-center py-3" />
    </form>
  );
}
