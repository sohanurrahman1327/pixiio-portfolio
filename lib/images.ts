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
  { src: "/image-01.jpg", alt: "UI design project 1", w: 440 },
  { src: "/image-02.jpg", alt: "UI design project 2", w: 480 },
  { src: "/image-03.jpg", alt: "UI design project 3", w: 420 },
  { src: "/image-04.jpg", alt: "UI design project 4", w: 460 },
  { src: "/image-05.jpg", alt: "UI design project 5", w: 430 },
];

export const bestUIWorkRow2 = [
  { src: "/image-06.jpg", alt: "UI design project 6", w: 480 },
  { src: "/image-07.jpg", alt: "UI design project 7", w: 460 },
  { src: "/image-08.jpg", alt: "UI design project 8", w: 420 },
  { src: "/image-09.jpg", alt: "UI design project 9", w: 450 },
  { src: "/image-10.jpg", alt: "UI design project 10", w: 440 },
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
