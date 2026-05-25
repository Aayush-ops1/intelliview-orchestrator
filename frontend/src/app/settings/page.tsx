"use client";
import { useState } from "react";
import useSWR from "swr";
import { Card } from "@/components/Card";
import { Skeleton, ErrorState } from "@/components/States";
import { endpoints } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import { useThemeStore } from "@/lib/theme";
import { toast } from "@/lib/toast";
import { Moon, Sun, Monitor } from "lucide-react";
import type { LoadBalancingStrategy } from "@/lib/types";

export default function SettingsPage() {
  const { token, setToken } = useAppStore();
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const [draft, setDraft] = useState("");
  const [switching, setSwitching] = useState<LoadBalancingStrategy | null>(null);
  const [detecting, setDetecting] = useState(false);
  const scheduling = useSWR("/scheduling-status", { refreshInterval: 5000 });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-50">Settings</h1>
        <p className="text-sm text-muted">API credentials, theme, and runtime controls.</p>
      </div>

      <Card title="API token" description="Required for worker management and protected endpoints.">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setToken(draft.trim() || null);
            toast.success("API token updated");
          }}
          className="flex items-center gap-2"
        >
          <input
            type="password"
            value={draft || token || ""}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="paste API_TOKEN"
            className="flex-1 rounded-md border border-border bg-bg-card px-3 py-2 text-sm text-zinc-100 placeholder:text-muted focus:border-accent focus:outline-none"
          />
          <button type="submit" className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark">
            Save
          </button>
          {token && (
            <button
              type="button"
              onClick={() => { setToken(null); setDraft(""); toast.info("Signed out"); }}
              className="rounded-md border border-border bg-bg-card px-3 py-2 text-sm text-zinc-300 hover:bg-bg-panel"
            >
              Clear
            </button>
          )}
        </form>
      </Card>

      <Card title="Appearance" description="Choose how the dashboard looks.">
        <div className="flex flex-wrap items-center gap-2">
          {([
            { v: "dark" as const, label: "Dark", icon: Moon },
            { v: "light" as const, label: "Light", icon: Sun },
            { v: "system" as const, label: "System", icon: Monitor },
          ]).map((opt) => (
            <button
              key={opt.v}
              onClick={() => { setTheme(opt.v); toast.info(`Theme: ${opt.label}`); }}
              className={
                "flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium " +
                (theme === opt.v
                  ? "border-accent bg-accent/15 text-accent-light"
                  : "border-border bg-bg-card text-zinc-300 hover:border-accent/40")
              }
            >
              <opt.icon size={14} /> {opt.label}
            </button>
          ))}
        </div>
      </Card>

      <Card title="Load balancing" description="Switch the active strategy at runtime.">
        {scheduling.error ? (
          <ErrorState error={scheduling.error} onRetry={() => scheduling.mutate()} />
        ) : !scheduling.data ? (
          <Skeleton className="h-20 w-full" />
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {(["ROUND_ROBIN", "LEAST_LOADED", "QUEUE_BASED"] as LoadBalancingStrategy[]).map((s) => (
              <button
                key={s}
                disabled={switching !== null}
                onClick={async () => {
                  setSwitching(s);
                  try {
                    await endpoints.switchStrategy(s);
                    await scheduling.mutate();
                    toast.success("Strategy switched", s);
                  } catch (e) {
                    toast.error("Failed to switch", e instanceof Error ? e.message : String(e));
                  } finally {
                    setSwitching(null);
                  }
                }}
                className={
                  "rounded-md border px-3 py-1.5 text-xs font-medium " +
                  (scheduling.data.current_strategy === s
                    ? "border-accent bg-accent/15 text-accent-light"
                    : "border-border bg-bg-card text-zinc-300 hover:border-accent/40")
                }
              >
                {s} {switching === s ? "…" : ""}
              </button>
            ))}
          </div>
        )}
      </Card>

      <Card title="Failure detection" description="Manually trigger detection + recovery for stuck sessions and failed workers.">
        <button
          disabled={detecting}
          onClick={async () => {
            setDetecting(true);
            try {
              const r = await endpoints.detectFailures();
              toast.success(
                "Detection complete",
                `${r.failed_sessions_detected} failed · ${r.unhealthy_workers_detected} unhealthy · ${r.stuck_sessions_detected} stuck`
              );
            } catch (e) {
              toast.error("Detection failed", e instanceof Error ? e.message : String(e));
            } finally {
              setDetecting(false);
            }
          }}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark disabled:opacity-50"
        >
          {detecting ? "Scanning…" : "Run detection"}
        </button>
      </Card>
    </div>
  );
}
