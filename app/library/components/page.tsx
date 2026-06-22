import type { Metadata } from "next";
import LibraryListing from "@/components/library/LibraryListing";

export const metadata: Metadata = {
  title: "Components — Design Library | Pixiio",
  description:
    "Browse free and premium UI components for Figma, Elementor, WordPress, Framer, Webflow, and more.",
};

export default function LibraryComponentsPage() {
  return (
    <LibraryListing type="component" basePath="/library/components" />
  );
}
