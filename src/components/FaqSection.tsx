import { copy } from "@/data/copy";

export default function FaqSection() {
  return (
    <section className="bg-pearl-dim py-16 sm:py-24">
      <div className="mx-auto grid max-w-content gap-9 px-4 sm:px-6 md:grid-cols-[0.7fr_1.3fr] md:gap-14 lg:gap-20">
        <div>
          <p className="text-xs font-extrabold tracking-[0.28em] text-orange-dark sm:text-sm">
            {copy.faq.kicker}
          </p>
          <h2 className="mt-3 max-w-md text-3xl font-extrabold leading-[1.2] text-charcoal sm:text-4xl">
            {copy.faq.heading}
          </h2>
        </div>

        <div className="divide-y divide-charcoal/10 border-y border-charcoal/10">
          {copy.faq.items.map((item, index) => (
            <details key={item.q} className="group py-1">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-base font-extrabold text-charcoal marker:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark sm:text-lg">
                <span className="flex items-center gap-4">
                  <span className="text-xs font-extrabold tabular-nums text-orange-dark/70">
                    0{index + 1}
                  </span>
                  {item.q}
                </span>
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-charcoal/15 text-lg font-normal transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="max-w-2xl pb-5 pe-12 text-sm leading-7 text-charcoal/62 sm:text-base">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
