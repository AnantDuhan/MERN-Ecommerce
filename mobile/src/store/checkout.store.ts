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
  setShipping: (info: ShippingInfo) => void;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  shipping: null,
  setShipping: (info) => set({ shipping: info }),
  reset: () => set({ shipping: null }),
}));
