import fetch from "node-fetch";

const BASE = "https://deep-index.moralis.io/api/v2";

function headers() {
  const key = process.env.MORALIS_API_KEY;
  if (!key) throw new Error("MORALIS_API_KEY missing");
  return { "X-API-Key": key, Accept: "application/json" };
}

export async function moralisGet(path: string, params?: Record<string, any>) {
  const q = params
    ? "?" + new URLSearchParams(params as any).toString()
    : "";
  const url = `${BASE}${path}${q}`;
  const r = await fetch(url, { headers: headers() });
  const text = await r.text();
  return JSON.parse(text);
}
