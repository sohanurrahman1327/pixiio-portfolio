const unsplash = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=90`;

const pexels = (id: number, w: number, h: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;

/** Hero-only — local project images */
export const heroMarqueeImages = {
  left: [
    { src: "/image-01.jpg", alt: "UI design project 1" },
    { src: "/image-02.jpg", alt: "UI design project 2" },
    { src: "/image-03.jpg", alt: "UI design project 3" },
    { src: "/image-04.jpg", alt: "UI design project 4" },
    { src: "/image-05.jpg", alt: "UI design project 5" },
  ],
  right: [
    { src: "/image-06.jpg", alt: "UI design project 6" },
    { src: "/image-07.jpg", alt: "UI design project 7" },
    { src: "/image-08.jpg", alt: "UI design project 8" },
    { src: "/image-09.jpg", alt: "UI design project 9" },
    { src: "/image-10.jpg", alt: "UI design project 10" },
  ],
};

export const serviceImages = {
  uiDesign: pexels(3184292, 900, 560),
  branding: unsplash("photo-1626785774573-4b799315345d", 900, 560),
  website: pexels(1181263, 900, 560),
  marketing: pexels(196644, 900, 560),
};

export const featuredWorkImages = [
  {
    title: "BRANDING",
    subtitle: "Olivia Studio",
    image: pexels(3861969, 1000, 720),
  },
  {
    title: "UI DESIGN",
    subtitle: "Train Services Platform",
    image: unsplash("photo-1551650975-87deedd944c3", 1000, 720),
  },
  {
    title: "WEB DESIGN",
    subtitle: "Grovallo Agency",
    image: pexels(574071, 1000, 720),
  },
  {
    title: "LANDING PAGE",
    subtitle: "Design That Sells",
    image: unsplash("photo-1600607687939-ce8a6c25118c", 1000, 720),
  },
];

/** Best UI Work — row 1 scrolls left, row 2 scrolls right */
export const bestUIWorkRow1 = [
  {
    src: unsplash("photo-1618005182384-a83a8bd57fbe", 520, 320),
    alt: "Bold creative agency landing page design",
    w: 440,
  },
  {
    src: unsplash("photo-1547658719-da2b51169166", 520, 320),
    alt: "SaaS platform landing page on laptop",
    w: 480,
  },
  {
    src: unsplash("photo-1558655146-d09347e92766", 520, 320),
    alt: "Vibrant product landing page UI",
    w: 420,
  },
  {
    src: unsplash("photo-1618221195710-dd6b41faaea6", 520, 320),
    alt: "Premium brand landing page design",
    w: 460,
  },
  {
    src: unsplash("photo-1555421689-491a97ff2040", 520, 320),
    alt: "Marketing agency landing page design",
    w: 430,
  },
  {
    src: pexels(6476589, 520, 320),
    alt: "UI design team workspace mockup",
    w: 450,
  },
];

export const bestUIWorkRow2 = [
  {
    src: unsplash("photo-1551288049-bebda4e38f71", 520, 320),
    alt: "Data analytics dashboard UI design",
    w: 480,
  },
  {
    src: unsplash("photo-1460925895917-afdab827c52f", 520, 320),
    alt: "Business intelligence landing page UI",
    w: 460,
  },
  {
    src: unsplash("photo-1551650975-87deedd944c3", 520, 320),
    alt: "Mobile-first app landing page UI",
    w: 420,
  },
  {
    src: unsplash("photo-1561070791-2526d30994b5", 520, 320),
    alt: "Figma website UI design mockup",
    w: 450,
  },
  {
    src: unsplash("photo-1556742049-0cfed4f6a45d", 520, 320),
    alt: "E-commerce checkout landing page UI",
    w: 440,
  },
  {
    src: unsplash("photo-1512941937669-90a1b58e7e9c", 520, 320),
    alt: "iOS app landing page UI design",
    w: 430,
  },
];

export const designProcessSteps = [
  {
    step: "01",
    title: "LOGO IN ILLUSTRATOR",
    description:
      "Brand identity starts in Adobe Illustrator — crafting a unique logo with color palette, typography, and visual language.",
    image: unsplash("photo-1626785774573-4b799315345d", 800, 600),
    alt: "Logo design process in Adobe Illustrator",
  },
  {
    step: "02",
    title: "PAPER WIREFRAME",
    description:
      "Low-fidelity wireframes sketched on paper to map layout, user flow, and content hierarchy before going digital.",
    image: unsplash("photo-1586281380349-632531db7ed4", 800, 600),
    alt: "Hand-drawn wireframe sketch on paper",
  },
  {
    step: "03",
    title: "FIGMA SITE DESIGN",
    description:
      "High-fidelity UI designed in Figma — pixel-perfect screens, components, and interactive prototypes ready for review.",
    image: unsplash("photo-1561070791-2526d30994b5", 800, 600),
    alt: "Website UI design in Figma on screen",
  },
  {
    step: "04",
    title: "WORDPRESS / FRAMER LIVE",
    description:
      "Final design built and deployed on WordPress or Framer — fully responsive, optimized, and live for the world to see.",
    image: unsplash("photo-1498050108023-c5249f4df085", 800, 600),
    alt: "Live website deployed on WordPress or Framer",
  },
];

export const testimonialAvatar = unsplash(
  "photo-1472099645785-5658abf4ff4e",
  120,
  120,
);
