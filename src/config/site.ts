export interface SocialLink {
  label: string;
  href: string;
}

export interface TimelineEntry {
  company: string;
  role: string;
  period: string;
  summary: string;
  highlights: string[];
}

export interface Hobby {
  title: string;
  blurb: string;
}

export interface SiteConfig {
  name: string;
  /** Browser tab / SEO title suffix */
  title: string;
  tagline: string;
  /** One-paragraph hero/about intro */
  shortBio: string;
  /** Longer about-section paragraphs */
  longBio: string[];
  email: string;
  socials: SocialLink[];
  careerTimeline: TimelineEntry[];
  family: string;
  hobbies: Hobby[];
}

// TODO(content): replace every placeholder below with your real details.
// This file is the main thing you edit. See CONTENT-CHECKLIST.md.
export const site: SiteConfig = {
  name: 'Sonny K.',
  title: 'Sonny K. — Software Engineer',
  tagline: 'Software engineer building reliable backend systems and clean developer tools.',
  shortBio:
    'I build dependable services and the tooling that makes teams faster. I care about clear interfaces, good tests, and shipping things people actually use.',
  longBio: [
    "I'm a software engineer focused on backend systems, APIs, and developer experience. I like turning fuzzy problems into well-bounded, well-tested components.",
    "Recently I've worked on distributed services, internal platforms, and the kind of tooling that quietly saves everyone an hour a day.",
  ],
  email: 'you@example.com',
  socials: [
    { label: 'GitHub', href: 'https://github.com/your-handle' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/your-handle' },
  ],
  careerTimeline: [
    {
      company: 'Acme Corp',
      role: 'Senior Software Engineer',
      period: '2023 — Present',
      summary: 'Lead backend work on the payments platform.',
      highlights: [
        'Cut p99 checkout latency by 40% by redesigning the settlement pipeline.',
        'Mentored three engineers and owned the on-call playbook.',
      ],
    },
    {
      company: 'Startup Inc',
      role: 'Software Engineer',
      period: '2020 — 2023',
      summary: 'Built core services from zero to production.',
      highlights: [
        'Shipped the first public API, growing integrations to 50+ partners.',
        'Introduced CI and test coverage from scratch.',
      ],
    },
  ],
  family:
    'Outside of work I am a husband and dad. Family is the thing that keeps the rest in perspective.',
  hobbies: [
    { title: 'Trail running', blurb: 'Slowly working toward a first ultra.' },
    { title: 'Home lab', blurb: 'A rack of Raspberry Pis that mostly behave.' },
    { title: 'Cooking', blurb: 'Weekend ramen experiments, varying results.' },
  ],
};
