import { createFileRoute } from "@tanstack/react-router";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from "recharts";
import { PageHeader } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports — RequireQA" }] }),
  component: ReportsPage,
});

const trend = [
  { week: "W1", passed: 120, failed: 18, blocked: 5 },
  { week: "W2", passed: 142, failed: 22, blocked: 7 },
  { week: "W3", passed: 165, failed: 15, blocked: 4 },
  { week: "W4", passed: 188, failed: 12, blocked: 6 },
  { week: "W5", passed: 197, failed: 10, blocked: 3 },
];

const compliance = [
  { name: "FDA 21 CFR Part 820", coverage: 92 },
  { name: "ISO 13485", coverage: 85 },
  { name: "IEC 62304", coverage: 78 },
  { name: "ISO 14971", coverage: 88 },
];

function ReportsPage() {
  return (
    <div className="px-6 py-6 max-w-[1600px] mx-auto">
      <PageHeader
        title="Reports"
        description="Generate and export reports on test execution, compliance, and quality trends."
        actions={<Button variant="outline"><Download className="h-4 w-4 mr-1" /> Export PDF</Button>}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Execution Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Line dataKey="passed" stroke="#10b981" />
              <Line dataKey="failed" stroke="#ef4444" />
              <Line dataKey="blocked" stroke="#f59e0b" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Compliance Coverage</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={compliance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" fontSize={11} />
              <YAxis type="category" dataKey="name" fontSize={11} width={140} />
              <Tooltip />
              <Bar dataKey="coverage" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
