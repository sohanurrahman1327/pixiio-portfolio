import type { Metadata } from "next";
import LibraryListing from "@/components/library/LibraryListing";

export const metadata: Metadata = {
  title: "Blocks — Design Library | Pixiio",
  description:
    "Ready-made website blocks for Figma, Elementor, WordPress, Gutenberg, Framer, and Webflow.",
};

export default function LibraryBlocksPage() {
  return <LibraryListing type="block" basePath="/library/blocks" />;
}
