"use client";

import { createContext, startTransition, useActionState, useContext, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Trash2 } from "lucide-react";
import type { ActionState } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

const PendingContext = createContext(false);

export function SubmitButton({ children, className, pendingText = "Saving…" }: { children: React.ReactNode; className?: string; pendingText?: string }) {
  const status = useFormStatus();
  const ctxPending = useContext(PendingContext);
  const pending = status.pending || ctxPending;
  return (
    <button type="submit" disabled={pending} className={cn("a-btn bg-royal text-white hover:bg-royal-600", className)}>
      {pending && <Loader2 className="size-4 animate-spin" />}
      {pending ? pendingText : children}
    </button>
  );
}

/**
 * Form bound to a server action returning {ok|error}; shows the message inline.
 * Submits via onSubmit (not the `action` prop) so React doesn't auto-reset the
 * fields: typed input survives a validation error.
 */
export function ActionForm({
  action,
  children,
  className,
  resetOnSuccess = false,
}: {
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok && resetOnSuccess) ref.current?.reset();
  }, [state, resetOnSuccess]);
  return (
    <form
      ref={ref}
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => formAction(fd));
      }}
    >
      <PendingContext.Provider value={pending}>{children}</PendingContext.Provider>
      {state.error && <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{state.error}</p>}
      {state.ok && <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">{state.ok}</p>}
    </form>
  );
}

/** A small form that runs a server action after a confirm() prompt. */
export function ConfirmButton({
  action,
  message = "Are you sure? This cannot be undone.",
  children,
  className,
}: {
  action: () => Promise<void>;
  message?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <form action={action} onSubmit={(e) => { if (!confirm(message)) e.preventDefault(); }}>
      <button type="submit" className={cn("a-btn text-rose-600 hover:bg-rose-50", className)}>
        {children ?? <><Trash2 className="size-4" /> Delete</>}
      </button>
    </form>
  );
}
