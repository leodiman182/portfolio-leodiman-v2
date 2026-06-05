export const personalInfo = {
  name: "Leonardo Diman",
  role: "Mid-level Frontend Developer",
  location: "Bauru, SP, Brazil",
  email: "leonardo.diman@gmail.com",
  phone: "+55 14 98139-5514",
  whatsapp: "5514981395514",
  linkedin: "https://www.linkedin.com/in/leonardodiman/",
  github: "https://github.com/leodiman182",
  portfolio: "https://portfolio-leodiman.vercel.app",
  yearsExp: 5,
  tagline: "Finding art and beauty in the simplest things",
  bio: [
    "Frontend developer with 5 years of experience building mobile-first products, leading frontend architecture, and delivering polished user experiences from Figma to production. Comfortable owning technical decisions, conducting technical interviews, and collaborating with designers and backend teams in agile environments.",
    "I discovered my passion for development through problem-solving — I genuinely appreciate each small solution found along the way. I dream of contributing to products that positively impact many people's lives and becoming a reference in my craft.",
    "Actively looking for international remote opportunities where I can contribute to products that scale and teams that care about quality.",
  ],
};

export const typewriterLines = [
  "Mid-level Frontend Developer",
  "5 years building for the web",
  "React · Next.js · TypeScript",
  "Open to remote opportunities",
];

export const hobbies = [
  "Musician — 200+ live shows & digital releases",
  "Gamer & vintage console collector",
  "Co-host of Prosa Interior podcast (50 eps)",
  "Traveler — lived in the US & Czech Republic",
  "Camping, offroad & nature lover",
];

export const languages = [
  { flag: "🇧🇷", lang: "Portuguese", level: "Native" },
  { flag: "🇺🇸", lang: "English", level: "Advanced" },
  { flag: "🇪🇸", lang: "Spanish", level: "Intermediate" },
];

export const experiences = [
  {
    id: 1,
    role: "Mid-level Frontend Developer",
    company: "eSapiens",
    location: "Remote, Brazil",
    period: "May 2025 — Present",
    current: true,
    bullets: [
      "Building Hotvips, a mobile-first platform for content monetization with pixel-perfect Figma-to-production delivery.",
      "Implemented social login integrations (Google) and a live streaming feature.",
      "Built a reusable promotion component system that significantly accelerated team delivery.",
      "Used Claude as a development tool within a monorepo setup.",
    ],
    tags: ["React", "TypeScript", "Zustand", "Tailwind", "SCSS", "Node.js"],
  },
  {
    id: 2,
    role: "Mid-level Frontend Developer",
    company: "Cotefácil",
    location: "Brazil",
    period: "Jun 2024 — May 2025",
    current: false,
    bullets: [
      "Led frontend of a new marketplace platform from scratch — product discovery, UX/visual identity, and architecture.",
      "Managed deployments via AWS Amplify and conducted technical interviews for frontend candidates.",
      "Drove legacy Java-to-React.js migration focused on performance, scalability, and code quality.",
    ],
    tags: ["React", "TypeScript", "AWS Amplify"],
  },
  {
    id: 3,
    role: "Junior Frontend Developer",
    company: "Cotefácil",
    location: "Brazil",
    period: "Apr 2023 — Jun 2024",
    current: false,
    bullets: [
      "Joined core team to modernize the platform: Java-to-React.js migration, bug fixing, new features, and performance-focused refactoring.",
    ],
    tags: ["React", "JavaScript"],
  },
  {
    id: 4,
    role: "Frontend Developer",
    company: "AGA Tecnologia",
    location: "Brazil",
    period: "Mar 2022 — Feb 2023",
    current: false,
    bullets: [
      "Built responsive websites, apps, and client platforms across multiple projects.",
      "Managed backend integrations and API connections for diverse clients.",
    ],
    tags: ["React", "Vue.js", "Tailwind", "Bootstrap", "Laravel", "Node.js"],
  },
  {
    id: 5,
    role: "Junior Web Developer",
    company: "AGA Tecnologia",
    location: "Brazil",
    period: "Jun 2021 — Mar 2022",
    current: false,
    bullets: [
      "First professional role — built websites with HTML, CSS, JS and Bootstrap; started applying React.js for frontend development.",
    ],
    tags: ["HTML", "CSS", "JavaScript", "Bootstrap", "React"],
  },
];

