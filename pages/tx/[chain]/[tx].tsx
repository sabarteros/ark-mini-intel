import { useRouter } from "next/router";
import useSWR from "swr";

const fetcher = (u) => fetch(u).then((r) => r.json());

export default function TxPage() {
  const router = useRouter();
  const { chain, tx } = router.query;

  const { data } = useSWR(
    tx ? `/api/tx/${chain}/${tx}` : null,
    fetcher
  );

  if (!data) return "Loading...";

  return (
    <div style={{ padding: 20 }}>
      <h3>Detail</h3>
      <pre>{JSON.stringify(data.detail, null, 2)}</pre>

      <h3>Receipt</h3>
      <pre>{JSON.stringify(data.receipt, null, 2)}</pre>
    </div>
  );
}
