import type { Metadata } from "next";
import LibraryListing from "@/components/library/LibraryListing";

export const metadata: Metadata = {
  title: "Blocks, Design Library",
  description:
    "Ready-made website blocks for Figma, Elementor, WordPress, Gutenberg, Framer, and Webflow.",
  alternates: { canonical: "/library/blocks" },
};

type Props = {
  searchParams: Promise<{ platform?: string; category?: string; tag?: string; q?: string }>;
};

export default async function LibraryBlocksPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <LibraryListing
      type="block"
      basePath="/library/blocks"
      heroTitle="Website blocks for WordPress, Figma, Elementor & more"
      platform={params.platform}
      category={params.category}
      tag={params.tag}
      query={params.q}
    />
  );
}
