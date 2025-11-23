import { useRouter } from "next/router";
import useSWR from "swr";

const fetcher = (u) => fetch(u).then((r) => r.json());

export default function AddressPage() {
  const router = useRouter();
  const { chain, address } = router.query;

  const { data } = useSWR(
    address ? `/api/address/${chain}/${address}` : null,
    fetcher
  );

  if (!data) return "Loading...";

  return (
    <div style={{ padding: 20 }}>
      <h2>{address}</h2>

      <h3>Native</h3>
      <pre>{JSON.stringify(data.native, null, 2)}</pre>

      <h3>Tokens</h3>
      <pre>{JSON.stringify(data.tokens, null, 2)}</pre>

      <h3>Txs</h3>
      <ul>
        {data.txs?.map((t) => (
          <li key={t.hash}>
            <a href={`/tx/${chain}/${t.hash}`}>{t.hash}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
