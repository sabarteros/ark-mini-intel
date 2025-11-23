import { moralisGet } from "../../../../lib/moralis";
import { cacheGet, cacheSet } from "../../../../lib/cache";

export default async function handler(req, res) {
  try {
    const { chain, tx } = req.query;

    const key = `tx:${chain}:${tx}`;
    const cached = await cacheGet(key);
    if (cached) return res.json(cached);

    const detail = await moralisGet(`/transaction/${tx}`, { chain });
    const receipt = await moralisGet(`/transaction/${tx}/receipt`, { chain });

    const out = { detail, receipt };
    await cacheSet(key, out, 120);

    res.json(out);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
