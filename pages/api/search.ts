import { moralisGet } from "../../lib/moralis";

export default async function handler(req, res) {
  const q = String(req.query.q || "").trim();
  if (!q) return res.json({ type: "none" });

  if (q.startsWith("0x") && q.length === 42)
    return res.json({ type: "address", value: q });

  if (q.startsWith("0x") && q.length === 66)
    return res.json({ type: "tx", value: q });

  const ens = await moralisGet(`/resolve/${q}`);
  if (ens?.address) return res.json({ type: "address", value: ens.address });

  return res.json({ type: "unknown", value: q });
}
