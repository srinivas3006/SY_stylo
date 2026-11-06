export type BookingRequest = {
  name: string;
  service: string;
  date: string;
  time: string;
};

export function buildBookingMessage({ name, service, date, time }: BookingRequest): string {
  const cleanName = name.replace(/\s+/g, " ").trim();
  return [
    "Hello SY STYLO! I would like to book an appointment.",
    "",
    `Name: ${cleanName}`,
    `Selected Service: ${service}`,
    `Preferred Date: ${date}`,
    `Preferred Time: ${time}`,
  ].join("\n");
}

/** wa.me opens the WhatsApp app on phones and WhatsApp Web on desktop. */
export function buildWhatsAppUrl(whatsappNumber: string, message: string): string {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
