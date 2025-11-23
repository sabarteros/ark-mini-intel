// pages/index.tsx
import { useEffect, useState } from "react";
import Link from "next/link";
import MiniAppSDK from "@farcaster/miniapp-sdk";

export default function Home() {
  const [sdk, setSdk] = useState<any>(null);
  const [auth, setAuth] = useState<any>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    // robust initializer: try multiple patterns (class, factory, init, window)
    function createInstance(): any {
      try {
        // 1) constructable class (some versions)
        if (typeof MiniAppSDK === "function") {
          try {
            // try new
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return new (MiniAppSDK as any)();
          } catch (e) {
            // try calling as function
            try {
              return (MiniAppSDK as any)();
            } catch (e2) {
              // continue to other attempts
            }
          }
        }

        // 2) factory / init style
        if (MiniAppSDK && typeof (MiniAppSDK as any).init === "function") {
          return (MiniAppSDK as any).init();
        }
        if (MiniAppSDK && typeof (MiniAppSDK as any).create === "function") {
          return (MiniAppSDK as any).create();
        }

        // 3) fallback to global/window exposed provider (host may inject)
        // check common global names
        if (typeof window !== "undefined") {
          // @ts-ignore
          const w = window as any;
          return w.MiniApp || w.miniapp || w.farcasterMiniApp || null;
        }
      } catch (err) {
        console.error("miniapp init error", err);
      }
      return null;
    }

    const inst = createInstance();
    if (inst && typeof inst.ready === "function") {
      try { inst.ready(); } catch (e) { /* ignore */ }
    }
    setSdk(inst);
  }, []);

  async function signin() {
    if (!sdk) return alert("Sign in only available inside Farcaster client");
    try {
      const token = await sdk.auth.getToken();
      setAuth(token);
    } catch (e: any) {
      console.error("auth.getToken() failed", e);
      alert("Failed to get token: " + (e?.message || e));
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "Inter, system-ui, sans-serif" }}>
      <h1>Ark-mini-intel</h1>

      {!auth ? (
        <div>
          <button onClick={signin} style={{ padding: "8px 12px" }}>
            Sign in with Farcaster
          </button>
          <p style={{ color: "#666", marginTop: 8 }}>
            (Sign-in only works when the mini app is opened inside a Farcaster client)
          </p>
        </div>
      ) : (
        <div>
          <strong>Signed in</strong>
          <div>FID: {String(auth.fid)}</div>
          <div>Username: {String(auth.username || "-")}</div>
          <div>Valid until: {String(auth.valid_until)}</div>
        </div>
      )}

      <div style={{ marginTop: 18 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="address / tx / ens"
          style={{ width: 360, padding: 8 }}
        />
        <Link href={`/address/eth/${encodeURIComponent(query)}`}>
          <button style={{ marginLeft: 8, padding: "8px 12px" }}>Lookup</button>
        </Link>
      </div>
    </div>
  );
}
