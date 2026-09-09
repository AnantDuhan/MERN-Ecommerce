import { ApiOrder, OrderVM } from "../types/order";

export function toOrder(api: ApiOrder): OrderVM {
  const items = (api.orderItems ?? []).map((i) => ({
    name: i.name,
    price: i.price,
    quantity: i.quantity,
    image: i.images?.[0]?.url ? { uri: i.images[0].url } : undefined,
    product: i.product,
  }));

  return {
    id: api._id,
    status: api.orderStatus,
    createdAt: api.createdAt,
    isReturned: !!api.isReturned,
    returnRequestedAt: api.returnRequestedAt,
    estimatedDeliveryDate: api.estimatedDeliveryDate,
    itemsPrice: api.itemsPrice ?? 0,
    shippingPrice: api.shippingPrice ?? 0,
    totalPrice: api.totalPrice ?? 0,
    itemCount: items.reduce((n, i) => n + i.quantity, 0),
    shippingInfo: api.shippingInfo,
    items,
  };
}
