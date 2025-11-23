import { useEffect, useState } from "react";
import Link from "next/link";
import MiniAppSDK from "@farcaster/miniapp-sdk";

export default function Home() {
  const [sdk, setSdk] = useState<any>(null);
  const [auth, setAuth] = useState<any>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const m = new MiniAppSDK();
    m.ready();
    setSdk(m);
  }, []);

  async function signin() {
    if (!sdk) return alert("Not inside Farcaster client");
    const token = await sdk.auth.getToken();
    setAuth(token);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Ark-mini-intel</h1>

      {!auth && (
        <button onClick={signin}>Sign in with Farcaster</button>
      )}

      {auth && (
        <div>
          <p>FID: {auth.fid}</p>
          <p>Valid until: {auth.valid_until}</p>
        </div>
      )}

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Wallet / Tx / ENS"
        style={{ width: 300, padding: 8 }}
      />

      <Link href={`/address/eth/${query}`}>
        <button style={{ marginLeft: 10 }}>Lookup</button>
      </Link>
    </div>
  );
}
