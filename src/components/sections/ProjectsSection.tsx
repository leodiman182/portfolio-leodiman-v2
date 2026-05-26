"use client";

import { projects } from "@/data";
import { ProjectTag, Reveal, SectionEyebrow } from "@/components/ui";
import { cn } from "@/lib/utils";

export function ProjectsSection() {
  return (
    <section id="projects" className="py-32 px-6 border-t border-border">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionEyebrow label="04 / Projects" />
        </Reveal>

        <div className="grid md:grid-cols-2 gap-12 mt-8 mb-16 items-end">
          <Reveal>
            <h2 className="font-display text-4xl sm:text-5xl font-light text-cream leading-tight">
              Things I&apos;ve<br />
              <span className="italic text-sand">shipped.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-text2 text-sm leading-7">
              A selection of work — from marketplace platforms and content
              monetization apps to automation tools and client sites.
            </p>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-0">
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={(i % 4) * 0.08}>
              <a
                href={project.url !== "#" ? project.url : undefined}
                target={project.url !== "#" ? "_blank" : undefined}
                rel="noopener noreferrer"
                className={cn(
                  "project-card group block border-b border-border px-4 py-8",
                  i % 2 === 0 ? "md:border-r" : "",
                  project.url === "#" ? "cursor-default" : "cursor-none"
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="font-mono text-[0.68rem] text-text3 tracking-widest">
                    {project.num}
                  </span>
                  {project.url !== "#" && (
                    <svg
                      className="w-4 h-4 text-text3 opacity-0 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  )}
                </div>

                <h3 className="font-display text-2xl font-light text-cream mb-2 group-hover:text-sand transition-colors duration-200">
                  {project.name}
                </h3>

                <p className="text-text2 text-sm leading-6 mb-5">
                  {project.desc}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <ProjectTag key={tag}>{tag}</ProjectTag>
                  ))}
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
