export type BlogCategorySlug =
  | "website-redesign"
  | "saas-design"
  | "wordpress"
  | "ui-ux"
  | "industry-guides";

export type BlogCategory = {
  slug: BlogCategorySlug;
  label: string;
  description: string;
  keywords: string[];
};

export type BlogAuthor = {
  name: string;
  role: string;
};

export type BlogSection =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string; id: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "callout"; title: string; text: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | {
      type: "table";
      headers: string[];
      rows: string[][];
    };

export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
  children?: TocItem[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategorySlug;
  author: BlogAuthor;
  publishedAt: string;
  coverImage: string;
  tags: string[];
  readingTime: number;
  sections: BlogSection[];
  featured?: boolean;
};
