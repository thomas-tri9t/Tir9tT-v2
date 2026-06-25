import type { ReactNode } from "react";
import { WorkspaceShell, ContextHeader } from "./workspace-shell";

export { ContextHeader } from "./workspace-shell";

export function AppLayout({ children }: { children: ReactNode }) {
  return <WorkspaceShell>{children}</WorkspaceShell>;
}

/** Legacy alias kept for existing routes. Maps `description` → `meta`. */
export function PageHeader(props: {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
}) {
  const { description, ...rest } = props;
  return <ContextHeader {...rest} meta={description} />;
}
