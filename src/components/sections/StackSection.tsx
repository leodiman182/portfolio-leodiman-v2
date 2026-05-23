"use client";

import { stackGroups } from "@/data";
import { Reveal, SectionEyebrow, StackPill } from "@/components/ui";

export function StackSection() {
  return (
    <section id="stack" className="py-32 px-6 border-t border-border bg-bg2">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionEyebrow label="03 / Stack" />
        </Reveal>

        <div className="grid md:grid-cols-2 gap-12 mt-8 items-end">
          <Reveal>
            <h2 className="font-display text-4xl sm:text-5xl font-light text-cream leading-tight">
              Tools I reach<br />
              <span className="italic text-sand">for daily.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-text2 text-sm leading-7">
              Five years of building across the stack has taught me which tools
              ship and which talk. These are the ones I trust — from pixel to
              production.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 space-y-12">
          {stackGroups.map((group, gi) => (
            <Reveal key={group.label} delay={gi * 0.1}>
              <div>
                <p className="font-mono text-[0.68rem] tracking-[0.15em] uppercase text-text3 mb-5">
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {group.items.map((item) => (
                    <StackPill key={item.name} highlight={item.highlight}>
                      {item.name}
                    </StackPill>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
