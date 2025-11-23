import { moralisGet } from "../../../../lib/moralis";
import { cacheGet, cacheSet } from "../../../../lib/cache";

export default async function handler(req, res) {
  try {
    const { chain, address } = req.query;

    const cacheKey = `addr:${chain}:${address}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return res.json(cached);

    const native = await moralisGet(`/${address}`, { chain });
    const tokens = await moralisGet(`/${address}/erc20`, { chain });
    const txs = await moralisGet(`/${address}/transactions`, {
      chain,
      limit: 25,
    });

    const out = { native, tokens, txs };
    await cacheSet(cacheKey, out, 45);

    res.json(out);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
