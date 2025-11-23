import { useEffect, useState } from "react";
import Link from "next/link";
import MiniAppSDK from "@farcaster/miniapp-sdk";

export default function Home() {
  const [sdk, setSdk] = useState<any>(null);
  const [auth, setAuth] = useState<any>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let instance: any = null;

    try {
      instance = new (MiniAppSDK as any)();
    } catch {
      try {
        instance = (MiniAppSDK as any)();
      } catch {
        if (typeof window !== "undefined") {
          const w = window as any;
          instance = w.miniapp || w.MiniApp || null;
        }
      }
    }

    if (instance && instance.ready) instance.ready();
    setSdk(instance);
  }, []);

  async function signin() {
    if (!sdk) return alert("Not inside Farcaster client");
    const t = await sdk.auth.getToken();
    setAuth(t);
  }

  return (
    <div className="container">
      <h1>Ark-mini-intel</h1>

      {!auth && (
        <button onClick={signin}>Sign in with Farcaster</button>
      )}

      {auth && (
        <div className="card">
          <p>FID: {auth.fid}</p>
          <p>Username: {auth.username}</p>
          <p>Valid until: {auth.valid_until}</p>
        </div>
      )}

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="wallet / ens / tx"
      />

      <Link href={`/address/eth/${query}`}>
        <button style={{ marginLeft: 10 }}>Lookup</button>
      </Link>
    </div>
  );
}
