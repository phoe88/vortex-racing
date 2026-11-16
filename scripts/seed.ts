/**
 * Seed Supabase with demo content.
 *
 *   pnpm seed
 *
 * Reads .env.local (or the environment). Requires SUPABASE_SERVICE_ROLE_KEY.
 * Optionally creates/promotes an admin when SEED_ADMIN_EMAIL + SEED_ADMIN_PASSWORD
 * are set.
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/types/database";
import { seed } from "../src/lib/seed/data";

config({ path: ".env.local" });
config();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("✖ NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
  process.exit(1);
}

const db = createClient<Database>(url, key, { auth: { persistSession: false } });

async function upsert<T extends keyof Database["public"]["Tables"]>(
  table: T,
  rows: Database["public"]["Tables"][T]["Insert"][],
  onConflict = "id",
) {
  if (!rows.length) return;
  // @ts-expect-error — generic table insert typing is too strict for a loop over tables
  const { error } = await db.from(table).upsert(rows, { onConflict });
  if (error) throw new Error(`${table}: ${error.message}`);
  console.log(`✔ ${table.padEnd(24)} ${rows.length} rows`);
}

async function main() {
  console.log(`Seeding ${url}\n`);

  await upsert("drivers", seed.drivers);
  await upsert("team_members", seed.teamMembers);
  await upsert("races", seed.races);
  // results are regenerated wholesale so standings stay consistent
  const raceIds = seed.races.map((r) => r.id);
  await db.from("race_results").delete().in("race_id", raceIds);
  await upsert("race_results", seed.raceResults);
  await db.from("driver_standings").delete().eq("season", seed.races[0].season);
  await db.from("constructor_standings").delete().eq("season", seed.races[0].season);
  await upsert("driver_standings", seed.driverStandings);
  await upsert("constructor_standings", seed.constructorStandings);
  await upsert("cars", seed.cars);
  await upsert("partners", seed.partners);
  await upsert("articles", seed.articles);
  await upsert("site_settings", seed.siteSettings as never, "key");

  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (email && password) {
    const { data: created, error } = await db.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: "Site Admin" },
    });
    let userId = created?.user?.id;
    if (error && !/already/i.test(error.message)) throw error;
    if (!userId) {
      const { data: list } = await db.auth.admin.listUsers({ perPage: 1000 });
      userId = list?.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())?.id;
    }
    if (userId) {
      const { error: pErr } = await db
        .from("profiles")
        .upsert({ id: userId, email, full_name: "Site Admin", role: "admin" });
      if (pErr) throw pErr;
      console.log(`✔ admin user ${email} → role admin`);
    }
  }

  console.log("\nDone.");
}

main().catch((e) => {
  console.error("✖", e.message ?? e);
  process.exit(1);
});
