"use client";

import { useMemo, useState } from "react";
import { agents } from "@/data/agents";
import { regions, regionLabel } from "@/data/regions";
import AgentCard from "./AgentCard";
import AnimatedHeading from "./AnimatedHeading";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { copy } from "@/data/copy";

export default function AgentsDirectory() {
  const [regionId, setRegionId] = useState<string>("all");
  const [query, setQuery] = useState("");

  const gridRevealRef = useScrollReveal<HTMLDivElement>({
    childSelector: "article",
    stagger: 0.06,
    y: 18,
    duration: 0.5,
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return agents.filter((agent) => {
      const matchesRegion =
        regionId === "all" || agent.regionIds.includes(regionId);
      if (!matchesRegion) return false;
      if (!q) return true;

      const haystack = [
        agent.name,
        agent.company ?? "",
        ...(agent.cities ?? []),
        ...agent.regionIds.map(regionLabel),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [regionId, query]);

  const isFiltered = regionId !== "all" || query.trim() !== "";

  function reset() {
    setRegionId("all");
    setQuery("");
  }

  return (
    <section id="agents" className="bg-pearl-dim py-20 sm:py-28">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <AnimatedHeading
          className="max-w-2xl"
          kicker={copy.agents.kicker}
          kickerClassName="mb-3 text-sm font-bold tracking-[0.3em] text-orange-dark"
          heading={copy.agents.heading}
          headingClassName="text-3xl font-extrabold leading-tight text-charcoal sm:text-4xl"
        />
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-charcoal/65 sm:text-lg">
          {copy.agents.description}
        </p>

        {/* أدوات الفلترة */}
        <div className="mt-10 rounded-2xl bg-white p-4 shadow-[0_10px_30px_-18px_rgba(16,16,16,0.2)] sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <label className="relative flex-1 lg:max-w-sm">
              <span className="sr-only">{copy.agents.searchSr}</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal/35"
              >
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="m20 20-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={copy.agents.searchPlaceholder}
                className="w-full rounded-xl border border-charcoal/10 bg-pearl-dim/60 py-2.5 pe-10 ps-4 text-sm text-charcoal placeholder:text-charcoal/40 transition-colors focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/30"
              />
            </label>

            <button
              type="button"
              onClick={reset}
              disabled={!isFiltered}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-charcoal/15 px-4 py-2.5 text-sm font-bold text-charcoal/70 transition-colors duration-200 hover:border-orange hover:text-orange-dark active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-charcoal/15 disabled:hover:text-charcoal/70"
            >
              {copy.agents.resetLabel}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={copy.agents.regionGroupLabel}>
            <FilterPill
              active={regionId === "all"}
              onClick={() => setRegionId("all")}
              label={copy.agents.allRegions}
            />
            {regions.map((r) => (
              <FilterPill
                key={r.id}
                active={regionId === r.id}
                onClick={() => setRegionId(r.id)}
                label={r.label}
              />
            ))}
          </div>
        </div>

        <p className="mt-6 text-sm font-semibold text-charcoal/55" aria-live="polite">
          {filtered.length === 0
            ? copy.agents.resultsEmpty
            : copy.agents.resultsFound(filtered.length, agents.length)}
        </p>

        <div ref={gridRevealRef}>
          {filtered.length > 0 ? (
            <div
              key={`${regionId}-${query.trim().toLowerCase()}`}
              className="mt-4 grid animate-[agent-grid-in_0.35s_ease-out] gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          ) : (
            <div className="mt-6 animate-[agent-grid-in_0.35s_ease-out] rounded-2xl border border-dashed border-charcoal/15 bg-white/60 px-6 py-14 text-center">
              <p className="text-lg font-bold text-charcoal">
                {copy.agents.emptyTitle}
              </p>
              <p className="mt-2 text-sm text-charcoal/55">
                {copy.agents.emptyBody}
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-5 inline-flex items-center justify-center rounded-full bg-orange px-5 py-2.5 text-sm font-bold text-charcoal transition-transform duration-200 hover:scale-105 hover:bg-orange-light active:scale-95"
              >
                {copy.agents.emptyReset}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FilterPill({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-4 py-2 text-xs font-bold transition-colors duration-200 sm:text-sm ${
        active
          ? "bg-charcoal text-pearl"
          : "bg-pearl-dim text-charcoal/60 hover:bg-charcoal/10"
      }`}
    >
      {label}
    </button>
  );
}
