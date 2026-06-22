import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Privacy Policy — Pixiio Design Agency",
  description: "How Pixiio collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <PageShell>
      <PageHero
        label="LEGAL"
        title="PRIVACY POLICY"
        description="Last updated: May 2026"
      />
      <section className="py-20 bg-background">
        <div className="max-w-3xl mx-auto px-6 prose prose-gray">
          <h2 className="font-display text-2xl text-gray-900 tracking-wide mb-4">1. Information We Collect</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            When you contact us through our website or email, we collect the information you voluntarily provide — such as your name, email address, and project details. We do not collect any data automatically beyond standard server logs.
          </p>

          <h2 className="font-display text-2xl text-gray-900 tracking-wide mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            We use your information solely to respond to your inquiries, deliver the services you request, and send occasional project updates or newsletters if you have opted in. We never sell or share your data with third parties for marketing purposes.
          </p>

          <h2 className="font-display text-2xl text-gray-900 tracking-wide mb-4">3. Email Communications</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            All email communications are handled through <a href="mailto:agency.pixiio@gmail.com" className="text-primary hover:underline">agency.pixiio@gmail.com</a>. By submitting a contact form or newsletter subscription, you consent to receiving a reply from this address.
          </p>

          <h2 className="font-display text-2xl text-gray-900 tracking-wide mb-4">4. Data Retention</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            We retain your contact information only as long as necessary to fulfil the purpose for which it was collected, or as required by applicable law.
          </p>

          <h2 className="font-display text-2xl text-gray-900 tracking-wide mb-4">5. Your Rights</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            You have the right to request access to, correction of, or deletion of any personal data we hold about you. To exercise these rights, email us at <a href="mailto:agency.pixiio@gmail.com" className="text-primary hover:underline">agency.pixiio@gmail.com</a>.
          </p>

          <h2 className="font-display text-2xl text-gray-900 tracking-wide mb-4">6. Changes to This Policy</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated date.
          </p>

          <h2 className="font-display text-2xl text-gray-900 tracking-wide mb-4">7. Contact</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Questions about this policy? Reach us at{" "}
            <a href="mailto:agency.pixiio@gmail.com" className="text-primary hover:underline">
              agency.pixiio@gmail.com
            </a>.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
