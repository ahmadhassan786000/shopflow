"use server";

import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email address."),
  subject: z.string().min(2, "Please enter a subject."),
  message: z.string().min(10, "Please write a slightly longer message."),
});

export async function submitContactMessage(formData: FormData) {
  const parsed = contactSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.errors[0]?.message ?? "Please check your details and try again.",
    };
  }

  // Logged here for now — wire this up to email/ticketing once a support
  // inbox is configured (see src/lib/email.ts for the existing mailer).
  console.log("New contact message:", parsed.data);

  return {
    success: true,
    message: "Thanks! Your message has been received — our team will get back to you soon.",
  };
}
