import { ImageSourcePropType } from "react-native";

export interface Product {
  id: string;
  brand: string;
  name: string;
  category: string;
  description: string;
  images: ImageSourcePropType[];
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  favourite: boolean;
  discount?: number;
  sizes?: string[];
  specifications?: {
    title: string;
    value: string;
  }[];
}