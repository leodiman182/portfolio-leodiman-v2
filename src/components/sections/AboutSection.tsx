"use client";

import { personalInfo, hobbies, languages } from "@/data";
import { Reveal, SectionEyebrow } from "@/components/ui";

export function AboutSection() {
  return (
    <section id="about" className="pb-32 x-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionEyebrow label="01 / About" />
        </Reveal>

        <div className="grid md:grid-cols-2 gap-16 mt-8">
          {/* Bio */}
          <div className="space-y-6">
            <Reveal>
              <h2 className="font-display text-4xl sm:text-5xl font-light text-cream leading-tight">
                Building things<br />
                <span className="italic text-sand">that matter.</span>
              </h2>
            </Reveal>

            <div className="space-y-4">
              {personalInfo.bio.map((paragraph, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <p className="text-text2 leading-7 text-[0.95rem]">{paragraph}</p>
                </Reveal>
              ))}
            </div>

            {/* Location + availability */}
            <Reveal delay={0.3}>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 font-mono text-xs text-text2 tracking-wider">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-moss-lt animate-[pulseDot_2s_ease_infinite]"
                  />
                  {personalInfo.location}
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-moss-lt tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-moss-lt animate-[pulseDot_2s_ease_infinite]" />
                  Open to Remote
                </div>
              </div>
            </Reveal>
          </div>

          {/* Side column */}
          <div className="space-y-10">
            {/* Languages */}
            <Reveal delay={0.15}>
              <div>
                <p className="font-mono text-[0.7rem] tracking-[0.15em] uppercase text-text3 mb-4">
                  Languages
                </p>
                <div className="space-y-3">
                  {languages.map(({ flag, lang, level }) => (
                    <div key={lang} className="flex items-center justify-between border-b border-border pb-3">
                      <span className="flex items-center gap-2 text-text text-sm">
                        <span>{flag}</span>
                        {lang}
                      </span>
                      <span className="font-mono text-[0.7rem] text-text2 tracking-wider">
                        {level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Beyond code */}
            <Reveal delay={0.25}>
              <div>
                <p className="font-mono text-[0.7rem] tracking-[0.15em] uppercase text-text3 mb-4">
                  Beyond code
                </p>
                <ul className="space-y-2">
                  {hobbies.map((h) => (
                    <li key={h} className="flex items-start gap-3 text-text2 text-sm leading-6">
                      <span className="mt-2 w-1 h-1 rounded-full bg-coffee-lt flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Stat chips */}
            <Reveal delay={0.35}>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { n: "5+", label: "Years experience" },
                  { n: "10+", label: "Projects shipped" },
                  { n: "3", label: "Languages spoken" },
                  { n: "200+", label: "Live shows played" },
                ].map(({ n, label }) => (
                  <div
                    key={label}
                    className="rounded-sm border border-border bg-bg2 px-4 py-3"
                  >
                    <p className="font-display text-2xl text-sand font-light">{n}</p>
                    <p className="font-mono text-[0.68rem] text-text3 tracking-wider mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
