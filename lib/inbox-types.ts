export interface StoredSubscriber {
  id: string;
  email: string;
  source: "newsletter";
  createdAt: string;
  updatedAt: string;
}

export interface StoredContactInquiry {
  id: string;
  name: string;
  email: string;
  project: string;
  budget: string;
  package: string;
  message: string;
  hasReferenceImage: boolean;
  /** Small inline thumbnail (data URL) so the admin dashboard can preview the reference image. */
  referenceImagePreview?: string;
  /** True when this inquiry was submitted via a "Purchase Now" link from the Pricing page/section. */
  fromPricing: boolean;
  createdAt: string;
}
