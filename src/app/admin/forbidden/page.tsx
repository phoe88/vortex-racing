import { signOut } from "@/actions/auth";
import { Button, ButtonLink } from "@/components/ui/button";

export const metadata = { title: "Access restricted", robots: { index: false } };

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-sunken px-4">
      <div className="card max-w-md p-6 text-center sm:p-8">
        <p className="type-heading-xxsmall text-subtlest">403</p>
        <h1 className="type-heading-large mt-1">Access restricted</h1>
        <p className="mt-2 text-sm text-subtle">Your account is signed in but doesn&apos;t have an editor or admin role yet. Ask an administrator to grant access from <em>Users &amp; roles</em>.</p>
        <div className="mt-4 flex justify-center gap-2">
          <ButtonLink href="/">Website</ButtonLink>
          <form action={signOut}><Button type="submit" appearance="primary">Sign out</Button></form>
        </div>
      </div>
    </div>
  );
}
