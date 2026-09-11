"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { agents } from "@/data/agents";
import { regions, regionLabel } from "@/data/regions";
import { agentPoints, regionsWithoutMapPoint } from "@/lib/agentPoints";
import { textIncludes } from "@/lib/text";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { companyWhatsapp } from "@/data/contact";
import { waHref } from "@/lib/phone";
import AgentCard from "./AgentCard";
import AgentsMap from "./AgentsMap";
import AnimatedHeading from "./AnimatedHeading";
import { copy } from "@/data/copy";

type MobileView = "map" | "list";

export default function AgentsDirectory() {
  const [regionId, setRegionId] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<MobileView>("map");
  const [savedRegion, setSavedRegion, hydrated] = useLocalStorage("ram:selected-region:v1", null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hydrated || !savedRegion) return;
    if (regions.some((region) => region.id === savedRegion)) setRegionId(savedRegion);
  }, [hydrated, savedRegion]);

  const filtered = useMemo(() => {
    return agents.filter((agent) => {
      const matchesRegion = regionId === "all" || agent.regionIds.includes(regionId);
      if (!matchesRegion) return false;
      if (!query.trim()) return true;

      const haystack = [
        agent.name,
        agent.company ?? "",
        ...(agent.cities ?? []),
        ...agent.regionIds.map(regionLabel),
      ].join(" ");
      return textIncludes(haystack, query);
    });
  }, [regionId, query]);

  const filteredAgentIds = useMemo(
    () => new Set(filtered.map((agent) => agent.id)),
    [filtered]
  );

  const filteredPoints = useMemo(
    () => agentPoints.filter((point) => {
      if (!filteredAgentIds.has(point.agent.id)) return false;
      return regionId === "all" || point.regionId === regionId;
    }),
    [filteredAgentIds, regionId]
  );

  const mappedAgentIds = useMemo(
    () => new Set(filteredPoints.map((point) => point.agent.id)),
    [filteredPoints]
  );

  const hasUnmappedResults = filtered.some((agent) =>
    agent.regionIds.some((id) => regionsWithoutMapPoint.has(id))
  );
  const isFiltered = regionId !== "all" || query.trim() !== "";

  useEffect(() => {
    if (selectedAgentId && !filteredAgentIds.has(selectedAgentId)) {
      setSelectedAgentId(null);
    }
  }, [filteredAgentIds, selectedAgentId]);

  const selectAgent = useCallback((agentId: string) => {
    setSelectedAgentId(agentId);
    window.requestAnimationFrame(() => {
      document.getElementById(`agent-card-${agentId}`)?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "nearest",
      });
    });
  }, []);

  function chooseRegion(nextRegionId: string) {
    setRegionId(nextRegionId);
    setSelectedAgentId(null);
    setSavedRegion(nextRegionId === "all" ? null : nextRegionId);
    window.requestAnimationFrame(() => resultsRef.current?.focus({ preventScroll: true }));
  }

  function reset() {
    setRegionId("all");
    setQuery("");
    setSelectedAgentId(null);
    setSavedRegion(null);
  }

  const missingRegionMessage = copy.agents.notFoundMessage(query.trim());

  return (
    <section id="agents" className="relative overflow-hidden bg-pearl-dim py-16 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute -right-20 top-20 h-64 w-64 rounded-full bg-orange/10 blur-3xl" />
      <div className="relative mx-auto max-w-content px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div>
            <AnimatedHeading
              kicker={copy.agents.kicker}
              kickerClassName="mb-3 text-xs font-extrabold tracking-[0.28em] text-orange-dark sm:text-sm"
              heading={copy.agents.heading}
              headingClassName="text-3xl font-extrabold leading-[1.18] text-charcoal sm:text-4xl lg:text-5xl"
            />
            <p className="mt-4 max-w-xl text-base leading-8 text-charcoal/65 sm:text-lg">
              {copy.agents.description}
            </p>
          </div>

          <div className="rounded-[1.5rem] bg-charcoal p-5 text-pearl sm:p-6">
            <label htmlFor="quick-region" className="text-lg font-extrabold sm:text-xl">
              {copy.agents.regionPickerHeading}
            </label>
            <p className="mt-1 text-sm text-silver/70">{copy.agents.regionPickerBody}</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <select
                id="quick-region"
                value={regionId}
                onChange={(event) => chooseRegion(event.target.value)}
                className="min-h-12 min-w-0 flex-1 rounded-xl border border-white/14 bg-charcoal-soft px-4 text-sm font-bold text-pearl outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
              >
                <option value="all">{copy.agents.allRegions}</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>{region.label}</option>
                ))}
              </select>
              {regionId !== "all" ? (
                <button
                  type="button"
                  onClick={() => chooseRegion("all")}
                  className="min-h-12 rounded-xl border border-white/14 px-4 text-xs font-extrabold text-silver transition-colors hover:border-orange hover:text-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange"
                >
                  {copy.agents.clearSavedRegion}
                </button>
              ) : null}
            </div>
            <p className="mt-3 text-xs font-bold text-orange" aria-live="polite">
              {regionId === "all"
                ? copy.agents.resultsFound(filtered.length, agents.length)
                : copy.agents.regionMatchCount(filtered.length)}
            </p>
          </div>
        </div>

        <div className="mt-8 border-y border-charcoal/10 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <label className="relative w-full lg:max-w-md">
              <span className="sr-only">{copy.agents.searchSr}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/35">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="m20 20-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={copy.agents.searchPlaceholder}
                className="min-h-12 w-full rounded-xl border border-charcoal/12 bg-white py-2.5 pe-11 ps-4 text-sm text-charcoal outline-none placeholder:text-charcoal/40 focus:border-orange focus:ring-2 focus:ring-orange/25"
              />
            </label>

            <div className="flex flex-wrap items-center gap-2">
              <p className="me-1 text-xs font-bold text-charcoal/55" aria-live="polite">
                {filtered.length === 0
                  ? copy.agents.resultsEmpty
                  : copy.agents.resultsFound(filtered.length, agents.length)}
              </p>
              <button
                type="button"
                onClick={reset}
                disabled={!isFiltered}
                className="min-h-10 rounded-full border border-charcoal/15 px-4 text-xs font-extrabold text-charcoal/70 transition-colors hover:border-orange hover:text-orange-dark disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark"
              >
                {copy.agents.resetLabel}
              </button>
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]" role="group" aria-label={copy.agents.regionGroupLabel}>
            <FilterPill active={regionId === "all"} onClick={() => chooseRegion("all")} label={copy.agents.allRegions} />
            {regions.map((region) => (
              <FilterPill
                key={region.id}
                active={regionId === region.id}
                onClick={() => chooseRegion(region.id)}
                label={region.label}
              />
            ))}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 rounded-xl bg-charcoal/5 p-1 md:hidden" role="tablist" aria-label="طريقة عرض الوكلاء">
          {(["map", "list"] as MobileView[]).map((view) => (
            <button
              key={view}
              type="button"
              role="tab"
              aria-selected={mobileView === view}
              onClick={() => setMobileView(view)}
              className={`min-h-10 rounded-lg text-sm font-extrabold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-dark ${
                mobileView === view ? "bg-charcoal text-pearl" : "text-charcoal/55"
              }`}
            >
              {view === "map" ? copy.agents.viewMap : copy.agents.viewList}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.7fr)] md:items-start lg:grid-cols-[minmax(0,1.55fr)_minmax(340px,0.65fr)]">
          <div className={mobileView === "map" ? "block" : "hidden md:block"}>
            <AgentsMap
              points={filteredPoints}
              selectedAgentId={selectedAgentId}
              onSelectAgent={selectAgent}
            />
            {hasUnmappedResults ? (
              <p className="mt-3 rounded-xl border border-orange/20 bg-orange/10 px-4 py-3 text-xs font-bold leading-6 text-charcoal/65">
                {copy.agents.mapNoPointNote}
              </p>
            ) : null}
          </div>

          <div
            ref={resultsRef}
            tabIndex={-1}
            className={`${mobileView === "list" ? "block" : "hidden md:block"} scroll-mt-28 outline-none md:max-h-[548px] md:overflow-y-auto md:pe-2 md:[scrollbar-color:#F36B21_transparent]`}
          >
            {filtered.length > 0 ? (
              <div className="grid gap-4">
                {filtered.map((agent) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    selected={selectedAgentId === agent.id}
                    onSelect={mappedAgentIds.has(agent.id) ? () => selectAgent(agent.id) : undefined}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-charcoal/18 bg-white/70 px-6 py-12 text-center">
                <p className="text-lg font-extrabold text-charcoal">{copy.agents.emptyTitle}</p>
                <p className="mt-2 text-sm leading-7 text-charcoal/58">{copy.agents.emptyBody}</p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <button type="button" onClick={reset} className="min-h-10 rounded-full bg-charcoal px-5 text-xs font-extrabold text-pearl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange">
                    {copy.agents.emptyReset}
                  </button>
                  <a href="#contact" className="inline-flex min-h-10 items-center rounded-full border border-charcoal/18 px-5 text-xs font-extrabold text-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark">
                    احكي معنا
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start gap-2 border-s-2 border-orange ps-4">
          <p className="text-sm font-extrabold text-charcoal">{copy.agents.notFoundRegion}</p>
          <a
            href={waHref(companyWhatsapp, missingRegionMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold text-orange-dark underline decoration-orange/40 underline-offset-4 hover:text-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark"
          >
            ابعتلنا اسم منطقتك عالواتساب
          </a>
        </div>
      </div>
    </section>
  );
}

function FilterPill({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-10 flex-none whitespace-nowrap rounded-full px-4 text-xs font-extrabold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark sm:text-sm ${
        active ? "bg-charcoal text-pearl" : "bg-white text-charcoal/62 hover:bg-charcoal/10"
      }`}
    >
      {label}
    </button>
  );
}
