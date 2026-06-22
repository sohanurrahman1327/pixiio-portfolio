import PageShell from "@/components/PageShell";
import LibraryTabs from "@/components/library/LibraryTabs";

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageShell>
      <LibraryTabs />
      <div className="bg-gray-50 min-h-screen">{children}</div>
    </PageShell>
  );
}
