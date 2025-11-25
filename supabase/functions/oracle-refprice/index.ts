const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RefPriceResponse {
  symbol: string;
  price_usd: number;
  source: string;
  timestamp: string;
}

const COINGECKO_IDS: Record<string, string> = {
  btc: "bitcoin",
  eth: "ethereum",
  sol: "solana",
};

Deno.serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const segments = url.pathname.split("/").filter(Boolean);
  const symbol = segments[segments.length - 1]?.toLowerCase();

  if (!symbol) {
    return new Response(JSON.stringify({ error: "Symbol is required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const coingeckoId = COINGECKO_IDS[symbol];

  if (!coingeckoId) {
    return new Response(JSON.stringify({ error: `Unsupported symbol: ${symbol}` }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd`;
    const cgRes = await fetch(apiUrl, { headers: { accept: "application/json" } });

    if (!cgRes.ok) {
      console.error("Coingecko error", cgRes.status, await cgRes.text());
      return new Response(JSON.stringify({ error: "Failed to fetch reference price" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await cgRes.json();
    const price = data[coingeckoId]?.usd;

    if (typeof price !== "number") {
      console.error("Unexpected Coingecko response", data);
      return new Response(JSON.stringify({ error: "Invalid price data from oracle" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: RefPriceResponse = {
      symbol: symbol.toUpperCase(),
      price_usd: price,
      source: "coingecko",
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(body), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("oracle-refprice unexpected error", error);
    return new Response(JSON.stringify({ error: "Internal oracle error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
