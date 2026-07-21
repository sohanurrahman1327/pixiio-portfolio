"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import WhatsappButton from "@/components/WhatsappButton";
import { mailtoContactInquiry } from "@/lib/mailto";
import { pricingPackageNames } from "@/lib/content";
import { compressImageToLimit, compressImageToPreviewDataUrl } from "@/lib/image-compress";

const NO_PACKAGE = "General Inquiry (No Package)";
const CUSTOM_PACKAGE = "Custom Package";
const packageOptions = [NO_PACKAGE, ...pricingPackageNames, CUSTOM_PACKAGE];

const MAX_IMAGE_SELECT_BYTES = 10 * 1024 * 1024; // 10 MB — advertised limit, enforced at file selection
const MAX_IMAGE_UPLOAD_BYTES = 3.5 * 1024 * 1024; // target after client-side compression, emailed as attachment
const MAX_IMAGE_PREVIEW_BYTES = 120 * 1024; // small thumbnail stored inline so the admin dashboard can show it
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function toJpegFilename(originalName: string) {
  const base = originalName.replace(/\.[^/.]+$/, "").trim() || "reference-image";
  return `${base}.jpg`;
}

function ContactFormFields() {
  const searchParams = useSearchParams();
  const packageParam = searchParams.get("package");
  const priceParam = searchParams.get("price");
  const pagesParam = searchParams.get("pages");
  const fromPricing = Boolean(packageParam);
  const initialPackage = packageParam && packageOptions.includes(packageParam) ? packageParam : packageParam ? CUSTOM_PACKAGE : NO_PACKAGE;

  const [status, setStatus] = useState<"idle" | "success" | "mailto" | "error">("idle");
  const [emailError, setEmailError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(initialPackage);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageError("Please upload a JPG, PNG, or WEBP image.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_SELECT_BYTES) {
      setImageError("Image must be 10MB or smaller.");
      e.target.value = "";
      return;
    }

    setImageError("");
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function removeImage() {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    setImageError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

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
    const projectEl = form.elements.namedItem("project") as HTMLSelectElement | null;
    const budgetEl = form.elements.namedItem("budget") as HTMLSelectElement | null;
    const project = projectEl?.value || (fromPricing ? "Package Purchase" : "Not specified");
    const budget =
      budgetEl?.value || (fromPricing ? priceParam || "N/A (Package Purchase)" : "Not specified");
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;
    const packageLabel =
      selectedPackage !== NO_PACKAGE && priceParam
        ? `${selectedPackage} (${priceParam}${pagesParam ? `, ${pagesParam}` : ""})`
        : selectedPackage;

    setSubmitting(true);
    setSubmitError("");

    const mailtoPayload = {
      name,
      email: emailInput.value,
      project,
      budget,
      package: packageLabel,
      message,
      hasReferenceImage: Boolean(imageFile),
    };

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", emailInput.value);
      formData.append("project", project);
      formData.append("budget", budget);
      formData.append("package", packageLabel);
      formData.append("message", message);
      formData.append("fromPricing", String(fromPricing));

      if (imageFile) {
        setCompressing(true);
        try {
          const [compressed, previewDataUrl] = await Promise.all([
            compressImageToLimit(imageFile, MAX_IMAGE_UPLOAD_BYTES),
            compressImageToPreviewDataUrl(imageFile, MAX_IMAGE_PREVIEW_BYTES),
          ]);
          formData.append("referenceImage", compressed, toJpegFilename(imageFile.name));
          formData.append("referenceImagePreview", previewDataUrl);
        } finally {
          setCompressing(false);
        }
      }

      const res = await fetch("/api/contact", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        return;
      }
      if (data.fallback === "mailto") {
        window.location.href = mailtoContactInquiry(mailtoPayload);
        setStatus("mailto");
        return;
      }
      setStatus("error");
      setSubmitError(data.error || "Could not send message. Please try again.");
    } catch {
      window.location.href = mailtoContactInquiry(mailtoPayload);
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
          Your message is ready, click <strong>Send</strong> in your email app to deliver it to us.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {packageParam && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
          <p className="text-xs text-gray-600">
            You&apos;re requesting the <strong className="text-gray-900">{selectedPackage}</strong>
            {priceParam ? <> at <strong className="text-gray-900">{priceParam}</strong></> : null}
            {pagesParam ? <> for the <strong className="text-gray-900">{pagesParam}</strong> tier</> : null}. Just confirm your details below, no need to fill out project type or budget.
          </p>
        </div>
      )}
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
          SELECTED PACKAGE
        </span>
        <select
          name="package"
          value={selectedPackage}
          onChange={(e) => setSelectedPackage(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors bg-surface-elevated text-gray-900"
        >
          {packageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      {!fromPricing && (
        <>
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
        </>
      )}
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
      <div className="block">
        <span className="text-xs font-semibold tracking-wider text-gray-700 mb-2 block">
          REFERENCE IMAGE <span className="font-normal text-gray-400 tracking-normal">(optional, max 10MB)</span>
        </span>
        {imagePreview ? (
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagePreview} alt="Reference preview" className="w-12 h-12 rounded-lg object-cover shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-900 truncate">{imageFile?.name}</p>
              <p className="text-xs text-gray-400">{imageFile ? formatBytes(imageFile.size) : ""}</p>
            </div>
            <button
              type="button"
              onClick={removeImage}
              className="text-xs font-semibold text-gray-500 hover:text-red-500 transition-colors shrink-0"
            >
              REMOVE
            </button>
          </div>
        ) : (
          <label className="flex items-center justify-center rounded-xl border border-dashed border-gray-300 px-4 py-6 text-center cursor-pointer hover:border-primary transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="sr-only"
            />
            <span className="text-sm text-gray-500">
              Click to upload a reference image <span className="text-gray-400">(JPG, PNG, WEBP)</span>
            </span>
          </label>
        )}
        {imageError && <p className="text-red-500 text-xs mt-1">{imageError}</p>}
      </div>
      {submitError && (
        <p className="text-red-500 text-xs text-center">{submitError}</p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-primary text-white text-xs font-semibold tracking-wider py-4 rounded-full hover:bg-primary-dark transition-colors disabled:opacity-60"
      >
        {compressing ? "PREPARING IMAGE…" : submitting ? "SENDING…" : "SEND MESSAGE"}
      </button>
      <p className="text-center text-xs text-gray-400">or reach us instantly</p>
      <WhatsappButton className="w-full justify-center py-3" />
    </form>
  );
}

export default function ContactForm() {
  return (
    <Suspense fallback={<div className="h-[600px]" aria-hidden="true" />}>
      <ContactFormFields />
    </Suspense>
  );
}
