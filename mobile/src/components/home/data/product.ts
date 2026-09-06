import { Product } from "@/types/product";

export const flashSaleProducts: Product[] = [
  {
    id: "1",
    brand: "Nike",
    name: "Air Max",
    category: "Running Shoes",
    description:
      "The Nike Air Max delivers lightweight cushioning and premium comfort for everyday wear.",
    images: [
      require("@/assets/products/shoe-jordan.png"),
      require("@/assets/products/shoe-jordan.png"),
      require("@/assets/products/shoe-jordan.png"),
    ],
    price: 8999,
    originalPrice: 10999,
    rating: 4.8,
    reviews: 1248,
    favourite: false,
    discount: 20,
    sizes: ["7", "8", "9", "10", "11"],
    specifications: [
      {
        title: "Brand",
        value: "Nike",
      },
      {
        title: "Material",
        value: "Mesh",
      },
      {
        title: "Weight",
        value: "320 g",
      },
      {
        title: "Warranty",
        value: "1 Year",
      },
    ],
  },

  {
    id: "2",
    brand: "Apple",
    name: "Apple Watch Series 10",
    category: "Smart Watch",
    description:
      "Stay connected with advanced health tracking and premium performance.",
    images: [
      require("@/assets/products/watch.png"),
      require("@/assets/products/watch.png"),
    ],
    price: 49999,
    originalPrice: 54999,
    rating: 4.9,
    reviews: 856,
    favourite: true,
    discount: 15,
    specifications: [
      {
        title: "Display",
        value: "46 mm",
      },
      {
        title: "Battery",
        value: "18 Hours",
      },
      {
        title: "Warranty",
        value: "1 Year",
      },
    ],
  },

  {
    id: "3",
    brand: "Sony",
    name: "WH-1000XM5",
    category: "Headphones",
    description:
      "Industry-leading noise cancellation with premium sound quality.",
    images: [
      require("@/assets/products/headphone.png"),
      require("@/assets/products/headphone.png"),
    ],
    price: 24999,
    originalPrice: 29999,
    rating: 4.7,
    reviews: 634,
    favourite: false,
    discount: 30,
    specifications: [
      {
        title: "Battery",
        value: "30 Hours",
      },
      {
        title: "Bluetooth",
        value: "5.3",
      },
    ],
  },

  {
    id: "4",
    brand: "Nike",
    name: "Air Jordan 1",
    category: "Basketball Shoes",
    description:
      "A timeless basketball sneaker with premium leather construction.",
    images: [
      require("@/assets/products/shoe.png"),
      require("@/assets/products/shoe.png"),
    ],
    price: 8999,
    originalPrice: 10999,
    rating: 4.8,
    reviews: 1248,
    favourite: true,
    discount: 20,
    sizes: ["7", "8", "9", "10", "11"],
    specifications: [
      {
        title: "Material",
        value: "Leather",
      },
      {
        title: "Weight",
        value: "340 g",
      },
    ],
  },
];