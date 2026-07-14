import type { Metadata } from "next";
import LibraryListing from "@/components/library/LibraryListing";

export const metadata: Metadata = {
  title: "Templates — Design Library",
  description:
    "Full-page website templates for digital agencies, SaaS, and modern brands.",
  alternates: { canonical: "/library/templates" },
};

type Props = {
  searchParams: Promise<{ platform?: string; category?: string; tag?: string; q?: string }>;
};

export default async function LibraryTemplatesPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <LibraryListing
      type="template"
      basePath="/library/templates"
      heroTitle="Full-page website templates for WordPress, Figma & more"
      platform={params.platform}
      category={params.category}
      tag={params.tag}
      query={params.q}
    />
  );
}
