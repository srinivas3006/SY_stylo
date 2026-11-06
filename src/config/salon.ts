/**
 * SY STYLO: the single place to edit salon details.
 * Everything on the site (status, booking, map, FAQ, SEO) reads from here.
 */

const closedDays: readonly number[] = [2]; // JavaScript weekday numbers: 0 = Sunday, 2 = Tuesday

const coordinates = { latitude: 17.1644993, longitude: 79.4244815 };
const destination = `${coordinates.latitude},${coordinates.longitude}`;

export const salonConfig = {
  name: "SY STYLO",
  nameTelugu: "స్టైలో",
  businessType: "Men's Salon & Beauty Parlour",
  tagline: "Your style. Your identity.",

  phone: "+919948602967",
  phoneDisplay: "99486 02967",
  whatsapp: "919948602967",

  /** Set NEXT_PUBLIC_SITE_URL to the live domain when deploying. */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  timezone: "Asia/Kolkata",

  /**
   * NOT YET CONFIRMED. Replace with the real time in 24-hour "HH:MM" format, e.g. "06:15".
   * Until then the site says "before 7:00 AM", never a guessed time.
   */
  openingTime: "CONFIGURE_ACTUAL_TIME",
  /** The salon is known to be open by this time. Used only while openingTime is unconfirmed. */
  openingTimeUpperBound: "07:00",
  closingTime: "21:30",
  closedDays,

  /** Derived from closedDays so the two can never disagree. */
  openingHours: {
    monday: !closedDays.includes(1),
    tuesday: !closedDays.includes(2),
    wednesday: !closedDays.includes(3),
    thursday: !closedDays.includes(4),
    friday: !closedDays.includes(5),
    saturday: !closedDays.includes(6),
    sunday: !closedDays.includes(0),
  },

  address: "Shivalayam, Nakrekal, Telangana 508211",
  addressParts: {
    streetAddress: "Shivalayam",
    addressLocality: "Nakrekal",
    addressRegion: "Telangana",
    postalCode: "508211",
    addressCountry: "IN",
  },
  landmark: "Shivalayam",
  plusCode: "5C7F+QQ Nakrekal, Telangana",
  coordinates,
  googleMapsUrl:
    "https://www.google.com/maps/place/Stylo+SY+Men's+saloon+%26+beauty+parlour/@17.1644993,79.4244815,17z/data=!3m1!4b1!4m6!3m5!1s0x3a34d3145c49ba2b:0x2fe32e01e91a0717!8m2!3d17.1644993!4d79.4244815!16s%2Fg%2F11_00qps_5?hl=en",
  directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${destination}`,
  mapEmbedUrl: `https://maps.google.com/maps?q=${destination}&z=16&output=embed`,

  owner: {
    nameTelugu: "నేలపట్ల సైదులు",
    nameEnglish: "Nelapatla Saidulu",
    photo: "/images/brand/owner.jpg",
  },

  /** Add full profile URLs when available. Empty links are not shown. */
  social: {
    instagram: "",
    facebook: "",
    youtube: "",
  },

  booking: {
    /** Number of weeks shown in the date picker. */
    weeksAhead: 4,
    slotIntervalMinutes: 30,
  },
} as const;

export const telHref = `tel:${salonConfig.phone}`;
export const whatsappHref = `https://wa.me/${salonConfig.whatsapp}`;
