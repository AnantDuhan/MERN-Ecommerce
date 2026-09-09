import { create } from "zustand";

export interface ShippingInfo {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  phoneNumber: string;
}

interface CheckoutState {
  shipping: ShippingInfo | null;
  couponCode: string | null;
  setShipping: (info: ShippingInfo) => void;
  setCoupon: (code: string | null) => void;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  shipping: null,
  couponCode: null,
  setShipping: (info) => set({ shipping: info }),
  setCoupon: (code) => set({ couponCode: code }),
  reset: () => set({ shipping: null, couponCode: null }),
}));
