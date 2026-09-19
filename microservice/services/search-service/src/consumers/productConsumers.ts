import {
  EventBus,
  DomainEvent,
  createLogger,
  type ProductUpsertedPayload,
  type ProductDeletedPayload,
} from "@order-planning/shared";
import { indexProduct, deleteProductDoc } from "../searchService";

const log = createLogger("search-service");

/**
 * The heart of the read-model. catalog-service is the single writer of product
 * data; this service keeps the Elasticsearch index eventually consistent with it
 * purely by reacting to events. No shared database, no synchronous call on the
 * write path — a product write in catalog returns immediately and the index
 * catches up when this handler runs.
 */
export async function startProductConsumers(bus: EventBus): Promise<void> {
  const upsert = async ({ productId, product }: ProductUpsertedPayload) => {
    await indexProduct(productId, product);
    log.info({ productId }, "indexed product");
  };

  await bus.subscribe(DomainEvent.ProductCreated, upsert);
  await bus.subscribe(DomainEvent.ProductUpdated, upsert);
  await bus.subscribe(DomainEvent.ProductDeleted, async ({ productId }: ProductDeletedPayload) => {
    await deleteProductDoc(productId);
    log.info({ productId }, "removed product from index");
  });

  log.info("product consumers subscribed");
}
