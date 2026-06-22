import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ category: string; slug: string }>;
};

/** Pixalo-style URL alias → library detail page */
export default async function FigmaUiFileRedirect({ params }: Props) {
  const { slug } = await params;
  redirect(`/library/${slug}`);
}
