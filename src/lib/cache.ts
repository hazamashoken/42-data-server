import NodeCache from "node-cache";

export const deviceCache = new NodeCache({
  stdTTL: 60 * 2,
  checkperiod: 60 * 2 + 20,
});
