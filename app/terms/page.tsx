import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import { mailtoLinks } from "@/lib/mailto";
import { CONTACT_EMAIL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms & Conditions — Pixiio Design Agency",
  description: "Terms and conditions governing the use of Pixiio's services.",
};

export default function TermsPage() {
  return (
    <PageShell>
      <PageHero
        label="LEGAL"
        title="TERMS & CONDITIONS"
        description="Last updated: May 2026"
      />
      <section className="py-20 bg-background">
        <div className="max-w-3xl mx-auto px-6 prose prose-gray">
          <h2 className="font-display text-2xl text-gray-900 tracking-wide mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            By engaging Pixiio for any design service, you agree to these Terms & Conditions. If you do not agree, please do not proceed with a project.
          </p>

          <h2 className="font-display text-2xl text-gray-900 tracking-wide mb-4">2. Services</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            Pixiio provides UI/UX design, branding, website design, and digital marketing services. The exact scope, deliverables, and timeline are agreed upon in writing before work begins.
          </p>

          <h2 className="font-display text-2xl text-gray-900 tracking-wide mb-4">3. Payment</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            A deposit of 50% is required before work commences. The remaining balance is due upon project completion and before final files are delivered. All prices are in USD unless otherwise agreed.
          </p>

          <h2 className="font-display text-2xl text-gray-900 tracking-wide mb-4">4. Revisions</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            Revision rounds are as specified in your chosen plan. Additional revisions beyond the included rounds will be billed at an hourly rate agreed upon in advance.
          </p>

          <h2 className="font-display text-2xl text-gray-900 tracking-wide mb-4">5. Intellectual Property</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            Upon receipt of full payment, all final design files and deliverables become the property of the client. Pixiio retains the right to display the work in its portfolio unless the client requests otherwise in writing.
          </p>

          <h2 className="font-display text-2xl text-gray-900 tracking-wide mb-4">6. Confidentiality</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            Both parties agree to keep confidential any proprietary information shared during the project. This obligation survives the completion of the project.
          </p>

          <h2 className="font-display text-2xl text-gray-900 tracking-wide mb-4">7. Limitation of Liability</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            Pixiio is not liable for any indirect, incidental, or consequential damages arising from the use of delivered work. Our total liability is limited to the amount paid for the specific project.
          </p>

          <h2 className="font-display text-2xl text-gray-900 tracking-wide mb-4">8. Termination</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            Either party may terminate a project with 7 days written notice. Work completed up to the termination date will be billed accordingly, and the deposit is non-refundable.
          </p>

          <h2 className="font-display text-2xl text-gray-900 tracking-wide mb-4">9. Governing Law</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            These terms are governed by the laws of Bangladesh. Any disputes will be resolved through good-faith negotiation before pursuing legal remedies.
          </p>

          <h2 className="font-display text-2xl text-gray-900 tracking-wide mb-4">10. Contact</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Questions about these terms? Email us at{" "}
            <a href={mailtoLinks.legal()} className="text-primary hover:underline">
              {CONTACT_EMAIL}
            </a>.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
