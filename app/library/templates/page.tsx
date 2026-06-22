import type { Metadata } from "next";
import LibraryListing from "@/components/library/LibraryListing";

export const metadata: Metadata = {
  title: "Templates — Design Library | Pixiio",
  description:
    "Full-page website templates for digital agencies, SaaS, and modern brands.",
};

export default function LibraryTemplatesPage() {
  return (
    <LibraryListing type="template" basePath="/library/templates" />
  );
}
