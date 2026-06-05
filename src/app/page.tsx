import { Navbar }            from "@/components/layout/Navbar";
import { HeroSection }       from "@/components/sections/HeroSection";
import { AboutSection }      from "@/components/sections/AboutSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { StackSection }      from "@/components/sections/StackSection";
import { ProjectsSection }   from "@/components/sections/ProjectsSection";
import { ContactSection }    from "@/components/sections/ContactSection";
import { ChatSection } from "@/components/sections/ChatSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ChatSection />
        <AboutSection />
        <ExperienceSection />
        <StackSection />
        <ProjectsSection />
        <ContactSection />
      </main>
    </>
  );
}
