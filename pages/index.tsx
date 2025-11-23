import { useEffect, useState } from "react";
import Link from "next/link";
import MiniAppSDK from "@farcaster/miniapp-sdk";

export default function Home() {
  const [sdk, setSdk] = useState<MiniAppSDK | null>(null);
  const [authUser, setAuthUser] = useState<any>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const m = new MiniAppSDK();
    m.ready();
    setSdk(m);
  }, []);

  async function signin() {
    if (!sdk) return alert("Not inside Farcaster client");
    const auth = await sdk.auth.getToken();
    setAuthUser(auth);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Ark-mini-intel (Mini App)</h1>

      {!authUser && (
        <button onClick={signin}>Sign in with Farcaster</button>
      )}

      {authUser && (
        <p>
          Logged in as FID {authUser.fid} – token valid until{" "}
          {authUser.valid_until}
        </p>
      )}

      <input
        style={{ width: 300, padding: 8 }}
        placeholder="Address / Tx / ENS"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <Link href={`/address/eth/${query}`}>
        <button style={{ marginLeft: 10 }}>Lookup</button>
      </Link>
    </div>
  );
}
