import { createFileRoute } from "@tanstack/react-router";
import { Fragment } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { permissions, roles } from "@/lib/mock-data";

export const Route = createFileRoute("/settings/permissions")({
  head: () => ({ meta: [{ title: "Permissions — Settings" }] }),
  component: PermissionMgmt,
});

function PermissionMgmt() {
  const grouped = permissions.reduce<Record<string, typeof permissions>>((acc, p) => {
    (acc[p.category] ||= []).push(p);
    return acc;
  }, {});

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Permission Management</h2>
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-[11px] uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-2.5">Permission</th>
                {roles.map((r) => <th key={r.id} className="text-center px-3 py-2.5">{r.name}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y">
              {Object.entries(grouped).map(([cat, items]) => (
                <Fragment key={cat}>
                  <tr key={cat} className="bg-muted/30">
                    <td colSpan={roles.length + 1} className="px-4 py-1.5 text-[11px] uppercase font-semibold text-muted-foreground">{cat}</td>
                  </tr>
                  {items.map((p) => (
                    <tr key={p.id} className="hover:bg-accent/30">
                      <td className="px-4 py-2">
                        <div className="font-mono text-xs">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{p.description}</div>
                      </td>
                      {roles.map((r) => (
                        <td key={r.id} className="text-center px-3 py-2">
                          <Checkbox defaultChecked={r.name === "Admin" || (r.name === "Manager" && p.category !== "Administration")} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
