import { useEffect, useState } from "react";
import Link from "next/link";
import { MiniApp } from "@farcaster/miniapp-sdk";

export default function Home() {
  const [sdk, setSdk] = useState(null);
  const [profile, setProfile] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && MiniApp.isAvailable()) {
      const s = new MiniApp();
      s.ready();
      setSdk(s);
    }
  }, []);

  async function signin() {
    if (!sdk) return alert("Not inside Farcaster");
    const r = await sdk.signIn();
    setProfile(r);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Ark-mini-intel</h1>

      {!profile && <button onClick={signin}>Sign in with Farcaster</button>}

      {profile && (
        <p>Signed in as FID {profile.fid} ({profile.username})</p>
      )}

      <input
        style={{ width: 400, padding: 8 }}
        placeholder="Address / Tx / ENS"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <Link href={`/address/eth/${query}`}>
        <button style={{ marginLeft: 8 }}>Lookup</button>
      </Link>
    </div>
  );
}
