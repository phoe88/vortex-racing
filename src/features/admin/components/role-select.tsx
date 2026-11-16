"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { setUserRole } from "@/actions/users";
import { USER_ROLES, type UserRole } from "@/types";

export function RoleSelect({ userId, role, disabled }: { userId: string; role: UserRole; disabled?: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="inline-flex flex-col items-end">
      <select
        defaultValue={role}
        disabled={disabled || pending}
        onChange={(e) => start(async () => { const r = await setUserRole(userId, e.target.value); if (r && !r.ok) setError(r.message ?? "Failed"); else setError(null); router.refresh(); })}
        className="rounded-lg border border-white/12 bg-navy px-2.5 py-1.5 text-xs font-semibold capitalize disabled:opacity-50"
        aria-label="Role"
      >
        {USER_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
      </select>
      {error && <span className="mt-1 text-[11px] text-red-400">{error}</span>}
    </div>
  );
}
