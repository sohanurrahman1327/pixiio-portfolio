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
  message: string;
  createdAt: string;
}
