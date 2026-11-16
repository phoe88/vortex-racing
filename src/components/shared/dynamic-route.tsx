import { connection } from "next/server";
import { Suspense } from "react";

async function Marker() {
  await connection();
  return null;
}

/**
 * Marks a route as request-time rendered. Used on admin `[id]` pages, which
 * have no static params and must never be prerendered or cached.
 */
export function DynamicRoute() {
  return (
    <Suspense fallback={null}>
      <Marker />
    </Suspense>
  );
}
