"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { setUserRole } from "@/actions/users";
import { Select } from "@/components/ui/form";
import { USER_ROLES, type UserRole } from "@/types";

export function RoleSelect({ userId, role, disabled }: { userId: string; role: UserRole; disabled?: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="inline-flex w-32 flex-col items-end">
      <Select
        defaultValue={role}
        disabled={disabled || pending}
        onChange={(e) => start(async () => { const r = await setUserRole(userId, e.target.value); if (r && !r.ok) setError(r.message ?? "Failed"); else setError(null); router.refresh(); })}
        className="py-[3px]! capitalize"
        aria-label="Role"
      >
        {USER_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
      </Select>
      {error && <span className="type-body-small mt-1 text-danger">{error}</span>}
    </div>
  );
}
