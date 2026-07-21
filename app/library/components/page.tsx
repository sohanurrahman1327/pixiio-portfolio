import type { Metadata } from "next";
import LibraryListing from "@/components/library/LibraryListing";

export const metadata: Metadata = {
  title: "Components, Design Library",
  description:
    "Browse free and premium UI components for Figma, Elementor, WordPress, Framer, Webflow, and more.",
  alternates: { canonical: "/library/components" },
};

type Props = {
  searchParams: Promise<{ platform?: string; category?: string; tag?: string; q?: string }>;
};

export default async function LibraryComponentsPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <LibraryListing
      type="component"
      basePath="/library/components"
      heroTitle="UI components for WordPress, Figma, Elementor & more"
      platform={params.platform}
      category={params.category}
      tag={params.tag}
      query={params.q}
    />
  );
}
