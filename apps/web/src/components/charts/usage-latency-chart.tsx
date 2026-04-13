"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { UsageResponse } from "@relayforge/shared";

export function UsageLatencyChart({
  data
}: {
  data: UsageResponse["data"]["timeseries"];
}) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="requests" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#4f7dff" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#4f7dff" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="latency" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#7f63ff" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#7f63ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#8a94a7", fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: "#8a94a7", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              background: "rgba(15,23,42,0.95)",
              border: "1px solid rgba(148,163,184,0.16)",
              borderRadius: "16px"
            }}
          />
          <Area type="monotone" dataKey="requests" stroke="#4f7dff" fill="url(#requests)" strokeWidth={2.5} />
          <Area type="monotone" dataKey="latencyMs" stroke="#7f63ff" fill="url(#latency)" strokeWidth={2.5} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

