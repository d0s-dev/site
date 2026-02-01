import type { APIRoute } from "astro";
import { fetchCatalogData, fetchCatalogManifest } from "../../../lib/catalog/data-source";
import type { CatalogManifestResult } from "../../../lib/catalog/types";

export async function getStaticPaths() {
  const catalog = await fetchCatalogData({ forceRefresh: true });
  const apps = catalog.response?.apps ?? [];

  const manifestPairs = await Promise.all(
    apps.map(async (app) => {
      const manifestResult = await fetchCatalogManifest(app.id);
      return {
        params: { appId: app.id },
        props: {
          manifestResult,
        },
      };
    }),
  );

  return manifestPairs;
}

export const GET: APIRoute = async ({ params, props }) => {
  const appId = params.appId;
  if (!appId) {
    return new Response(JSON.stringify({ error: "App ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const cached = props?.manifestResult as CatalogManifestResult | undefined;
    const result = cached ?? (await fetchCatalogManifest(appId));
    return new Response(
      JSON.stringify({
        source: result.source,
        fetchedAt: result.fetchedAt,
        manifest: result.manifest,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
