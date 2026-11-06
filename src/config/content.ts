/**
 * Services and gallery content.
 *
 * Images: `source: "stock"` shows an "Illustrative" label on the site.
 * When you replace a photo with a real SY STYLO one, set `source: "salon"`.
 * The labels and notes disappear on their own once no stock photos remain.
 */

export type ImageSource = "stock" | "salon";

export type Service = {
  id: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  imageSource: ImageSource;
  /** Display text such as "₹200". Leave null until the owner supplies it. */
  price: string | null;
  /** Display text such as "30 min". Leave null to hide it. */
  duration: string | null;
};

export const services: Service[] = [
  {
    id: "haircut-styling",
    name: "Haircut & Styling",
    description: "A cut shaped around your face, your hair and how you like to wear it.",
    image: "/images/services/haircut.jpg",
    imageAlt: "Barber lifting a client's hair with a comb while shaping a short fade",
    imageSource: "stock",
    price: null,
    duration: null,
  },
  {
    id: "beard-trimming-styling",
    name: "Beard Trimming & Styling",
    description: "Clean lines and a considered shape, trimmed to suit your look.",
    image: "/images/services/beard.jpg",
    imageAlt: "Client reclining while a barber trims their beard with clippers",
    imageSource: "stock",
    price: null,
    duration: null,
  },
  {
    id: "hair-colouring",
    name: "Hair Colouring",
    description: "Colour chosen with you, whether you want a refresh or a change.",
    image: "/images/services/colouring.jpg",
    imageAlt: "Person seen from behind with long, multi-toned brown and caramel hair",
    imageSource: "stock",
    price: null,
    duration: null,
  },
  {
    id: "hair-spa-treatment",
    name: "Hair Spa & Treatment",
    description: "Time set aside for your hair, and for how it looks and feels.",
    image: "/images/services/hair-spa.jpg",
    imageAlt: "Stylist's hands working through sections of a client's dark hair",
    imageSource: "stock",
    price: null,
    duration: null,
  },
  {
    id: "facial-skin-care",
    name: "Facial & Skin Care",
    description: "Unhurried skin care that leaves your face feeling fresh.",
    image: "/images/services/facial.jpg",
    imageAlt: "Client lying back with eyes closed as a face mask is brushed on",
    imageSource: "stock",
    price: null,
    duration: null,
  },
  {
    id: "beauty-parlour",
    name: "Beauty Parlour Services",
    description: "Beauty and personal care. Ask us and we'll help you choose.",
    image: "/images/services/beauty.jpg",
    imageAlt: "Makeup brushes standing in a holder on a salon counter",
    imageSource: "stock",
    price: null,
    duration: null,
  },
  {
    id: "hair-wash",
    name: "Hair Wash",
    description: "A simple, refreshing wash, on its own or before your cut.",
    image: "/images/services/hair-wash.jpg",
    imageAlt: "Stylist washing a client's hair at a salon basin",
    imageSource: "stock",
    price: null,
    duration: null,
  },
  {
    id: "grooming-packages",
    name: "Grooming Packages",
    description: "More than one service in a visit. Tell us what you'd like to combine.",
    image: "/images/services/packages.jpg",
    imageAlt: "Clippers, scissors and a comb laid out on a dark slate board",
    imageSource: "stock",
    price: null,
    duration: null,
  },
];

export const galleryCategories = [
  { id: "all", label: "All" },
  { id: "haircuts", label: "Haircuts" },
  { id: "beard", label: "Beard Styling" },
  { id: "transformations", label: "Transformations" },
  { id: "colouring", label: "Colouring" },
  { id: "interior", label: "Interior" },
] as const;

export type GalleryCategory = Exclude<(typeof galleryCategories)[number]["id"], "all">;

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  category: GalleryCategory;
  source: ImageSource;
};

export const galleryImages: GalleryImage[] = [
  { id: "interior-classic", src: "/images/gallery/interior-classic.jpg", alt: "Barber chair under warm pendant lights against an exposed brick wall", category: "interior", source: "stock" },
  { id: "haircut-chair", src: "/images/gallery/haircut-chair.jpg", alt: "Barber styling a seated client's hair in a richly decorated shop", category: "haircuts", source: "stock" },
  { id: "beard-razor", src: "/images/gallery/beard-razor.jpg", alt: "Barber shaping a reclining client's beard in low, moody light", category: "beard", source: "stock" },
  { id: "style-profile", src: "/images/gallery/style-profile.jpg", alt: "Side profile of a man with a neat, short groomed hairstyle", category: "transformations", source: "stock" },
  { id: "colour-tones", src: "/images/gallery/colour-tones.jpg", alt: "Stylist blow-drying a client's hair, showing brown and blonde tones", category: "colouring", source: "stock" },
  { id: "beard-brush", src: "/images/gallery/beard-brush.jpg", alt: "Black and white photo of a barber brushing shaving foam onto a beard", category: "beard", source: "stock" },
  { id: "interior-modern", src: "/images/gallery/interior-modern.jpg", alt: "Modern salon with dark walls, round mirrors and black styling chairs", category: "interior", source: "stock" },
  { id: "haircut-clipper", src: "/images/gallery/haircut-clipper.jpg", alt: "Barber tidying the back of a client's neckline with clippers", category: "haircuts", source: "stock" },
  { id: "style-fade", src: "/images/gallery/style-fade.jpg", alt: "Barber finishing a sharp fade and beard line with a razor", category: "transformations", source: "stock" },
  { id: "beard-scissors", src: "/images/gallery/beard-scissors.jpg", alt: "Black and white close-up of scissors trimming a client's beard", category: "beard", source: "stock" },
  { id: "interior-lounge", src: "/images/gallery/interior-lounge.jpg", alt: "Bright salon interior with polished floors and a central seating area", category: "interior", source: "stock" },
];

export const heroImage = {
  src: "/images/hero.jpg",
  alt: "Barber in a hat and braces combing a client's freshly cut hair",
  source: "stock" as ImageSource,
};

export const hasStockServiceImages = services.some((s) => s.imageSource === "stock");
export const hasStockGalleryImages = galleryImages.some((g) => g.source === "stock");
