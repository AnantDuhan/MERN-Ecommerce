export const FREE_SHIPPING_THRESHOLD = 1000;
export const FLAT_SHIPPING = 50;

export function computePricing(itemsPrice: number) {
  const shippingPrice =
    itemsPrice > FREE_SHIPPING_THRESHOLD || itemsPrice === 0
      ? 0
      : FLAT_SHIPPING;
  return { itemsPrice, shippingPrice, totalPrice: itemsPrice + shippingPrice };
}

/**
 * Client-side ESTIMATE of a coupon's effect, for display only.
 * The backend recalculates and applies the authoritative discount at order
 * creation using the ORIGINAL (pre-discount) totalPrice + couponCode — so
 * callers must keep sending the undiscounted total to the order endpoint,
 * never this estimated result, or the discount would be applied twice.
 */
export function estimateCouponDiscount(
  totalPrice: number,
  coupon: { discountPercent: number; minOrderAmount: number; maxOrderAmount: number } | null
) {
  if (
    !coupon ||
    totalPrice < coupon.minOrderAmount ||
    totalPrice > coupon.maxOrderAmount
  ) {
    return { eligible: false, discountedTotal: totalPrice, savings: 0 };
  }
  const discountedTotal =
    totalPrice - (totalPrice * coupon.discountPercent) / 100;
  return {
    eligible: true,
    discountedTotal: Math.round(discountedTotal),
    savings: Math.round(totalPrice - discountedTotal),
  };
}
