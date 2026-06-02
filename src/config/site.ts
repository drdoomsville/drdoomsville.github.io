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
  /** Short eyebrow shown above the name in the hero (role + location) */
  kicker: string;
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

export const site: SiteConfig = {
  name: 'William Kocak',
  title: 'William Kocak — AI Engineering Leader',
  kicker: 'AI Engineering Leader · Charlotte, NC',
  tagline:
    'AI and enterprise technology leader building production-scale, responsibly-governed AI across banking, pharma, and financial services.',
  shortBio:
    'I build 0-to-1 enterprise AI operating models, stand up Responsible AI governance, and drive disciplined, production-scale AI adoption inside complex regulated environments.',
  longBio: [
    "I'm an AI and enterprise technology leader with 30+ years across banking, pharma, and financial services. I found and operationalize enterprise AI functions, establish Responsible AI governance, and turn fuzzy mandates into well-bounded, production-grade systems.",
    'My financial-services tenure spans Wells Fargo, Wachovia, Ally, Bank of America, and RoundPoint Financial, and today I lead AI engineering at Merck CTO scale. Along the way I have scaled engineering organizations from 2 to 40+ engineers, delivered $200M+ in operational savings, and cut enterprise compliance exposure by 70%+.',
    'I partner with C-suite stakeholders to align AI investment with business priorities, regulatory expectations, and risk frameworks across front-office, risk, and corporate functions.',
  ],
  email: 'sonnyk487@gmail.com',
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/william-kocak-a3026811' },
  ],
  careerTimeline: [
    {
      company: 'Merck',
      role: 'Associate Director of AI Engineering, Automation',
      period: '2023 — Present',
      summary: 'Lead AI engineering and automation across the CTO division.',
      highlights: [
        "Founded Merck's Responsible AI function and mandated AI assessments on 100% of AI solutions, cutting compliance exposure by 70%+.",
        'Architected the Merck AI Agentic Framework — a 0-to-1, production-scale operating model for reusable LLM agents, MLOps, and observability.',
        'Impacted 36+ enterprise processes end-to-end, with realized improvements of 26% to 315%+.',
      ],
    },
    {
      company: 'AvidXchange',
      role: 'Senior Manager, Automation',
      period: '2021 — 2023',
      summary: 'Architected cloud intelligent-automation for high-throughput payments.',
      highlights: [
        'Built fault-tolerant Azure automation supporting 50M+ financial transactions per year and cutting revenue leakage 15%+.',
        'Instituted CI/CD, peer review, and automated testing — doubling solution delivery throughput.',
      ],
    },
    {
      company: 'Wells Fargo',
      role: 'Business Consultant, Solution Architect',
      period: '2020 — 2021',
      summary: 'Enterprise automation for Commercial Banking and Lending.',
      highlights: [
        'Delivered $200M+ in cumulative operational cost savings.',
        'Drove C-suite adoption of RPA, OCR, API, and AI/NLP automation across front-office operations.',
      ],
    },
    {
      company: 'Ally',
      role: 'Automation Lead, Compliance',
      period: '2018 — 2020',
      summary: "Founded Ally's enterprise RPA Center of Excellence.",
      highlights: [
        'Stood up a 0-to-1 RPA CoE and reusable code-library framework, lifting production output 48%.',
        'Automated AML and fraud account alerting, improving detection accuracy 35%.',
      ],
    },
    {
      company: 'Pegasystems',
      role: 'Senior Architect, PRPC & Robotics Automation',
      period: '2014 — 2018',
      summary: 'Pega case management and robotic automation for Fortune 500 clients.',
      highlights: [
        'Built bots that cut case processing times 67% across Blue Cross Blue Shield, CIBC, US Census, and T-Mobile.',
        "Delivered CIBC's customer onboarding solution, scaled to 1,200+ branches.",
      ],
    },
    {
      company: 'RoundPoint Financial Group',
      role: 'Manager, Software Engineering',
      period: '2008 — 2014',
      summary: 'Built and scaled the software engineering organization.',
      highlights: [
        'Grew engineering 20x — from 2 to 40+ engineers — establishing Agile/DevOps from the ground up.',
        'Delivered tooling for Capital Markets, Loan Servicing, and Originations, lifting efficiency 20%.',
      ],
    },
    {
      company: 'Bank of America, Wachovia, Microsoft & others',
      role: 'Senior Software Engineer / Consultant',
      period: '1991 — 2008',
      summary: 'Two decades of hands-on software engineering across banking and tech.',
      highlights: [
        'Built trading-floor and reporting systems at Bank of America and Wachovia (C#, .NET, TIBCO, IBM MQ).',
        'Earlier roles at Microsoft, Rabar Market Research, and Duke Energy (via SMCI).',
      ],
    },
  ],
  // TODO(content): the resume has no personal details — replace the placeholders
  // below with a real note, or tell me to drop the Personal section entirely.
  family:
    'Based in Charlotte, North Carolina. Thirty years in, and I still get a kick out of shipping technology that makes hard, regulated work simpler.',
  hobbies: [
    { title: 'Add a hobby', blurb: 'TODO(content): something you do outside work.' },
    { title: 'Add a hobby', blurb: 'TODO(content): a second interest.' },
    { title: 'Add a hobby', blurb: 'TODO(content): a third interest.' },
  ],
};
