export interface Address {
  _id: string;
  label?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  phoneNumber: string;
}

export interface AddressesResponse {
  success: boolean;
  addresses: Address[];
  message?: string;
}

export type NewAddress = Omit<Address, "_id">;
