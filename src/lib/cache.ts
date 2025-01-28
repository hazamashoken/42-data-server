import NodeCache from "node-cache";

export const deviceCache = new NodeCache({
  stdTTL: 60 * 5,
  checkperiod: 60 * 5 + 20,
});
