"use client";

import { experiences } from "@/data";
import { Badge, CurrentTag, Reveal, SectionEyebrow } from "@/components/ui";

export function ExperienceSection() {
  return (
    <section id="experience" className="py-32 px-6 border-t border-border">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionEyebrow label="02 / Work" />
        </Reveal>

        <Reveal>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-cream mt-8 mb-16 leading-tight">
            Where I&apos;ve<br />
            <span className="italic text-sand">been building.</span>
          </h2>
        </Reveal>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-border hidden md:block" />

          <div className="space-y-0">
            {experiences.map((exp, i) => (
              <Reveal key={exp.id} delay={i * 0.08}>
                <div className="group relative md:pl-10 py-8 border-b border-border last:border-0">
                  {/* Timeline dot */}
                  <div
                    className={`hidden md:block absolute left-0 top-10 w-2 h-2 rounded-full -translate-x-1/2 transition-colors duration-300 ${
                      exp.current ? "bg-moss-lt" : "bg-border2 group-hover:bg-sand"
                    }`}
                  />

                  <div className="grid md:grid-cols-[1fr_auto] gap-4 md:gap-8">
                    <div>
                      {/* Role + company */}
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h3 className="font-display text-xl font-light text-cream">
                          {exp.role}
                        </h3>
                        {exp.current && <CurrentTag />}
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <span className="font-mono text-sm text-coffee-lt">
                          {exp.company}
                        </span>
                        <span className="text-text3">·</span>
                        <span className="font-mono text-xs text-text3">
                          {exp.location}
                        </span>
                      </div>

                      {/* Bullets */}
                      <ul className="space-y-2 mb-5">
                        {exp.bullets.map((b, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-3 text-text2 text-sm leading-6"
                          >
                            <span className="mt-2.5 w-1 h-1 rounded-full bg-border2 flex-shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {exp.tags.map((tag) => (
                          <Badge key={tag}>{tag}</Badge>
                        ))}
                      </div>
                    </div>

                    {/* Period */}
                    <div className="md:text-right">
                      <span className="font-mono text-xs text-text3 tracking-wider whitespace-nowrap">
                        {exp.period}
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
