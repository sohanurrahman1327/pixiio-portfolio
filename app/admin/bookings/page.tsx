import type { Metadata } from "next";
import BookingAdminDashboard from "@/components/BookingAdminDashboard";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Admin Dashboard — Pixiio",
  robots: { index: false, follow: false },
};

export default function BookingsDashboardPage() {
  return (
    <PageShell>
      <section className="bg-background py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <BookingAdminDashboard />
        </div>
      </section>
    </PageShell>
  );
}
