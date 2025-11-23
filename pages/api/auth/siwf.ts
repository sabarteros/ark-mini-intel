export default async function handler(req, res) {
  // SIWF verification minimal
  // Host SDK kirim signature + fid ke endpoint ini
  const { fid, signature, message } = req.body;

  if (!fid || !signature || !message)
    return res.status(400).json({ error: "invalid payload" });

  // Di produksi harus verifikasi signature menggunakan Farcaster protocol
  // Untuk sekarang: validasi minimal
  res.json({ ok: true, fid });
}
