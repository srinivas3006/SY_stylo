import { describe, expect, it } from "vitest";
import { buildBookingMessage, buildWhatsAppUrl } from "./whatsapp";

const request = {
  name: "  Ravi   Kumar ",
  service: "Beard Trimming & Styling",
  date: "Thursday, 12 November 2026",
  time: "10:30 AM",
};

describe("booking message", () => {
  it("follows the requested format", () => {
    expect(buildBookingMessage(request)).toBe(
      "Hello SY STYLO! I would like to book an appointment.\n\n" +
        "Name: Ravi Kumar\n" +
        "Selected Service: Beard Trimming & Styling\n" +
        "Preferred Date: Thursday, 12 November 2026\n" +
        "Preferred Time: 10:30 AM",
    );
  });

  it("survives URL encoding, including the & in service names", () => {
    const message = buildBookingMessage(request);
    const url = new URL(buildWhatsAppUrl("919948602967", message));
    expect(url.origin + url.pathname).toBe("https://wa.me/919948602967");
    expect(url.searchParams.get("text")).toBe(message);
  });
});
