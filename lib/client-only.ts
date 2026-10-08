import { useSyncExternalStore } from "react";

const nothing = () => () => {};

/** True in the browser, false while the page is rendered on the server: for parts that only make sense there. */
export function useInBrowser() {
  return useSyncExternalStore(nothing, () => true, () => false);
}
