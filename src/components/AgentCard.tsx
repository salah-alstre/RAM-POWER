import type { Agent } from "@/data/agents";
import { regionLabel } from "@/data/regions";
import { telHref, waHref } from "@/lib/phone";
import { copy } from "@/data/copy";
import CopyButton from "./CopyButton";

export default function AgentCard({
  agent,
  selected = false,
  onSelect,
}: {
  agent: Agent;
  selected?: boolean;
  onSelect?: () => void;
}) {
  return (
    <article
      id={`agent-card-${agent.id}`}
      data-selected={selected || undefined}
      className={`group flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-[0_10px_30px_-18px_rgba(16,16,16,0.25)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-orange/50 hover:shadow-[0_18px_40px_-18px_rgba(16,16,16,0.3)] ${
        selected
          ? "border-orange ring-2 ring-orange/25"
          : "border-charcoal/8"
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {agent.regionIds.map((id) => (
              <span
                key={id}
                className="rounded-full bg-orange/10 px-2.5 py-1 text-[11px] font-bold text-orange-dark"
              >
                {regionLabel(id)}
              </span>
            ))}
          </div>
          {onSelect ? (
            <button
              type="button"
              onClick={onSelect}
              aria-pressed={selected}
              aria-label={`اعرض ${agent.company ?? agent.name} على الخريطة`}
              className={`flex h-9 w-9 flex-none items-center justify-center rounded-full border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark ${
                selected
                  ? "border-charcoal bg-charcoal text-orange"
                  : "border-charcoal/12 text-charcoal/55 hover:border-orange hover:text-orange-dark"
              }`}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 21s6-5.5 6-11a6 6 0 1 0-12 0c0 5.5 6 11 6 11Z" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </button>
          ) : null}
        </div>

        <h3 className="mt-3 text-lg font-extrabold text-charcoal">
          {agent.company ?? agent.name}
        </h3>
        {agent.company && (
          <p className="mt-0.5 text-sm font-semibold text-charcoal/60">
            {agent.title ? `${agent.title} ${agent.name}` : agent.name}
          </p>
        )}
        {!agent.company && agent.title && (
          <p className="mt-0.5 text-sm font-semibold text-charcoal/60">
            {agent.title}
          </p>
        )}

        {agent.cities && agent.cities.length > 0 && (
          <p className="mt-3 text-sm leading-relaxed text-charcoal/55">
            {agent.cities.join(" · ")}
          </p>
        )}
      </div>

      <div className="mt-5 border-t border-charcoal/8 pt-4">
        <p
          dir="ltr"
          className="text-left text-base font-bold tabular-nums text-charcoal"
        >
          {agent.phone}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <a
            href={telHref(agent.phone)}
            className="group/btn inline-flex items-center gap-1.5 rounded-full bg-orange px-4 py-1.5 text-xs font-bold text-charcoal transition-[background-color] duration-200 hover:bg-orange-light active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="transition-transform duration-200 group-hover/btn:-rotate-12"
            >
              <path
                d="M6.6 10.8c1.4 2.8 3.7 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.8 21 3 13.2 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
            {copy.agents.callLabel}
          </a>

          {agent.whatsapp && (
            <a
              href={waHref(agent.phone)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/15 px-4 py-1.5 text-xs font-bold text-charcoal/80 transition-colors duration-200 hover:border-orange hover:text-orange-dark active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
            >
              {copy.agents.whatsappLabel}
            </a>
          )}

          <CopyButton value={agent.phone} />
        </div>
      </div>
    </article>
  );
}
