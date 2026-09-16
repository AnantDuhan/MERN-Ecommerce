import { z } from "zod";

export const shippingSchema = z.object({
  address: z.string().min(3, "Enter your address"),
  city: z.string().min(2, "Enter your city"),
  state: z.string().min(2, "Enter your state"),
  country: z.string().min(2, "Enter your country"),
  pinCode: z.string().regex(/^\d{4,10}$/, "Enter a valid PIN / ZIP code"),
  phoneNumber: z.string().regex(/^\d{10}$/, "Enter a 10-digit phone number"),
});

export type ShippingFormData = z.infer<typeof shippingSchema>;
