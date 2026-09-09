export const FREE_SHIPPING_THRESHOLD = 1000;
export const FLAT_SHIPPING = 50;

export function computePricing(itemsPrice: number) {
  const shippingPrice =
    itemsPrice > FREE_SHIPPING_THRESHOLD || itemsPrice === 0
      ? 0
      : FLAT_SHIPPING;
  return { itemsPrice, shippingPrice, totalPrice: itemsPrice + shippingPrice };
}