export const stackGroups = [
  {
    label: "Frontend",
    items: [
      { name: "React.js", highlight: true },
      { name: "TypeScript", highlight: true },
      { name: "JavaScript", highlight: true },
      { name: "Redux", highlight: true },
      { name: "Zustand", highlight: true },
      { name: "Tailwind CSS", highlight: true },
      { name: "SCSS", highlight: true },
      { name: "Material UI", highlight: true },
      { name: "Next.js", highlight: false },
      { name: "React Native", highlight: false },
      { name: "Bootstrap", highlight: false },
      { name: "Vue.js", highlight: false },
    ],
  },
  {
    label: "Backend & Infrastructure",
    items: [
      { name: "Node.js", highlight: true },
      { name: "Express.js", highlight: true },
      { name: "REST APIs", highlight: true },
      { name: "AWS Amplify", highlight: true },
      { name: "Docker", highlight: false },
      { name: "MySQL", highlight: false },
      { name: "MongoDB", highlight: false },
      { name: "PostgreSQL", highlight: false },
      { name: "Laravel", highlight: false },
      { name: "Java", highlight: false },
    ],
  },
  {
    label: "Tooling & Workflow",
    items: [
      { name: "Jest", highlight: true },
      { name: "RTL", highlight: true },
      { name: "Figma", highlight: true },
      { name: "Axios", highlight: true },
      { name: "Git", highlight: true },
      { name: "Python", highlight: false },
      { name: "Monorepo", highlight: false },
    ],
  },
];

export const projects = [
  {
    id: 1,
    num: "01",
    name: "Hotvips",
    desc: "Mobile-first content monetization platform. Pixel-perfect Figma-to-production, live streaming, and social login integrations.",
    tags: ["React", "TypeScript", "Zustand", "Tailwind"],
    url: "#",
  },
  {
    id: 2,
    num: "02",
    name: "Mercado Unido",
    desc: "Marketplace platform built from scratch — product discovery, UX/visual identity, and architecture in React + TypeScript.",
    tags: ["React", "TypeScript", "AWS Amplify"],
    url: "#",
  },
  {
    id: 3,
    num: "03",
    name: "Dvitto",
    desc: "Client platform with responsive design and backend integrations, delivered across the full development cycle.",
    tags: ["React", "Node.js", "Tailwind"],
    url: "#",
  },
  {
    id: 4,
    num: "04",
    name: "AGA Site",
    desc: "Corporate website for AGA Tecnologia with responsive layout, CMS integration, and performance-first approach.",
    tags: ["Vue.js", "Bootstrap", "Laravel"],
    url: "#",
  },
  {
    id: 5,
    num: "05",
    name: "Next Events App",
    desc: "Events discovery app built with Next.js. Focused on SSR, dynamic routing, and clean UI patterns.",
    tags: ["Next.js", "TypeScript", "React"],
    url: "#",
  },
  {
    id: 6,
    num: "06",
    name: "Usain Bot",
    desc: "Automation bot with a landing page interface. Built for speed and reliability with a sharp, minimal UI.",
    tags: ["React", "Node.js", "Axios"],
    url: "#",
  },
  {
    id: 7,
    num: "07",
    name: "Teia Exp",
    desc: "Experience platform with rich UI components, gallery, and interactive sections for end-to-end user flows.",
    tags: ["React", "Tailwind", "TypeScript"],
    url: "#",
  },
  {
    id: 8,
    num: "08",
    name: "Pluga Integration",
    desc: "Integration dashboard connecting multiple SaaS tools. Focused on clarity, workflow efficiency, and responsive UI.",
    tags: ["React", "REST APIs", "Node.js"],
    url: "#",
  },
];