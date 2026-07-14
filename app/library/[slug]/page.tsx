import type { Metadata } from "next";
import Link from "next/link";
import LibraryDetailView from "@/components/library/LibraryDetailView";
import {
  getItemBySlug,
  getSimilarItems,
  libraryItems,
} from "@/lib/library";
import { breadcrumbSchema, jsonLdScript } from "@/lib/schema";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getItemBySlug(slug);
  if (!item) {
    return { title: "Design Not Found" };
  }
  return {
    title: `${item.title} — Design Library`,
    description: item.excerpt,
    alternates: { canonical: `/library/${item.slug}` },
    openGraph: {
      title: `${item.title} — Design Library`,
      description: item.excerpt,
      url: `/library/${item.slug}`,
      images: [{ url: item.previewImage }],
    },
  };
}

export async function generateStaticParams() {
  return libraryItems.map((item) => ({ slug: item.slug }));
}

export default async function LibraryDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = getItemBySlug(slug);

  if (!item) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="font-display text-4xl text-gray-900 mb-4">
            Design Not Found
          </h1>
          <p className="text-gray-500 mb-8">
            This resource doesn&apos;t exist in our library.
          </p>
          <Link
            href="/library/components"
            className="text-primary font-semibold hover:underline"
          >
            Browse Library →
          </Link>
        </div>
      </div>
    );
  }

  const similar = getSimilarItems(item);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Library", path: "/library/components" },
            { name: item.title, path: `/library/${item.slug}` },
          ])
        )}
      />
      <LibraryDetailView item={item} similar={similar} />
    </>
  );
}
