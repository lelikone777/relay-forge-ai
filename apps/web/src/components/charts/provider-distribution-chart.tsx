"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { UsageResponse } from "@relayforge/shared";

const colors = ["#4f7dff", "#7f63ff", "#2ed3a3"];

export function ProviderDistributionChart({
  data
}: {
  data: UsageResponse["data"]["providerDistribution"];
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="provider"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={102}
            paddingAngle={4}
          >
            {data.map((entry, index) => (
              <Cell key={entry.provider} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "rgba(15,23,42,0.95)",
              border: "1px solid rgba(148,163,184,0.16)",
              borderRadius: "16px"
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

