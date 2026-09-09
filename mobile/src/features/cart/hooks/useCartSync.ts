import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { CartRepository } from "../repositories/cart.repository";

/**
 * Once per login, pulls the server's cart and union-merges it into this
 * device's local cart (summing quantities for lines both devices added),
 * then pushes the merged result back. This is what fixes carts going out
 * of sync across two devices signed into the same account — each device
 * reconciles with the server the moment it becomes authenticated, and
 * every local change after that debounced-pushes automatically.
 */
export function useCartSync() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const synced = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      synced.current = false;
      return;
    }
    if (synced.current) return;
    synced.current = true;

    CartRepository.get()
      .then((serverItems) => {
        if (serverItems.length > 0) {
          useCartStore.getState().mergeFromServer(serverItems);
        }
      })
      .catch(() => {
        // Offline at login, or the request failed — local cart (already
        // persisted from last session) still works; it'll sync next time.
      });
  }, [isAuthenticated]);
}
