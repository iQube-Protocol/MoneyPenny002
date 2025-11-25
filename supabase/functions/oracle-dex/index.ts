const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DexOracleResponse {
  chain: string;
  address: string;
  label: string;
  price_usd: number | null;
  liquidity_usd: number | null;
  volume_24h_usd: number | null;
  fees_bps: number | null;
  source: string;
  timestamp: string;
}

Deno.serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const segments = url.pathname.split("/").filter(Boolean);
  // Path format: /functions/v1/oracle-dex/:chain/:address
  const address = segments[segments.length - 1];
  const chain = segments[segments.length - 2];

  if (!chain || !address) {
    return new Response(JSON.stringify({ error: "Chain and pool address are required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // For now we return a synthetic snapshot so the UI can render
    // You can later wire this up to a real DEX analytics API.
    const body: DexOracleResponse = {
      chain,
      address,
      label: `${chain.toUpperCase()} pool ${address.slice(0, 6)}…${address.slice(-4)}`,
      price_usd: null,
      liquidity_usd: 5_000_000,
      volume_24h_usd: 250_000,
      fees_bps: 30,
      source: "synthetic-demo",
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(body), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("oracle-dex unexpected error", error);
    return new Response(JSON.stringify({ error: "Internal DEX oracle error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
